import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import client from "../../../api/client";

interface Category {
  id: string;
  name: string;
  description?: string;
}

const ShopByCategory = () => {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await client.get("/categories/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleMouseEnter = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => setOpen(false), 200);
  };

  const handleCategoryClick = () => {
    setOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3 border-r border-gray-300 pr-8">
        <span className="tracking-widest text-gray-400">LOADING...</span>
      </div>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* TRIGGER */}
      <div className="flex items-center gap-3 border-r border-gray-300 pr-8 cursor-pointer group">
        <span className="tracking-widest group-hover:text-blue-600 transition-colors">SHOP BY CATEGORY</span>
        <i className={`fa-solid fa-bars text-sm transition-transform duration-300 ${open ? 'rotate-90' : ''}`}></i>
      </div>

      {/* DROPDOWN MENU */}
      <div
        className={`
          absolute left-0 top-full mt-0 w-64 bg-white
          border border-gray-200 shadow-2xl rounded-b-lg overflow-hidden
          transition-all duration-300 ease-out z-50
          ${open ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-4 invisible"}
        `}
      >
        <div className="py-2">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                onClick={handleCategoryClick}
                className="
                  flex items-center px-6 py-4 text-xs font-bold uppercase tracking-widest
                  text-gray-700 hover:bg-blue-600 hover:text-white transition-all duration-200
                "
              >
                {cat.name}
              </Link>
            ))
          ) : (
            <div className="px-6 py-4 text-xs text-gray-400 italic">No categories found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopByCategory;
