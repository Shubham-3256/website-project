// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

// Pages
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import OrderFood from "./pages/OrderFood"; // item detail
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmation from "./pages/OrderConfirmation";
import BookingPage from "./pages/BookingPage";
import ContactPage from "./pages/ContactPage";
import ContactConfirmation from "./pages/ContactConfirmation";
import NotFound from "./pages/NotFound";
import AuthPage from "@/pages/AuthPage";
import ProfilePage from "@/pages/ProfilePage";
import MyOrders from "@/pages/MyOrders";
import MyBookings from "@/pages/MyBookings";
import BookingConfirmation from "./pages/BookingConfirmation";
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
            {/* Order Flow */}
            <Route path="/order" element={<OrderFood />} />
            <Route path="/order/:itemId" element={<OrderFood />} />{" "}
            {/* detail */}
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            {/* Booking Flow */}
            <Route path="/booking" element={<BookingPage />} />
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
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/profile" element={<ProfilePage />} />
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
