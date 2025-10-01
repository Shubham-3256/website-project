import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  User,
  Phone,
  Clock,
  Menu,
  X,
  Mail,
  MapPin,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/menu", label: "Menu" },
    { path: "/order", label: "Order Food" },
    { path: "/contact", label: "Contact Us" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        {/* Top bar */}
        <div className="bg-primary text-primary-foreground px-4 py-2 text-sm">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            {/* Left side: contact info */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+91 123456789</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>9AM - 4PM</span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@millets.com</span>
              </div>
            </div>

            {/* Right side icons */}
            <div className="flex items-center gap-4 relative">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button>
                      <User className="h-5 w-5 cursor-pointer hover:text-secondary-foreground/80 transition-colors" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem asChild>
                      <Link to="/my-orders">My Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => supabase.auth.signOut()}
                      className="text-red-500"
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth">
                  <User className="h-5 w-5 hover:text-secondary-foreground/80 transition-colors" />
                </Link>
              )}

              <Link to="/cart">
                <ShoppingCart className="h-5 w-5 hover:text-secondary-foreground/80 transition-colors" />
              </Link>
            </div>
          </div>
        </div>

        {/* Main navigation */}
        <div className="px-4 py-4 border-b">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                </div>
              </div>
              <span className="font-serif font-bold text-xl text-foreground">
                MILLETS
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`font-medium transition-colors ${
                    isActive(item.path)
                      ? "text-primary"
                      : "text-foreground hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-md text-foreground hover:text-primary focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Dropdown */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 space-y-3 px-2 pb-4 bg-white rounded-lg shadow-lg border border-gray-100">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-2 px-3 rounded-md font-medium transition-colors ${
                    isActive(item.path)
                      ? "bg-primary text-white"
                      : "text-foreground hover:bg-secondary"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                </div>
              </div>
              <span className="font-serif font-bold text-xl text-white">
                MILLETS
              </span>
            </div>
            <p className="text-sm text-gray-400">
              Serving healthy, millet-based meals crafted with care.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg text-white mb-4">Contact</h3>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4" /> +91 123456789
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4" /> info@millets.com
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Bangalore, India
              </p>
            </div>
          </div>

          {/* Opening */}
          <div>
            <h3 className="font-semibold text-lg text-white mb-4">
              Opening Hours
            </h3>
            <div className="space-y-2 text-sm">
              <p>Mon - Sat: 9AM - 4PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg text-white mb-4">
              Quick Links
            </h3>
            <div className="space-y-2 text-sm">
              <Link
                to="/menu"
                className="hover:text-primary transition-colors block"
              >
                Menu
              </Link>
              <Link
                to="/contact"
                className="hover:text-primary transition-colors block"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
            <p>© 2025 Millets. All rights reserved.</p>
            <div className="flex gap-4 mt-2 sm:mt-0">
              <Link to="/help" className="hover:text-gray-300">
                Help
              </Link>
              <Link to="/terms" className="hover:text-gray-300">
                Terms
              </Link>
              <Link to="/privacy" className="hover:text-gray-300">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
