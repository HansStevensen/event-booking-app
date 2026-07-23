import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Admin() {
    const navigate = useNavigate();
    const [events, setEvents] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'events' | 'bookings'>('events');
    const [bookings, setBookings] = useState<any[]>([]);
    const [bookingSearchQuery, setBookingSearchQuery] = useState('');

    const getBookings = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/bookings`);
            setBookings(res.data.allBookings || []);
        } catch (err) {
            toast.error('Failed to load bookings');
        }
    };

    const getEvent = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/events`);
            setEvents(response.data.allEvents || []);
        } catch (err) {
            toast.error('Gagal Mengambil Data Event');
        }
    };

    const deleteEvent = async (id: string) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/events/${id}`);
            await getEvent();
            toast.success(response.data.message);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete event');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
        toast.success("Logged out successfully");
        navigate('/login', { replace: true });
    };

    useEffect(() => {
        getEvent();
        getBookings();

        const timer = setInterval(() => {
            getEvent();
            getBookings();
        }, 10000);

        return () => clearInterval(timer);
    }, []);

    const filteredBookings = bookings.filter((booking) => {
        const userName = booking.userId?.name || booking.userId?.username || '';
        const userEmail = booking.userId?.email || '';
        const eventTitle = booking.eventId?.title || '';
        const query = bookingSearchQuery.toLowerCase();

        return (
            userName.toLowerCase().includes(query) ||
            userEmail.toLowerCase().includes(query) ||
            eventTitle.toLowerCase().includes(query)
        );
    });

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-6 flex flex-col items-center">
            {/* Header */}
            <div className="w-full max-w-4xl flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage events and monitor ticket booking transactions</p>
                </div>
                <div className="flex items-center gap-3">
                    {activeTab === 'events' && (
                        <button
                            onClick={() => navigate('/admin/add-event')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-sm font-medium shadow-sm"
                        >
                            + Add Event
                        </button>
                    )}

                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 border border-red-200 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition text-sm font-medium"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="w-full max-w-4xl flex gap-3 mb-6">
                <button
                    onClick={() => setActiveTab('events')}
                    className={`px-5 py-2.5 rounded-xl font-medium text-sm transition ${
                        activeTab === 'events'
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                >
                    Manage Events ({events.length})
                </button>
                <button
                    onClick={() => setActiveTab('bookings')}
                    className={`px-5 py-2.5 rounded-xl font-medium text-sm transition ${
                        activeTab === 'bookings'
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                >
                    Transaction Monitoring ({bookings.length})
                </button>
            </div>

            {/* Content Area */}
            <div className="w-full max-w-4xl flex flex-col gap-4">
                {activeTab === 'events' ? (
                    /* TAB 1: MANAGE EVENTS */
                    events.length === 0 ? (
                        <p className="text-gray-500 text-center py-12 bg-white rounded-2xl border border-gray-100">
                            No events created yet.
                        </p>
                    ) : (
                        events.map((event) => (
                            <div key={event._id} className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                                <img
                                    src={`http://localhost:5000/${event.image}`}
                                    alt={event.title}
                                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                                />

                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-800 text-lg">{event.title}</h3>
                                    <p className="text-sm text-gray-500">{event.location}</p>
                                    <p className="text-sm text-gray-700 mt-1">
                                        Price: <span className="font-medium">Rp {event.price.toLocaleString('id-ID')}</span>
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        Ticket Quota: <span className="font-medium">{event.quota}</span>
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Date: {new Date(event.date).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => navigate('/admin/edit-event/' + event._id)}
                                        className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteEvent(event._id)}
                                        className="px-4 py-1.5 border border-red-500 text-red-500 text-sm rounded-lg hover:bg-red-50 transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )
                ) : (
                    /* TAB 2: TRANSACTION MONITORING */
                    <div className="flex flex-col gap-4">
                        {/* Transaction Search Input */}
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
                            <input
                                type="text"
                                placeholder="Search transaction by customer name, email, or event title..."
                                value={bookingSearchQuery}
                                onChange={(e) => setBookingSearchQuery(e.target.value)}
                                className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>

                        {filteredBookings.length === 0 ? (
                            <p className="text-gray-500 text-center py-12 bg-white rounded-2xl border border-gray-100">
                                {bookingSearchQuery ? `No transactions match "${bookingSearchQuery}"` : "No booking transactions found."}
                            </p>
                        ) : (
                            filteredBookings.map((booking) => (
                                <div key={booking._id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-900 text-base">
                                                {booking.userId?.name || booking.userId?.username || "Deleted User"}
                                            </span>
                                            <span className="text-xs text-gray-400">({booking.userId?.email || "-"})</span>
                                        </div>
                                        <p className="text-sm font-medium text-blue-600">
                                            Event: {booking.eventId?.title || "Deleted Event"}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Booked on: {new Date(booking.createdAt).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0">
                                        <div className="text-left md:text-right">
                                            <p className="text-xs text-gray-400">Quantity: {booking.quantity} Tickets</p>
                                            <p className="text-base font-bold text-gray-800">
                                                Rp {booking.totalPrice?.toLocaleString('id-ID')}
                                            </p>
                                        </div>

                                        {/* Status Badge */}
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${
                                            booking.status === 'paid'
                                                ? 'bg-green-100 text-green-700 border border-green-200'
                                                : booking.status === 'cancelled'
                                                ? 'bg-red-100 text-red-700 border border-red-200'
                                                : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                        }`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}