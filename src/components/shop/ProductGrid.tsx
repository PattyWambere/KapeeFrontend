import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { FaTh, FaList, FaChevronDown } from "react-icons/fa";
import type { Filters } from "../../pages/Shop";
import client from "../../api/client";

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  categoryId: string;
  inStock: boolean;
  quantity: number;
  images: string[];
  colors: string[];
  sizes: string[];
  rating: number;
}

const ProductGrid = ({ filters }: { filters: Filters }) => {
  const [sort, setSort] = useState("default");
  const [perPage, setPerPage] = useState(12);
  const [gridView, setGridView] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products and categories from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          client.get("/products/products"),
          client.get("/categories/categories")
        ]);

        setProducts(prodRes.data);

        // Create a map of ID -> Name
        const catMap: { [key: string]: string } = {};
        catRes.data.forEach((c: any) => {
          catMap[c.id] = c.name;
        });
        setCategories(catMap);

        setError(null);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters
  let filteredProducts = products.filter((product) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.categoryId.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;
    }

    // Category filter
    if (filters.category) {
      if (product.categoryId !== filters.category) return false;
    }

    if (filters.price && product.price > filters.price) return false;

    // Color filter
    if (filters.color) {
      if (!product.colors || !product.colors.includes(filters.color))
        return false;
    }

    // Size filter
    if (filters.size) {
      if (!product.sizes || !product.sizes.includes(filters.size)) return false;
    }

    // Rating filter
    if (filters.rating) {
      if (product.rating < filters.rating) return false;
    }

    return true;
  });

  // Apply sorting
  filteredProducts = [...filteredProducts].sort((a, b) => {
    if (sort === "low-high") return a.price - b.price;
    if (sort === "high-low") return b.price - a.price;
    if (sort === "name-az") return a.name.localeCompare(b.name);
    if (sort === "name-za") return b.name.localeCompare(a.name);
    return 0; // default
  });

  // Limit products per page
  const displayedProducts = filteredProducts.slice(0, perPage);

  // Loading state
  if (loading) {
    return (
      <div className="py-32 text-center">
        <div className="inline-block p-10 rounded-full bg-gray-50 shadow-sm mb-6">
          <FaTh size={40} className="text-gray-300 animate-pulse" />
        </div>
        <h3 className="text-xl font-black uppercase tracking-tighter text-gray-400">
          Loading Products...
        </h3>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-32 text-center bg-red-50 rounded-3xl border border-red-200">
        <div className="inline-block p-10 rounded-full bg-white shadow-sm mb-6">
          <FaTh size={40} className="text-red-300" />
        </div>
        <h3 className="text-2xl font-black uppercase tracking-tighter text-red-400">
          {error}
        </h3>
        <p className="text-xs font-bold uppercase tracking-widest text-red-300 mt-2">
          Please try again later
        </p>
      </div>
    );
  }

  return (
    <>
      {/* TOP BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10 pb-6 border-b border-gray-100 gap-6">
        <div className="flex items-center gap-6 self-start md:self-auto">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            <span className="text-gray-900">{displayedProducts.length}</span> of{" "}
            {filteredProducts.length} Products
          </p>
          {/* View Switcher */}
          <div className="hidden md:flex items-center gap-4 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
            <button
              onClick={() => setGridView(true)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${gridView ? "bg-white shadow-sm text-blue-600" : "text-gray-400 hover:text-gray-900"}`}
            >
              <FaTh size={12} />
            </button>
            <button
              onClick={() => setGridView(false)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${!gridView ? "bg-white shadow-sm text-blue-600" : "text-gray-400 hover:text-gray-900"}`}
            >
              <FaList size={12} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between w-full sm:w-auto gap-4 md:gap-8">
          {/* Show per page */}
          <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-2xl border border-gray-100">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Show:
            </label>
            <select
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
              className="bg-transparent text-[11px] font-black uppercase tracking-widest text-gray-900 focus:outline-none appearance-none cursor-pointer pr-4 relative"
            >
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
            </select>
          </div>

          {/* Sorting */}
          <div className="relative group">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-blue-500 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:outline-none appearance-none cursor-pointer pr-12 shadow-xl shadow-black/10 active:scale-95 transition-all"
            >
              <option value="default">Default Sort</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
              <option value="name-az">Name: A to Z</option>
              <option value="name-za">Name: Z to A</option>
            </select>
            <FaChevronDown
              className="absolute right-5 top-1/2 -translate-y-1/2 text-white pointer-events-none"
              size={10}
            />
          </div>
        </div>
      </div>

      {/* PRODUCTS GRID / LIST */}
      {displayedProducts.length > 0 ? (
        <div
          className={`${gridView
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
            : "flex flex-col gap-6"
            }`}
        >
          {displayedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categoryName={categories[product.categoryId] || product.categoryId}
            />
          ))}
        </div>
      ) : (
        <div className="py-32 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
          <div className="inline-block p-10 rounded-full bg-white shadow-sm mb-6">
            <FaTh size={40} className="text-gray-200" />
          </div>
          {filters.category ? (
            <>
              <h3 className="text-2xl font-black uppercase tracking-tighter text-gray-300">
                Products Coming Soon!
              </h3>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-2">
                {filters.category} products will be available soon
              </p>
            </>
          ) : (
            <>
              <h3 className="text-2xl font-black uppercase tracking-tighter text-gray-300">
                No Products Found
              </h3>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-2">
                Try adjusting your filters
              </p>
            </>
          )}
        </div>
      )}

      {/* Pagination Placeholder */}
      <div className="mt-20 flex justify-center items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-gray-600 text-white flex items-center justify-center text-[10px] font-black">
          1
        </div>
        <div className="w-10 h-10 rounded-xl bg-white border-2 border-gray-50 text-gray-400 flex items-center justify-center text-[10px] font-black hover:border-gray-900 hover:text-gray-900 transition-all cursor-pointer">
          2
        </div>
        <div className="w-10 h-10 rounded-xl bg-white border-2 border-gray-50 text-gray-400 flex items-center justify-center text-[10px] font-black hover:border-gray-900 hover:text-gray-900 transition-all cursor-pointer">
          3
        </div>
      </div>
    </>
  );
};

export default ProductGrid;
