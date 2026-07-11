import { useState, useEffect, useMemo } from "react";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaImage, FaSearch, FaChevronLeft, FaChevronRight, FaFilter } from "react-icons/fa";
import productService, { type Product } from "../../api/product.service";
import categoryService, { type Category } from "../../api/category.service";
import { useCurrency } from "../../context/CurrencyContext";

const AVAILABLE_COLORS = [
    { name: "Black", color: "#000000" },
    { name: "White", color: "#FFFFFF" },
    { name: "Blue", color: "#1E88E5" },
    { name: "Red", color: "#D32F2F" },
    { name: "Beige", color: "#F5F5DC" },
    { name: "Green", color: "#388E3C" },
];

const ITEMS_PER_PAGE = 10;

const ManageProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [processing, setProcessing] = useState(false);
    const { convertPrice, symbol } = useCurrency();

    // Filter & pagination state
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [filterStock, setFilterStock] = useState<"" | "in" | "out">("");
    const [currentPage, setCurrentPage] = useState(1);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: 0,
        categoryId: "",
        quantity: 0,
        inStock: true,
        colors: [] as string[]
    });

    const [images, setImages] = useState<Array<{ id: string; url: string; file?: File }>>([]);

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
                colors: product.colors || []
            });
            setImages(product.images ? product.images.map((url, idx) => ({ id: `existing-${idx}-${url}`, url })) : []);
        } else {
            setFormData({
                name: "",
                description: "",
                price: 0,
                categoryId: "",
                quantity: 10,
                inStock: true,
                colors: []
            });
            setImages([]);
        }
        setShowModal(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            const newImages = filesArray.map((file, idx) => ({
                id: `new-${Date.now()}-${idx}-${file.name}`,
                url: URL.createObjectURL(file),
                file
            }));
            setImages(prev => [...prev, ...newImages]);
        }
    };

    const removeImage = (id: string) => {
        const imageToRemove = images.find(img => img.id === id);
        if (imageToRemove?.file) {
            URL.revokeObjectURL(imageToRemove.url);
        }
        setImages(prev => prev.filter(img => img.id !== id));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("price", String(formData.price));
            formDataToSend.append("categoryId", formData.categoryId);
            formDataToSend.append("quantity", String(formData.quantity));
            formDataToSend.append("inStock", String(formData.inStock));
            formData.colors.forEach(color => formDataToSend.append("colors", color));

            // Append new files as Files, and existing image URLs as strings
            images.forEach(img => {
                if (img.file) {
                    formDataToSend.append("images", img.file);
                } else {
                    formDataToSend.append("images", img.url);
                }
            });

            if (editingProduct) {
                await productService.updateProduct(editingProduct.id, formDataToSend);
            } else {
                await productService.createProduct(formDataToSend);
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

    // --- Derived: filtered + paginated products ---
    const filteredProducts = useMemo(() => {
        return products.filter(prod => {
            const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = filterCategory === "" || prod.categoryId === filterCategory;
            const matchesStock =
                filterStock === "" ||
                (filterStock === "in" && prod.inStock) ||
                (filterStock === "out" && !prod.inStock);
            return matchesSearch && matchesCategory && matchesStock;
        });
    }, [products, searchQuery, filterCategory, filterStock]);

    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const paginatedProducts = filteredProducts.slice(
        (safePage - 1) * ITEMS_PER_PAGE,
        safePage * ITEMS_PER_PAGE
    );

    const handleFilterChange = (setter: (v: any) => void) => (val: any) => {
        setter(val);
        setCurrentPage(1); // reset to page 1 on any filter change
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-2">Manage Products</h2>
                    <p className="text-gray-400 font-medium italic">Create, update, or remove products from your catalog.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-none text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-black transition-all"
                >
                    <FaPlus size={12} />
                    Add New Product
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    {/* Search */}
                    <div className="relative flex-1 w-full">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={13} />
                        <input
                            type="text"
                            placeholder="Search products by name..."
                            value={searchQuery}
                            onChange={e => handleFilterChange(setSearchQuery)(e.target.value)}
                            className="w-full pl-10 pr-5 py-3.5 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 text-sm font-medium tracking-tight transition-all"
                        />
                    </div>

                    {/* Category filter */}
                    <div className="relative">
                        <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={12} />
                        <select
                            value={filterCategory}
                            onChange={e => handleFilterChange(setFilterCategory)(e.target.value)}
                            className="pl-10 pr-8 py-3.5 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 text-sm font-bold tracking-tight appearance-none transition-all cursor-pointer min-w-[170px]"
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Stock filter */}
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-none px-2 py-1.5">
                        {(["", "in", "out"] as const).map(val => (
                            <button
                                key={val}
                                onClick={() => handleFilterChange(setFilterStock)(val)}
                                className={`px-4 py-2 rounded-none text-[10px] font-black uppercase tracking-widest transition-all ${
                                    filterStock === val
                                        ? val === "out"
                                            ? "bg-red-500 text-white shadow"
                                            : val === "in"
                                            ? "bg-emerald-500 text-white shadow"
                                            : "bg-blue-600 text-white shadow"
                                        : "text-gray-400 hover:text-gray-700"
                                }`}
                            >
                                {val === "" ? "All" : val === "in" ? "In Stock" : "Out of Stock"}
                            </button>
                        ))}
                    </div>

                    {/* Results count */}
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 whitespace-nowrap">
                        {filteredProducts.length} result{filteredProducts.length !== 1 ? "s" : ""}
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-20 text-center text-gray-400 font-bold uppercase tracking-widest animate-pulse">
                    Loading Products catalog...
                </div>
            ) : (
                <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left border-collapse min-w-[900px]">
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
                                {paginatedProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-10 py-16 text-center text-gray-400 font-bold uppercase tracking-widest text-[11px]">
                                            No products match your filters.
                                        </td>
                                    </tr>
                                ) : paginatedProducts.map((prod) => (
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
                                            {convertPrice(prod.price)}
                                        </td>
                                        <td className="px-10 py-6 text-center">
                                            <p className={`text-[10px] font-black uppercase tracking-widest ${prod.inStock ? 'text-emerald-500' : 'text-red-500'}`}>
                                                {prod.inStock ? `${prod.quantity} In Stock` : 'Out of Stock'}
                                            </p>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <div className="flex justify-end gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleOpenModal(prod)}
                                                    className="w-10 h-10 rounded-none bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                >
                                                    <FaEdit size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(prod.id)}
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

                    {/* Pagination Footer */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-10 py-5 border-t border-gray-100 bg-gray-50/30">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                Page {safePage} of {totalPages} &mdash; {filteredProducts.length} products
                            </p>
                            <div className="flex items-center gap-2">
                                {/* Prev */}
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={safePage === 1}
                                    className="w-9 h-9 rounded-none bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                                >
                                    <FaChevronLeft size={11} />
                                </button>

                                {/* Page numbers */}
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(page => page === 1 || page === totalPages || Math.abs(page - safePage) <= 1)
                                    .reduce<(number | "...")[]>((acc, page, idx, arr) => {
                                        if (idx > 0 && (page as number) - (arr[idx - 1] as number) > 1) acc.push("...");
                                        acc.push(page);
                                        return acc;
                                    }, [])
                                    .map((page, idx) =>
                                        page === "..." ? (
                                            <span key={`ellipsis-${idx}`} className="px-1 text-gray-400 text-xs font-bold">…</span>
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

                                {/* Next */}
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
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Price ({symbol})</label>
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
                                            <option value="" disabled>Select a category</option>
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

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Colors</label>
                                        <div className="flex flex-wrap gap-3 px-1">
                                            {AVAILABLE_COLORS.map((c) => {
                                                const isSelected = formData.colors.includes(c.color);
                                                return (
                                                    <button
                                                        type="button"
                                                        key={c.name}
                                                        onClick={() => {
                                                            const newColors = isSelected 
                                                                ? formData.colors.filter(col => col !== c.color)
                                                                : [...formData.colors, c.color];
                                                            setFormData({ ...formData, colors: newColors });
                                                        }}
                                                        title={c.name}
                                                        className={`w-8 h-8 rounded-xl border shadow-sm transition-all flex items-center justify-center ${isSelected ? 'ring-2 ring-blue-600 ring-offset-2 scale-110' : 'border-gray-200 hover:scale-110'}`}
                                                        style={{ backgroundColor: c.color }}
                                                    >
                                                        {isSelected && (
                                                            <div className={`w-1.5 h-1.5 rounded-full ${c.name === "White" || c.name === "Beige" ? "bg-black" : "bg-white"}`}></div>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
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
                                    </div>

                                    {/* Upload area */}
                                    <div className="space-y-4">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="product-image-upload"
                                        />
                                        <label
                                            htmlFor="product-image-upload"
                                            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-8 cursor-pointer hover:border-blue-500 hover:bg-blue-50/20 transition-all group"
                                        >
                                            <FaImage className="text-gray-300 group-hover:text-blue-500 transition-colors mb-3" size={32} />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-blue-600 transition-colors">Upload Images</span>
                                            <span className="text-[9px] text-gray-400 mt-1 font-medium italic">Click to browse or drop files (Max 5)</span>
                                        </label>

                                        {/* Image Previews */}
                                        <div className="grid grid-cols-2 gap-4 max-h-[250px] overflow-y-auto pr-1">
                                            {images.map((img) => (
                                                <div key={img.id} className="relative rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 aspect-video group shadow-sm">
                                                    <img src={img.url} alt="Product image preview" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(img.id)}
                                                            className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors shadow-lg"
                                                        >
                                                            <FaTrash size={14} />
                                                        </button>
                                                    </div>
                                                    {img.file && (
                                                        <span className="absolute top-2 left-2 bg-blue-600 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider shadow">
                                                            New
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sticky Footer in Form */}
                            <div className="pt-8 border-t border-gray-100 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-8 py-5 rounded-none text-[11px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 hover:bg-gray-200 transition-all"
                                >
                                    Discard
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 bg-black text-white px-4 md:px-8 py-3 md:py-5 rounded-none text-[11px] font-black uppercase tracking-widest shadow-xl shadow-black/10 hover:bg-blue-600 transition-all disabled:opacity-50 whitespace-normal break-words"
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
