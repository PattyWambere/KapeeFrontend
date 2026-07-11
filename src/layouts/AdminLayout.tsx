import { useState, useRef, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt, FaChevronDown } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="flex min-h-screen bg-gray-50">

            {/* Backdrop (mobile) */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main column */}
            <div className="flex-1 flex flex-col min-w-0 lg:ml-64">

                {/* ── Top bar (always visible) ── */}
                <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between px-5 py-3.5">

                        {/* Left: hamburger (mobile) */}
                        <button
                            onClick={() => setSidebarOpen(prev => !prev)}
                            className="lg:hidden w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-all"
                            aria-label="Toggle sidebar"
                        >
                            {sidebarOpen ? <FaTimes size={17} /> : <FaBars size={17} />}
                        </button>

                        {/* Center: brand name (mobile only) */}
                        <h1 className="lg:hidden text-base font-black tracking-tighter uppercase text-gray-900">
                            Gura<span className="text-blue-600">Faster</span>
                            <span className="text-[9px] font-black text-gray-400 tracking-widest ml-2 align-middle">Admin</span>
                        </h1>

                        {/* Right: avatar + dropdown */}
                        <div className="ml-auto relative" ref={dropdownRef}>
                            <button
                                onClick={() => setProfileOpen(prev => !prev)}
                                className="flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all group"
                            >
                                {/* Avatar */}
                                <div className="w-8 h-8 bg-blue-600 flex items-center justify-center text-xs font-black text-white overflow-hidden ring-2 ring-blue-100 group-hover:ring-blue-300 transition-all flex-shrink-0">
                                    {user?.avatar
                                        ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                                        : <span>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</span>
                                    }
                                </div>

                                {/* Name + role (desktop) */}
                                <div className="hidden sm:block text-left">
                                    <p className="text-[11px] font-black text-gray-900 leading-tight tracking-tight">
                                        {user?.firstName} {user?.lastName}
                                    </p>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-blue-600">
                                        Administrator
                                    </p>
                                </div>

                                <FaChevronDown
                                    size={10}
                                    className={`text-gray-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                                />
                            </button>

                            {/* Dropdown */}
                            {profileOpen && (
                                <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-gray-100 shadow-lg py-1 z-50">
                                    <NavLink
                                        to="/admin/profile"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-wider text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all"
                                    >
                                        <FaUserCircle size={14} />
                                        My Profile
                                    </NavLink>
                                    <div className="border-t border-gray-100 my-1" />
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-wider text-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
                                    >
                                        <FaSignOutAlt size={14} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-5 md:p-8 lg:p-10">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
