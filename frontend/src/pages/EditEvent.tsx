import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function EditEvent() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formEvent, setFormEvent] = useState<any>({
        newTitle: "",
        newDescription: "",
        newLocation: "",
        newPrice: 0,
        newQuota: 0,
        newDate: "",
        newImage: null as File | null
    });

    const getEvent = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/events/${id}`);
            const eventData = res.data.events;

            if (eventData) {
                setFormEvent({
                    newTitle: eventData.title || "",
                    newDescription: eventData.description || "",
                    newLocation: eventData.location || "",
                    newPrice: eventData.price || 0,
                    newQuota: eventData.quota || 0,
                    newDate: eventData.date ? eventData.date.split('T')[0] : "",
                    newImage: null
                });
            }
        } catch (err) {
            toast.error("Gagal Mengambil Data Event");
        }
    };

    const handleonChange = (e: any) => {
        if (e.target.type === 'file') {
            setFormEvent({ ...formEvent, newImage: e.target.files?.[0] || null });
        } else {
            setFormEvent({ ...formEvent, [e.target.name]: e.target.value });
        }
    };

    const handleOnSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = new FormData();
        data.append("newTitle", formEvent.newTitle);
        data.append("newDescription", formEvent.newDescription);
        data.append("newLocation", formEvent.newLocation);
        data.append("newPrice", formEvent.newPrice);
        data.append("newQuota", formEvent.newQuota);
        data.append("newDate", formEvent.newDate);
        if (formEvent.newImage) {
            data.append("newImage", formEvent.newImage);
        }

        try {
            const send = await axios.put(`http://localhost:5000/api/events/${id}`, data);
            toast.success(send.data.message);
            navigate('/admin', { replace: true });
        } catch (err) {
            toast.error("Gagal Mengupdate Data Event");
        }
    };

    useEffect(() => {
        getEvent();
    }, [id]);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate('/admin')}
                        className="text-gray-500 hover:text-gray-700 transition"
                    >
                        ← Back
                    </button>
                    <h2 className="text-3xl font-bold text-gray-800">Edit Event</h2>
                </div>

                <form onSubmit={handleOnSubmit} className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="text-sm font-semibold text-gray-700">Event Title</label>
                            <input
                                type="text"
                                name="newTitle"
                                placeholder="Enter Event Title"
                                value={formEvent.newTitle}
                                onChange={handleonChange}
                                required
                                className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="text-sm font-semibold text-gray-700">Description</label>
                            <textarea
                                name="newDescription"
                                placeholder="Describe the event details..."
                                value={formEvent.newDescription}
                                onChange={handleonChange}
                                required
                                rows={4}
                                className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-700">Location</label>
                            <input
                                type="text"
                                name="newLocation"
                                placeholder="Enter Location"
                                value={formEvent.newLocation}
                                onChange={handleonChange}
                                required
                                className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-700">Date</label>
                            <input
                                type="date"
                                name="newDate"
                                value={formEvent.newDate}
                                onChange={handleonChange}
                                required
                                className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-700">Price (IDR)</label>
                            <input
                                type="number"
                                name="newPrice"
                                placeholder="Enter Price"
                                value={formEvent.newPrice}
                                onChange={handleonChange}
                                required
                                className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-700">Quota</label>
                            <input
                                type="number"
                                name="newQuota"
                                placeholder="Enter Quota"
                                value={formEvent.newQuota}
                                onChange={handleonChange}
                                required
                                className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="text-sm font-semibold text-gray-700">New Event Poster (Optional)</label>
                            <input
                                type="file"
                                name="newImage"
                                accept="image/*"
                                onChange={handleonChange}
                                className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition file:mr-4 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition duration-200 shadow-sm"
                    >
                        Update Event
                    </button>
                </form>
            </div>
        </div>
    );
}