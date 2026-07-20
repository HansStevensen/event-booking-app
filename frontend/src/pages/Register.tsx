import axios from "axios";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
    const navigate = useNavigate();
    const [formData,setFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        phoneNumber: "",
        DOB: "",
    })

    const handleOnChange = async(e:React.ChangeEvent<HTMLInputElement>)=>{
        setFormData({...formData,[e.target.name] : e.target.value});
    }

    const handleOnSubmit = async(e: React.FormEvent)=>{
        e.preventDefault();

        try {
            const response = await axios.post(`http://localhost:5000/api/register`,formData);

            if(response.data.message){
                toast.success(response.data.message);
                navigate('/login',{replace:true});
            }
        } catch (err:any) {
            toast.error(err.response.data.message)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Create an Account</h2>
                <p className="text-gray-500 text-sm text-center mb-8">Join EventTix to start booking tickets</p>

                <form onSubmit={handleOnSubmit} className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-700">Full Name</label>
                            <input 
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleOnChange}
                                required
                                className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-700">Username</label>
                            <input
                                type="text"
                                name="username"
                                placeholder="Choose a username"
                                value={formData.username}
                                onChange={handleOnChange} 
                                required
                                className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-700">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleOnChange}
                                required
                                className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-700">Password</label>
                            <input 
                                type="password"
                                name="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleOnChange}
                                required
                                className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                            <input 
                                type="text"
                                name="phoneNumber"
                                placeholder="Enter phone number"
                                value={formData.phoneNumber}
                                onChange={handleOnChange}
                                className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-700">Date of Birth</label>
                            <input
                                type="date"
                                name="DOB"
                                value={formData.DOB}
                                onChange={handleOnChange}
                                className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition duration-200 shadow-sm"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="text-sm text-gray-600 text-center mt-6">
                    Already have an account?{" "}
                    <button
                        onClick={() => navigate('/login')}
                        className="text-blue-600 hover:underline font-semibold"
                    >
                        Sign In
                    </button>
                </p>
            </div>
        </div>
    );
}