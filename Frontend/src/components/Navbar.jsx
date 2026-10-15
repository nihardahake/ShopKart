import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Heart,
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
  Compass,
  Package
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "text-emerald-600 bg-emerald-50 font-semibold"
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
    }`;

  return (
    <header className="sticky top-0 z-50 glass-nav border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link
            to={isAuthenticated ? "/products" : "/login"}
            className="flex items-center gap-2.5 text-emerald-600 hover:text-emerald-700 transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-emerald-600 transition">
                ShopKart
              </span>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-emerald-600 -mt-1">
                Store
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links - Visible only when logged in */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1">
              <NavLink to="/products" className={navLinkClass}>
                <Compass className="w-4 h-4" />
                Products
              </NavLink>

              <NavLink to="/home" className={navLinkClass}>
                <User className="w-4 h-4" />
                Home
              </NavLink>

              <NavLink to="/wishlist" className={navLinkClass}>
                <div className="relative flex items-center gap-1">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs font-bold bg-rose-100 text-rose-700 rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </div>
              </NavLink>

              <NavLink to="/cart" className={navLinkClass}>
                <div className="relative flex items-center gap-1">
                  <ShoppingCart className="w-4 h-4 text-emerald-600" />
                  <span>Cart{totalItems > 0 ? ` (${totalItems})` : ""}</span>
                </div>
              </NavLink>

              <NavLink to="/orders" className={navLinkClass}>
                <Package className="w-4 h-4 text-emerald-600" />
                Orders
              </NavLink>
            </nav>
          )}

          {/* User Account Controls */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/home"
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 rounded-full text-slate-700 transition text-sm font-medium"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                    {user?.fullName?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="max-w-[120px] truncate">{user?.fullName}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 rounded-lg text-sm font-medium text-slate-600 transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm shadow-emerald-600/30 transition hover:shadow"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          {/* Mobile Menu Controls */}
          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated && (
              <NavLink
                to="/cart"
                className="relative p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                <ShoppingCart className="w-5 h-5 text-emerald-600" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </NavLink>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-fadeIn">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                  {user?.fullName?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-900">{user?.fullName}</span>
                  <span className="text-xs text-slate-500">{user?.email}</span>
                </div>
              </div>

              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 font-medium"
              >
                <Compass className="w-5 h-5 text-emerald-600" />
                Products Catalog
              </Link>

              <Link
                to="/home"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 font-medium"
              >
                <User className="w-5 h-5 text-emerald-600" />
                My Profile
              </Link>

              <Link
                to="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 font-medium"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-rose-500" />
                  <span>Wishlist</span>
                </div>
                {wishlistCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-rose-100 text-rose-700 rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 font-medium"
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5 text-emerald-600" />
                  <span>Cart{totalItems > 0 ? ` (${totalItems})` : ""}</span>
                </div>
                {totalItems > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-emerald-600 text-white rounded-full">
                    {totalItems}
                  </span>
                )}
              </Link>

              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 font-medium"
              >
                <Package className="w-5 h-5 text-emerald-600" />
                My Orders
              </Link>
            </>
          ) : null}

          <div className="pt-3 border-t border-slate-200">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg font-medium transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2.5 text-center font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2.5 text-center font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
