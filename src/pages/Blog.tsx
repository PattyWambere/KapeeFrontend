import { useState, useEffect } from "react";
import { useContent } from "../context/ContentContext";
import type { BlogPost } from "../api/content.service";
import {
  FaCalendarAlt,
  FaUser,
  FaSearch,
  FaClock,
  FaNewspaper,
  FaTimes,
  FaChevronRight,
} from "react-icons/fa";

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Render plain-text content where blank lines become paragraph breaks */
const renderContent = (text: string) =>
  text
    .split(/\n\n+/)
    .map((para, i) => (
      <p key={i} className="text-gray-600 leading-relaxed text-sm md:text-base">
        {para.trim()}
      </p>
    ));

// ── Post Modal ─────────────────────────────────────────────────────────────────

const PostModal = ({
  post,
  onClose,
}: {
  post: BlogPost;
  onClose: () => void;
}) => {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const body = post.content?.trim() || post.excerpt;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={post.title}
        className="fixed inset-0 z-50 flex items-start justify-center px-4 py-8 md:py-12 overflow-y-auto"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Hero image */}
          {post.image && (
            <div className="aspect-[16/7] rounded-t-3xl overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Body */}
          <div className="p-6 md:p-10 space-y-6">
            {/* Category + close */}
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-orange-50 text-orange-500 border border-orange-100">
                {post.category}
              </span>
              <button
                onClick={onClose}
                aria-label="Close article"
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-gray-500 transition"
              >
                <FaTimes size={12} />
              </button>
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
              {post.title}
            </h2>

            {/* Meta */}
            <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 pb-6 border-b border-gray-100">
              <span className="flex items-center gap-1.5">
                <FaUser size={9} className="text-blue-400" />
                {post.author}
              </span>
              <span className="flex items-center gap-1.5">
                <FaCalendarAlt size={9} className="text-orange-400" />
                {post.date}
              </span>
              {post.readTime && (
                <span className="flex items-center gap-1.5">
                  <FaClock size={9} className="text-green-400" />
                  {post.readTime}
                </span>
              )}
            </div>

            {/* Content */}
            <div className="space-y-4">{renderContent(body)}</div>

            {/* Close button */}
            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={onClose}
                className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition flex items-center gap-1.5"
              >
                <FaTimes size={10} />
                Close Article
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ── Blog Page ──────────────────────────────────────────────────────────────────

const Blog = () => {
  const { blogPosts } = useContent();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [openPost, setOpenPost] = useState<BlogPost | null>(null);

  // Derive unique categories from posts
  const categories = [
    "ALL",
    ...Array.from(new Set(blogPosts.map((p) => p.category))),
  ];

  // Filter posts by search + category
  const filteredPosts = blogPosts.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === "ALL" || p.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  // A post has readable content when its content or excerpt is long enough
  const hasContent = (post: BlogPost) =>
    (post.content?.trim().length ?? 0) > 0 || post.excerpt.length > 120;

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* ── Page Header ── */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-14 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-3">
            Our Journal
          </p>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-gray-900 mb-4">
            Style Blog
          </h1>
          <p className="text-gray-400 text-sm font-medium max-w-md mx-auto">
            Fashion tips, trend reports, and style inspiration — updated by our team.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* ── Search + Category Filters ── */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 items-start md:items-center justify-between">
          {/* Search */}
          <div className="relative w-full md:w-72">
            <input
              id="blog-search"
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:border-orange-400 focus:outline-none text-sm bg-gray-50 focus:bg-white transition"
            />
            <FaSearch
              size={13}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── Result count ── */}
        {(searchQuery || activeCategory !== "ALL") && (
          <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-6">
            {filteredPosts.length} article{filteredPosts.length !== 1 ? "s" : ""} found
            {searchQuery && (
              <>
                {" "}for "
                <span className="text-orange-500">{searchQuery}</span>"
              </>
            )}
          </p>
        )}

        {/* ── Posts Grid ── */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                  {post.image ? (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaNewspaper size={32} className="text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-5 gap-3">
                  {/* Category badge */}
                  <span className="self-start text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-orange-50 text-orange-500 border border-orange-100">
                    {post.category}
                  </span>

                  {/* Title */}
                  <h2 className="text-base font-black text-gray-900 leading-snug line-clamp-2">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>

                  {/* Continue Reading — only when there's content worth showing */}
                  {hasContent(post) && (
                    <button
                      onClick={() => setOpenPost(post)}
                      className="self-start inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-orange-500 hover:text-orange-600 transition-colors group/btn mt-1"
                    >
                      Continue Reading
                      <FaChevronRight
                        size={8}
                        className="group-hover/btn:translate-x-0.5 transition-transform"
                      />
                    </button>
                  )}

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-100 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <FaUser size={9} className="text-blue-400" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FaCalendarAlt size={9} className="text-orange-400" />
                      {post.date}
                    </span>
                    {post.readTime && (
                      <span className="flex items-center gap-1.5">
                        <FaClock size={9} className="text-green-400" />
                        {post.readTime}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* ── Empty state ── */
          <div className="text-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-sm mb-6">
              <FaNewspaper size={28} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tighter text-gray-400 mb-2">
              No Articles Found
            </h3>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6">
              {searchQuery
                ? `No results for "${searchQuery}"`
                : "No posts in this category yet"}
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("ALL");
              }}
              className="text-[10px] font-black uppercase tracking-widest text-orange-500 border-b-2 border-orange-500 pb-0.5 hover:text-orange-600 transition"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* ── Post Modal ── */}
      {openPost && (
        <PostModal post={openPost} onClose={() => setOpenPost(null)} />
      )}
    </div>
  );
};

export default Blog;
