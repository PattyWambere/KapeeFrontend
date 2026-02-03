// data/Products.ts

// data/Products.ts

// ✅ TypeScript types used for Filters (Categories)
export interface Category {
  name: string;
}

// ✅ TypeScript types for Actual Products
export interface ProductItem {
  id: number;
  title: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  featured: boolean;
  rating: number;
  colors: string[];
  sizes: string[];
}

// Categories (for Filters)
export const categories: Category[] = [
  { name: "Men's Clothing" },
  { name: "Women's Clothing" },
  { name: "Accessories" },
];

// ✅ Actual Products Data
export const products: ProductItem[] = [
  // Men's
  {
    id: 1,
    title: "Classic White T-Shirt",
    category: "Men's Clothing",
    price: 25.0,
    image: "/images/mens_tshirt_white_1769413247505.png",
    featured: true,
    rating: 5,
    colors: ["#FFFFFF", "#000000"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 2,
    title: "Slim Fit Jeans",
    category: "Men's Clothing",
    price: 45.0,
    oldPrice: 60.0,
    image: "/images/mens_jeans_blue_1769413266092.png",
    featured: false,
    rating: 4,
    colors: ["#1E88E5", "#000000"],
    sizes: ["30", "32", "34", "36"],
  },
  {
    id: 3,
    title: "Leather Biker Jacket",
    category: "Men’s Clothing",
    price: 150.0,
    oldPrice: 199.0,
    image: "/images/leather_jacket_black_1769413295399.png",
    featured: true,
    rating: 5,
    colors: ["#000000", "#795548"],
    sizes: ["M", "L", "XL"],
  },

  // Women's
  {
    id: 4,
    title: "Floral Summer Dress",
    category: "Women's Clothing",
    price: 55.0,
    image: "/images/womens_dress_floral_1769413280298.png",
    featured: true,
    rating: 5,
    colors: ["#FF4081"],
    sizes: ["XS", "S", "M", "L"],
  },

  // Accessories
  {
    id: 5,
    title: "Classic Leather Handbag",
    category: "Accessories",
    price: 85.0,
    oldPrice: 120.0,
    image: "/images/handbag_classic_1769413309814.png",
    featured: true,
    rating: 4,
    colors: ["#795548"],
    sizes: ["One Size"],
  },
];
