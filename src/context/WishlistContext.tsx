import { createContext, useContext, useState } from "react";

// Support both old static products and new API products
interface WishlistProduct {
  id: string | number;
  [key: string]: any;
}

interface WishlistContextType {
  wishlist: WishlistProduct[];
  toggleWishlist: (product: WishlistProduct) => void;
  isInWishlist: (id: string | number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlist, setWishlist] = useState<WishlistProduct[]>([]);

  const toggleWishlist = (product: WishlistProduct) => {
    setWishlist((prev) =>
      prev.find((item) => item.id === product.id)
        ? prev.filter((item) => item.id !== product.id)
        : [...prev, product]
    );
  };

  const isInWishlist = (id: string | number) =>
    wishlist.some((item) => item.id === id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used inside WishlistProvider");
  return context;
};
