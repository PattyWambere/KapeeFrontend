import { Link, useLocation } from "react-router-dom";
import { FaCheck, FaPrint, FaShoppingBag } from "react-icons/fa";
import CheckoutSteps from "../components/checkout/CheckoutSteps";
import type { Order } from "../api/order.service";

const OrderComplete = () => {
    const location = useLocation();
    const order = location.state?.order as Order | undefined;

    // Fallback for direct access without order data
    if (!order) {
        return (
            <div className="bg-white min-h-screen pb-20">
                <CheckoutSteps currentStep={3} />
                <div className="max-w-3xl mx-auto px-4 py-20 text-center">
                    <h2 className="text-2xl font-black mb-4 uppercase tracking-tighter text-gray-900">
                        No Order Found
                    </h2>
                    <p className="text-gray-500 mb-8 font-medium">
                        It looks like you haven't placed an order recently, or the page was refreshed.
                    </p>
                    <Link
                        to="/shop"
                        className="bg-[#ff6b20] text-white px-12 py-4 rounded-xl font-black hover:bg-black transition-all duration-300 shadow-xl shadow-orange-500/20 uppercase tracking-widest text-xs"
                    >
                        Return To Shop
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pb-20">
            <CheckoutSteps currentStep={3} />

            <div className="max-w-3xl mx-auto px-4 py-12 md:py-20 text-center">
                {/* Success Icon */}
                <div className="flex justify-center mb-12">
                    <div className="relative">
                        <div className="absolute inset-0 bg-green-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                        <div className="relative w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-green-500/40 border-4 border-white">
                            <FaCheck size={36} />
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                <h1 className="text-[36px] md:text-[50px] font-black text-gray-900 mb-6 uppercase tracking-tighter leading-none">
                    Order Received!
                </h1>
                <p className="text-sm md:text-base text-gray-400 mb-14 max-w-xl mx-auto font-bold uppercase tracking-widest leading-relaxed">
                    Thank you for your purchase. We've received your order and our team is
                    already preparing it for delivery.
                </p>

                {/* Order Details Card */}
                <div className="bg-white border border-gray-100 p-10 md:p-14 mb-16 shadow-2xl shadow-gray-200/50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 text-left">
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">
                                Order number:
                            </div>
                            <div className="text-gray-900 font-bold text-sm tracking-tighter">
                                #{order.id.split('-')[0].toUpperCase()}
                            </div>
                        </div>

                        <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">
                                Order Date:
                            </div>
                            <div className="text-gray-900 font-bold text-sm tracking-tighter">
                                {new Date(order.createdAt).toLocaleDateString("en-US", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </div>
                        </div>

                        <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">
                                Total Price:
                            </div>
                            <div className="text-blue-600 font-bold text-sm tracking-tighter">
                                ${order.totalAmount.toFixed(2)}
                            </div>
                        </div>

                        <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">
                                Status:
                            </div>
                            <div className="text-gray-900 font-bold text-sm uppercase tracking-tighter">
                                {order.status === 'pending' ? 'Processing' : order.status}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-5 justify-center mt-10">
                    <Link
                        to="/shop"
                        className="bg-[#ff6b20] text-white px-12 py-5 hover:bg-orange-400 transition-all duration-500 font-bold uppercase text-[11px] tracking-[0.3em] shadow-xl shadow-orange-500/20 flex items-center justify-center gap-3"
                    >
                        <FaShoppingBag size={12} />
                        Back to Shop
                    </Link>
                    <button className="bg-blue-500 border-2  text-white px-12 py-5 hover:bg-blue-400 transition-all duration-500 font-bold uppercase text-[11px] tracking-[0.3em] flex items-center justify-center gap-3">
                        <FaPrint size={12} />
                        Download Receipt
                    </button>
                </div>

                <p className="mt-16 text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] opacity-80">
                    Check your email for full order details and tracking status.
                </p>
            </div>
        </div>
    );
};

export default OrderComplete;
