import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PageHeader from "../components/header/PageHeader";
import ShopFilters from "../components/shop/ShopFilters";
import ProductGrid from "../components/shop/ProductGrid";
import { FaFilter, FaTimes } from "react-icons/fa";

export interface Filters {
  category: string | null;
  price: number;
  color: string | null;
  size: string | null;
  rating: number | null;
  search?: string;
}

const Shop = () => {
  const [searchParams] = useSearchParams();

  const [filters, setFilters] = useState<Filters>({
    category: searchParams.get("category") || null,
    price: 2000,
    color: null,
    size: null,
    rating: null,
    search: searchParams.get("search") || undefined,
  });

  // Update filters when search params change
  useEffect(() => {
    const search = searchParams.get("search");
    const category = searchParams.get("category");

    if (search || category) {
      setFilters(prev => ({
        ...prev,
        search: search || undefined,
        category: category || null,
      }));
    }
  }, [searchParams]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <PageHeader title="Our Shop" />

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
        <div className="flex flex-col lg:flex-row gap-12 relative">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex justify-between items-center mb-6">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all"
            >
              <FaFilter size={12} />
              Filters
            </button>
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Filter Products
            </div>
          </div>

          {/* Sidebar Drawer for Mobile / Aside for Desktop */}
          <aside className={`
            fixed inset-0 z-[100] bg-white transition-transform duration-500 ease-in-out transform shadow-2xl p-8 overflow-y-auto
            lg:relative lg:translate-x-0 lg:shadow-none lg:p-0 lg:z-10 lg:w-64 lg:block lg:bg-transparent
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            <div className="lg:hidden flex justify-between items-center mb-8 border-b pb-4">
              <h2 className="text-xl font-black uppercase tracking-tighter">Shop Filters</h2>
              <button onClick={() => setIsSidebarOpen(false)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                <FaTimes />
              </button>
            </div>

            <div className="sticky top-32">
              <ShopFilters filters={filters} setFilters={setFilters} />

              {/* Apply Button for Mobile */}
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="w-full mt-8 lg:hidden bg-orange-500 text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest"
              >
                Apply Filters
              </button>
            </div>
          </aside>

          {/* Overlay for Mobile Sidebar */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-[90] lg:hidden backdrop-blur-sm"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          <section className="flex-1">
            <ProductGrid filters={filters} />
          </section>
        </div>
      </div>
    </>
  );
};

export default Shop;
