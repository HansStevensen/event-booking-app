import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function EventDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');

    const [event, setEvent] = useState<any>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);

    const getEventDetail = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/events/${id}`);
            setEvent(res.data.events);
        } catch (err) {
            toast.error("Failed to load event details");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
        toast.success("Logged out successfully");
        navigate('/login', { replace: true });
    };

    const handleBookTicket = async () => {
        if (!userId) {
            toast.error("Please login to book tickets");
            navigate('/login');
            return;
        }

        if (quantity > event.quota) {
            toast.error("Quantity exceeds available quota");
            return;
        }

        try {
            await axios.post(`http://localhost:5000/api/bookings`, {
                userId,
                eventId: id,
                quantity
            });
            toast.success("Booking created! Complete your payment.");
            navigate('/my-bookings');
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to book ticket");
        }
    };

    useEffect(() => {
        getEventDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500 font-medium">Loading event details...</p>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <p className="text-gray-500 text-lg mb-4">Event not found.</p>
                <button
                    onClick={() => navigate('/')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    const totalPrice = (event.price || 0) * quantity;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
                    <h1
                        onClick={() => navigate('/')}
                        className="text-2xl font-bold text-blue-600 cursor-pointer tracking-tight"
                    >
                        EventTix
                    </h1>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/')}
                            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
                        >
                            Catalog
                        </button>

                        {userId && (
                            <button
                                onClick={() => navigate('/my-bookings')}
                                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
                            >
                                My Tickets
                            </button>
                        )}

                        {userId && (
                            <button
                                onClick={() => navigate('/profile')}
                                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
                            >
                                My Profile
                            </button>
                        )}

                        {role === 'admin' && (
                            <button
                                onClick={() => navigate('/admin')}
                                className="px-4 py-2 text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-xl hover:bg-blue-100 transition"
                            >
                                Admin Dashboard
                            </button>
                        )}

                        {userId ? (
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition"
                            >
                                Logout
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => navigate('/register')}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition shadow-sm"
                                >
                                    Sign Up
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Event Detail Container */}
            <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <button
                    onClick={() => navigate('/')}
                    className="text-sm font-medium text-gray-500 hover:text-gray-800 transition mb-6 flex items-center gap-1"
                >
                    ← Back to Catalog
                </button>

                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-0">
                    {/* Event Poster Image */}
                    <div className="lg:col-span-7 bg-gray-100 flex items-center justify-center p-6 border-b lg:border-b-0 lg:border-r border-gray-200">
                        <img
                            src={`http://localhost:5000/${event.image}`}
                            alt={event.title}
                            className="max-h-[450px] w-full object-contain rounded-xl shadow-sm"
                        />
                    </div>

                    {/* Event Info & Booking Box */}
                    <div className="lg:col-span-5 p-8 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-700 rounded-md">
                                    {event.location}
                                </span>
                                <span className="text-xs font-medium text-gray-500">
                                    {new Date(event.date).toLocaleDateString('id-ID', {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </span>
                            </div>

                            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                                {event.title}
                            </h2>

                            {/* Schedule & Venue Details */}
                            <div className="flex flex-col gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
                                {(event.openGateTime || event.startTime) && (
                                    <div className="flex items-center gap-4 text-xs font-semibold text-gray-700">
                                        {event.openGateTime && (
                                            <span className="px-2.5 py-1 bg-white border border-gray-200 rounded-md">
                                                Open Gate: {event.openGateTime}
                                            </span>
                                        )}
                                        {event.startTime && (
                                            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-md">
                                                Start Show: {event.startTime}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {event.venueAddress && (
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase">Venue Address</p>
                                        <p className="text-sm font-medium text-gray-800 mt-0.5">{event.venueAddress}</p>
                                    </div>
                                )}

                                {event.mapsUrl && (
                                    <a
                                        href={event.mapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline mt-1"
                                    >
                                        📍 Open in Google Maps →
                                    </a>
                                )}
                            </div>

                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">
                                    Description
                                </h3>
                                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                    {event.description}
                                </p>
                            </div>

                            {event.terms && (
                                <div className="mb-6 border-t border-gray-100 pt-4">
                                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">
                                        Terms & Conditions
                                    </h3>
                                    <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-line">
                                        {event.terms}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Booking Section */}
                        <div className="border-t border-gray-100 pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-xs text-gray-400">Price per ticket</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        Rp {event.price?.toLocaleString('id-ID')}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-400">Available Quota</p>
                                    <p className="text-base font-semibold text-gray-800">
                                        {event.quota} Tickets
                                    </p>
                                </div>
                            </div>

                            {/* Quantity Counter */}
                            {event.quota > 0 && (
                                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-200 mb-6">
                                    <span className="text-sm font-semibold text-gray-700">Quantity</span>
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-8 h-8 rounded-lg bg-white border border-gray-300 font-bold text-gray-700 hover:bg-gray-100 transition"
                                        >
                                            -
                                        </button>
                                        <span className="font-bold text-gray-900 text-base min-w-[20px] text-center">
                                            {quantity}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setQuantity(Math.min(event.quota, quantity + 1))}
                                            className="w-8 h-8 rounded-lg bg-white border border-gray-300 font-bold text-gray-700 hover:bg-gray-100 transition"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Total & Action Button */}
                            <div className="flex flex-col gap-3">
                                {event.quota > 0 && (
                                    <div className="flex justify-between items-center text-sm font-medium text-gray-700">
                                        <span>Total Payment:</span>
                                        <span className="text-xl font-bold text-gray-900">
                                            Rp {totalPrice.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                )}

                                <button
                                    onClick={handleBookTicket}
                                    disabled={event.quota <= 0}
                                    className={`w-full py-3.5 rounded-xl font-semibold text-base transition shadow-sm ${
                                        event.quota > 0
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    {event.quota > 0 ? `Book ${quantity} Ticket(s)` : "Sold Out"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
