import { Link } from "react-router-dom";
import { useCompare } from "../context/CompareContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useCurrency } from "../context/CurrencyContext";
import {
  FaExchangeAlt,
  FaStar,
  FaRegStar,
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
  FaTimes,
  FaStore,
} from "react-icons/fa";

// ── helpers ────────────────────────────────────────────────────────────────────

const renderStars = (rating: number) =>
  [1, 2, 3, 4, 5].map((s) =>
    rating >= s ? (
      <FaStar key={s} size={11} className="text-orange-400" />
    ) : (
      <FaRegStar key={s} size={11} className="text-gray-300" />
    )
  );

// ── attribute rows config ──────────────────────────────────────────────────────

const ATTRIBUTES = [
  { key: "price",       label: "Price" },
  { key: "rating",      label: "Rating" },
  { key: "inStock",     label: "Availability" },
  { key: "colors",      label: "Colors" },
  { key: "sizes",       label: "Sizes" },
  { key: "description", label: "Description" },
];

// ── cell renderer ──────────────────────────────────────────────────────────────

const Cell = ({
  attrKey,
  product,
  convertPrice,
}: {
  attrKey: string;
  product: any;
  convertPrice: (p: number) => string;
}) => {
  switch (attrKey) {
    case "price":
      return (
        <span className="text-lg font-black text-gray-900">
          {convertPrice(product.price)}
        </span>
      );

    case "rating":
      return (
        <div className="flex flex-col items-center gap-1">
          <div className="flex gap-0.5">{renderStars(product.rating || 0)}</div>
          <span className="text-[10px] text-gray-400 font-bold">
            {(product.rating || 0).toFixed(1)} ({product.numReviews || 0})
          </span>
        </div>
      );

    case "inStock":
      return product.inStock ? (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-widest border border-green-200">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          In Stock
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest border border-red-200">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          Out of Stock
        </span>
      );

    case "colors": {
      const colors: string[] = product.colors || [];
      return colors.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-2">
          {colors.map((c: string) => (
            <span
              key={c}
              title={c}
              className="w-5 h-5 rounded-full border-2 border-white shadow"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      ) : (
        <span className="text-gray-300 text-xs">—</span>
      );
    }

    case "sizes": {
      const sizes: string[] = product.sizes || [];
      return sizes.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-1">
          {sizes.map((s: string) => (
            <span
              key={s}
              className="px-2 py-0.5 rounded border border-gray-200 text-[10px] font-black uppercase tracking-wider text-gray-600 bg-gray-50"
            >
              {s}
            </span>
          ))}
        </div>
      ) : (
        <span className="text-gray-300 text-xs">—</span>
      );
    }

    case "description":
      return (
        <p className="text-xs text-gray-500 leading-relaxed text-left line-clamp-4">
          {product.description || "No description available."}
        </p>
      );

    default:
      return <span className="text-xs text-gray-500">{product[attrKey] ?? "—"}</span>;
  }
};

// ── Compare page ───────────────────────────────────────────────────────────────

const Compare = () => {
  const { compareList, toggleCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { convertPrice } = useCurrency();

  // ── Empty state ──────────────────────────────────────────────────────────────
  if (compareList.length === 0) {
    return (
      <div className="bg-white min-h-screen pb-24">
        {/* Page header */}
        <div className="border-b border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-4 text-[11px] text-gray-500 flex items-center gap-2">
            <Link to="/" className="hover:text-orange-500">Home</Link>
            <span>/</span>
            <span>Compare</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-32 text-center">
          <div
            className="inline-flex items-center justify-center w-28 h-28 rounded-full mb-8"
            style={{ background: "linear-gradient(135deg, #fff7ed, #fed7aa)" }}
          >
            <FaExchangeAlt size={44} className="text-orange-400" />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-gray-900 mb-3">
            Nothing to Compare
          </h1>
          <p className="text-gray-400 text-[11px] font-black uppercase tracking-[0.2em] mb-10">
            Add products using the compare icon on any product card
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-3 bg-orange-500 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-black transition-all duration-300 shadow-xl shadow-orange-500/20"
          >
            <FaStore size={12} />
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  // ── Comparison table ─────────────────────────────────────────────────────────
  return (
    <div className="bg-white min-h-screen pb-28">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-[11px] text-gray-500 flex items-center gap-2">
            <Link to="/" className="hover:text-orange-500">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-orange-500">Shop</Link>
            <span>/</span>
            <span className="text-gray-900 font-bold">Compare</span>
          </div>
          <button
            onClick={clearCompare}
            className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition flex items-center gap-1.5"
          >
            <FaTimes size={10} />
            Clear All
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Heading */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-gray-900 mb-2">
            Product Comparison
          </h1>
          <div className="flex items-center gap-3">
            <div className="w-12 h-1 bg-orange-500 rounded-full" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              Comparing {compareList.length} products
            </p>
          </div>
        </div>

        {/* Scrollable table wrapper */}
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full min-w-[640px] border-collapse">
            {/* ── Product header row ── */}
            <thead>
              <tr>
                {/* Row-label column */}
                <th className="w-36 md:w-44 bg-gray-50 border-b border-r border-gray-100 p-4" />

                {compareList.map((product) => (
                  <th
                    key={product.id}
                    className="bg-white border-b border-r border-gray-100 p-5 align-top last:border-r-0"
                  >
                    <div className="relative flex flex-col items-center gap-3">
                      {/* Remove button */}
                      <button
                        onClick={() => toggleCompare(product)}
                        title="Remove from compare"
                        className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gray-100 hover:bg-red-500 hover:text-white text-gray-400 flex items-center justify-center transition-all"
                      >
                        <FaTimes size={9} />
                      </button>

                      {/* Thumbnail */}
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 shadow-sm">
                        <img
                          src={product.images?.[0] || "/images/placeholder.png"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Name */}
                      <Link
                        to={`/shop/${product.id}`}
                        className="text-xs font-black uppercase tracking-tight text-gray-900 hover:text-orange-500 transition text-center leading-snug"
                      >
                        {product.name}
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* ── Attribute rows ── */}
            <tbody>
              {ATTRIBUTES.map((attr, rowIdx) => (
                <tr
                  key={attr.key}
                  className={rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50/60"}
                >
                  {/* Row label */}
                  <td className="border-r border-gray-100 px-4 py-4 align-middle">
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-500">
                      {attr.label}
                    </span>
                  </td>

                  {compareList.map((product) => (
                    <td
                      key={product.id}
                      className="border-r border-gray-100 px-4 py-4 text-center align-middle last:border-r-0"
                    >
                      <Cell
                        attrKey={attr.key}
                        product={product}
                        convertPrice={convertPrice}
                      />
                    </td>
                  ))}
                </tr>
              ))}

              {/* ── Action row ── */}
              <tr className="bg-white border-t-2 border-gray-100">
                <td className="border-r border-gray-100 px-4 py-5 align-middle">
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-500">
                    Actions
                  </span>
                </td>

                {compareList.map((product) => {
                  const liked = isInWishlist(product.id);
                  return (
                    <td
                      key={product.id}
                      className="border-r border-gray-100 px-4 py-5 text-center align-middle last:border-r-0"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <button
                          onClick={() =>
                            addToCart(
                              {
                                ...product,
                                title: product.name,
                                image: product.images?.[0],
                                price: product.price,
                              },
                              1,
                            )
                          }
                          disabled={!product.inStock}
                          className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                          style={{
                            background: product.inStock
                              ? "linear-gradient(135deg, #f97316 0%, #ea580c 100%)"
                              : "#e5e7eb",
                            color: product.inStock ? "#fff" : "#9ca3af",
                            boxShadow: product.inStock
                              ? "0 4px 12px rgba(249,115,22,0.3)"
                              : "none",
                          }}
                        >
                          <FaShoppingCart size={10} />
                          Add to Cart
                        </button>

                        <button
                          onClick={() =>
                            toggleWishlist({
                              ...product,
                              title: product.name,
                              image: product.images?.[0],
                            })
                          }
                          className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 border-gray-100 hover:border-orange-300 hover:text-orange-500 transition-all"
                        >
                          {liked ? (
                            <FaHeart size={10} className="text-red-500" />
                          ) : (
                            <FaRegHeart size={10} />
                          )}
                          Wishlist
                        </button>
                      </div>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Compare;
