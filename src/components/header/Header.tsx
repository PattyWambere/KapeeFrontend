import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaRegUser,
  FaRegHeart,
  FaShoppingCart,
  FaSearch,
  FaChevronDown,
} from "react-icons/fa";
import SearchBar from "./SearchBar";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import CartSidebar from "../cart/CartSidebar";
import NavMenu from "./NavMenu";
import LoginModal from "../auth/LoginModal";
import RegisterModal from "../auth/RegisterModal";
import LostPasswordModal from "../auth/LostPasswordModal";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLostPasswordOpen, setIsLostPasswordOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { wishlist } = useWishlist();
  const { cartItems, subtotal, setCartOpen } = useCart();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const switchToRegister = () => {
    setIsLoginOpen(false);
    setIsLostPasswordOpen(false);
    setIsRegisterOpen(true);
  };

  const switchToLogin = () => {
    setIsRegisterOpen(false);
    setIsLostPasswordOpen(false);
    setIsLoginOpen(true);
  };

  const switchToLostPassword = () => {
    setIsLoginOpen(false);
    setIsLostPasswordOpen(true);
  };

  return (
    <>
      <header className="bg-blue-600 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-between gap-4 md:gap-10">
            {/* MOBILE MENU TOGGLE */}
            <button
              className="text-white text-xl md:hidden focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* LOGO */}
            <Link
              to="/"
              className="text-white text-2xl md:text-4xl font-bold tracking-tighter"
            >
              kapee<span className="text-orange-400">.</span>
            </Link>

            {/* SEARCH (desktop / expanded mobile) */}
            <div
              className={`${isSearchOpen ? "flex" : "hidden md:flex"
                } flex-1 absolute md:relative top-full left-0 w-full md:w-auto bg-blue-600 md:bg-transparent p-4 md:p-0 border-t border-blue-500 md:border-0 z-40 transition-all`}
            >
              <SearchBar />
            </div>

            {/* USER ACTIONS */}
            <div className="flex items-center gap-4 md:gap-7 text-white">
              {/* MOBILE SEARCH TOGGLE */}
              <button
                className="md:hidden text-lg"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <FaSearch />
              </button>

              {/* SIGN IN / USER MENU */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-3 group"
                  >
                    <FaRegUser className="text-xl group-hover:text-orange-400 transition" />
                    <div className="hidden lg:block leading-tight">
                      <p className="text-[10px] opacity-70 uppercase">Hello,</p>
                      <p className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                        {user.firstName} <FaChevronDown size={8} />
                      </p>
                    </div>
                  </button>

                  {/* User Dropdown */}
                  {isUserMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                        <Link
                          to="/account"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          My Account
                        </Link>
                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          My Orders
                        </Link>
                        <hr className="my-2" />
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="flex items-center gap-3 group"
                >
                  <FaRegUser className="text-xl group-hover:text-orange-400 transition" />
                  <div className="hidden lg:block leading-tight">
                    <p className="text-[10px] opacity-70 uppercase">Hello,</p>
                    <p className="text-xs font-bold uppercase tracking-wider">
                      Sign In
                    </p>
                  </div>
                </button>
              )}

              {/* WISHLIST */}
              <Link to="/wishlist" className="relative group">
                <FaRegHeart className="text-xl group-hover:text-orange-400 transition" />
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-blue-600">
                  {wishlist.length}
                </span>
              </Link>

              {/* CART */}
              <div
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => setCartOpen(true)}
              >
                <div className="relative">
                  <FaShoppingCart className="text-xl group-hover:text-orange-400 transition" />
                  <span className="absolute -top-2 -right-2 bg-white text-blue-600 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                </div>
                <span className="hidden sm:inline font-bold text-sm">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE NAVIGATION DRAWER */}
        <div
          className={`md:hidden absolute w-64 h-screen bg-white top-full left-0 shadow-2xl transform transition-transform duration-300 z-50 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <NavMenu isMobile onNavigate={() => setIsMenuOpen(false)} />
        </div>
        {isMenuOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMenuOpen(false)}
            style={{ top: "80px" }}
          />
        )}
      </header>

      {/* DESKTOP NAV MENU */}
      <div className="hidden md:block">
        <NavMenu />
      </div>

      <CartSidebar />

      {/* AUTH MODALS */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={switchToRegister}
        onSwitchToLostPassword={switchToLostPassword}
      />
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={switchToLogin}
      />
      <LostPasswordModal
        isOpen={isLostPasswordOpen}
        onClose={() => setIsLostPasswordOpen(false)}
        onSwitchToLogin={switchToLogin}
      />
    </>
  );
};

export default Header;
