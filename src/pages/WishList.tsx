import PageHeader from "../components/header/PageHeader";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/shop/ProductCard";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

const WishList = () => {
  const { wishlist } = useWishlist();

  return (
    <div className="bg-white min-h-screen pb-20">
      <PageHeader title="My Wishlist" />

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        {wishlist.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-100">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-gray-200 mx-auto mb-8 shadow-sm">
              <FaHeart size={32} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-4">Your wishlist is empty</h2>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-12">Save your favorite cakes and treats here!</p>
            <Link
              to="/shop"
              className="inline-block bg-black text-white px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-orange-500 transition-all duration-500 shadow-2xl shadow-black/10"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12">
            {wishlist.map((product) => (
              <ProductCard key={product.id} product={product as any} categoryName="" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishList;
