import { useState, useEffect } from "react";
import {
  FaTimes,
  FaClock,
  FaCheckCircle,
  FaTruck,
  FaTimesCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import orderService, { type Order } from "../../api/order.service";

interface OrderDetailsModalProps {
  orderId: string;
  onClose: () => void;
  onStatusUpdate: () => void;
}

const OrderDetailsModal = ({
  orderId,
  onClose,
  onStatusUpdate,
}: OrderDetailsModalProps) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const data = await orderService.getOrderById(orderId);
        setOrder(data);
      } catch (error) {
        console.error("Failed to fetch order details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleCancelOrder = async () => {
    if (!order || order.status !== "pending") return;



    setIsCancelling(true);
    try {
      await orderService.cancelOrder(order.id);
      onStatusUpdate();
      // Refresh order data
      const updatedOrder = await orderService.getOrderById(order.id);
      setOrder(updatedOrder);
    } catch (error) {
      console.error("Failed to cancel order:", error);
      alert("Failed to cancel order. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <FaClock className="text-blue-500" />;
      case "shipped":
        return <FaTruck className="text-purple-500" />;
      case "delivered":
        return <FaCheckCircle className="text-green-500" />;
      case "cancelled":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-blue-50 border-blue-100";
      case "shipped":
        return "bg-purple-50 border-purple-100";
      case "delivered":
        return "bg-green-50 border-green-100";
      case "cancelled":
        return "bg-red-50 border-red-100";
      default:
        return "bg-gray-50 border-gray-100";
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white w-full max-w-lg rounded-3xl p-12 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]">
            Loading Order Details...
          </p>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
                Order Details
              </h2>
              <span className="text-xs font-bold text-gray-400 bg-white px-2 py-1 border border-gray-100 rounded">
                #{order.id.split("-")[0].toUpperCase()}
              </span>
            </div>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-all duration-300 shadow-sm"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {/* Status Banner */}
          <div
            className={`flex items-center gap-4 p-5 rounded-2xl border-2 mb-8 ${getStatusBg(order.status)} transition-colors duration-500`}
          >
            <div className="text-xl">{getStatusIcon(order.status)}</div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-0.5">
                Current Status
              </div>
              <div className="text-sm font-black text-gray-900 uppercase tracking-tighter">
                Order is{" "}
                <span
                  className={
                    order.status === "cancelled"
                      ? "text-red-500"
                      : order.status === "delivered"
                        ? "text-green-600"
                        : "text-blue-600"
                  }
                >
                  {order.status}
                </span>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-6">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
              Items Purchased
            </h3>
            <div className="divide-y divide-gray-100">
              {order.items.map((item, index) => {
                const product =
                  typeof item.productId === "object" ? item.productId : null;
                return (
                  <div
                    key={index}
                    className="py-6 flex gap-6 items-center first:pt-0 last:pb-0"
                  >
                    <div className="w-20 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                      <img
                        src={product?.images?.[0] || "/images/placeholder.png"}
                        alt={product?.name || "Product"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-sm leading-tight mb-2">
                        {product?.name || "Product Name Loading..."}
                      </h4>
                      <div className="flex justify-between items-end">
                        <div className="text-xs font-medium text-black">
                          Qty:{" "}
                          <span className="text-black font-bold">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="text-sm font-black text-blue-600 tracking-tighter">
                          ${item.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-100 bg-gray-50/50">
          <div className="flex justify-between items-center mb-8">
            <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
              Total Amount Paid
            </span>
            <span className="text-2xl font-black text-blue-600 tracking-tighter">
              ${order.totalAmount.toFixed(2)}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {order.status === "pending" && (
              <button
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className="flex-1 bg-red-500  text-white font-black py-4 rounded-xl hover:bg-red-400 hover:text-white transition-all duration-500 uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {isCancelling ? (
                  <>
                    <div className="w-3 h-3 border-2 border-red-500 border-t-transparent  animate-spin"></div>
                    CANCELLING...
                  </>
                ) : (
                  <>
                    <FaTimesCircle />
                    CANCEL ORDER
                  </>
                )}
              </button>
            )}
          </div>

          {order.status === "cancelled" && (
            <div className="mt-6 flex items-center gap-2 text-red-500 bg-red-50 p-4 rounded-xl border border-red-100">
              <FaExclamationTriangle className="flex-shrink-0" />
              <p className="text-[10px] font-bold uppercase tracking-widest">
                This order was cancelled and the total amount will be refunded
                if applicable.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
