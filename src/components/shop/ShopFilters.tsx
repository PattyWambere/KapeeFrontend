import { useState, useEffect } from "react";
import { FaChevronDown, FaStar } from "react-icons/fa";
import categoryService, { type Category as ApiCategory } from "../../api/category.service";
import type { Filters } from "../../pages/Shop";

const FilterSection = ({
  title,
  children,
  isOpen: defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 py-6">
      <button
        className="w-full flex justify-between items-center text-[10px] font-black text-gray-900 mb-4 uppercase tracking-[0.2em]"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <span
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        >
          <FaChevronDown size={10} className="text-gray-300" />
        </span>
      </button>

      {isOpen && <div className="mt-2 animate-fadeIn">{children}</div>}
    </div>
  );
};

const ShopFilters = ({
  filters,
  setFilters,
}: {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}) => {
  const [categories, setCategories] = useState<ApiCategory[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div>
      {/* CLEAR FILTERS */}
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xs font-black uppercase tracking-widest text-gray-900">
          Filters
        </h3>
        <button
          onClick={() =>
            setFilters({
              category: null,
              price: 500,
              color: null,
              size: null,
              rating: null,
            })
          }
          className="text-[9px] text-orange-500 font-black uppercase tracking-widest border-b-2 border-transparent hover:border-orange-500 transition-all"
        >
          Reset All
        </button>
      </div>

      {/* PRODUCT CATEGORIES */}
      <FilterSection title="Categories" isOpen>
        <ul className="space-y-3">
          {categories.map((cat) => (
            <li
              key={cat.id}
              onClick={() =>
                setFilters({
                  ...filters,
                  category: cat.id,
                })
              }
              className={`flex items-center justify-between cursor-pointer group px-1`}
            >
              <span
                className={`text-[11px] font-black uppercase tracking-[0.1em] transition-all duration-300 ${filters.category === cat.id
                  ? "text-blue-600 translate-x-1"
                  : "text-gray-400 group-hover:text-gray-900"
                  }`}
              >
                {cat.name}
              </span>
              {filters.category === cat.id && (
                <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
              )}
            </li>
          ))}
        </ul>
      </FilterSection>

      {/* PRICE FILTER */}
      <FilterSection title="Price Range" isOpen>
        <div className="space-y-4 px-1">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Max Price
            </span>
            <span className="text-sm font-black text-gray-900">
              ${filters.price}
            </span>
          </div>

          <input
            type="range"
            min="10"
            max="2000"
            value={filters.price}
            onChange={(e) =>
              setFilters({
                ...filters,
                price: Number(e.target.value),
              })
            }
            className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
          <div className="flex justify-between text-[8px] font-black text-gray-300 uppercase tracking-widest">
            <span>$10</span>
            <span>$2000</span>
          </div>
        </div>
      </FilterSection>

      {/* COLOR FILTER */}
      <FilterSection title="Colors" isOpen>
        <div className="flex flex-wrap gap-3 px-1">
          {[
            { name: "Black", color: "#000000" },
            { name: "White", color: "#FFFFFF" },
            { name: "Blue", color: "#1E88E5" },
            { name: "Red", color: "#D32F2F" },
            { name: "Beige", color: "#F5F5DC" },
            { name: "Green", color: "#388E3C" },
          ].map((c) => (
            <button
              key={c.name}
              onClick={() => setFilters({ ...filters, color: c.color })}
              title={c.name}
              className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-300 border shadow-sm ${filters.color === c.color
                ? "ring-2 ring-blue-600 ring-offset-2 scale-110"
                : "border-gray-100 hover:scale-110"
                }`}
              style={{ backgroundColor: c.color }}
            >
              {filters.color === c.color && (
                <div
                  className={`w-1 h-1 rounded-full ${c.name === "White" || c.name === "Beige" ? "bg-black" : "bg-white"}`}
                ></div>
              )}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* SIZE FILTER */}
      <FilterSection title="Sizes" isOpen>
        <div className="flex flex-wrap gap-2 px-1">
          {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
            <button
              key={size}
              onClick={() => setFilters({ ...filters, size })}
              className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all duration-300 border-2 ${filters.size === size
                ? "bg-black text-white border-black shadow-lg shadow-black/20"
                : "bg-white text-gray-400 border-gray-100 hover:border-gray-900 hover:text-gray-900"
                }`}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* RATING FILTER */}
      <FilterSection title="Customer Rating" isOpen>
        <ul className="space-y-3 px-1">
          {[5, 4, 3, 2].map((stars) => (
            <li
              key={stars}
              onClick={() => setFilters({ ...filters, rating: stars })}
              className={`flex items-center gap-3 cursor-pointer group transition-all ${filters.rating === stars ? "translate-x-1" : ""}`}
            >
              <div className="flex text-orange-400 text-[10px]">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`mr-0.5 ${i < stars ? "text-orange-500" : "text-gray-100"}`}
                  />
                ))}
              </div>
              <span
                className={`text-[10px] font-black uppercase tracking-widest ${filters.rating === stars ? "text-gray-900" : "text-gray-400 group-hover:text-gray-900"}`}
              >
                {stars}.0 & Up
              </span>
            </li>
          ))}
        </ul>
      </FilterSection>

      {/* Help Banner */}
      {/* <div className="mt-12 bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
        <h4 className="text-base font-black uppercase tracking-tighter mb-2 relative z-10">Need Help?</h4>
        <p className="text-[10px] font-bold opacity-80 mb-6 relative z-10 uppercase tracking-widest">Our dessert experts are here for you.</p>
        <button className="bg-white text-blue-600 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest relative z-10 hover:bg-black hover:text-white transition-all">Chat Now</button>
      </div> */}
    </div>
  );
};

export default ShopFilters;
