import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { QRCodeSVG } from 'qrcode.react';


export default function MyBookings() {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedTicket, SetSelectedTicket] = useState<any>(null);
    const [currentTicketIndex, setCurrentTicketIndex] = useState<number>(0);

    const getBookings = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/bookings/user/${userId}`);
            setBookings(res.data.allBookings || []);
        } catch (err) {
            toast.error("Failed to get Bookings");
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async (bookingId: string) => {
        try {
            const res = await axios.put(`http://localhost:5000/api/bookings/${bookingId}/payment`);
            toast.success(res.data.message);
            getBookings();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to make payment");
        }
    };

    const handleCancel = async (bookingId: string) => {
        try {
            const res = await axios.put(`http://localhost:5000/api/bookings/${bookingId}/cancel`);
            toast.success(res.data.message);
            getBookings();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to cancel booking");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
        toast.success("Logged out successfully");
        navigate('/login', { replace: true });
    };

    const calculateTimeLeft = (createdAtString: string) =>{
        const createdAtTime = new Date(createdAtString).getTime();
        const expiredTime = createdAtTime+ 15*60*1000;

        const timeNow = new Date().getTime();
        const timeLeft = expiredTime - timeNow;

        if(timeLeft <= 0){
            return {isExpired: true, text:"Expired"}
        }

        const minutes = Math.floor((timeLeft % (1000*60*60)) / (1000*60))
        const seconds = Math.floor((timeLeft % (1000*60)) / 1000)

        const formattedTime = `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`

        return {isExpired: false, text: formattedTime }

    }

    const [, setTick] = useState(0);

    useEffect(() => {
        if (!userId) {
            toast.error("Please Login First");
            navigate('/login', { replace: true });
            return;
        }
        getBookings();

        // Interval 1s to make countdown timer tick in real-time
        const timer = setInterval(() => {
            setTick((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

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

                        <button
                            onClick={() => navigate('/profile')}
                            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
                        >
                            My Profile
                        </button>

                        {role === 'admin' && (
                            <button
                                onClick={() => navigate('/admin')}
                                className="px-4 py-2 text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-xl hover:bg-blue-100 transition"
                            >
                                Admin Dashboard
                            </button>
                        )}

                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Area */}
            <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">My Tickets & Bookings</h2>
                        <p className="text-sm text-gray-500 mt-1">Manage your booked event tickets and complete payment</p>
                    </div>
                </div>

                {loading ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                        <p className="text-gray-500">Loading your bookings...</p>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                        <p className="text-gray-500 text-lg mb-4">You have no booked tickets yet.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
                        >
                            Explore Events
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {bookings.map((booking) => {
                            const timeLeft = calculateTimeLeft(booking.createdAt);
                            const isExpiredPending = booking.status === 'pending' && timeLeft.isExpired;

                            return (
                                <div
                                    key={booking._id}
                                    className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={`http://localhost:5000/${booking.eventId?.image}`}
                                            alt={booking.eventId?.title}
                                            className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                                        />
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">
                                                {booking.eventId?.title || "Deleted Event"}
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                Location: {booking.eventId?.location}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Date: {booking.eventId?.date ? new Date(booking.eventId.date).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                }) : "-"}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Booked on: {new Date(booking.createdAt).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 gap-3">
                                        <div className="text-left md:text-right flex flex-col items-start md:items-end">
                                            {/* Status Badge */}
                                            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full capitalize mb-1 ${
                                                booking.status === 'paid'
                                                    ? 'bg-green-100 text-green-700 border border-green-200'
                                                    : booking.status === 'cancelled' || isExpiredPending
                                                    ? 'bg-red-100 text-red-700 border border-red-200'
                                                    : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                            }`}>
                                                {isExpiredPending ? 'Expired' : booking.status}
                                            </span>

                                            {/* Real-time Countdown Timer Badge for Pending */}
                                            {booking.status === 'pending' && !timeLeft.isExpired && (
                                                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 mb-1">
                                                    Pay within: {timeLeft.text}
                                                </span>
                                            )}

                                            <p className="text-xs text-gray-400">Quantity: {booking.quantity} Ticket(s)</p>
                                            <p className="text-lg font-extrabold text-blue-600">
                                                Rp {booking.totalPrice?.toLocaleString('id-ID')}
                                            </p>
                                        </div>

                                        {/* Action Buttons for Non-Expired Pending Status */}
                                        {booking.status === 'pending' && !timeLeft.isExpired && (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handlePayment(booking._id)}
                                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-xl transition shadow-sm"
                                                >
                                                    Pay Now
                                                </button>
                                                <button
                                                    onClick={() => handleCancel(booking._id)}
                                                    className="px-3 py-2 border border-red-300 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-xl transition"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        )}

                                        {/* Cancel Button Only for Expired Pending */}
                                        {isExpiredPending && (
                                            <button
                                                onClick={() => handleCancel(booking._id)}
                                                className="px-3 py-1.5 border border-gray-300 text-gray-500 hover:bg-gray-100 text-xs font-semibold rounded-xl transition"
                                            >
                                                Remove Expired Booking
                                            </button>
                                        )}
                                        {booking.status === 'paid' && (
                                            <button
                                                onClick={() => {
                                                    SetSelectedTicket(booking);
                                                    setCurrentTicketIndex(0);
                                                }}
                                                className="px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
                                            >
                                                View E-Ticket
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* E-Ticket Modal Popup */}
            {selectedTicket && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center border border-gray-100 shadow-2xl relative">
                        {/* Close Button */}
                        <button
                            onClick={() => SetSelectedTicket(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-lg"
                        >
                            ✕
                        </button>

                        <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 font-semibold text-xs rounded-full">
                                Official E-Ticket
                            </span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 font-bold text-xs rounded-full">
                                Ticket {currentTicketIndex + 1} of {selectedTicket.quantity || 1}
                            </span>
                        </div>

                        <h3 className="text-xl font-extrabold text-gray-900 mb-1">
                            {selectedTicket.eventId?.title || "Event Ticket"}
                        </h3>
                        <p className="text-xs text-gray-500 mb-4">
                            Location: {selectedTicket.eventId?.location}
                        </p>

                        {/* Individual Ticket QR Code Container */}
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 inline-block mb-4 shadow-inner">
                            <QRCodeSVG value={`${selectedTicket._id}-${currentTicketIndex + 1}`} size={180} />
                        </div>

                        {/* Prev / Next Slider Controls if quantity > 1 */}
                        {(selectedTicket.quantity || 1) > 1 && (
                            <div className="flex items-center justify-between gap-3 mb-4 bg-gray-50 p-2 rounded-xl border border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setCurrentTicketIndex((prev) => Math.max(0, prev - 1))}
                                    disabled={currentTicketIndex === 0}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                        currentTicketIndex === 0
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-300 shadow-sm'
                                    }`}
                                >
                                    ← Previous
                                </button>
                                <span className="text-xs font-semibold text-gray-600">
                                    {currentTicketIndex + 1} / {selectedTicket.quantity}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setCurrentTicketIndex((prev) => Math.min((selectedTicket.quantity || 1) - 1, prev + 1))}
                                    disabled={currentTicketIndex === (selectedTicket.quantity || 1) - 1}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                        currentTicketIndex === (selectedTicket.quantity || 1) - 1
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-300 shadow-sm'
                                    }`}
                                >
                                    Next →
                                </button>
                            </div>
                        )}

                        <p className="text-xs font-mono font-bold text-gray-800 mb-1">
                            Ticket Code: {selectedTicket._id}-{currentTicketIndex + 1}
                        </p>

                        <p className="text-xs text-blue-700 bg-blue-50 p-3 rounded-xl border border-blue-100 leading-relaxed font-medium mt-3">
                            Show this specific QR Code to the gate crew at the venue entrance.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}