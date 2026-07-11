import { Link, useLocation } from "react-router-dom";
import { FaCheck, FaPrint, FaShoppingBag, FaCreditCard, FaMoneyBill } from "react-icons/fa";
import CheckoutSteps from "../components/checkout/CheckoutSteps";
import type { Order } from "../api/order.service";
import { useAuth } from "../context/AuthContext";
import { useCurrency } from "../context/CurrencyContext";
import { QRCodeCanvas } from "qrcode.react";

const OrderComplete = () => {
    const location = useLocation();
    const order = location.state?.order as Order | undefined;
    const { user } = useAuth();
    const { convertPrice } = useCurrency();

    // Fallback for direct access without order data
    if (!order) {
        return (
            <div className="bg-white min-h-screen pb-20">
                <CheckoutSteps currentStep={3} />
                <div className="max-w-3xl mx-auto px-4 py-20 text-center">
                    <h2 className="text-2xl font-black mb-4 uppercase tracking-tighter text-gray-900">No Order Found</h2>
                    <p className="text-gray-500 mb-8 font-medium">
                        It looks like you haven't placed an order recently, or the page was refreshed.
                    </p>
                    <Link to="/shop" className="bg-[#ff6b20] text-white px-12 py-4 rounded-xl font-black hover:bg-black transition-all duration-300 shadow-xl shadow-orange-500/20 uppercase tracking-widest text-xs">
                        Return To Shop
                    </Link>
                </div>
            </div>
        );
    }

    const isCardPayment = order.paymentMethod === "card";
    const isPaid = order.paymentStatus === "paid";

    return (
        <div className="bg-white min-h-screen">
            {/* Screen UI - Hidden on Print */}
            <div className="pb-20 print:hidden">
                <CheckoutSteps currentStep={3} />

            <div className="max-w-3xl mx-auto px-4 py-12 md:py-20 text-center">
                {/* Success Icon */}
                <div className="flex justify-center mb-12">
                    <div className="relative">
                        <div className="absolute inset-0 bg-green-500 rounded-full blur-3xl opacity-20 animate-pulse" />
                        <div className="relative w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-green-500/40 border-4 border-white">
                            <FaCheck size={36} />
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                <h1 className="text-[36px] md:text-[50px] font-black text-gray-900 mb-6 uppercase tracking-tighter leading-none">
                    {order.status === 'pending' ? 'Order Received!' : 'Order Information'}
                </h1>
                <p className="text-sm md:text-base text-gray-400 mb-14 max-w-xl mx-auto font-bold uppercase tracking-widest leading-relaxed">
                    {order.status === 'pending' 
                        ? "Thank you for your purchase. We've received your order and our team is already preparing it for delivery."
                        : `Here are the details for your past order.`}
                </p>

                {/* Order Details Card */}
                <div className="bg-white border border-gray-100 p-10 md:p-14 mb-8 shadow-2xl shadow-gray-200/50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-600" />

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 text-left">
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Order number:</div>
                            <div className="text-gray-900 font-bold text-sm tracking-tighter">
                                #{order.id.split('-')[0].toUpperCase()}
                            </div>
                        </div>

                        <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Order Date:</div>
                            <div className="text-gray-900 font-bold text-sm tracking-tighter">
                                {new Date(order.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                            </div>
                        </div>

                        <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Total Price:</div>
                            <div className="text-blue-600 font-bold text-sm tracking-tighter">{convertPrice(order.totalAmount)}</div>
                        </div>

                        <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Status:</div>
                            <div className="text-gray-900 font-bold text-sm uppercase tracking-tighter">
                                {order.status === 'pending' ? 'Processing' : order.status}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Info Card */}
                <div className={`border rounded-2xl p-6 mb-8 text-left ${isCardPayment ? "bg-blue-50 border-blue-100" : "bg-amber-50 border-amber-100"}`}>
                    <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isCardPayment ? "bg-blue-600 text-white" : "bg-amber-500 text-white"}`}>
                            {isCardPayment ? <FaCreditCard size={16} /> : <FaMoneyBill size={16} />}
                        </div>
                        <div className="flex-1">
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Payment Method</div>
                            {isCardPayment ? (
                                <div>
                                    <div className="text-gray-900 font-bold text-sm capitalize">
                                        {order.paymentDetails?.cardType || "Card"} {order.paymentDetails?.last4 ? `ending in ${order.paymentDetails.last4}` : ""}
                                    </div>
                                    <div className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${isPaid ? "bg-green-100 text-green-700 border border-green-200" : "bg-gray-100 text-gray-500 border border-gray-200"}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${isPaid ? "bg-green-500" : "bg-gray-400"}`} />
                                        {isPaid ? "Payment Confirmed" : "Payment Pending"}
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="text-gray-900 font-bold text-sm">Cash on Delivery</div>
                                    <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-amber-100 text-amber-700 border border-amber-200">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                        Pay on Delivery
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-5 justify-center mt-6">
                    <Link to="/shop" className="bg-[#ff6b20] text-white px-12 py-5 hover:bg-orange-400 transition-all duration-500 font-bold uppercase text-[11px] tracking-[0.3em] shadow-xl shadow-orange-500/20 flex items-center justify-center gap-3">
                        <FaShoppingBag size={12} />
                        Back to Shop
                    </Link>
                    <button 
                        onClick={() => window.print()} 
                        className="bg-blue-500 border-2 text-white px-12 py-5 hover:bg-blue-400 transition-all duration-500 font-bold uppercase text-[11px] tracking-[0.3em] flex items-center justify-center gap-3"
                    >
                        <FaPrint size={12} />
                        Download Receipt
                    </button>
                </div>

                <p className="mt-16 text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] opacity-80">
                    Check your email for full order details and tracking status.
                </p>
            </div>
        </div>

            {/* Print UI - Minimalist POS-style receipt */}
            <div className="hidden print:block p-8 max-w-2xl mx-auto text-black font-sans">
                <div className="text-center mb-8 border-b border-gray-200 pb-4">
                    <h1 className="text-3xl font-black uppercase tracking-tighter">GuraFaster</h1>
                    <p className="text-sm text-gray-500 uppercase tracking-widest mt-1">Official Receipt</p>
                </div>

                {user && (
                    <div className="flex justify-between items-start mb-8 border-b border-gray-200 pb-8">
                        <div>
                            <p className="font-bold text-gray-400 text-[10px] uppercase tracking-widest mb-1">Customer</p>
                            <p className="font-bold text-sm uppercase tracking-tighter">{user.firstName} {user.lastName}</p>
                            <p className="text-xs text-gray-500 font-medium">{user.email}</p>
                        </div>
                        <div className="bg-white p-2 border border-gray-200 rounded-xl shadow-sm">
                            <QRCodeCanvas value={`${window.location.origin}/orders/${order.id}`} size={64} level="M" />
                        </div>
                    </div>
                )}

                <div className="flex justify-between text-sm mb-8">
                    <div>
                        <p className="font-bold text-gray-400 text-[10px] uppercase tracking-widest">Order Number</p>
                        <p className="font-bold">#{order.id.split('-')[0].toUpperCase()}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-gray-400 text-[10px] uppercase tracking-widest">Date</p>
                        <p className="font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                {order.items && order.items.length > 0 && (
                    <div className="mb-8 border-t border-b border-gray-200 py-4">
                        <div className="grid grid-cols-4 gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                            <div className="col-span-2">Item</div>
                            <div className="text-center">Qty</div>
                            <div className="text-right">Price</div>
                        </div>
                        {order.items.map((item: any, idx: number) => {
                            const name = typeof item.productId === 'object' ? item.productId.name : 'Product';
                            return (
                                <div key={idx} className="grid grid-cols-4 gap-4 text-sm mb-2">
                                    <div className="col-span-2 truncate">{name}</div>
                                    <div className="text-center">{item.quantity}</div>
                                    <div className="text-right">{convertPrice(item.price * item.quantity)}</div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="flex justify-between items-end">
                    <div>
                        <p className="font-bold text-gray-400 text-[10px] uppercase tracking-widest">Payment Method</p>
                        <p className="font-bold capitalize">{order.paymentMethod === 'card' ? `Card ${order.paymentDetails?.last4 ? `(*${order.paymentDetails.last4})` : ''}` : 'Cash on Delivery'}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-gray-400 text-[10px] uppercase tracking-widest">Total Amount</p>
                        <p className="text-2xl font-black">{convertPrice(order.totalAmount)}</p>
                    </div>
                </div>

                <div className="text-center mt-12 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    Thank you for shopping with GuraFaster!
                </div>
            </div>
        </div>
    );
};

export default OrderComplete;

