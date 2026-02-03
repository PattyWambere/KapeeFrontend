import { useState, useEffect } from "react";
import { FaBox, FaShoppingCart, FaTags, FaArrowRight, FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";
import productService from "../../api/product.service";
import categoryService from "../../api/category.service";
import orderService, { type Order } from "../../api/order.service";

const DashboardCard = ({ title, value, icon, color, delay }: any) => (
    <div className={`bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 fill-mode-both`} style={{ animationDelay: `${delay}ms` }}>
        <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">{title}</p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tighter">{value}</h3>
        </div>
        <div className={`w-16 h-16 rounded-3xl ${color} flex items-center justify-center text-2xl text-white group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
            {icon}
        </div>
    </div>
);

const Dashboard = () => {
    const [metrics, setMetrics] = useState({
        products: 0,
        categories: 0,
        orders: 0,
        revenue: 0
    });
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const [prods, cats, orders] = await Promise.all([
                    productService.getProducts(),
                    categoryService.getCategories(),
                    orderService.getOrders()
                ]);

                const totalRevenue = orders.reduce((acc, order) =>
                    order.status !== "cancelled" ? acc + order.totalAmount : acc, 0
                );

                setMetrics({
                    products: prods.length,
                    categories: cats.length,
                    orders: orders.length,
                    revenue: totalRevenue
                });

                setRecentOrders(orders.slice(0, 5));
            } catch (error) {
                console.error("Failed to fetch dashboard metrics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    return (
        <div className="space-y-12 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-2">Platform Overview</h2>
                    <p className="text-gray-400 font-medium italic">Monitor your business performance in real-time.</p>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 px-6 py-3 rounded-xl border border-gray-200">
                    <FaClock className="text-blue-600" />
                    Last Updated: {new Date().toLocaleTimeString()}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <DashboardCard
                    title="Total Revenue"
                    value={`$${metrics.revenue.toLocaleString()}`}
                    icon={<FaChartLine />}
                    color="bg-emerald-600 shadow-emerald-600/20"
                    delay={0}
                />
                <DashboardCard
                    title="Total Orders"
                    value={metrics.orders}
                    icon={<FaShoppingCart />}
                    color="bg-orange-500 shadow-orange-500/20"
                    delay={100}
                />
                <DashboardCard
                    title="Products"
                    value={metrics.products}
                    icon={<FaBox />}
                    color="bg-blue-600 shadow-blue-600/20"
                    delay={200}
                />
                <DashboardCard
                    title="Categories"
                    value={metrics.categories}
                    icon={<FaTags />}
                    color="bg-purple-600 shadow-purple-600/20"
                    delay={300}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Recent Orders */}
                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm animate-in fade-in slide-in-from-left-4 duration-700">
                    <div className="flex justify-between items-center mb-10">
                        <h4 className="text-xl font-black uppercase tracking-tighter">Recent Orders</h4>
                        <Link to="/admin/orders" className="text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-2 hover:gap-3 transition-all">
                            View All <FaArrowRight />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-50 rounded-3xl animate-pulse" />)}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-6 rounded-3xl bg-gray-50 border border-gray-100 group hover:border-blue-200 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold
                                            ${order.status === 'delivered' ? 'bg-emerald-500' : 'bg-orange-500'}`}>
                                            {order.status.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 tracking-tight">#{order.id.substring(0, 8).toUpperCase()}</p>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="font-black text-gray-900 tracking-tighter">${order.totalAmount.toFixed(2)}</p>
                                </div>
                            ))}
                            {recentOrders.length === 0 && (
                                <p className="text-center py-10 text-gray-400 font-bold uppercase tracking-widest text-xs italic">
                                    No orders recorded yet.
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Platform Analytics Placeholder */}
                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm animate-in fade-in slide-in-from-right-4 duration-700">
                    <h4 className="text-xl font-black uppercase tracking-tighter mb-4">Store Analytics</h4>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-10 italic">Performance by collection</p>

                    <div className="space-y-10 py-10">
                        <div className="flex flex-col items-center justify-center text-center gap-6">
                            <div className="w-32 h-32 rounded-full border-[10px] border-blue-50 border-t-blue-600 flex items-center justify-center animate-spin-slow">
                                <FaChartBar className="text-3xl text-blue-600 -rotate-90" />
                            </div>
                            <div>
                                <p className="text-sm font-black uppercase tracking-widest text-gray-900">Advanced Analytics</p>
                                <p className="text-[10px] font-medium text-gray-400 mt-2 max-w-[200px]">Detailed sales charts and visitor tracking integration coming soon.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

import { FaChartLine, FaChartBar } from "react-icons/fa";

export default Dashboard;
