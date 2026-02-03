import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
    FaChartLine,
    FaBoxOpen,
    FaTags,
    FaShoppingCart,
    FaSignOutAlt,
    FaHome
} from "react-icons/fa";

const AdminSidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const navItems = [
        { icon: <FaChartLine />, label: "Dashboard", path: "/admin" },
        { icon: <FaBoxOpen />, label: "Products", path: "/admin/products" },
        { icon: <FaTags />, label: "Categories", path: "/admin/categories" },
        { icon: <FaShoppingCart />, label: "Orders", path: "/admin/orders" },
    ];

    return (
        <div className="w-64 h-full bg-black text-white flex flex-col fixed left-0 top-0 z-50">
            {/* Brand */}
            <div className="p-8 border-b border-white/10">
                <h1 className="text-2xl font-black tracking-tighter uppercase italic">
                    Kapee <span className="text-blue-500 font-black">Admin</span>
                </h1>
            </div>

            {/* Profile */}
            <div className="p-8 flex items-center gap-4 border-b border-white/10 bg-white/5">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-xl font-bold border-2 border-white/20 overflow-hidden">
                    {user?.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        user?.firstName?.charAt(0)
                    )}
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-0.5">Welcome back,</p>
                    <p className="text-sm font-bold truncate max-w-[120px] tracking-tight">{user?.firstName} {user?.lastName}</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-6 space-y-2 mt-4">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === "/admin"}
                        className={({ isActive }) => `
              flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300
              ${isActive
                                ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20 translate-x-1"
                                : "text-gray-400 hover:text-white hover:bg-white/5 hover:translate-x-1"}
            `}
                    >
                        <span className="text-lg opacity-80">{item.icon}</span>
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* Footer Actions */}
            <div className="p-6 space-y-2 border-t border-white/10 mb-6">
                <NavLink
                    to="/"
                    className="flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300"
                >
                    <FaHome className="text-lg opacity-80" />
                    Back to Site
                </NavLink>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-red-500 hover:bg-red-500/10 transition-all duration-300 group"
                >
                    <FaSignOutAlt className="text-lg opacity-80 group-hover:-translate-x-1 transition-transform" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
