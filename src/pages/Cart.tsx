import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import CheckoutSteps from "../components/checkout/CheckoutSteps";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, subtotal } = useCart();
  const navigate = useNavigate();
  const shippingCost = 5.0;
  const total = subtotal + shippingCost;
  const freeShippingThreshold = 120;
  const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  if (cartItems.length === 0) {
    return (
      <div className="bg-white">
        <CheckoutSteps currentStep={1} />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="bg-gray-50 inline-block p-10 rounded-full mb-8">
            <img
              src="https://cdn-icons-png.flaticon.com/512/11329/11329065.png"
              alt="Empty Cart"
              className="w-24 opacity-20"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-tighter">
            Your cart is currently empty.
          </h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto font-medium">
            Before proceed to checkout you must add some products to your
            shopping cart. You will find a lot of interesting products on our
            "Shop" page.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-orange-500 hover:bg-black text-white font-bold py-4 px-12 rounded-xl transition-all duration-300 uppercase tracking-widest text-xs"
          >
            Return To Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white pb-20">
      <CheckoutSteps currentStep={1} />

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Cart Table */}
          <div className="lg:col-span-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-sm font-bold text-gray-800 uppercase">
                    <th className="pb-4 pt-4 w-10"></th>
                    <th className="pb-4 pt-4">PRODUCT</th>
                    <th className="pb-4 pt-4">PRICE</th>
                    <th className="pb-4 pt-4 text-center">QUANTITY</th>
                    <th className="pb-4 pt-4 text-right">SUBTOTAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <tr key={item.id} className="group">
                      <td className="py-8">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <FaTrash size={14} />
                        </button>
                      </td>
                      <td className="py-8">
                        <div className="flex items-center gap-6">
                          <img
                            src={
                              item.image ||
                              (item.images && item.images[0]) ||
                              "/images/placeholder.png"
                            }
                            alt={item.name || item.title}
                            className="w-20 h-24 object-cover"
                          />
                          <Link
                            to={`/shop/${item.productId || item.id}`}
                            className="font-medium text-gray-700 hover:text-blue-600 transition-colors text-sm"
                          >
                            {item.name || item.title}
                          </Link>
                        </div>
                      </td>
                      <td className="py-8 text-blue-600 font-bold text-sm">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="py-8">
                        <div className="flex justify-center">
                          <div className="inline-flex items-center border border-gray-200 bg-white">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-gray-50 border-r border-gray-200"
                              disabled={item.quantity <= 1}
                            >
                              <FaMinus size={8} />
                            </button>
                            <span className="w-10 text-center text-sm font-bold px-2">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-gray-50 border-l border-gray-200"
                            >
                              <FaPlus size={8} />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="py-8 font-bold text-blue-600 text-sm text-right">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Coupon Section */}
            <div className="mt-8 flex flex-col sm:flex-row gap-0 border border-gray-100 p-8">
              <input
                type="text"
                placeholder="Coupon code"
                className="border border-gray-200 border-r-0 px-6 py-3 outline-none text-sm w-full sm:w-64"
              />
              <button className="bg-blue-600 text-white text-[10px] font-bold uppercase py-3 px-8 hover:bg-blue-700 transition-all duration-300">
                APPLY COUPON
              </button>
            </div>
          </div>

          {/* Cart Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="border border-gray-100 p-8 shadow-sm bg-white">
              <h2 className="text-xl font-bold text-gray-800 mb-8 border-b border-gray-100 pb-4">
                CART TOTALS
              </h2>

              <div className="space-y-0 pb-4 mb-8">
                <div className="flex justify-between py-4 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600 uppercase">
                    Subtotal
                  </span>
                  <span className="text-blue-600 font-bold text-sm">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-4 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600 uppercase">
                    Shipping
                  </span>
                  <div className="text-right">
                    <p className="text-sm text-gray-800">
                      Flat rate:{" "}
                      <span className="text-blue-600 font-bold">
                        ${shippingCost.toFixed(2)}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Shipping to KGL.
                    </p>
                    <button className="text-xs text-gray-500 hover:text-blue-600 underline mt-4">
                      Change address
                    </button>
                  </div>
                </div>
                <div className="flex justify-between py-6">
                  <span className="text-sm font-medium text-gray-600 uppercase">
                    Total
                  </span>
                  <span className="text-lg font-bold text-blue-600">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Progress Bar in Sidebar */}
              <div className="mb-8 p-1">
                <div className="w-full bg-gray-100 h-5 rounded-sm relative overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-1000 flex items-center justify-center"
                    style={{ width: `${progress}%` }}
                  >
                    <span className="text-[10px] text-white font-bold">
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-4 text-center">
                  {progress >= 100
                    ? "Congratulation! You have got free shipping"
                    : `Add $${(freeShippingThreshold - subtotal).toFixed(2)} more for free shipping`}
                </p>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-[#ff6b20] text-white font-bold py-4 hover:bg-orange-400 transition-all duration-500 uppercase text-xs tracking-[0.2em]"
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
