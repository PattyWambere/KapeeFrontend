import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FaInfoCircle, FaMinus, FaPlus } from "react-icons/fa";
import CheckoutSteps from "../components/checkout/CheckoutSteps";
import orderService from "../api/order.service";

const Checkout = () => {
    const { cartItems, subtotal, clearCart, updateQuantity } = useCart();
    const navigate = useNavigate();
    const shippingCost = 0.0; // Screenshot shows "Free shipping"
    const total = subtotal + shippingCost;

    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "NIYIGENA",
        lastName: "Patrick",
        companyName: "NPpresents",
        country: "Rwanda",
        streetAddress: "nyamasheke",
        apartment: "",
        city: "Kigali",
        state: "",
        zipCode: "43546",
        phone: "+250786352984",
        email: "pniyigena1@gmail.com",
        orderNotes: "",
    });

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        try {
            // Create the order via API
            const order = await orderService.createOrder();

            // Clear cart locally
            await clearCart();

            // Navigate to order complete with real data
            navigate("/order-complete", { state: { order } });
        } catch (error: any) {
            console.error("Order failed:", error);
            const message = error.response?.data?.message || "Failed to place order. Please try again.";
            alert(message);
        } finally {
            setIsProcessing(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="bg-white min-h-screen">
                <CheckoutSteps currentStep={2} />
                <div className="text-center py-20 px-4">
                    <h2 className="text-2xl font-black mb-4 uppercase tracking-tighter">
                        Your cart is empty.
                    </h2>
                    <p className="text-gray-500 mb-8 font-medium">
                        You need to add items to your cart before you can checkout.
                    </p>
                    <Link
                        to="/shop"
                        className="bg-orange-500 text-white px-12 py-4 rounded-xl font-black hover:bg-black transition-all duration-300 shadow-xl shadow-orange-500/20 uppercase tracking-widest text-xs"
                    >
                        Return To Shop
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pb-20 font-sans">
            <CheckoutSteps currentStep={2} />

            <div className="max-w-7xl mx-auto px-4">
                {/* Banner Section */}
                {/* <div className="space-y-4 mb-10">
                    <div className="bg-[#f7f7f7] border-t-[3px] border-blue-600 p-4 flex items-center gap-3 text-sm text-gray-700">
                        <FaInfoCircle className="text-blue-600" />
                        <span>
                            Returning customer? <button className="text-blue-600 hover:text-black">Click here to login</button>
                        </span>
                    </div>
                    <div className="p-4 border border-gray-100 flex items-center gap-3 text-sm text-gray-700">
                        <FaInfoCircle className="text-blue-600" />
                        <span>
                            Have a coupon? <button className="text-blue-600 hover:text-black">Click here to enter your code</button>
                        </span>
                    </div>
                </div> */}

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-12"
                >
                    {/* Billing Details - Left Side */}
                    <div className="lg:col-span-7">
                        <h2 className="text-[26px] font-bold mb-8 text-gray-800">
                            Billing details
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    First name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    required
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-200 px-4 py-2.5 outline-none text-sm text-gray-600 focus:border-blue-600 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Last name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    required
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-200 px-4 py-2.5 outline-none text-sm text-gray-600 focus:border-blue-600 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Company name (optional)
                            </label>
                            <input
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleInputChange}
                                className="w-full border border-gray-200 px-4 py-2.5 outline-none text-sm text-gray-600 focus:border-blue-600 transition-colors"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Country / Region <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                className="w-full border border-gray-200 px-4 py-2.5 outline-none text-sm text-gray-600 focus:border-blue-600 transition-colors"
                            >
                                <option value="Rwanda">Rwanda</option>
                                <option value="United States (US)">United States (US)</option>
                                <option value="United Kingdom (UK)">United Kingdom (UK)</option>
                            </select>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Street address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="streetAddress"
                                required
                                placeholder="House number and street name"
                                value={formData.streetAddress}
                                onChange={handleInputChange}
                                className="w-full border border-gray-200 px-4 py-2.5 outline-none text-sm text-gray-600 focus:border-blue-600 transition-colors mb-4"
                            />
                            <input
                                type="text"
                                name="apartment"
                                placeholder="Apartment, suite, unit, etc. (optional)"
                                value={formData.apartment}
                                onChange={handleInputChange}
                                className="w-full border border-gray-200 px-4 py-2.5 outline-none text-sm text-gray-600 focus:border-blue-600 transition-colors"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Town / City <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="city"
                                required
                                value={formData.city}
                                onChange={handleInputChange}
                                className="w-full border border-gray-200 px-4 py-2.5 outline-none text-sm text-gray-600 focus:border-blue-600 transition-colors"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Postcode / ZIP <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="zipCode"
                                required
                                value={formData.zipCode}
                                onChange={handleInputChange}
                                className="w-full border border-gray-200 px-4 py-2.5 outline-none text-sm text-gray-600 focus:border-blue-600 transition-colors"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Phone <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full border border-gray-200 px-4 py-2.5 outline-none text-sm text-gray-600 focus:border-blue-600 transition-colors"
                            />
                        </div>

                        <div className="mb-10">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Email address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full border border-gray-200 px-4 py-2.5 outline-none text-sm text-gray-600 focus:border-blue-600 transition-colors"
                            />
                        </div>

                        <div className="mb-8 flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="shipDifferent"
                                className="w-4 h-4 accent-blue-600"
                            />
                            <label
                                htmlFor="shipDifferent"
                                className="text-sm font-bold text-gray-700"
                            >
                                Ship to a different address?
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Order notes (optional)
                            </label>
                            <textarea
                                name="orderNotes"
                                rows={5}
                                placeholder="Notes about your order, e.g. special notes for delivery."
                                value={formData.orderNotes}
                                onChange={handleInputChange}
                                className="w-full border border-gray-200 px-4 py-4 outline-none text-sm text-gray-600 focus:border-blue-600 transition-colors resize-none"
                            ></textarea>
                        </div>
                    </div>

                    {/* Order Summary - Right Side */}
                    <div className="lg:col-span-5">
                        <div className="bg-white p-8 border-[2px] border-gray-100 flex flex-col h-fit sticky top-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-8">
                                Your order
                            </h2>

                            <div className="flex justify-between border-b-2 border-gray-100 pb-3 mb-6">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    PRODUCT
                                </span>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    SUBTOTAL
                                </span>
                            </div>

                            <div className="space-y-6 mb-8">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between items-start border-b border-gray-100 pb-6 last:border-0 last:pb-0"
                                    >
                                        <div className="flex gap-4">
                                            <img
                                                src={
                                                    item.image ||
                                                    (item.images && item.images[0]) ||
                                                    "/images/placeholder.png"
                                                }
                                                alt={item.name || item.title}
                                                className="w-14 h-16 object-cover"
                                            />
                                            <div className="space-y-2">
                                                <span className="text-xs font-medium text-gray-600 leading-tight block max-w-[200px]">
                                                    {item.name || item.title}{" "}
                                                    <span className="text-gray-400">
                                                        × {item.quantity}
                                                    </span>
                                                </span>
                                                {/* Quantity controls as seen in screenshot */}
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            updateQuantity(item.id, item.quantity - 1)
                                                        }
                                                        className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <FaMinus size={8} />
                                                    </button>
                                                    <span className="w-8 text-center text-xs font-medium bg-gray-50 py-1">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            updateQuantity(item.id, item.quantity + 1)
                                                        }
                                                        className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors"
                                                    >
                                                        <FaPlus size={8} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="font-bold text-blue-600 text-sm whitespace-nowrap">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 py-4 border-t border-gray-100">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium text-gray-700">Subtotal</span>
                                    <span className="text-blue-600 font-bold">
                                        ${subtotal.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium text-gray-700">Shipping</span>
                                    <span className="text-gray-800">Free shipping</span>
                                </div>
                                <div className="pt-4 flex justify-between items-center border-t border-gray-100">
                                    <span className="text-sm font-bold text-gray-700">Total</span>
                                    <span className="text-blue-600 font-bold text-lg">
                                        ${total.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Notice box */}
                            <div className="mt-8 mb-8 bg-[#f7f7f7] border-t-[3px] border-blue-600 p-6 relative">
                                <div className="flex gap-3 text-xs text-gray-600 leading-relaxed">
                                    <FaInfoCircle className="text-blue-600 flex-shrink-0 mt-0.5" />
                                    <p>
                                        Sorry, it seems that there are no available payment methods.
                                        Please contact us if you require assistance or wish to make
                                        alternate arrangements.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6 pt-6 border-t border-gray-100">
                                <p className="text-[12px] text-gray-500 leading-snug">
                                    Your personal data will be used to process your order, support
                                    your experience throughout this website, and for other
                                    purposes described in our{" "}
                                    <button
                                        type="button"
                                        className="text-blue-600 hover:underline"
                                    >
                                        privacy policy
                                    </button>
                                    .
                                </p>

                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className={`w-full bg-[#ff6b20] text-white font-bold py-4 hover:bg-orange-400 transition-all duration-300 uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2 ${isProcessing ? "opacity-70 cursor-not-allowed" : ""
                                        }`}
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            PROCESSING...
                                        </>
                                    ) : (
                                        "PLACE ORDER"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
