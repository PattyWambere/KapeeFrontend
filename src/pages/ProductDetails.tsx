import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaStar,
  FaHeart,
  FaRegHeart,
  FaMinus,
  FaPlus,
  FaShareAlt,
  FaChevronLeft,
  FaUndo,
  FaHandHoldingUsd,
  FaShippingFast,
  FaRulerHorizontal,
  FaExchangeAlt,
  FaQuestionCircle,
} from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/shop/ProductCard";
import client from "../api/client";

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
  numReviews: number;
}

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<string>("");
  const [userRating, setUserRating] = useState(0);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [ratingMessage, setRatingMessage] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [timeLeft, setTimeLeft] = useState({
    days: 337,
    hrs: 15,
    mins: 45,
    secs: 2,
  });

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        // Fetch current product
        const response = await client.get(`/products/productsById/${id}`);
        const prodData = response.data;
        setProduct(prodData);
        setMainImage(
          prodData.images && prodData.images.length > 0
            ? prodData.images[0]
            : "/images/placeholder.png",
        );
        setSelectedColor(
          prodData.colors && prodData.colors.length > 0
            ? prodData.colors[0]
            : null,
        );
        setSelectedSize(
          prodData.sizes && prodData.sizes.length > 0
            ? prodData.sizes[0]
            : null,
        );

        // Fetch all products to filter for related products
        const allResponse = await client.get("/products/products");
        const allProducts = allResponse.data;
        const related = allProducts
          .filter(
            (p: Product) =>
              p.categoryId === response.data.categoryId && p.id !== id,
          )
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductData();
    }
  }, [id]);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hrs > 0)
          return { ...prev, hrs: prev.hrs - 1, mins: 59, secs: 59 };
        if (prev.days > 0)
          return { ...prev, days: prev.days - 1, hrs: 23, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <div className="text-center">
          <div className="inline-block p-10 rounded-full bg-gray-50 shadow-sm mb-6">
            <FaExchangeAlt size={40} className="text-gray-300 animate-spin" />
          </div>
          <h3 className="text-xl font-black uppercase tracking-tighter text-gray-400">
            Loading Product...
          </h3>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-40">
        <div className="inline-block p-10 rounded-full bg-red-50 shadow-sm mb-6">
          <FaQuestionCircle size={40} className="text-red-300" />
        </div>
        <h3 className="text-2xl font-black uppercase tracking-tighter text-red-400">
          Product not found
        </h3>
        <Link
          to="/shop"
          className="mt-6 inline-block text-blue-600 font-bold border-b-2 border-blue-600 uppercase tracking-widest text-xs hover:text-orange-500 hover:border-orange-500 transition-all"
        >
          Back to shop
        </Link>
      </div>
    );
  }

  const liked = isInWishlist(product.id);

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100 sticky top-[80px] bg-white z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between text-[11px] md:text-[13px] text-gray-500 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <div className="flex items-center gap-2">
            <Link to="/" className="hover:text-orange-500">
              Home
            </Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-orange-500">
              Shop
            </Link>
            <span>/</span>
            <span className="text-gray-400 truncate max-w-[300px]">
              {product.name}
            </span>
          </div>
          <div className="flex items-center gap-4 ml-4">
            <FaShareAlt className="cursor-pointer hover:text-orange-500" />
            <FaChevronLeft className="cursor-pointer hover:text-orange-500" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 mb-16">
          {/* Image Section */}
          <div className="lg:col-span-6 flex flex-col md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="hidden md:flex flex-col gap-4 w-20">
              {product.images.map((img, i) => (
                <div
                  key={i}
                  onMouseEnter={() => setMainImage(img)}
                  onClick={() => setMainImage(img)}
                  className={`border rounded overflow-hidden cursor-pointer transition-all shrink-0 ${mainImage === img ? "border-orange-500 ring-2 ring-orange-500/20" : "border-gray-100 hover:border-gray-300"}`}
                >
                  <img src={img} alt="" className="w-full h-20 object-cover" />
                </div>
              ))}
            </div>
            {/* Main Image */}
            <div className="relative flex-1">
              <div className="overflow-hidden bg-gray-50 rounded-lg shadow-sm border border-gray-100 h-full">
                <img
                  src={mainImage || "/images/placeholder.png"}
                  alt={product.name}
                  className="w-full h-[400px] md:h-[600px] object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-2 leading-tight uppercase tracking-tight">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-6 md:mb-4">
              <div className="flex bg-green-600 text-white text-[10px] px-2 py-1 rounded-sm items-center gap-1 font-bold">
                {(product.rating || 0).toFixed(1)} <FaStar size={8} />
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {product.numReviews || 0} Reviews
              </span>
              <div className="hidden sm:block h-4 w-[1px] bg-gray-200 mx-1"></div>
              {/* Countdown Timer */}
              <div className="flex items-center gap-2 md:gap-3">
                {[
                  { label: "Days", val: timeLeft.days },
                  { label: "Hrs", val: timeLeft.hrs },
                  { label: "Mins", val: timeLeft.mins },
                  { label: "Secs", val: timeLeft.secs },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-center border border-gray-100 px-2 py-1 min-w-[38px] md:min-w-[45px] rounded bg-gray-50/50"
                  >
                    <span className="text-blue-600 font-bold text-sm md:text-lg leading-none">
                      {String(item.val).padStart(2, "0")}
                    </span>
                    <span className="text-[8px] md:text-[10px] text-gray-400 uppercase font-bold mt-0.5">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl md:text-3xl font-black text-gray-900">
                ${product.price.toFixed(2)}
              </div>
              <span className="text-lg text-gray-300 line-through">
                ${(product.price * 1.2).toFixed(2)}
              </span>
              <span className="text-[10px] font-bold text-white bg-blue-600 px-2 py-1 rounded-sm uppercase tracking-widest">
                20% Off
              </span>
            </div>

            <div
              className={`text-[10px] font-black uppercase tracking-widest mb-8 ${product.inStock ? "text-green-600" : "text-red-500"}`}
            >
              {product.inStock
                ? `In Stock • Ready to ship (${product.quantity} available)`
                : "Out of Stock"}
            </div>

            {/* Offers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {[
                {
                  icon: <FaUndo />,
                  text: "Special Price: Get extra 10% off",
                  color: "text-green-600",
                },
                {
                  icon: <FaHandHoldingUsd />,
                  text: "Bank Offer: 10% Instant Discount",
                  color: "text-blue-600",
                },
                {
                  icon: <FaShippingFast />,
                  text: "No cost EMI: Starting at $49/mo",
                  color: "text-orange-600",
                },
              ].map((offer, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 border border-dashed border-gray-200 rounded-lg group hover:border-gray-300 transition-colors"
                >
                  <span className={`${offer.color} text-lg`}>{offer.icon}</span>
                  <span className="text-[11px] font-bold text-gray-600 uppercase leading-snug">
                    {offer.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Services & Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 text-[12px] bg-gray-50 p-6 rounded-xl border border-gray-100">
              <div>
                <span className="block font-black text-gray-900 mb-4 uppercase tracking-[0.2em] text-[10px]">
                  Services:
                </span>
                <ul className="space-y-3 text-gray-600 font-medium">
                  <li className="flex items-center gap-3">
                    <FaQuestionCircle className="text-blue-600" size={12} /> 30
                    Day Return Policy
                  </li>
                  <li className="flex items-center gap-3">
                    <FaQuestionCircle className="text-blue-600" size={12} />{" "}
                    Cash on Delivery available
                  </li>
                  <li className="flex items-center gap-3">
                    <FaQuestionCircle className="text-blue-600" size={12} />{" "}
                    Free Delivery on $99+
                  </li>
                </ul>
              </div>
              <div className="border-t sm:border-t-0 sm:border-l border-gray-200 pt-6 sm:pt-0 sm:pl-6">
                <span className="block font-black text-gray-900 mb-4 uppercase tracking-[0.2em] text-[10px]">
                  Highlights:
                </span>
                <ul className="space-y-3 text-gray-600 font-medium">
                  <li className="flex items-center gap-3">• Premium Design.</li>
                  <li className="flex items-center gap-3">
                    • 100% Quality Materials.
                  </li>
                  <li className="flex items-center gap-3">
                    • Perfect Fit Guaranteed.
                  </li>
                </ul>
              </div>
            </div>

            {/* Options Selector */}
            <div className="space-y-10 mb-10 border-t border-gray-100 pt-8">
              {product.colors && product.colors.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-12">
                  <span className="w-20 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    Select Color
                  </span>
                  <div className="flex gap-4">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border-2 p-0.5 transition-all duration-300 transform hover:scale-110 ${selectedColor === color ? "border-blue-600 ring-2 ring-blue-600/20" : "border-transparent"}`}
                      >
                        <div
                          className="w-full h-full rounded-full shadow-inner border border-black/5"
                          style={{ backgroundColor: color }}
                        ></div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {product.sizes && product.sizes.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-12">
                  <span className="w-20 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    Select Size
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`h-11 min-w-[44px] px-4 rounded border-2 text-xs font-black transition-all duration-300 uppercase tracking-widest ${selectedSize === size ? "border-orange-500 bg-orange-500 text-white shadow-lg" : "border-gray-100 text-gray-400 hover:border-gray-200"}`}
                      >
                        {size}
                      </button>
                    ))}
                    {selectedSize && (
                      <button
                        className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors ml-2"
                        onClick={() => setSelectedSize(null)}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cart Actions */}
            <div className="mb-12 border-b border-gray-100 pb-12">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="flex items-center border-2 border-gray-100 rounded-lg bg-white h-14">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-14 h-full text-gray-400 hover:text-black hover:bg-gray-50 transition border-r-2 border-gray-100 disabled:opacity-30"
                    disabled={quantity <= 1}
                  >
                    <FaMinus size={12} />
                  </button>
                  <span className="w-14 text-center font-black text-gray-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-14 h-full text-gray-400 hover:text-black hover:bg-gray-50 transition border-l-2 border-gray-100"
                  >
                    <FaPlus size={12} />
                  </button>
                </div>
                <button
                  onClick={() =>
                    addToCart(
                      {
                        ...product,
                        title: product.name,
                        image: product.images[0],
                      },
                      quantity,
                    )
                  }
                  className="flex-1 bg-yellow-500 text-white font-black text-xs uppercase tracking-[0.2em] rounded-lg h-14 hover:bg-blue-600 transition-all duration-300 shadow-xl hover:shadow-blue-600/20 active:scale-[0.98]"
                >
                  Add To Cart
                </button>
                <button className="flex-1 bg-orange-500 text-white font-black text-xs uppercase tracking-[0.2em] rounded-lg h-14 hover:opacity-90 transition-all duration-300 shadow-xl active:scale-[0.98]">
                  Buy It Now
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-12">
              <button
                onClick={() =>
                  toggleWishlist({
                    ...product,
                    title: product.name,
                    image: product.images[0],
                  })
                }
                className="flex items-center gap-3 hover:text-orange-500 transition"
              >
                {liked ? (
                  <FaHeart className="text-red-500 text-sm" />
                ) : (
                  <FaRegHeart className="text-sm" />
                )}{" "}
                Add to Wishlist
              </button>
              <button className="flex items-center gap-3 hover:text-orange-500 transition">
                <FaRulerHorizontal className="text-sm" /> Size Guide
              </button>
              <button className="flex items-center gap-3 hover:text-orange-500 transition">
                <FaExchangeAlt className="text-sm" /> Contrast
              </button>
            </div>

            {/* Trust Bar */}
            <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100 relative shadow-sm">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white border border-gray-100 px-6 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
                Guaranteed Safe Checkout
              </div>
              <div className="flex flex-wrap justify-center gap-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                <div className="font-bold text-blue-900 text-lg uppercase tracking-tighter italic">
                  PayPal
                </div>
                <div className="font-bold text-blue-700 text-lg tracking-tighter">
                  VISA
                </div>
                <div className="font-bold text-red-600 text-lg tracking-tighter">
                  Mastercard
                </div>
                <div className="font-bold text-blue-500 text-lg tracking-tighter">
                  AMEX
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-20">
          <div className="flex gap-8 md:gap-12 border-b border-gray-100 mb-10 overflow-x-auto whitespace-nowrap scrollbar-hide">
            {["Description", "Additional information", "Reviews (0)"].map(
              (tab) => {
                const tabKey = tab.split(" ")[0].toLowerCase();
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tabKey)}
                    className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tabKey
                        ? "text-gray-900 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-orange-500"
                        : "text-gray-400 hover:text-gray-900"
                      }`}
                  >
                    {tab}
                  </button>
                );
              },
            )}
          </div>

          <div className="max-w-4xl mx-auto text-gray-500 text-sm md:text-base leading-loose font-medium px-4">
            {activeTab === "description" && (
              <div className="space-y-6">
                <p className="text-center italic">
                  {product.description ||
                    "Elevate your casual wardrobe with our premium selection. Crafted from fine materials, this piece offers a perfect blend of comfort and style. Ideal for all-day wear, featuring a refined fit that stays true to size."}
                </p>
              </div>
            )}
            {activeTab === "additional" && (
              <div className="max-w-2xl mx-auto">
                <div className="grid grid-cols-2 border border-gray-100 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-4 font-black uppercase text-[10px] tracking-widest text-gray-900 border-r border-b border-gray-100">
                    Weight
                  </div>
                  <div className="p-4 text-xs font-semibold text-gray-500 border-b border-gray-100">
                    0.5 kg
                  </div>
                  <div className="bg-gray-50 p-4 font-black uppercase text-[10px] tracking-widest text-gray-900 border-r border-gray-100">
                    Dimensions
                  </div>
                  <div className="p-4 text-xs font-semibold text-gray-500">
                    25 × 30 × 5 cm
                  </div>
                </div>
              </div>
            )}
            {activeTab === "reviews" && (
              <div className="max-w-2xl mx-auto space-y-12">
                <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                  <h4 className="text-sm font-black text-gray-900 mb-2 uppercase tracking-widest">
                    Rate this Product
                  </h4>
                  <div className="flex justify-center gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onMouseEnter={() =>
                          !isSubmittingRating && setUserRating(star)
                        }
                        onClick={() => setUserRating(star)}
                        className={`transition-all duration-300 transform ${userRating >= star ? "text-orange-500 scale-125" : "text-gray-300 hover:scale-110"}`}
                      >
                        <FaStar size={32} />
                      </button>
                    ))}
                  </div>
                  <p className="text-gray-400 italic text-sm mb-8">
                    {userRating > 0
                      ? `Selected ${userRating} stars`
                      : "Click to select your rating"}
                  </p>

                  {ratingMessage && (
                    <p
                      className={`text-xs font-bold uppercase tracking-widest mb-6 ${ratingMessage.includes("success") ? "text-green-600" : "text-red-500"}`}
                    >
                      {ratingMessage}
                    </p>
                  )}

                  <button
                    onClick={async () => {
                      if (userRating === 0 || isSubmittingRating) return;
                      try {
                        setIsSubmittingRating(true);
                        const response = await client.post(
                          `/products/rateProduct/${product.id}`,
                          { rating: userRating },
                        );
                        setRatingMessage("Rating submitted successfully!");
                        // Update local product state
                        setProduct((prev) =>
                          prev
                            ? {
                              ...prev,
                              rating: response.data.newRating,
                              numReviews: response.data.numReviews,
                            }
                            : null,
                        );
                      } catch (err) {
                        console.error("Failed to submit rating:", err);
                        setRatingMessage(
                          "Failed to submit rating. Please try again.",
                        );
                      } finally {
                        setIsSubmittingRating(false);
                      }
                    }}
                    disabled={userRating === 0 || isSubmittingRating}
                    className={`px-10 py-4 font-black text-[10px] uppercase tracking-[0.2em] rounded-full transition-all duration-300 ${userRating === 0 || isSubmittingRating ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-black text-white hover:bg-orange-500 shadow-xl shadow-black/10"}`}
                  >
                    {isSubmittingRating ? "Submitting..." : "Submit Review"}
                  </button>
                </div>

                <div className="text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-2">
                    Total Reviews
                  </p>
                  <div className="text-3xl font-black text-gray-900 mb-1">
                    {product.numReviews || 0}
                  </div>
                  <div className="flex justify-center text-orange-500 gap-1">
                    {[1, 2, 3, 4, 5].map((st) => (
                      <FaStar
                        key={st}
                        size={12}
                        className={
                          product.rating >= st ? "opacity-100" : "opacity-20"
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="border-t border-gray-100 pt-20 pb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter mb-2">
              You May Also Like
            </h2>
            <div className="w-12 h-1 bg-orange-500 mx-auto"></div>
          </div>
          {relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
              {relatedProducts.map((related) => (
                <ProductCard key={related.id} product={related as any} categoryName="" />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-400 italic">No related products found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
