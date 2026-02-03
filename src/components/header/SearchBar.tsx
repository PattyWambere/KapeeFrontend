import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "../../data/Products";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      // Navigate to shop page with search query
      const params = new URLSearchParams();
      params.set("search", searchQuery.trim());

      if (selectedCategory !== "All Categories") {
        params.set("category", selectedCategory);
      }

      navigate(`/shop?${params.toString()}`);
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
        <option>All Categories</option>
        {categories.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>

      <button type="submit" className="px-5 bg-blue-500 text-white hover:bg-blue-600 transition">
        <i className="fa-solid fa-magnifying-glass"></i>
      </button>
    </form>
  );
};

export default SearchBar;
