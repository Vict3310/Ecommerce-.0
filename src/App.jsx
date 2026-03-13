import React, { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CartDrawer from './components/CartDrawer';
import Toast from './components/Toast';
import LiveChat from "./components/LiveChat";
import { AuthProvider } from "./context/AuthContext";
import { StoreProvider } from "./context/StoreContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import { ThemeProvider } from "./context/ThemeContext";
import AdminRoute from "./components/AdminRoute";
import PageTransition from "./components/PageTransition";

import Home from "./pages/Home";
const Contact = lazy(() => import("./pages/Contact"));
const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const About = lazy(() => import("./pages/About"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Products = lazy(() => import("./pages/Products"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Cart = lazy(() => import("./pages/Cart"));
const Account = lazy(() => import("./pages/Account"));

const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminProductForm = lazy(() => import("./pages/admin/AdminProductForm"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminCalendar = lazy(() => import("./pages/admin/AdminCalendar"));
const AdminProfile = lazy(() => import("./pages/admin/AdminProfile"));
const AdminCharts = lazy(() => import("./pages/admin/AdminCharts"));

function App() {
  const savedCart = localStorage.getItem('shoppingCart');
  let startingCart = [];

  if (savedCart != null) {
    startingCart = JSON.parse(savedCart);
  }
  const [cart, setCart] = useState(startingCart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  useEffect(function () {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
  }, [cart]);

  function addToCart(product) {
    const newCart = cart.slice();

    let found = false;
    for (let i = 0; i < newCart.length; i++) {
      if (newCart[i].id === product.id) {
        newCart[i].quantity = newCart[i].quantity + 1;
        found = true;
        break;
      }
    }

    if (!found) {
      newCart.push({
        id: product.id,
        name: product.name || product.title,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    }

    setCart(newCart);

    setToastMsg((product.name || product.title) + " added to cart!");

    setTimeout(function () {
      setToastMsg(null);
    }, 3000);
  }

  function removeFromCart(productId) {
    const newCart = [];
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].id !== productId) {
        newCart.push(cart[i]);
      }
    }
    setCart(newCart);
  }

  function updateQuantity(productId, delta) {
    const newCart = cart.map(item => {
      if (item.id === productId) {
        const newQty = item.quantity + delta;
        if (newQty < 1) return null;
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(Boolean);
    setCart(newCart);
  }

  function clearCart() {
    setCart([]);
  }

  let cartItemCount = 0;
  for (let i = 0; i < cart.length; i++) {
    cartItemCount = cartItemCount + cart[i].quantity;
  }

  return (
    <Router>
      <AuthProvider>
        <StoreProvider>
          <CurrencyProvider>
            <ThemeProvider>
              <div className="App">
                <Navbar
                  cartCount={cartItemCount}
                  onCartClick={function () { setIsCartOpen(true); }}
                />

                <Suspense fallback={<div style={{ height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading application...</div>}>
                  <PageTransition>
                    <Routes>
                      <Route path="/" element={<Home onAddToCart={addToCart} />} />
                      <Route path="/products" element={<Products onAddToCart={addToCart} />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/checkout" element={<Checkout cartItems={cart} onClearCart={clearCart} />} />
                      <Route path="/cart" element={<Cart cartItems={cart} onRemove={removeFromCart} onUpdateQuantity={updateQuantity} onClearCart={clearCart} />} />
                      <Route path="/account" element={<Account />} />
                      <Route path="/product/:id" element={<ProductDetail onAddToCart={addToCart} />} />
                      <Route path="/wishlist" element={<Wishlist onAddToCart={addToCart} />} />
                      
                      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="orders" element={<AdminOrders />} />
                        <Route path="products" element={<AdminProducts />} />
                        <Route path="products/new" element={<AdminProductForm />} />
                        <Route path="products/edit/:id" element={<AdminProductForm />} />
                        <Route path="settings" element={<AdminSettings />} />
                        <Route path="calendar" element={<AdminCalendar />} />
                        <Route path="profile" element={<AdminProfile />} />
                        <Route path="charts" element={<AdminCharts />} />
                      </Route>
                    </Routes>
                  </PageTransition>
                </Suspense>

                <CartDrawer
                  isOpen={isCartOpen}
                  onClose={function () { setIsCartOpen(false); }}
                  cartItems={cart}
                  onRemove={removeFromCart}
                />

                <Toast message={toastMsg} />
                <LiveChat />
              </div>
            </ThemeProvider>
          </CurrencyProvider>
        </StoreProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
