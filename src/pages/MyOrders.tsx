import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaShoppingBag, FaPrint } from "react-icons/fa";
import orderService from "../api/order.service";
import type { Order } from "../api/order.service";
import { useAuth } from "../context/AuthContext";
import { useCurrency } from "../context/CurrencyContext";
import { QRCodeCanvas } from "qrcode.react";
import OrderDetailsModal from "../components/modals/OrderDetailsModal";

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [lastSeenStatuses, setLastSeenStatuses] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const { convertPrice } = useCurrency();

  // Load last seen statuses from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("gurafaster_order_statuses");
    if (saved) {
      try {
        setLastSeenStatuses(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse order statuses", e);
      }
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const data = await orderService.getOrders();
      setOrders(data);

      // Silently register new orders in localStorage if they don't exist
      // This ensures that NEXT time they change, we catch the update
      const saved = localStorage.getItem("gurafaster_order_statuses");
      let currentRecords: Record<string, string> = {};
      if (saved) currentRecords = JSON.parse(saved);

      let updated = false;
      data.forEach(order => {
        if (!currentRecords[order.id]) {
          currentRecords[order.id] = order.status;
          updated = true;
        }
      });

      if (updated) {
        localStorage.setItem("gurafaster_order_statuses", JSON.stringify(currentRecords));
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleViewDetails = (id: string, currentStatus: string) => {
    setSelectedOrderId(id);

    // Mark as seen
    const newStatuses = { ...lastSeenStatuses, [id]: currentStatus };
    setLastSeenStatuses(newStatuses);
    localStorage.setItem("gurafaster_order_statuses", JSON.stringify(newStatuses));
  };

  const handleDownloadReceipt = (order: Order) => {
    setSelectedReceiptOrder(order);
    setTimeout(() => {
      window.print();
    }, 100);
  };

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
    <div className="bg-white min-h-screen font-sans">
      <div className="pb-20 print:hidden max-w-7xl mx-auto px-4 pt-12">
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
                        {lastSeenStatuses[order.id] && lastSeenStatuses[order.id] !== order.status && (
                          <span className="ml-3 px-3 py-1 bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest rounded-lg animate-pulse">
                            Status Updated
                          </span>
                        )}
                      </td>
                      <td className="py-10">
                        <div className="text-gray-600 font-bold text-sm tracking-tight">
                          {order.items.length}{" "}
                          {order.items.length === 1 ? "Product" : "Products"}
                        </div>
                      </td>
                      <td className="py-10 text-right">
                        <div className="font-black text-blue-600 text-lg tracking-tighter">
                          {convertPrice(order.totalAmount)}
                        </div>
                      </td>
                      <td className="py-10 pr-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDownloadReceipt(order)}
                            className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 hover:bg-blue-400 transition-all duration-500 font-black uppercase text-[10px] tracking-[0.2em] group relative overflow-hidden"
                          >
                            <FaPrint className="text-xs group-hover:scale-125 transition-transform" />
                            Receipt
                          </button>
                          <button
                            onClick={() => handleViewDetails(order.id, order.status)}
                            className="inline-flex items-center gap-3 bg-orange-600 text-white px-8 py-4 hover:bg-orange-400 transition-all duration-500 font-black uppercase text-[10px] tracking-[0.2em] group relative overflow-hidden"
                          >
                            <FaEye className="text-xs group-hover:scale-125 transition-transform" />
                            Details
                          </button>
                        </div>
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
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border-2 ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                      {lastSeenStatuses[order.id] && lastSeenStatuses[order.id] !== order.status && (
                        <span className="px-3 py-1 bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest rounded-lg animate-pulse">
                          Status Updated
                        </span>
                      )}
                    </div>
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
                        {convertPrice(order.totalAmount)}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mt-6">
                    <button
                      onClick={() => handleDownloadReceipt(order)}
                      className="flex-1 bg-blue-600 text-white py-5 flex items-center justify-center gap-4 font-black uppercase text-[11px] tracking-[0.3em] rounded-2xl group-hover:bg-blue-500 transition-all duration-500 shadow-xl shadow-blue-600/10"
                    >
                      <FaPrint size={14} />
                      Receipt
                    </button>
                    <button
                      onClick={() => handleViewDetails(order.id, order.status)}
                      className="flex-1 bg-black text-white py-5 flex items-center justify-center gap-4 font-black uppercase text-[11px] tracking-[0.3em] rounded-2xl group-hover:bg-orange-600 transition-all duration-500 shadow-xl shadow-black/10"
                    >
                      <FaEye size={14} />
                      Details
                    </button>
                  </div>
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

      {/* Print UI - Minimalist POS-style receipt */}
      {selectedReceiptOrder && (
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
                          <QRCodeCanvas value={`${window.location.origin}/orders/${selectedReceiptOrder.id}`} size={64} level="M" />
                      </div>
                  </div>
              )}

              <div className="flex justify-between text-sm mb-8">
                  <div>
                      <p className="font-bold text-gray-400 text-[10px] uppercase tracking-widest">Order Number</p>
                      <p className="font-bold">#{selectedReceiptOrder.id.split('-')[0].toUpperCase()}</p>
                  </div>
                  <div className="text-right">
                      <p className="font-bold text-gray-400 text-[10px] uppercase tracking-widest">Date</p>
                      <p className="font-bold">{new Date(selectedReceiptOrder.createdAt).toLocaleDateString()}</p>
                  </div>
              </div>

              {selectedReceiptOrder.items && selectedReceiptOrder.items.length > 0 && (
                  <div className="mb-8 border-t border-b border-gray-200 py-4">
                      <div className="grid grid-cols-4 gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                          <div className="col-span-2">Item</div>
                          <div className="text-center">Qty</div>
                          <div className="text-right">Price</div>
                      </div>
                      {selectedReceiptOrder.items.map((item: any, idx: number) => {
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
                      <p className="font-bold capitalize">{selectedReceiptOrder.paymentMethod === 'card' ? `Card ${selectedReceiptOrder.paymentDetails?.last4 ? `(*${selectedReceiptOrder.paymentDetails.last4})` : ''}` : 'Cash on Delivery'}</p>
                  </div>
                  <div className="text-right">
                      <p className="font-bold text-gray-400 text-[10px] uppercase tracking-widest">Total Amount</p>
                      <p className="text-2xl font-black">{convertPrice(selectedReceiptOrder.totalAmount)}</p>
                  </div>
              </div>

              <div className="text-center mt-12 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  Thank you for shopping with GuraFaster!
              </div>
          </div>
      )}
    </div>
  );
};

export default MyOrders;
