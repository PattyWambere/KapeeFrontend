import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import categoryService, { type Category } from "../../api/category.service";

const ManageCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({ name: "", description: "" });
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

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
        setFormData(category ? { name: category.name, description: category.description || "" } : { name: "", description: "" });
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

    return (
        <div className="space-y-12">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-2">Manage Categories</h2>
                    <p className="text-gray-400 font-medium italic">Organize your store collections and filters.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-black transition-all"
                >
                    <FaPlus size={12} />
                    Add New Category
                </button>
            </div>

            {loading ? (
                <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-20 text-center text-gray-400 font-bold uppercase tracking-widest animate-pulse">
                    Loading Categories...
                </div>
            ) : (
                <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Name</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Description</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {categories.map((cat) => (
                                <tr key={cat.id} className="group hover:bg-blue-50/30 transition-colors">
                                    <td className="px-10 py-6">
                                        <p className="font-bold text-gray-900 tracking-tight">{cat.name}</p>
                                    </td>
                                    <td className="px-10 py-6">
                                        <p className="text-sm text-gray-400 max-w-md truncate italic font-medium">
                                            {cat.description || "No description provided"}
                                        </p>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleOpenModal(cat)}
                                                className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                            >
                                                <FaEdit size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat.id)}
                                                className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-10 py-20 text-center text-gray-400 font-bold uppercase tracking-widest italic">
                                        No categories found. Start by adding one!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
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
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 font-bold tracking-tight transition-all"
                                    placeholder="Enter category name..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 font-medium tracking-tight h-32 resize-none transition-all"
                                    placeholder="Enter description (optional)..."
                                />
                            </div>
                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 bg-black text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-black/10 hover:bg-blue-600 transition-all disabled:opacity-50"
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
