import axios from "axios";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
    const navigate = useNavigate();
    const [username,setUsername]= useState('');
    const [password,setPassword]= useState('');

    const handleOnSubmit = async(e: React.FormEvent)=>{
        e.preventDefault();

        try {
            const response = await axios.post(`http://localhost:5000/api/login`, {username,password});
            localStorage.setItem('userId',response.data.id);
            localStorage.setItem('role',response.data.role);
            toast.success("Login success")
            if(response.data.role==='admin'){
                navigate('/admin',{replace:true});
            }else{
                navigate('/',{replace:true});
            }
        } catch (err:any) {
            toast.error(err.response.data.message);
        }

    }
    
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Welcome Back</h2>
                <p className="text-gray-500 text-sm text-center mb-8">Please enter your details to sign in</p>

                <form onSubmit={handleOnSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-gray-700">Username</label>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-gray-700">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                    </div>

                    <button
                        type="submit"
                        className="mt-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition duration-200 shadow-sm"
                    >
                        Sign In
                    </button>
                </form>

                <p className="text-sm text-gray-600 text-center mt-6">
                    Don't have an account?{" "}
                    <button
                        onClick={() => navigate('/register')}
                        className="text-blue-600 hover:underline font-semibold"
                    >
                        Sign Up
                    </button>
                </p>
            </div>
        </div>
    );
}