import { useState, useEffect } from "react";
import { FaTrash, FaEye, FaTimes, FaCheckCircle, FaShippingFast, FaClock, FaBan } from "react-icons/fa";
import orderService, { type Order } from "../../api/order.service";

const ManageOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [processing, setProcessing] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await orderService.getOrders();
            setOrders(data);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        setProcessing(id);
        try {
            await orderService.updateOrder(id, newStatus);
            fetchOrders();
            if (selectedOrder?.id === id) {
                const updated = await orderService.getOrderById(id);
                setSelectedOrder(updated);
            }
        } catch (error) {
            console.error("Update failed:", error);
        } finally {
            setProcessing(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Permanently delete this order record? This cannot be undone.")) return;
        try {
            await orderService.deleteOrder(id);
            fetchOrders();
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "pending": return <FaClock className="text-orange-500" />;
            case "shipped": return <FaShippingFast className="text-blue-500" />;
            case "delivered": return <FaCheckCircle className="text-emerald-500" />;
            case "cancelled": return <FaBan className="text-red-500" />;
            default: return null;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending": return "bg-orange-50 text-orange-600 border-orange-100";
            case "shipped": return "bg-blue-50 text-blue-600 border-blue-100";
            case "delivered": return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case "cancelled": return "bg-red-50 text-red-600 border-red-100";
            default: return "bg-gray-50 text-gray-600 border-gray-100";
        }
    };

    return (
        <div className="space-y-12">
            <div>
                <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-2">Customer Orders</h2>
                <p className="text-gray-400 font-medium italic">Track fulfillment and manage customer purchases.</p>
            </div>

            {loading ? (
                <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-20 text-center text-gray-400 font-bold uppercase tracking-widest animate-pulse">
                    Loading global orders...
                </div>
            ) : (
                <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Order ID</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Date</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-center">Amount</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-center">Status</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders.map((order) => (
                                <tr key={order.id} className="group hover:bg-blue-50/30 transition-colors">
                                    <td className="px-10 py-6">
                                        <p className="font-bold text-gray-900 tracking-tight">#{order.id.substring(0, 8).toUpperCase()}</p>
                                    </td>
                                    <td className="px-10 py-6">
                                        <p className="text-sm font-medium text-gray-500 italic">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </td>
                                    <td className="px-10 py-6 text-center">
                                        <p className="font-black text-gray-900 tracking-tighter">${order.totalAmount.toFixed(2)}</p>
                                    </td>
                                    <td className="px-10 py-6 text-center">
                                        <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                                            {getStatusIcon(order.status)}
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={async () => {
                                                    const fullOrder = await orderService.getOrderById(order.id);
                                                    setSelectedOrder(fullOrder);
                                                    setShowModal(true);
                                                }}
                                                className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                            >
                                                <FaEye size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(order.id)}
                                                className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-10 py-20 text-center text-gray-400 font-bold uppercase tracking-widest italic">
                                        No orders found in the system.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Order Details Modal */}
            {showModal && selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-tighter">
                                    Order <span className="text-blue-600">Details</span>
                                </h3>
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">ID: {selectedOrder.id}</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-black transition-colors">
                                <FaTimes />
                            </button>
                        </div>

                        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                            {/* Items */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Order Items</h4>
                                <div className="space-y-3">
                                    {selectedOrder.items.map((item, idx) => {
                                        const product = typeof item.productId === 'object' ? item.productId : null;
                                        return (
                                            <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                                <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 overflow-hidden flex-shrink-0">
                                                    {product?.images?.[0] && (
                                                        <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-gray-900 truncate tracking-tight">{product?.name || 'Unknown Product'}</p>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{item.quantity} x ${item.price.toFixed(2)}</p>
                                                </div>
                                                <p className="font-black text-gray-900 tracking-tighter">${(item.quantity * item.price).toFixed(2)}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Status Management */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Update Status</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {["pending", "shipped", "delivered", "cancelled"].map((s) => (
                                        <button
                                            key={s}
                                            disabled={processing === selectedOrder.id}
                                            onClick={() => handleStatusUpdate(selectedOrder.id, s)}
                                            className={`
                                                flex flex-col items-center gap-2 p-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all
                                                ${selectedOrder.status === s
                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20'
                                                    : 'bg-white text-gray-400 border-gray-100 hover:border-blue-200 hover:text-blue-600'}
                                            `}
                                        >
                                            <span className="text-lg">{getStatusIcon(s)}</span>
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
                            <div>
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Total Amount</p>
                                <p className="text-3xl font-black text-gray-900 tracking-tighter">${selectedOrder.totalAmount.toFixed(2)}</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-black text-white px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-black/10 hover:bg-blue-600 transition-all"
                            >
                                Close View
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageOrders;
