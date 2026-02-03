import { NavLink } from "react-router-dom";
import ShopByCategory from "./dropdown/ShopByCategory";

interface NavMenuProps {
  isMobile?: boolean;
  onNavigate?: () => void;
}

const NavMenu = ({ isMobile, onNavigate }: NavMenuProps) => {
  const links = [
    { path: "/", label: "HOME" },
    { path: "/shop", label: "SHOP" },
    { path: "/blog", label: "BLOG" },
    { path: "/about", label: "ABOUT" },
  ];

  if (isMobile) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Menu</h3>
        </div>
        <nav className="flex flex-col p-4">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={onNavigate}
              className={({ isActive }) =>
                `p-4 text-sm font-bold border-b border-gray-50 transition-colors ${isActive ? "text-blue-600 bg-blue-50/50" : "text-gray-700 hover:text-blue-600"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto p-6 border-t border-gray-100">
          <ShopByCategory />
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-gray-200 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center gap-10 px-4 py-4 text-[13px] font-bold">
        {/* SHOP BY CATEGORY DROPDOWN */}
        <ShopByCategory />

        {/* MAIN LINKS */}
        <nav className="flex items-center gap-10">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `tracking-widest transition-all duration-300 relative py-2 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-blue-600 after:transition-all hover:after:w-full ${isActive ? "text-blue-600 after:w-full" : "text-gray-800 hover:text-blue-600"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default NavMenu;
