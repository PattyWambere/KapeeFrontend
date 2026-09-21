// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import { ContentProvider } from "./context/ContentContext";
import { CompareProvider } from "./context/CompareContext";
import CompareBar from "./components/compare/CompareBar";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Shop from "./pages/Shop";
import WishList from "./pages/WishList";
import Compare from "./pages/Compare";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderComplete from "./pages/OrderComplete";
import Contact from "./pages/Contact";
import MyAccount from "./pages/MyAccount";
import MyOrders from "./pages/MyOrders";
import ResetPassword from "./pages/ResetPassword";

// Admin Pages
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ManageProducts from "./pages/admin/ManageProducts";
import ManageCategories from "./pages/admin/ManageCategories";
import ManageOrders from "./pages/admin/ManageOrders";
import ManageSettings from "./pages/admin/ManageSettings";
import AdminProfile from "./pages/admin/AdminProfile";
import ManageBlog from "./pages/admin/ManageBlog";
import ManageAbout from "./pages/admin/ManageAbout";

function App() {
  return (
    <ContentProvider>
    <AuthProvider>
      <CurrencyProvider>
        <WishlistProvider>
          <CompareProvider>
          <CartProvider>
            <Router>
              <Routes>
                <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} /> {/* Home page */}
                <Route path="/about" element={<About />} /> {/* About page */}
                <Route path="/blog" element={<Blog />} /> {/* Blog page */}
                <Route path="/contact" element={<Contact />} /> {/* Contact page */}
                <Route path="/wishlist" element={<WishList />} />{" "}
                {/* Wishlist page */}
                <Route path="/compare" element={<Compare />} /> {/* Compare page */}
                <Route path="/shop" element={<Shop />} /> {/* Shop page */}
                <Route path="/shop/:id" element={<ProductDetails />} />

                {/* Protected Customer Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-complete" element={<OrderComplete />} />
                  <Route path="/account" element={<MyAccount />} />
                  <Route path="/orders" element={<MyOrders />} />
                </Route>

                <Route path="/reset-password/:token" element={<ResetPassword />} />
              </Route>

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="products" element={<ManageProducts />} />
                <Route path="categories" element={<ManageCategories />} />
                <Route path="orders" element={<ManageOrders />} />
                <Route path="settings" element={<ManageSettings />} />
                <Route path="profile" element={<AdminProfile />} />
                <Route path="blog" element={<ManageBlog />} />
                <Route path="about" element={<ManageAbout />} />
              </Route>

              {/* 404 fallback */}
              <Route
                path="*"
                element={<div className="text-center py-20">Page Not Found</div>}
              />
            </Routes>
            <CompareBar />
          </Router>
          </CartProvider>
          </CompareProvider>
        </WishlistProvider>
      </CurrencyProvider>
    </AuthProvider>
    </ContentProvider>
  );
}

export default App;
