// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute"; // <- new

// Pages
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import OrderFood from "./pages/OrderFood"; // item detail
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmation from "./pages/OrderConfirmation";
import BookingPage from "./pages/BookingPage";
import BookingConfirmation from "./pages/BookingConfirmation";
import ContactPage from "./pages/ContactPage";
import ContactConfirmation from "./pages/ContactConfirmation";
import NotFound from "./pages/NotFound";
import AuthPage from "@/pages/AuthPage";
import ProfilePage from "@/pages/ProfilePage";
import MyOrders from "@/pages/MyOrders";
import MyBookings from "@/pages/MyBookings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/menu/:category" element={<Menu />} />

            {/* Order Flow - protected (user must be logged in to view/order) */}
            <Route
              path="/order"
              element={
                <ProtectedRoute>
                  <OrderFood />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order/:itemId"
              element={
                <ProtectedRoute>
                  <OrderFood />
                </ProtectedRoute>
              }
            />

            {/* Cart is public (users can add items), checkout is protected */}
            <Route path="/cart" element={<CartPage />} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />

            {/* Booking Flow - protect booking page */}
            <Route
              path="/booking"
              element={
                <ProtectedRoute>
                  <BookingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking-confirmation"
              element={<BookingConfirmation />}
            />

            {/* Contact Flow */}
            <Route path="/contact" element={<ContactPage />} />
            <Route
              path="/contact-confirmation"
              element={<ContactConfirmation />}
            />

            {/* User / profile pages (protected) */}
            <Route
              path="/my-orders"
              element={
                <ProtectedRoute>
                  <MyOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Auth (login / register) */}
            <Route path="/auth" element={<AuthPage />} />

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
