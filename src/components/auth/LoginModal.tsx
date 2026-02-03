import { useState } from "react";
import { FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToRegister: () => void;
    onSwitchToLostPassword: () => void;
}

const LoginModal = ({ isOpen, onClose, onSwitchToRegister, onSwitchToLostPassword }: LoginModalProps) => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please enter both email and password");
            return;
        }

        setIsLoading(true);
        const loggedInUser = await login(email, password);
        setIsLoading(false);

        if (loggedInUser) {
            setEmail("");
            setPassword("");
            onClose();

            // Redirect admin to dashboard
            if (loggedInUser.role === "admin") {
                navigate("/admin");
            }
        } else {
            setError("Invalid email or password");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-4xl mx-4 bg-white rounded-lg shadow-2xl overflow-hidden animate-fadeIn">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 transition"
                >
                    <FaTimes size={20} />
                </button>

                <div className="grid md:grid-cols-2">
                    {/* Left Panel - Blue */}
                    <div className="bg-blue-600 text-white p-12 flex flex-col justify-center">
                        <h2 className="text-3xl font-black uppercase tracking-tight mb-4">Login</h2>
                        <p className="text-blue-100 mb-8">
                            Get access your Orders, Wishlist and Recommendations
                        </p>
                        <ul className="space-y-3 text-sm text-blue-100">
                            <li className="flex items-center gap-2">
                                <i className="fa-solid fa-check"></i>
                                <span>Wishlist and Recommendations</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <i className="fa-solid fa-check"></i>
                                <span>Track Your Orders</span>
                            </li>
                        </ul>
                    </div>

                    {/* Right Panel - Form */}
                    <div className="p-12">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                                    Enter Username/Email address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                                    placeholder="Email address"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                                    Enter Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 pr-12 border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                                        placeholder="Password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-gray-600">Remember me</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={onSwitchToLostPassword}
                                    className="text-blue-600 hover:underline"
                                >
                                    Lost your password?
                                </button>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 text-white py-3 font-bold uppercase tracking-wider hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Logging in..." : "LOG IN"}
                            </button>

                            {/* Register Link */}
                            <div className="text-center text-sm text-gray-600">
                                Don't have an account?{" "}
                                <button
                                    type="button"
                                    onClick={onSwitchToRegister}
                                    className="text-blue-600 font-bold hover:underline"
                                >
                                    Create Account
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
