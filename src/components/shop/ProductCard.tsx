import { FaRegHeart, FaHeart, FaStar, FaRegStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  categoryId: string;
  inStock: boolean;
  quantity: number;
  images: string[];
  rating?: number;
  numReviews?: number;
}

const ProductCard = ({ product, categoryName }: { product: Product; categoryName: string }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const liked = isInWishlist(product.id);

  return (
    <div className="group relative z-0">
      <div className="relative overflow-hidden mb-4 z-0">
        {/* Out of Stock Badge */}
        {!product.inStock && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 uppercase z-10">
            Out of Stock
          </span>
        )}

        {/* Image */}
        <Link to={`/shop/${product.id}`}>
          <img
            src={product.images[0] || "/images/placeholder.png"}
            alt={product.name}
            className="w-full h-[320px] object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product)}
          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md transition hover:bg-orange-500 hover:text-white z-10"
        >
          {liked ? (
            <FaHeart className="text-red-500" size={14} />
          ) : (
            <FaRegHeart size={14} />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="space-y-1">
        <p className="text-xs text-gray-400 uppercase">{categoryName}</p>
        <Link to={`/shop/${product.id}`}>
          <h3 className="font-semibold hover:text-blue-600 transition-colors">{product.name}</h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex text-orange-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star}>
                {(product.rating || 0) >= star ? (
                  <FaStar size={10} />
                ) : (product.rating || 0) >= star - 0.5 ? (
                  <FaStar size={10} className="clip-half" /> /* Note: Simple approach for now */
                ) : (
                  <FaRegStar size={10} />
                )}
              </span>
            ))}
          </div>
          <span className="text-[10px] text-gray-400 ml-1">
            ({product.numReviews || 0})
          </span>
        </div>

        {/* Stock Status */}
        <div className="flex items-center gap-2 text-xs">
          {product.inStock ? (
            <span className="text-green-600 font-medium">In Stock ({product.quantity})</span>
          ) : (
            <span className="text-red-600 font-medium">Out of Stock</span>
          )}
        </div>

        {/* Price */}
        <div className="text-sm font-bold">${product.price.toFixed(2)}</div>
      </div>
    </div>
  );
};

export default ProductCard;
