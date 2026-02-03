import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const MyAccount = () => {
    const { user, logout, isAuthenticated, isLoading, changePassword, uploadAvatar } = useAuth();
    const [activeTab, setActiveTab] = useState("dashboard");
    const [uploading, setUploading] = useState(false);

    // Change Password State
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (isLoading) {
        return <div className="min-h-[60vh] flex items-center justify-center">Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setIsSubmitting(true);

        try {
            await changePassword(oldPassword, newPassword);
            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setOldPassword("");
            setNewPassword("");
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || "Failed to change password" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            <h1 className="text-3xl font-bold mb-8">My Account</h1>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Sidebar / Menu */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-fit">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative group">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl uppercase overflow-hidden border-2 border-transparent group-hover:border-blue-500 transition">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    user?.firstName?.charAt(0)
                                )}
                            </div>
                            <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-xs opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition">
                                {uploading ? "..." : "Edit"}
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        if (e.target.files?.[0]) {
                                            setUploading(true);
                                            try {
                                                await uploadAvatar(e.target.files[0]);
                                            } catch (err) {
                                                console.error(err);
                                                alert("Failed to upload image");
                                            } finally {
                                                setUploading(false);
                                            }
                                        }
                                    }}
                                />
                            </label>
                        </div>
                        <div>
                            <p className="font-bold">{user?.firstName} {user?.lastName}</p>
                            <p className="text-sm text-gray-500 break-all">{user?.email}</p>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        <button
                            onClick={() => setActiveTab("dashboard")}
                            className={`w-full text-left px-4 py-2 rounded font-medium transition ${activeTab === "dashboard" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50 text-gray-600"}`}
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={() => setActiveTab("password")}
                            className={`w-full text-left px-4 py-2 rounded font-medium transition ${activeTab === "password" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50 text-gray-600"}`}
                        >
                            Change Password
                        </button>
                        <button
                            onClick={logout}
                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded mt-4"
                        >
                            Logout
                        </button>
                    </nav>
                </div>

                {/* Content Area */}
                <div className="md:col-span-2">
                    {activeTab === "dashboard" && (
                        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold mb-4">Profile Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">First Name</label>
                                    <p className="font-medium text-gray-900 border-b pb-2">{user?.firstName}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Last Name</label>
                                    <p className="font-medium text-gray-900 border-b pb-2">{user?.lastName}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                                    <p className="font-medium text-gray-900 border-b pb-2">{user?.email}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
                                    <p className="font-medium text-gray-900 border-b pb-2 capitalize">{user?.role}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "password" && (
                        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold mb-4">Change Password</h2>

                            {message && (
                                <div className={`p-4 rounded-md mb-4 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                    {message.text}
                                </div>
                            )}

                            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                    <input
                                        type="password"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition disabled:opacity-50"
                                >
                                    {isSubmitting ? "Updating..." : "Update Password"}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyAccount;
