import { useState } from "react";
import { FaTimes, FaLock } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

interface LostPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToLogin: () => void;
}

const LostPasswordModal = ({ isOpen, onClose, onSwitchToLogin }: LostPasswordModalProps) => {
    const { forgotPassword } = useAuth();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setIsSubmitting(true);

        try {
            await forgotPassword(email);
            setMessage({ type: 'success', text: 'Password reset link sent to your email.' });
            setEmail("");
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || "Failed to send reset email" });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-2xl overflow-hidden animate-fadeIn">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 transition"
                >
                    <FaTimes size={20} />
                </button>

                <div className="p-8">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                            <FaLock />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Lost Password?</h2>
                        <p className="text-gray-600 text-sm mt-2">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {message && (
                            <div className={`px-4 py-3 rounded text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                {message.text}
                            </div>
                        )}

                        <div>
                            <label htmlFor="reset-email" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                id="reset-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 text-white py-3 font-bold uppercase tracking-wider hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Sending..." : "Reset Password"}
                        </button>

                        <div className="text-center text-sm text-gray-600">
                            Remember your password?{" "}
                            <button
                                type="button"
                                onClick={onSwitchToLogin}
                                className="text-blue-600 font-bold hover:underline"
                            >
                                Back to Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LostPasswordModal;
