import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import categoryService, { type Category } from "../../api/category.service";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories for searchbar:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    }

    if (selectedCategory !== "All Categories") {
      params.set("category", selectedCategory);
    }

    // Only navigate if we actually have parameters to search for
    if (searchQuery.trim() || selectedCategory !== "All Categories") {
      navigate(`/shop?${params.toString()}`);
    } else {
      navigate("/shop");
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex bg-white rounded-full overflow-hidden w-full max-w-xl">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for products, categories, brands, sku..."
        className="flex-1 px-4 py-3 outline-none"
      />

      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="px-3 border-l"
      >
        <option value="All Categories">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <button type="submit" className="px-4 md:px-5 bg-blue-500 text-white hover:bg-blue-600 transition whitespace-normal break-words">
        <i className="fa-solid fa-magnifying-glass"></i>
      </button>
    </form>
  );
};

export default SearchBar;
