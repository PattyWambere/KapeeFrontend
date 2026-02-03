import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/shop/ProductCard";
import {
  FaShippingFast,
  FaUndo,
  FaHandHoldingUsd,
  FaHistory,
} from "react-icons/fa";
import client from "../api/client";
import categoryService, { type Category } from "../api/category.service";

import menImg from "/images/men.jpg";
import womenImg from "/images/women.jpg";
import accessoriesImg from "/images/accessories.jpg";

const categoryImages: Record<string, string> = {
  "Men's Clothing": menImg,
  "Women's Clothing": womenImg,
  Accessories: accessoriesImg,
  // Fallbacks for curly apostrophes or other variants
  "Men’s Clothing": menImg,
  "Women’s Clothing": womenImg,
};

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  categoryId: string;
  inStock: boolean;
  quantity: number;
  images: string[];
}

const carouselSlides = [
  {
    title: "MEN'S CLOTHES",
    subtitle: "NEW COLLECTIONS 2026",
    description:
      "Explore the latest trends in men's fashion. Quality meets style in our newest arrivals.",
    cta: "SHOP NOW",
    bg: "bg-white",
    image: "/images/womens_banner.jpg",
    align: "center",
    textColor: "text-black",
  },
  {
    title: "HUGE SALE",
    subtitle: "FASHION COLLECTION",
    description:
      "MIN. 40-80% OFF. Don't miss out on our biggest sale of the season.",
    cta: "SHOP NOW",
    bg: "bg-white",
    image: "/images/womens_banner.jpg",
    align: "right",
    textColor: "text-black",
  },
  {
    title: "Fashion Accessories",
    subtitle: "Festive Feast",
    description:
      "Minimum 50% Off on all premium accessories. Elevate your look today.",
    cta: "SHOP NOW",
    bg: "bg-white",
    image: "/images/womens_banner.jpg",
    align: "center",
    textColor: "text-black",
  },
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products and categories from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          client.get("/products/products"),
          categoryService.getCategories(),
        ]);
        setProducts(prodRes.data);
        setCategories(catRes);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get first 8 products as featured
  const featuredProducts = products.slice(0, 8);

  // Category map for name lookups
  const categoryMap = categories.reduce(
    (acc, cat) => {
      acc[cat.id] = cat.name;
      return acc;
    },
    {} as { [key: string]: string },
  );

  // Auto-slide every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Carousel */}
      <div className="relative w-full h-[400px] md:h-[600px] lg:h-[700px] overflow-hidden bg-gray-50 group">
        {carouselSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 transform
            ${idx === currentSlide ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-105"}`}
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover opacity-15"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
            </div>

            {/* Slide Content */}
            <div className="max-w-7xl mx-auto w-full px-6 flex items-center h-full z-10">
              <div
                className={`w-full ${slide.align === "right" ? "md:text-right md:ml-auto" : "text-center md:text-left"} max-w-2xl transform transition-all delay-300 duration-700 ${idx === currentSlide ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
              >
                <p className="text-blue-600 font-bold tracking-[0.3em] uppercase mb-4 text-xs md:text-sm">
                  {slide.subtitle}
                </p>
                <h2 className="text-4xl md:text-7xl lg:text-8xl font-black mb-6 text-gray-900 leading-tight uppercase tracking-tighter">
                  {slide.title}
                </h2>
                <div
                  className={`h-1.5 w-24 bg-orange-500 mb-8 md:mb-10 ${slide.align === "right" ? "md:ml-auto" : "mx-auto md:mx-0"}`}
                />
                <p className="text-gray-500 mb-10 text-sm md:text-xl font-medium max-w-lg ${slide.align === 'right' ? 'md:ml-auto' : ''}">
                  {slide.description}
                </p>
                <button className="bg-blue-600 text-white hover:bg-black px-12 py-5 uppercase text-xs font-black tracking-[0.2em] transition-all duration-300 shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] hover:shadow-2xl active:scale-95 rounded-xl">
                  {slide.cta}
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <div className="absolute inset-x-4 md:inset-x-10 top-1/2 -translate-y-1/2 flex justify-between z-20 pointer-events-none">
          <button
            className="w-10 h-10 md:w-14 md:h-14 bg-white/90 backdrop-blur shadow-xl rounded-full flex items-center justify-center text-gray-800 hover:bg-blue-600 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 pointer-events-auto active:scale-90"
            onClick={() =>
              setCurrentSlide((prev) =>
                prev === 0 ? carouselSlides.length - 1 : prev - 1,
              )
            }
          >
            <i className="fa-solid fa-angle-left"></i>
          </button>
          <button
            className="w-10 h-10 md:w-14 md:h-14 bg-white/90 backdrop-blur shadow-xl rounded-full flex items-center justify-center text-gray-800 hover:bg-blue-600 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 pointer-events-auto active:scale-90"
            onClick={() =>
              setCurrentSlide((prev) =>
                prev === carouselSlides.length - 1 ? 0 : prev + 1,
              )
            }
          >
            <i className="fa-solid fa-angle-right"></i>
          </button>
        </div>

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {carouselSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 transition-all duration-500 rounded-full ${i === currentSlide ? "w-10 bg-blue-600" : "w-4 bg-gray-300 hover:bg-gray-400"}`}
            />
          ))}
        </div>
      </div>

      {/* Category Highlights */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        {categories.slice(0, 3).map((cat, idx) => (
          <Link
            key={cat.id}
            to={`/shop?category=${cat.id}`}
            className="relative overflow-hidden group cursor-pointer aspect-[4/3] rounded-3xl bg-gray-100 flex items-center p-8 md:p-12 transition-all duration-700 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-gray-100/50"
          >
            {/* 🔹 CATEGORY IMAGE */}
            <img
              src={categoryImages[cat.name] || "/images/placeholder.png"}
              alt={cat.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
            />

            {/* 🔹 Overlay for readability */}
            {/* <div className="absolute inset-0 bg-white/70 group-hover:bg-white/50 transition-colors duration-700" /> */}

            <div className="relative z-10 w-2/3">
              <h3 className="text-2xl md:text-3xl font-black uppercase mb-1 leading-tight text-gray-900 tracking-tighter">
                <span className="block">{cat.name.split(" ")[0]}</span>
                <span className="block text-blue-600">
                  {cat.name.split(" ").slice(1).join(" ") || "COLLECTION"}
                </span>
              </h3>

              <p className="text-gray-500 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-8">
                NEW ARRIVALS 2026
              </p>

              <span className="inline-flex items-center gap-3 bg-blue-500 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:bg-blue-400 transition-all duration-500 shadow-xl shadow-black/10">
                Shop Now
                <i className="fa-solid fa-arrow-right text-[8px] group-hover:translate-x-1 transition-transform"></i>
              </span>
            </div>

            {/* Background Decoration */}
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-blue-600/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute right-8 top-8 text-7xl font-black text-black/5 group-hover:text-blue-600/10 transition-colors duration-500 select-none italic">
              0{idx + 1}
            </div>
          </Link>
        ))}
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter mb-2">
              Featured Products
            </h2>
            <p className="text-gray-400 font-medium italic text-sm md:text-base">
              Our most loved collections this season
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              to="/shop"
              className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 hover:text-orange-500 transition-all"
            >
              View Full Collection
              <div className="w-8 h-12 bg-blue-50 group-hover:bg-orange-50 rounded-full flex items-center justify-center transition-colors">
                <i className="fa-solid fa-arrow-right"></i>
              </div>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] bg-gray-100 rounded-3xl animate-pulse"
              />
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categoryName={categoryMap[product.categoryId] || "Collection"}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <i className="fa-solid fa-box-open text-5xl text-gray-200 mb-4 block"></i>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">
              No products available at the moment
            </p>
          </div>
        )}
      </section>

      {/* Trust Section */}
      <section className="bg-gray-50 border-y border-gray-100 py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            {
              icon: <FaShippingFast />,
              title: "Free Shipping",
              desc: "On all orders over $99",
            },
            {
              icon: <FaUndo />,
              title: "Money Return",
              desc: "30 days money back guarantee",
            },
            {
              icon: <FaHandHoldingUsd />,
              title: "Best Price",
              desc: "Guaranteed lowest prices",
            },
            {
              icon: <FaHistory />,
              title: "24/7 Support",
              desc: "Dedicated support whenever",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center gap-6 group"
            >
              <div className="text-4xl text-orange-500 bg-white shadow-2xl shadow-orange-500/10 p-6 rounded-[2rem] group-hover:bg-blue-600 group-hover:text-white group-hover:-translate-y-2 transition-all duration-500">
                {item.icon}
              </div>
              <div>
                <h4 className="font-black uppercase tracking-widest text-sm mb-2 text-gray-900">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
