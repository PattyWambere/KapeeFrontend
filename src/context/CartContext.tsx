import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import client from "../api/client";

// Support both old static products and new API products
export interface CartProduct {
  id: string | number;
  productId?: string; // For API items
  price: number;
  title?: string;
  name?: string;
  image?: string;
  images?: string[];
  [key: string]: any;
}

export interface CartItem extends CartProduct {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: CartProduct, quantity?: number) => Promise<void>;
  removeFromCart: (id: string | number) => Promise<void>;
  updateQuantity: (id: string | number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  subtotal: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Fetch cart when authenticated
  useEffect(() => {
    const fetchCart = async () => {
      if (isAuthenticated) {
        setIsLoading(true);
        try {
          const response = await client.get("/cart/cartItems");
          // Map backend items to frontend format
          const items = response.data.items.map((item: any) => ({
            ...item,
            id: item.id, // Cart item ID
            productId: item.productId, // Product ID
            // Product details already populated by backend
          }));
          setCartItems(items);
        } catch (error) {
          console.error("Failed to fetch cart:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        // Fallback to local storage for guests
        const localCart = localStorage.getItem("guest_cart");
        if (localCart) {
          setCartItems(JSON.parse(localCart));
        }
      }
    };

    fetchCart();
  }, [isAuthenticated]);

  // Sync guest cart to local storage
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("guest_cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  const addToCart = async (product: CartProduct, quantity = 1) => {
    if (isAuthenticated) {
      try {
        const response = await client.post("/cart/addCartItem/items", {
          productId: product.id,
          quantity,
        });

        // Refetch to get populated details correctly or just update locally if we have them
        const newItem = {
          ...response.data,
          name: product.name || product.title,
          price: product.price,
          images: product.images || [product.image],
        };

        setCartItems((prev) => {
          const existing = prev.find((item) => item.productId === product.id);
          if (existing) {
            return prev.map((item) =>
              item.productId === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            );
          }
          return [...prev, newItem];
        });
      } catch (error) {
        console.error("Failed to add to cart:", error);
      }
    } else {
      setCartItems((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );
        }
        return [...prev, { ...product, quantity }];
      });
    }
    setCartOpen(true);
  };

  const removeFromCart = async (id: string | number) => {
    if (isAuthenticated) {
      try {
        await client.delete(`/cart/deleteCartItem/items/${id}`);
        setCartItems((prev) => prev.filter((item) => item.id !== id));
      } catch (error) {
        console.error("Failed to remove from cart:", error);
      }
    } else {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const updateQuantity = async (id: string | number, quantity: number) => {
    if (quantity < 1) return;
    if (isAuthenticated) {
      try {
        await client.put(`/cart/updateCartItem/items/${id}`, { quantity });
        setCartItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
        );
      } catch (error) {
        console.error("Failed to update quantity:", error);
      }
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
      );
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await client.delete("/cart/clearCart/");
        setCartItems([]);
      } catch (error) {
        console.error("Failed to clear cart:", error);
      }
    } else {
      setCartItems([]);
    }
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartOpen,
        setCartOpen,
        subtotal,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
};
