import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaShoppingBag } from "react-icons/fa";
import orderService from "../api/order.service";
import type { Order } from "../api/order.service";
import { useAuth } from "../context/AuthContext";
import OrderDetailsModal from "../components/modals/OrderDetailsModal";

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const fetchOrders = useCallback(async () => {
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    } else if (!authLoading) {
      setIsLoading(false);
    }
  }, [isAuthenticated, authLoading, fetchOrders]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="bg-white min-h-screen pb-20">
        <div className="max-w-7xl mx-auto px-4 pt-12 text-center py-20">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-white min-h-screen pb-20">
        <div className="max-w-7xl mx-auto px-4 pt-12 text-center py-20">
          <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter">
            Login Required
          </h2>
          <p className="text-gray-500 mb-8 font-medium">
            Please login to access your order history and manage your purchases.
          </p>
          <Link
            to="/account"
            className="inline-block bg-[#ff6b20] text-white px-12 py-4 font-black uppercase text-xs tracking-[0.2em] hover:bg-black transition-all duration-500 shadow-xl shadow-orange-500/20"
          >
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 pt-12">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
          <Link to="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <span className="text-gray-300">/</span>
          <Link to="/account" className="hover:text-black transition-colors">
            Account
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-black">My Orders</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-[42px] md:text-[56px] font-black text-gray-900 uppercase tracking-tighter leading-none mb-4">
              My Orders
            </h1>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
              Manage your recent purchases and track shipping status.
            </p>
          </div>
          {orders.length > 0 && (
            <div className="bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100 flex items-center gap-4">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Total Orders
              </span>
              <span className="text-xl font-black text-blue-600 leading-none">
                {orders.length}
              </span>
            </div>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-32 bg-gray-50/50 rounded-[40px] border-2 border-dashed border-gray-200">
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl shadow-gray-200">
                <FaShoppingBag size={32} className="text-gray-200" />
              </div>
            </div>
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-2">
              No orders found
            </h3>
            <p className="text-gray-400 mb-10 font-bold uppercase text-[10px] tracking-widest">
              You haven't placed any orders yet.
            </p>
            <Link
              to="/shop"
              className="inline-block bg-[#ff6b20] text-white px-12 py-5 font-black uppercase text-xs tracking-[0.2em] hover:bg-black transition-all duration-500 shadow-2xl shadow-orange-500/30"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop view */}
            <div className="hidden lg:block">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-[3px] border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                    <th className="pb-8 pl-4">Order ID</th>
                    <th className="pb-8">Order Date</th>
                    <th className="pb-8">Status</th>
                    <th className="pb-8">Summary</th>
                    <th className="pb-8 text-right">Total Price</th>
                    <th className="pb-8 pr-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="group hover:bg-gray-50/80 transition-all duration-500"
                    >
                      <td className="py-10 pl-4">
                        <span className="font-black text-blue-600 text-sm tracking-tighter block mb-1">
                          #{order.id.split("-")[0].toUpperCase()}
                        </span>
                        <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">
                          UUID: {order.id.substring(0, 8)}...
                        </span>
                      </td>
                      <td className="py-10">
                        <div className="text-gray-900 font-bold text-sm tracking-tight mb-1">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </div>
                        <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                          {new Date(order.createdAt).toLocaleTimeString(
                            "en-US",
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </div>
                      </td>
                      <td className="py-10">
                        <span
                          className={`inline-flex px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border-2 ${getStatusColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-10">
                        <div className="text-gray-600 font-bold text-sm tracking-tight">
                          {order.items.length}{" "}
                          {order.items.length === 1 ? "Product" : "Products"}
                        </div>
                      </td>
                      <td className="py-10 text-right">
                        <div className="font-black text-blue-600 text-lg tracking-tighter">
                          ${order.totalAmount.toFixed(2)}
                        </div>
                      </td>
                      <td className="py-10 pr-4 text-right">
                        <button
                          onClick={() => setSelectedOrderId(order.id)}
                          className="inline-flex items-center gap-3 bg-orange-600 text-white px-8 py-4 hover:bg-orange-400 transition-all duration-500 font-black uppercase text-[10px] tracking-[0.2em] group relative overflow-hidden"
                        >
                          {/* <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div> */}
                          <FaEye className="text-xs group-hover:scale-125 transition-transform" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile view */}
            <div className="lg:hidden space-y-8">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border-[3px] border-gray-100 p-8 rounded-[32px] shadow-2xl shadow-gray-200/50 relative overflow-hidden group"
                >
                  <div
                    className={`absolute top-0 left-0 w-2 h-full ${order.status === "cancelled" ? "bg-red-500" : "bg-blue-600"}`}
                  ></div>
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-2">
                        Order Tracking ID
                      </div>
                      <div className="font-black text-blue-600 text-2xl tracking-tighter leading-none">
                        #{order.id.split("-")[0].toUpperCase()}
                      </div>
                    </div>
                    <span
                      className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border-2 ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-8 mb-10">
                    <div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                        Order Date
                      </div>
                      <div className="text-sm font-black text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                        Total Paid
                      </div>
                      <div className="text-xl font-black text-blue-600 tracking-tighter">
                        ${order.totalAmount.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedOrderId(order.id)}
                    className="w-full bg-black text-white py-5 flex items-center justify-center gap-4 font-black uppercase text-[11px] tracking-[0.3em] rounded-2xl group-hover:bg-blue-600 transition-all duration-500 shadow-xl shadow-black/10"
                  >
                    <FaEye size={14} />
                    View Full Details
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {selectedOrderId && (
        <OrderDetailsModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
          onStatusUpdate={fetchOrders}
        />
      )}
    </div>
  );
};

export default MyOrders;
