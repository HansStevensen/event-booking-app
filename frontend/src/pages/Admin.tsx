import axios from "axios";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Admin() {
    const navigate = useNavigate();
    const [events, setEvents] = useState<any[]>([]);

    const getEvent = async()=>{
        try {
            const response = await axios.get(`http://localhost:5000/api/events`);
            setEvents(response.data.allEvents);
        } catch (err) {
            toast.error('Gagal Mengambil Data')
        }
    }
    const deleteEvent = async(id: string)=>{
        try {
            const response = await axios.delete(`http://localhost:5000/api/events/${id}`);
            await getEvent();
            toast.success(response.data.message)
        } catch (error) {
            toast.error('Gagal Menghapus Data')
        }
    }

    useEffect(()=>{
        getEvent();
    },[]);

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-6 flex flex-col items-center">
            <div className="w-full max-w-4xl flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard Admin</h1>
                <button
                    onClick={() => navigate('/admin/add-event')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                    + Add Event
                </button>
            </div>

            <div className="w-full max-w-4xl flex flex-col gap-4">
                {events.length === 0 ? (
                    <p className="text-gray-500 text-center py-10">Belum ada event yang dibuat.</p>
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
                                    Harga: <span className="font-medium">Rp {event.price.toLocaleString('id-ID')}</span>
                                </p>
                                <p className="text-sm text-gray-700">
                                    Kuota Tiket: <span className="font-medium">{event.quota}</span>
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Tanggal: {new Date(event.date).toLocaleDateString('id-ID', {
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
                )}
            </div>
        </div>
    );
}