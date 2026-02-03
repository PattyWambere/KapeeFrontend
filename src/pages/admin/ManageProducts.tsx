import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaImage } from "react-icons/fa";
import productService, { type Product } from "../../api/product.service";
import categoryService, { type Category } from "../../api/category.service";

const ManageProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [processing, setProcessing] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: 0,
        categoryId: "",
        quantity: 0,
        inStock: true,
        images: [""]
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [prodData, catData] = await Promise.all([
                productService.getProducts(),
                categoryService.getCategories()
            ]);
            setProducts(prodData);
            setCategories(catData);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (product: Product | null = null) => {
        setEditingProduct(product);
        if (product) {
            setFormData({
                name: product.name,
                description: product.description || "",
                price: product.price,
                categoryId: product.categoryId,
                quantity: product.quantity,
                inStock: product.inStock,
                images: product.images && product.images.length > 0 ? product.images : [""]
            });
        } else {
            setFormData({
                name: "",
                description: "",
                price: 0,
                categoryId: categories[0]?.id || "",
                quantity: 10,
                inStock: true,
                images: [""]
            });
        }
        setShowModal(true);
    };

    const handleImageChange = (index: number, value: string) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData({ ...formData, images: newImages });
    };

    const addImageField = () => {
        setFormData({ ...formData, images: [...formData.images, ""] });
    };

    const removeImageField = (index: number) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: newImages.length > 0 ? newImages : [""] });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        try {
            // Clean up images - remove empty strings
            const cleanedImages = formData.images.filter(img => img.trim() !== "");
            const dataToSave = { ...formData, images: cleanedImages };

            if (editingProduct) {
                await productService.updateProduct(editingProduct.id, dataToSave);
            } else {
                await productService.createProduct(dataToSave);
            }
            fetchData();
            setShowModal(false);
        } catch (error) {
            console.error("Save failed:", error);
        } finally {
            setProcessing(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await productService.deleteProduct(id);
            fetchData();
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const getCategoryName = (id: string) => {
        return categories.find(c => c.id === id)?.name || "Unknown";
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-2">Manage Products</h2>
                    <p className="text-gray-400 font-medium italic">Create, update, or remove products from your catalog.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-black transition-all"
                >
                    <FaPlus size={12} />
                    Add New Product
                </button>
            </div>

            {loading ? (
                <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-20 text-center text-gray-400 font-bold uppercase tracking-widest animate-pulse">
                    Loading Products catalog...
                </div>
            ) : (
                <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Product</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Category</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-center">Price</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-center">Stock</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {products.map((prod) => (
                                <tr key={prod.id} className="group hover:bg-blue-50/30 transition-colors">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-gray-100 overflow-hidden border border-gray-200">
                                                {prod.images && prod.images[0] ? (
                                                    <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <FaImage size={24} />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 tracking-tight">{prod.name}</p>
                                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">ID: {prod.id.substring(0, 8)}...</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wider">
                                            {getCategoryName(prod.categoryId)}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 text-center font-black text-gray-900 tracking-tighter">
                                        ${prod.price.toFixed(2)}
                                    </td>
                                    <td className="px-10 py-6 text-center">
                                        <p className={`text-[10px] font-black uppercase tracking-widest ${prod.inStock ? 'text-emerald-500' : 'text-red-500'}`}>
                                            {prod.inStock ? `${prod.quantity} In Stock` : 'Out of Stock'}
                                        </p>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleOpenModal(prod)}
                                                className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                            >
                                                <FaEdit size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(prod.id)}
                                                className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm"
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
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-xl font-black uppercase tracking-tighter">
                                {editingProduct ? "Edit" : "Add New"} <span className="text-blue-600">Product</span>
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-black transition-colors">
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left Column: Basic Info */}
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Product Name</label>
                                        <input
                                            type="text" required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 font-bold tracking-tight transition-all"
                                            placeholder="Enter product name..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Price ($)</label>
                                            <input
                                                type="number" step="0.01" required
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 font-bold tracking-tight transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Quantity</label>
                                            <input
                                                type="number" required
                                                value={formData.quantity}
                                                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 font-bold tracking-tight transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Category</label>
                                        <select
                                            required
                                            value={formData.categoryId}
                                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 font-bold tracking-tight transition-all appearance-none"
                                        >
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 font-medium tracking-tight h-32 resize-none transition-all"
                                            placeholder="Enter product description..."
                                        />
                                    </div>

                                    <div className="flex items-center gap-3 ml-1">
                                        <input
                                            type="checkbox"
                                            id="inStock"
                                            checked={formData.inStock}
                                            onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                                            className="w-5 h-5 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="inStock" className="text-[10px] font-black uppercase tracking-widest text-gray-700">Display as In Stock</label>
                                    </div>
                                </div>

                                {/* Right Column: Images */}
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center ml-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Product Images</label>
                                        <button
                                            type="button"
                                            onClick={addImageField}
                                            className="text-blue-600 text-[10px] font-black uppercase tracking-widest hover:text-blue-700 underline underline-offset-4"
                                        >
                                            Add Another Image
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {formData.images.map((img, idx) => (
                                            <div key={idx} className="flex gap-3 items-start animate-in slide-in-from-right-4 duration-300">
                                                <div className="flex-1 space-y-2">
                                                    <input
                                                        type="text"
                                                        value={img}
                                                        onChange={(e) => handleImageChange(idx, e.target.value)}
                                                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 font-medium tracking-tight transition-all text-xs"
                                                        placeholder="Paste image URL here..."
                                                    />
                                                    {img && (
                                                        <div className="w-20 h-20 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                                                            <img src={img} alt="Preview" className="w-full h-full object-cover" onError={(e: any) => e.target.src = 'https://via.placeholder.com/150?text=Invalid+URL'} />
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeImageField(idx)}
                                                    className="p-4 rounded-xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all font-bold"
                                                >
                                                    <FaTrash size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Sticky Footer in Form */}
                            <div className="pt-8 border-t border-gray-100 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-8 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 hover:bg-gray-200 transition-all"
                                >
                                    Discard
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 bg-black text-white px-8 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-black/10 hover:bg-blue-600 transition-all disabled:opacity-50"
                                >
                                    {processing ? "Saving..." : editingProduct ? "Update Product" : "Publish Product"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageProducts;
