import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const CartSidebar = () => {
    const {
        cartItems,
        cartOpen,
        setCartOpen,
        removeFromCart,
        subtotal,
        updateQuantity,
    } = useCart();

    const freeShippingThreshold = 151.0;
    const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);

    return (
        <>
            {/* BACKDROP */}
            {cartOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity"
                    onClick={() => setCartOpen(false)}
                />
            )}

            {/* SIDEBAR */}
            <div
                className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${cartOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* HEADER */}
                <div className="bg-blue-600 text-white flex justify-between items-center p-4">
                    <button onClick={() => setCartOpen(false)}>
                        <i className="fa-solid fa-angle-left mr-2"></i>
                    </button>
                    <h2 className="text-sm font-bold tracking-widest uppercase">My Cart</h2>
                    <div className="w-5"></div> {/* Spacer for centering */}
                </div>

                {/* CART ITEMS LIST */}
                <div className="flex-1 overflow-y-auto p-4 h-[calc(100vh-280px)]">
                    {cartItems.length === 0 ? (
                        <div className="text-center text-gray-500 mt-10">
                            Your cart is empty.
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex gap-4 relative group">
                                    {/* Remove Button (Top Right) */}
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="absolute top-0 right-0 text-gray-400 hover:text-red-500 transition"
                                    >
                                        <i className="fa-regular fa-trash-can"></i>
                                    </button>

                                    {/* Image */}
                                    <div className="w-20 h-20 flex-shrink-0 border rounded-sm overflow-hidden">
                                        <img
                                            src={item.image || (item.images && item.images[0]) || "/images/placeholder.png"}
                                            alt={item.name || item.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 pr-6">
                                        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-tight mb-1">
                                            {item.name || item.title}
                                        </h3>

                                        {/* Size/Color if applicable (mocked for now or from item) */}
                                        {(item.colors || item.sizes) && (
                                            <p className="text-xs text-gray-500 mb-2">
                                                {/* Just showing mocked variant info as per design if needed, or rely on item props */}
                                            </p>
                                        )}

                                        {/* Quantity & Price */}
                                        <div className="flex items-center gap-3 mt-2">
                                            <div className="flex items-center border border-gray-300 rounded-sm">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="px-2 py-0.5 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    -
                                                </button>
                                                <span className="px-2 py-0.5 text-sm font-medium border-l border-r border-gray-300 min-w-[30px] text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="px-2 py-0.5 text-gray-600 hover:bg-gray-100"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <span className="text-sm text-gray-500">x</span>
                                            <span className="text-sm font-semibold">${item.price.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* FOOTER SECTION */}
                <div className="absolute bottom-0 left-0 w-full bg-white border-t p-4 pb-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-gray-600 uppercase">Subtotal:</span>
                        <span className="text-lg font-bold text-gray-900">${subtotal.toFixed(2)}</span>
                    </div>

                    {/* Free Shipping Progress */}
                    <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-blue-600 font-semibold">{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                        {subtotal < freeShippingThreshold ? (
                            <p className="text-xs text-gray-500">
                                Spend <span className="font-bold text-gray-800">${(freeShippingThreshold - subtotal).toFixed(2)}</span> to get free shipping
                            </p>
                        ) : (
                            <p className="text-xs text-green-600 font-bold">You've got free shipping!</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Link
                            to="/cart"
                            onClick={() => setCartOpen(false)}
                            className="block w-full text-center bg-blue-600 text-white font-bold py-3 uppercase text-sm hover:bg-blue-700 transition rounded-sm"
                        >
                            View Cart
                        </Link>
                        <Link
                            to="/checkout"
                            onClick={() => setCartOpen(false)}
                            className="block w-full text-center bg-orange-500 text-white font-bold py-3 uppercase text-sm hover:bg-orange-600 transition rounded-sm"
                        >
                            Checkout
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CartSidebar;
