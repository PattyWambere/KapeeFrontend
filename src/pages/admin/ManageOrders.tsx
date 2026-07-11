import { useState, useEffect, useMemo } from "react";
import {
    FaTrash, FaEye, FaTimes, FaCheckCircle, FaShippingFast,
    FaClock, FaBan, FaSearch, FaFilter, FaChevronLeft, FaChevronRight
} from "react-icons/fa";
import orderService, { type Order } from "../../api/order.service";
import { useCurrency } from "../../context/CurrencyContext";

// ── helpers ──────────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 10;
const PREFIX = "GURAFASTER";

/** e.g.  040787b7-4476-... → GURAFASTER-040787B7 */
const formatOrderId = (id: string) =>
    `${PREFIX}-${id.substring(0, 8).toUpperCase()}`;

// ─────────────────────────────────────────────────────────────────────────────

const ManageOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [processing, setProcessing] = useState<string | null>(null);
    const { convertPrice } = useCurrency();

    // ── filter state ──────────────────────────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterDateFrom, setFilterDateFrom] = useState("");
    const [filterDateTo, setFilterDateTo] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => { fetchOrders(); }, []);

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
            case "pending":   return <FaClock className="text-orange-500" />;
            case "shipped":   return <FaShippingFast className="text-blue-500" />;
            case "delivered": return <FaCheckCircle className="text-emerald-500" />;
            case "cancelled": return <FaBan className="text-red-500" />;
            default:          return null;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":   return "bg-orange-50 text-orange-600 border-orange-100";
            case "shipped":   return "bg-blue-50 text-blue-600 border-blue-100";
            case "delivered": return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case "cancelled": return "bg-red-50 text-red-600 border-red-100";
            default:          return "bg-gray-50 text-gray-600 border-gray-100";
        }
    };

    // ── filter logic ──────────────────────────────────────────────────────────

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            // search: match against the formatted ID or the raw UUID
            const formatted = formatOrderId(order.id).toLowerCase();
            const matchesSearch =
                searchQuery === "" ||
                formatted.includes(searchQuery.toLowerCase()) ||
                order.id.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus =
                filterStatus === "" || order.status === filterStatus;

            const orderDate = new Date(order.createdAt);
            const matchesFrom =
                filterDateFrom === "" || orderDate >= new Date(filterDateFrom);
            const matchesTo =
                filterDateTo === "" || orderDate <= new Date(filterDateTo + "T23:59:59");

            return matchesSearch && matchesStatus && matchesFrom && matchesTo;
        });
    }, [orders, searchQuery, filterStatus, filterDateFrom, filterDateTo]);

    const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ITEMS_PER_PAGE));
    const safePage   = Math.min(currentPage, totalPages);
    const pageOrders = filteredOrders.slice(
        (safePage - 1) * ITEMS_PER_PAGE,
        safePage * ITEMS_PER_PAGE
    );

    const handleFilterChange = (setter: (v: any) => void) => (val: any) => {
        setter(val);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setSearchQuery("");
        setFilterStatus("");
        setFilterDateFrom("");
        setFilterDateTo("");
        setCurrentPage(1);
    };

    const hasActiveFilters = searchQuery || filterStatus || filterDateFrom || filterDateTo;

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-2">Customer Orders</h2>
                <p className="text-gray-400 font-medium italic">Track fulfillment and manage customer purchases.</p>
            </div>

            {/* ── Filter Bar ── */}
            <div className="bg-white border border-gray-100 shadow-sm p-6">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">

                    {/* Search by order ID */}
                    <div className="relative flex-1 w-full">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={13} />
                        <input
                            type="text"
                            placeholder={`Search by order ID (e.g. ${PREFIX}-040787B7)...`}
                            value={searchQuery}
                            onChange={e => handleFilterChange(setSearchQuery)(e.target.value)}
                            className="w-full pl-10 pr-5 py-3.5 bg-gray-50 border border-gray-100 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 text-sm font-medium tracking-tight transition-all"
                        />
                    </div>

                    {/* Status filter */}
                    <div className="relative">
                        <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={12} />
                        <select
                            value={filterStatus}
                            onChange={e => handleFilterChange(setFilterStatus)(e.target.value)}
                            className="pl-10 pr-8 py-3.5 bg-gray-50 border border-gray-100 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 text-sm font-bold tracking-tight appearance-none transition-all cursor-pointer min-w-[170px]"
                        >
                            <option value="">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    {/* Date range */}
                    <div className="flex items-center gap-2">
                        <input
                            type="date"
                            value={filterDateFrom}
                            onChange={e => handleFilterChange(setFilterDateFrom)(e.target.value)}
                            className="px-4 py-3.5 bg-gray-50 border border-gray-100 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 text-sm font-medium tracking-tight transition-all cursor-pointer"
                            title="From date"
                        />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">to</span>
                        <input
                            type="date"
                            value={filterDateTo}
                            onChange={e => handleFilterChange(setFilterDateTo)(e.target.value)}
                            className="px-4 py-3.5 bg-gray-50 border border-gray-100 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 text-sm font-medium tracking-tight transition-all cursor-pointer"
                            title="To date"
                        />
                    </div>

                    {/* Results + clear */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 whitespace-nowrap">
                            {filteredOrders.length} result{filteredOrders.length !== 1 ? "s" : ""}
                        </p>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 border border-red-100 transition-all"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {/* Active status pills */}
                <div className="flex gap-2 mt-4 flex-wrap">
                    {(["pending", "shipped", "delivered", "cancelled"] as const).map(s => (
                        <button
                            key={s}
                            onClick={() => handleFilterChange(setFilterStatus)(filterStatus === s ? "" : s)}
                            className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest border transition-all ${
                                filterStatus === s
                                    ? s === "pending"   ? "bg-orange-500 text-white border-orange-500"
                                    : s === "shipped"   ? "bg-blue-600 text-white border-blue-600"
                                    : s === "delivered" ? "bg-emerald-500 text-white border-emerald-500"
                                                        : "bg-red-500 text-white border-red-500"
                                    : "bg-white text-gray-400 border-gray-200 hover:border-gray-400"
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Table ── */}
            {loading ? (
                <div className="bg-white border border-gray-100 p-20 text-center text-gray-400 font-bold uppercase tracking-widest animate-pulse">
                    Loading orders...
                </div>
            ) : (
                <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left border-collapse min-w-[800px]">
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
                                {pageOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-10 py-20 text-center text-gray-400 font-bold uppercase tracking-widest italic text-[11px]">
                                            No orders match your filters.
                                        </td>
                                    </tr>
                                ) : pageOrders.map((order) => (
                                    <tr key={order.id} className="group hover:bg-blue-50/30 transition-colors">
                                        <td className="px-10 py-6">
                                            <p className="font-black text-gray-900 tracking-tight text-sm">
                                                {formatOrderId(order.id)}
                                            </p>
                                            <p className="text-[9px] font-medium text-gray-400 mt-0.5 font-mono">
                                                {order.id}
                                            </p>
                                        </td>
                                        <td className="px-10 py-6">
                                            <p className="text-sm font-medium text-gray-500 italic">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </td>
                                        <td className="px-10 py-6 text-center">
                                            <p className="font-black text-gray-900 tracking-tighter">{convertPrice(order.totalAmount)}</p>
                                        </td>
                                        <td className="px-10 py-6 text-center">
                                            <span className={`inline-flex items-center gap-2 px-4 py-1.5 border text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
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
                                                    className="w-10 h-10 rounded-none bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                >
                                                    <FaEye size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(order.id)}
                                                    className="w-10 h-10 rounded-none bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                >
                                                    <FaTrash size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ── Pagination ── */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-10 py-5 border-t border-gray-100 bg-gray-50/30">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                Page {safePage} of {totalPages} &mdash; {filteredOrders.length} orders
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={safePage === 1}
                                    className="w-9 h-9 rounded-none bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                                >
                                    <FaChevronLeft size={11} />
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(page => page === 1 || page === totalPages || Math.abs(page - safePage) <= 1)
                                    .reduce<(number | "...")[]>((acc, page, idx, arr) => {
                                        if (idx > 0 && (page as number) - (arr[idx - 1] as number) > 1) acc.push("...");
                                        acc.push(page);
                                        return acc;
                                    }, [])
                                    .map((page, idx) =>
                                        page === "..." ? (
                                            <span key={`e-${idx}`} className="px-1 text-gray-400 text-xs font-bold">…</span>
                                        ) : (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page as number)}
                                                className={`w-9 h-9 rounded-none text-[11px] font-black uppercase tracking-wider transition-all shadow-sm ${
                                                    safePage === page
                                                        ? "bg-blue-600 text-white border-blue-600 shadow-blue-600/20"
                                                        : "bg-white border border-gray-200 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        )
                                    )
                                }

                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={safePage === totalPages}
                                    className="w-9 h-9 rounded-none bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                                >
                                    <FaChevronRight size={11} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── Order Details Modal ── */}
            {showModal && selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative bg-white w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-tighter">
                                    Order <span className="text-blue-600">Details</span>
                                </h3>
                                <p className="text-[11px] font-black uppercase text-blue-600 tracking-widest mt-0.5">
                                    {formatOrderId(selectedOrder.id)}
                                </p>
                                <p className="text-[9px] font-medium text-gray-400 font-mono mt-0.5">
                                    {selectedOrder.id}
                                </p>
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
                                            <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-100">
                                                <div className="w-12 h-12 bg-white border border-gray-200 overflow-hidden flex-shrink-0">
                                                    {product?.images?.[0] && (
                                                        <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-gray-900 truncate tracking-tight">{product?.name || 'Unknown Product'}</p>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{item.quantity} x {convertPrice(item.price)}</p>
                                                </div>
                                                <p className="font-black text-gray-900 tracking-tighter">{convertPrice(item.quantity * item.price)}</p>
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
                                                flex flex-col items-center gap-2 p-4 rounded-none border text-[10px] font-black uppercase tracking-widest transition-all
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
                                <p className="text-3xl font-black text-gray-900 tracking-tighter">{convertPrice(selectedOrder.totalAmount)}</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-black text-white px-10 py-4 rounded-none text-[11px] font-black uppercase tracking-widest shadow-xl shadow-black/10 hover:bg-blue-600 transition-all"
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
