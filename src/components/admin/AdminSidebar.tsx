import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
    FaChartLine,
    FaBoxOpen,
    FaTags,
    FaShoppingCart,
    FaHome,
    FaCog,
    FaTimes,
} from "react-icons/fa";

interface AdminSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const AdminSidebar = ({ isOpen = false, onClose }: AdminSidebarProps) => {
    const { user } = useAuth();

    const navItems = [
        { icon: <FaChartLine size={18} />,    label: "Dashboard",   path: "/admin" },
        { icon: <FaBoxOpen size={18} />,      label: "Products",    path: "/admin/products" },
        { icon: <FaTags size={18} />,         label: "Categories",  path: "/admin/categories" },
        { icon: <FaShoppingCart size={18} />, label: "Orders",      path: "/admin/orders" },
        { icon: <FaCog size={18} />,          label: "Settings",    path: "/admin/settings" },
    ];

    return (
        <aside
            className={`
                fixed left-0 top-0 z-50 h-full w-64 flex flex-col
                bg-white border-r border-gray-100 shadow-sm
                transition-transform duration-300 ease-in-out
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
                lg:translate-x-0
            `}
        >
            {/* ── Brand ── */}
            <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100">
                <div>
                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400 mb-0.5">
                        Control Panel
                    </p>
                    <h1 className="text-xl font-black tracking-tighter uppercase leading-none text-gray-900">
                        Gura<span className="text-blue-600">Faster</span>
                    </h1>
                </div>

                {/* Mobile close */}
                <button
                    onClick={onClose}
                    className="lg:hidden w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
                    aria-label="Close sidebar"
                >
                    <FaTimes size={15} />
                </button>
            </div>

            {/* ── Main Navigation ── */}
            <nav
                className="flex-1 px-4 py-6 space-y-1 overflow-y-auto"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                <style>{`aside nav::-webkit-scrollbar { display: none; }`}</style>

                <p className="text-[9px] font-black uppercase tracking-[0.28em] text-gray-400 px-3 pb-4">
                    Navigation
                </p>

                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === "/admin"}
                        onClick={onClose}
                        className={({ isActive }) =>
                            `group relative flex items-center gap-4 px-4 py-4 text-[11px] font-black uppercase tracking-[0.18em] transition-all duration-200
                            ${isActive
                                ? "text-blue-600 bg-blue-50"
                                : "text-gray-600 hover:text-gray-900"
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {/* Left accent border */}
                                <span className={`absolute left-0 top-0 h-full w-[3px] transition-all duration-200 ${
                                    isActive ? "bg-blue-600" : "bg-transparent group-hover:bg-blue-200"
                                }`} />

                                {/* Icon */}
                                <span className={`flex-shrink-0 transition-colors duration-200 ${
                                    isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-900"
                                }`}>
                                    {item.icon}
                                </span>

                                {/* Label */}
                                <span className="flex-1">{item.label}</span>

                                {/* Active dot */}
                                {isActive && (
                                    <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* ── Divider ── */}
            <div className="mx-5 border-t border-gray-100" />

            {/* ── Footer: Back to Site only ── */}
            <div className="px-4 py-5">
                <p className="text-[9px] font-black uppercase tracking-[0.28em] text-gray-400 px-3 pb-4">
                    Account
                </p>

                <NavLink
                    to="/"
                    onClick={onClose}
                    className="group relative flex items-center gap-4 px-4 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-gray-600 hover:text-gray-900 transition-all duration-200"
                >
                    <span className="absolute left-0 top-0 h-full w-[3px] bg-transparent group-hover:bg-blue-200 transition-all duration-200" />
                    <FaHome size={18} className="flex-shrink-0 text-gray-500 group-hover:text-gray-900 transition-colors" />
                    Back to Site
                </NavLink>
            </div>
        </aside>
    );
};

export default AdminSidebar;
