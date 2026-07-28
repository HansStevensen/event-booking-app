import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Profile() {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");

    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordInput, setShowPasswordInput] = useState(false);

    const [form, SetForm] = useState({
        name: "",
        username: "",
        email: "",
        oldPassword: "",
        password: "",
        phoneNumber: "",
        DOB: ""
    });
    const [loading, setLoading] = useState(true);

    const getUser = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/profile/${userId}`);
            const userData = res.data.user;

            if (userData) {
                SetForm({
                    ...userData,
                    oldPassword: "",
                    password: "",
                    DOB: userData.DOB ? userData.DOB.split('T')[0] : ""
                });
            }
        } catch (err) {
            toast.error("Failed to get profile data");
        } finally {
            setLoading(false);
        }
    };

    const handleEditProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.put(`http://localhost:5000/api/profile/${userId}`, {
                newName: form.name,
                newUsername: form.username,
                newEmail: form.email,
                oldPassword: form.oldPassword || undefined,
                newPassword: form.password || undefined,
                newPhoneNumber: form.phoneNumber,
                newDOB: form.DOB
            });

            toast.success(res.data.message || "Profile updated successfully");
            SetForm((prev) => ({ ...prev, oldPassword: "", password: "" }));
            setShowPasswordInput(false);
            setIsEditing(false); // Switch back to Read-Only mode after saving
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to update profile");
        }
    };

    useEffect(() => {
        if (!userId) {
            toast.error("Please login first");
            navigate('/login');
            return;
        }
        getUser();
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
                            onClick={() => navigate('/my-bookings')}
                            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
                        >
                            My Tickets
                        </button>

                        {role === 'admin' && (
                            <button
                                onClick={() => navigate('/admin')}
                                className="px-4 py-2 text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-xl hover:bg-blue-100 transition"
                            >
                                Admin Dashboard
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Profile Container */}
            <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                    {/* Header Profile Avatar & Toggle Button */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-6 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-2xl uppercase shadow-sm">
                                {form.name ? form.name.substring(0, 2) : "U"}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{form.name || "User Profile"}</h2>
                                <p className="text-sm text-gray-500">@{form.username || "username"}</p>
                            </div>
                        </div>

                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition shadow-sm"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <p className="text-center text-gray-500 py-8">Loading profile data...</p>
                    ) : !isEditing ? (
                        /* MODE 1: READ-ONLY VIEW MODE */
                        <div className="flex flex-col gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Full Name</p>
                                    <p className="text-base font-bold text-gray-800 mt-1">{form.name || "-"}</p>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Username</p>
                                    <p className="text-base font-bold text-gray-800 mt-1">@{form.username || "-"}</p>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</p>
                                    <p className="text-base font-bold text-gray-800 mt-1">{form.email || "-"}</p>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Phone Number</p>
                                    <p className="text-base font-bold text-gray-800 mt-1">{form.phoneNumber || "-"}</p>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Date of Birth</p>
                                    <p className="text-base font-bold text-gray-800 mt-1">
                                        {form.DOB ? new Date(form.DOB).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        }) : "-"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* MODE 2: EDITABLE FORM MODE */
                        <form onSubmit={handleEditProfile} className="flex flex-col gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Name */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-gray-700 uppercase">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Full Name"
                                        value={form.name}
                                        onChange={(e) => SetForm({ ...form, name: e.target.value })}
                                        required
                                        className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    />
                                </div>

                                {/* Username */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-gray-700 uppercase">Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="Username"
                                        value={form.username}
                                        onChange={(e) => SetForm({ ...form, username: e.target.value })}
                                        required
                                        className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    />
                                </div>

                                {/* Email */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-gray-700 uppercase">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email Address"
                                        value={form.email}
                                        onChange={(e) => SetForm({ ...form, email: e.target.value })}
                                        required
                                        className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    />
                                </div>

                                {/* Phone Number */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-gray-700 uppercase">Phone Number</label>
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        placeholder="e.g. 081234567890"
                                        value={form.phoneNumber}
                                        onChange={(e) => SetForm({ ...form, phoneNumber: e.target.value })}
                                        className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    />
                                </div>

                                {/* Date of Birth */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-gray-700 uppercase">Date of Birth</label>
                                    <input
                                        type="date"
                                        name="DOB"
                                        value={form.DOB}
                                        onChange={(e) => SetForm({ ...form, DOB: e.target.value })}
                                        className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    />
                                </div>

                                {/* Toggleable Password Field */}
                                <div className="flex flex-col gap-1.5 md:col-span-2 border-t border-gray-100 pt-4 mt-2">
                                    {!showPasswordInput ? (
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswordInput(true)}
                                            className="text-left text-xs font-semibold text-blue-600 hover:text-blue-700 underline py-1"
                                        >
                                            Change Password
                                        </button>
                                    ) : (
                                        <div className="flex flex-col gap-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Change Account Password</h4>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setShowPasswordInput(false);
                                                        SetForm({ ...form, oldPassword: "", password: "" });
                                                    }}
                                                    className="text-xs font-medium text-red-500 hover:underline"
                                                >
                                                    Cancel Password Change
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex flex-col gap-1.5">
                                                    <label className="text-xs font-semibold text-gray-700 uppercase">Current Password</label>
                                                    <input
                                                        type="password"
                                                        placeholder="Enter current password"
                                                        value={form.oldPassword}
                                                        onChange={(e) => SetForm({ ...form, oldPassword: e.target.value })}
                                                        required={showPasswordInput}
                                                        className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
                                                    />
                                                </div>

                                                <div className="flex flex-col gap-1.5">
                                                    <label className="text-xs font-semibold text-gray-700 uppercase">New Password</label>
                                                    <input
                                                        type="password"
                                                        placeholder="Enter new password"
                                                        value={form.password}
                                                        onChange={(e) => SetForm({ ...form, password: e.target.value })}
                                                        required={showPasswordInput}
                                                        className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 mt-4">
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition duration-200 shadow-sm"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        getUser(); // Reset form to original values
                                        setIsEditing(false);
                                    }}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-xl text-sm transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
}