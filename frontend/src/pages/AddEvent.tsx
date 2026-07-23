import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import toast from "react-hot-toast";

export default function AddEvent(){
    const navigate = useNavigate();
    const [formEvent,setFormEvent] = useState<any>({
        title:"",
        description:"",
        location:"",
        price:0,
        quota:0,
        date:"",
        image:null,
        venueAddress:"",
        mapsUrl:"",
        openGateTime:"",
        startTime:"",
        terms:""
    })

    const handleOnSubmit = async(e:React.FormEvent)=>{
        e.preventDefault();
        
        const data = new FormData();
        data.append("title",formEvent.title);
        data.append("description",formEvent.description);
        data.append("location",formEvent.location);
        data.append("price",formEvent.price);
        data.append("quota",formEvent.quota);
        data.append("date",formEvent.date);
        data.append("image",formEvent.image);
        data.append("venueAddress",formEvent.venueAddress);
        data.append("mapsUrl",formEvent.mapsUrl);
        data.append("openGateTime",formEvent.openGateTime);
        data.append("startTime",formEvent.startTime);
        data.append("terms",formEvent.terms);

        try {
            await axios.post(`http://localhost:5000/api/events`,data)
            toast.success("Success to create a new event")
            navigate("/admin",{replace: true})
        } catch (err) {
            toast.error("Failed to create a new event")
        }
    }

    const handleonChange = (e:any)=>{
        if(e.target.type ==='file'){
            setFormEvent({...formEvent,image: e.target.files?.[0]||null})
        }else{
            setFormEvent({...formEvent,[e.target.name]:e.target.value})
        }
    }

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
                    <h2 className="text-3xl font-bold text-gray-800">Add New Event</h2>
                </div>

                <form onSubmit={handleOnSubmit} className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="text-sm font-semibold text-gray-700">Event Title</label>
                            <input 
                                type="text"
                                name="title"
                                placeholder="e.g. Konser Musik Bandung"
                                value={formEvent.title}
                                onChange={handleonChange}
                                required
                                className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="text-sm font-semibold text-gray-700">Description</label>
                            <textarea 
                                name="description"
                                placeholder="Describe the event details..."
                                value={formEvent.description}
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
                                name="location"
                                placeholder="e.g. Gasibu, Bandung"
                                value={formEvent.location}
                                onChange={handleonChange}
                                required
                                className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-700">Date</label>
                            <input 
                                type="date"
                                name="date"
                                value={formEvent.date}
                                onChange={handleonChange}
                                required
                                className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-700">Price (IDR)</label>
                            <input 
                                type="number"
                                name="price"
                                placeholder="e.g. 150000"
                                value={formEvent.price}
                                onChange={handleonChange}
                                required
                                className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-700">Quota</label>
                            <input 
                                type="number"
                                name="quota"
                                placeholder="e.g. 100"
                                value={formEvent.quota}
                                onChange={handleonChange}
                                required
                                className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="text-sm font-semibold text-gray-700">Event Poster (Image)</label>
                            <input 
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleonChange}
                                required
                                className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition file:mr-4 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-700">Venue Address</label>
                            <input 
                                type="text"
                                name="venueAddress"
                                placeholder="e.g. Jl. Asia Afrika No. 123"
                                value={formEvent.venueAddress}
                                onChange={handleonChange}
                                required
                                className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-700">Maps URL</label>
                            <input 
                                type="text"
                                name="mapsUrl"
                                placeholder="e.g. https://maps.app.goo.gl/xyz"
                                value={formEvent.mapsUrl}
                                onChange={handleonChange}
                                required
                                className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-700">Open Gate Time</label>
                            <input 
                                type="time"
                                name="openGateTime"
                                value={formEvent.openGateTime}
                                onChange={handleonChange}
                                required
                                className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-700">Start Time</label>
                            <input 
                                type="time"
                                name="startTime"
                                value={formEvent.startTime}
                                onChange={handleonChange}
                                required
                                className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="text-sm font-semibold text-gray-700">Terms & Conditions</label>
                            <textarea 
                                name="terms"
                                placeholder="List the terms and conditions..."
                                value={formEvent.terms}
                                onChange={handleonChange}
                                required
                                rows={4}
                                className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition duration-200 shadow-sm"
                    >
                        Create Event
                    </button>
                </form>
            </div>
        </div>
    );

    
    
}