import { useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
  FaNewspaper,
  FaSearch,
  FaRedo,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useContent } from "../../context/ContentContext";
import type { BlogPost } from "../../api/content.service";

// ─── Empty form state ─────────────────────────────────────────────────────────

const emptyForm = (): Omit<BlogPost, "id"> => ({
  title: "",
  excerpt: "",
  content: "",
  image: "",
  date: new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  author: "",
  category: "",
  readTime: "",
});

const CATEGORIES = [
  "STYLE GUIDE",
  "MEN'S FASHION",
  "WOMEN'S FASHION",
  "ACCESSORIES",
  "SUSTAINABILITY",
  "NEW ARRIVALS",
  "STYLE TIPS",
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">
      {label}
    </label>
    {children}
  </div>
);

const inputCls =
  "w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-blue-500 focus:bg-white focus:outline-none text-sm transition-all";

// ─── Main Component ───────────────────────────────────────────────────────────

const ManageBlog = () => {
  const { blogPosts, addBlogPost, updateBlogPost, deleteBlogPost, resetBlogPosts } =
    useContent();

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<Omit<BlogPost, "id">>(emptyForm());
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openAdd = () => {
    setEditingPost(null);
    setForm(emptyForm());
    setShowForm(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditingPost(post);
    const { id: _id, ...rest } = post;
    setForm(rest);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingPost(null);
    setForm(emptyForm());
  };

  const handleField = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim() || !form.category.trim()) {
      showToast("Title, author and category are required.", "error");
      return;
    }
    if (editingPost) {
      updateBlogPost({ ...form, id: editingPost.id });
      showToast("Post updated successfully!");
    } else {
      addBlogPost(form);
      showToast("Post created successfully!");
    }
    closeForm();
  };

  const handleDelete = (id: number) => {
    deleteBlogPost(id);
    setDeleteConfirm(null);
    showToast("Post deleted.");
  };

  const handleReset = () => {
    resetBlogPosts();
    setResetConfirm(false);
    showToast("Blog posts reset to defaults.");
  };

  const filtered = blogPosts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.author.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-10 pb-20 relative">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-sm font-black uppercase tracking-widest transition-all ${
            toast.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-1">
            Blog Posts
          </h2>
          <p className="text-gray-400 font-medium italic">
            {blogPosts.length} article{blogPosts.length !== 1 ? "s" : ""}{" "}
            published — manage all content shown on the public blog.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => setResetConfirm(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-500 hover:border-red-400 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-all"
          >
            <FaRedo size={11} /> Reset
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-black text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20"
          >
            <FaPlus size={11} /> New Post
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <FaSearch
          size={13}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border-2 border-gray-100 focus:border-blue-500 focus:outline-none text-sm transition-all"
        />
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-12 gap-4 px-8 py-4 border-b border-gray-100 bg-gray-50/60">
          <p className="col-span-1 text-[9px] font-black uppercase tracking-widest text-gray-400">
            Cover
          </p>
          <p className="col-span-4 text-[9px] font-black uppercase tracking-widest text-gray-400">
            Title
          </p>
          <p className="col-span-2 text-[9px] font-black uppercase tracking-widest text-gray-400">
            Category
          </p>
          <p className="col-span-2 text-[9px] font-black uppercase tracking-widest text-gray-400">
            Author
          </p>
          <p className="col-span-2 text-[9px] font-black uppercase tracking-widest text-gray-400">
            Date
          </p>
          <p className="col-span-1 text-[9px] font-black uppercase tracking-widest text-gray-400 text-right">
            Actions
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <FaNewspaper size={36} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-black uppercase tracking-widest text-xs">
              No posts found.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((post) => (
              <div
                key={post.id}
                className="grid grid-cols-12 gap-4 px-8 py-5 items-center hover:bg-gray-50/50 transition-colors group"
              >
                {/* Cover */}
                <div className="col-span-1">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    {post.image ? (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaNewspaper className="text-gray-300" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div className="col-span-4 min-w-0">
                  <p className="text-sm font-black text-gray-900 leading-tight line-clamp-2">
                    {post.title}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">{post.readTime}</p>
                </div>

                {/* Category */}
                <div className="col-span-2">
                  <span className="inline-block text-[9px] font-black uppercase tracking-widest bg-orange-50 text-orange-500 px-2 py-1 rounded-lg">
                    {post.category}
                  </span>
                </div>

                {/* Author */}
                <div className="col-span-2">
                  <p className="text-xs font-bold text-gray-700">{post.author}</p>
                </div>

                {/* Date */}
                <div className="col-span-2">
                  <p className="text-xs text-gray-400 font-medium">{post.date}</p>
                </div>

                {/* Actions */}
                <div className="col-span-1 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(post)}
                    title="Edit post"
                    className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all"
                  >
                    <FaEdit size={12} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(post.id)}
                    title="Delete post"
                    className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Slide-in Form Panel ──────────────────────────────────────────── */}
      {showForm && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={closeForm}
          />
          {/* Panel */}
          <div className="fixed right-0 top-0 h-full w-full max-w-xl bg-white z-50 shadow-2xl overflow-y-auto flex flex-col">
            {/* Panel header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter text-gray-900">
                  {editingPost ? "Edit Post" : "New Post"}
                </h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                  {editingPost
                    ? "Update the blog article details below"
                    : "Fill in the details for the new article"}
                </p>
              </div>
              <button
                onClick={closeForm}
                className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all"
              >
                <FaTimes size={14} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="flex-1 px-8 py-8 space-y-6">
              <Field label="Post Title *">
                <input
                  name="title"
                  value={form.title}
                  onChange={handleField}
                  required
                  placeholder="e.g. Top 5 Style Tips for 2026"
                  className={inputCls}
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Author *">
                  <input
                    name="author"
                    value={form.author}
                    onChange={handleField}
                    required
                    placeholder="e.g. Amara Diallo"
                    className={inputCls}
                  />
                </Field>
                <Field label="Read Time">
                  <input
                    name="readTime"
                    value={form.readTime}
                    onChange={handleField}
                    placeholder="e.g. 5 min read"
                    className={inputCls}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Category *">
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleField}
                    required
                    className={inputCls}
                  >
                    <option value="" disabled>
                      Select…
                    </option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Publish Date">
                  <input
                    name="date"
                    value={form.date}
                    onChange={handleField}
                    placeholder="e.g. September 16, 2026"
                    className={inputCls}
                  />
                </Field>
              </div>

              <Field label="Cover Image URL">
                <input
                  name="image"
                  type="url"
                  value={form.image}
                  onChange={handleField}
                  placeholder="https://..."
                  className={inputCls}
                />
                {form.image && (
                  <div className="mt-2 aspect-video rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={form.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) =>
                        ((e.target as HTMLImageElement).style.display = "none")
                      }
                    />
                  </div>
                )}
              </Field>

              <Field label="Excerpt *">
                <textarea
                  name="excerpt"
                  value={form.excerpt}
                  onChange={handleField}
                  required
                  rows={3}
                  placeholder="A short summary shown on the blog listing (1–2 sentences)..."
                  className={`${inputCls} resize-none`}
                />
              </Field>

              <Field label="Full Article Content">
                <textarea
                  name="content"
                  value={form.content ?? ""}
                  onChange={handleField}
                  rows={10}
                  placeholder="Write the full article here. Separate paragraphs with a blank line..."
                  className={`${inputCls} resize-y`}
                />
                <p className="text-[10px] text-gray-400 mt-1 font-medium">
                  Shown in the 'Continue Reading' modal on the public blog. Leave blank to show excerpt only.
                </p>
              </Field>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-100 sticky bottom-0 bg-white pb-2">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all"
                >
                  <FaSave size={13} />
                  {editingPost ? "Update Post" : "Publish Post"}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border-2 border-gray-200 text-gray-600 font-black uppercase tracking-widest text-xs hover:border-gray-400 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* ── Delete Confirm Modal ─────────────────────────────────────────── */}
      {deleteConfirm !== null && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-3xl p-10 max-w-sm w-full shadow-2xl text-center space-y-6">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto">
                <FaExclamationTriangle className="text-red-500 text-2xl" />
              </div>
              <div>
                <h4 className="text-xl font-black uppercase tracking-tight text-gray-900">
                  Delete Post?
                </h4>
                <p className="text-sm text-gray-400 mt-2 font-medium">
                  This action cannot be undone. The post will be permanently
                  removed from the blog.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white font-black uppercase tracking-widest text-xs hover:bg-red-600 transition-all"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-black uppercase tracking-widest text-xs hover:border-gray-400 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Reset Confirm Modal ──────────────────────────────────────────── */}
      {resetConfirm && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-3xl p-10 max-w-sm w-full shadow-2xl text-center space-y-6">
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto">
                <FaRedo className="text-orange-500 text-2xl" />
              </div>
              <div>
                <h4 className="text-xl font-black uppercase tracking-tight text-gray-900">
                  Reset to Defaults?
                </h4>
                <p className="text-sm text-gray-400 mt-2 font-medium">
                  All custom posts will be lost and the original 6 articles will
                  be restored.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 rounded-xl bg-orange-500 text-white font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition-all"
                >
                  Yes, Reset
                </button>
                <button
                  onClick={() => setResetConfirm(false)}
                  className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-black uppercase tracking-widest text-xs hover:border-gray-400 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageBlog;
