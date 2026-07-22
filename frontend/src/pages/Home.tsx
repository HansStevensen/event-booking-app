import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function Home() {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    const [events, setEvents] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const handleGetEvents = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/events`);
            setEvents(res.data.allEvents);
        } catch (err) {
            toast.error("Failed to load data");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
        toast.success("Logged out successfully");
        navigate('/login', { replace: true });
    };

    const handleBookTicket = async (eventId: string) => {
        if (!userId) {
            toast.error("Please login to book tickets");
            navigate('/login');
            return;
        }

        try {
            await axios.post(`http://localhost:5000/api/bookings`, {
                userId,
                eventId,
                quantity: 1
            });
            toast.success("Booking created! Complete your payment.");
            navigate('/my-bookings');
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to book ticket");
        }
    };

    useEffect(() => {
        handleGetEvents();
    }, []);

    const filteredEvents = events.filter((event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navigation Header */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
                    <h1 
                        onClick={() => navigate('/')}
                        className="text-2xl font-bold text-blue-600 cursor-pointer tracking-tight"
                    >
                        EventTix
                    </h1>

                    {/* Search Input Bar */}
                    <div className="flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder="Search event or location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    {/* Navigation Actions */}
                    <div className="flex items-center gap-3">
                        {role === 'admin' && (
                            <button
                                onClick={() => navigate('/admin')}
                                className="px-4 py-2 text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-xl hover:bg-blue-100 transition"
                            >
                                Admin Dashboard
                            </button>
                        )}

                        {userId && (
                            <button
                                onClick={() => navigate('/my-bookings')}
                                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
                            >
                                My Tickets
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

            {/* Hero Section */}
            <header className="bg-blue-600 text-white py-16 px-4 text-center">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                        Discover & Book Upcoming Events
                    </h2>
                    <p className="mt-4 text-lg text-blue-100">
                        Explore concerts, conferences, workshops, and gatherings around you.
                    </p>
                </div>
            </header>

            {/* Main Content Grid */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">
                        {searchQuery ? `Search Results for "${searchQuery}"` : "All Events"}
                    </h3>
                    <span className="text-sm text-gray-500 font-medium">
                        {filteredEvents.length} events available
                    </span>
                </div>

                {filteredEvents.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                        <p className="text-gray-500 text-lg">No events found matching your search criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map((event) => (
                            <div 
                                key={event._id}
                                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
                            >
                                <img
                                    src={`http://localhost:5000/${event.image}`}
                                    alt={event.title}
                                    onClick={() => navigate(`/event/${event._id}`)}
                                    className="w-full h-48 object-cover cursor-pointer hover:opacity-95 transition"
                                />
                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between gap-2 mb-2">
                                            <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md">
                                                {event.location}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {new Date(event.date).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <h4 
                                            onClick={() => navigate(`/event/${event._id}`)}
                                            className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer transition"
                                        >
                                            {event.title}
                                        </h4>
                                        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                                            {event.description}
                                        </p>
                                    </div>

                                    <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-gray-400">Price</p>
                                            <p className="text-lg font-bold text-blue-600">
                                                Rp {event.price?.toLocaleString('id-ID')}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => navigate(`/event/${event._id}`)}
                                                className="px-3 py-2 rounded-xl text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                                            >
                                                Details
                                            </button>
                                            <button
                                                onClick={() => handleBookTicket(event._id)}
                                                disabled={event.quota <= 0}
                                                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                                                    event.quota > 0
                                                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                }`}
                                            >
                                                {event.quota > 0 ? "Book Ticket" : "Sold Out"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}