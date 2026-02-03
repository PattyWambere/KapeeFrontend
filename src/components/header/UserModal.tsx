import { FaTimes } from "react-icons/fa";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const UserModal = ({ isOpen, onClose }: ModalProps) => {
  return (
    <>
      {/* BACKDROP */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* MODAL */}
      <div
        className={`
          fixed top-1/2 left-1/2 z-50 w-[90%] max-w-3xl transform -translate-x-1/2 -translate-y-1/2
          rounded-lg shadow-xl overflow-hidden bg-white
          transition-all duration-500
          ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-90 translate-x-full"}
        `}
      >
        <div className="flex flex-col md:flex-row h-full">
          {/* LEFT INFO PANEL */}
          <div className="md:w-1/2 bg-blue-600 text-white p-8 flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-4">Welcome Back!</h2>
            <p className="text-sm mb-6">
              Sign in to access your orders, wishlist, and exclusive offers.
            </p>
            <ul className="space-y-2 text-sm">
              <li>✔ Fast checkout</li>
              <li>✔ Save your favorites</li>
              <li>✔ Track your orders</li>
            </ul>
          </div>

          {/* RIGHT FORM PANEL */}
          <div className="md:w-1/2 p-8 relative">
            {/* CLOSE BUTTON */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            >
              <FaTimes size={20} />
            </button>

            <h3 className="text-xl font-semibold mb-4">Sign In</h3>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              >
                Sign In
              </button>
            </form>

            <p className="text-sm text-gray-500 mt-4">
              Don't have an account?{" "}
              <span className="text-blue-600 cursor-pointer">Register</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserModal;
