import { useState, useEffect, useMemo } from "react";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import categoryService, { type Category } from "../../api/category.service";

const ITEMS_PER_PAGE = 8;

const ManageCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({ name: "", description: "" });
    const [processing, setProcessing] = useState(false);

    // Filter & pagination state
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => { fetchCategories(); }, []);

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getCategories();
            setCategories(data);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (category: Category | null = null) => {
        setEditingCategory(category);
        setFormData(category
            ? { name: category.name, description: category.description || "" }
            : { name: "", description: "" }
        );
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        try {
            if (editingCategory) {
                await categoryService.updateCategory(editingCategory.id, formData);
            } else {
                await categoryService.createCategory(formData);
            }
            fetchCategories();
            setShowModal(false);
        } catch (error) {
            console.error("Save failed:", error);
        } finally {
            setProcessing(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        try {
            await categoryService.deleteCategory(id);
            fetchCategories();
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    // ── Derived: filtered + paginated ─────────────────────────────────────────
    const filteredCategories = useMemo(() =>
        categories.filter(cat =>
            searchQuery === "" ||
            cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (cat.description || "").toLowerCase().includes(searchQuery.toLowerCase())
        ),
        [categories, searchQuery]
    );

    const totalPages = Math.max(1, Math.ceil(filteredCategories.length / ITEMS_PER_PAGE));
    const safePage   = Math.min(currentPage, totalPages);
    const pageCategories = filteredCategories.slice(
        (safePage - 1) * ITEMS_PER_PAGE,
        safePage * ITEMS_PER_PAGE
    );

    const handleSearch = (val: string) => { setSearchQuery(val); setCurrentPage(1); };

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="space-y-8">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-2">Manage Categories</h2>
                    <p className="text-gray-400 font-medium italic">Organize your store collections and filters.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-none text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-black transition-all"
                >
                    <FaPlus size={12} />
                    Add New Category
                </button>
            </div>

            {/* Search bar */}
            <div className="bg-white border border-gray-100 shadow-sm p-5">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative flex-1 w-full">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={13} />
                        <input
                            type="text"
                            placeholder="Search categories by name or description..."
                            value={searchQuery}
                            onChange={e => handleSearch(e.target.value)}
                            className="w-full pl-10 pr-5 py-3.5 bg-gray-50 border border-gray-100 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 text-sm font-medium tracking-tight transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 whitespace-nowrap">
                            {filteredCategories.length} result{filteredCategories.length !== 1 ? "s" : ""}
                        </p>
                        {searchQuery && (
                            <button
                                onClick={() => handleSearch("")}
                                className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 border border-red-100 transition-all"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="bg-white border border-gray-100 p-20 text-center text-gray-400 font-bold uppercase tracking-widest animate-pulse">
                    Loading Categories...
                </div>
            ) : (
                <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">#</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Name</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Description</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {pageCategories.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-10 py-20 text-center text-gray-400 font-bold uppercase tracking-widest italic text-[11px]">
                                            {searchQuery ? "No categories match your search." : "No categories found. Start by adding one!"}
                                        </td>
                                    </tr>
                                ) : pageCategories.map((cat, idx) => (
                                    <tr key={cat.id} className="group hover:bg-blue-50/30 transition-colors">
                                        {/* Row number */}
                                        <td className="px-10 py-6">
                                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                                {String((safePage - 1) * ITEMS_PER_PAGE + idx + 1).padStart(2, "0")}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-3">
                                                {/* Color chip derived from name */}
                                                <div
                                                    className="w-2 h-8 flex-shrink-0"
                                                    style={{
                                                        background: `hsl(${(cat.name.charCodeAt(0) * 37) % 360}, 60%, 55%)`
                                                    }}
                                                />
                                                <p className="font-bold text-gray-900 tracking-tight">{cat.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <p className="text-sm text-gray-400 max-w-md truncate italic font-medium">
                                                {cat.description || "No description provided"}
                                            </p>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <div className="flex justify-end gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleOpenModal(cat)}
                                                    className="w-10 h-10 rounded-none bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                >
                                                    <FaEdit size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(cat.id)}
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

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-10 py-5 border-t border-gray-100 bg-gray-50/30">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                Page {safePage} of {totalPages} &mdash; {filteredCategories.length} categories
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
                                    .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                                    .reduce<(number | "...")[]>((acc, p, i, arr) => {
                                        if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push("...");
                                        acc.push(p);
                                        return acc;
                                    }, [])
                                    .map((p, i) =>
                                        p === "..." ? (
                                            <span key={`e-${i}`} className="px-1 text-gray-400 text-xs font-bold">…</span>
                                        ) : (
                                            <button
                                                key={p}
                                                onClick={() => setCurrentPage(p as number)}
                                                className={`w-9 h-9 rounded-none text-[11px] font-black tracking-wider transition-all shadow-sm ${
                                                    safePage === p
                                                        ? "bg-blue-600 text-white border-blue-600 shadow-blue-600/20"
                                                        : "bg-white border border-gray-200 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                                                }`}
                                            >
                                                {p}
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
                    <div className="relative bg-white w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-xl font-black uppercase tracking-tighter">
                                {editingCategory ? "Update" : "Add New"} <span className="text-blue-600">Category</span>
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-black transition-colors">
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Category Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 font-bold tracking-tight transition-all"
                                    placeholder="Enter category name..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 font-medium tracking-tight h-32 resize-none transition-all"
                                    placeholder="Enter description (optional)..."
                                />
                            </div>
                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-8 py-4 rounded-none text-[11px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 bg-black text-white px-8 py-4 rounded-none text-[11px] font-black uppercase tracking-widest shadow-xl shadow-black/10 hover:bg-blue-600 transition-all disabled:opacity-50"
                                >
                                    {processing ? "Processing..." : editingCategory ? "Save Changes" : "Create Category"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageCategories;
