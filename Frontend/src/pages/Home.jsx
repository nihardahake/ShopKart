import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  Compass,
  Heart,
  ShoppingCart,
  LogOut,
  KeyRound,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const Home = () => {
  const { user, logout, changePassword } = useAuth();
  const { totalItems } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();

  // Change password form state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState("");

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwdError("");
    setPwdSuccess("");

    if (!passwordData.oldPassword || !passwordData.newPassword) {
      setPwdError("All fields are required");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPwdError("New password must be at least 6 characters long");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPwdError("New passwords do not match");
      return;
    }

    try {
      setPwdLoading(true);
      await changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      setPwdSuccess("Password changed successfully!");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => {
        setShowPasswordModal(false);
        setPwdSuccess("");
      }, 2000);
    } catch (err) {
      setPwdError(err.message || "Failed to change password");
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl shadow-emerald-900/10 mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold mb-3 tracking-wide uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>Customer Portal</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, {user?.fullName}!
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base mt-2 max-w-xl">
              You are signed in to your ShopKart profile. Explore today's catalog, manage your saved wishlist, or review items in your cart.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/products"
              className="px-5 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 font-semibold rounded-xl text-sm shadow-md transition"
            >
              Start Shopping
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 bg-emerald-800/80 hover:bg-emerald-800 text-white font-medium rounded-xl text-sm transition flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer Information Card */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center text-2xl font-black shadow-md shadow-emerald-500/20">
                {user?.fullName?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg leading-tight">
                  {user?.fullName}
                </h3>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
                  Active Customer
                </span>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3 text-slate-600">
                <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="font-medium text-slate-900 truncate">{user?.email}</span>
              </div>

              <div className="flex items-center gap-3 text-slate-600">
                <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="font-medium text-slate-900">{user?.phone}</span>
              </div>

              <div className="flex items-center gap-3 text-slate-600">
                <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="text-xs text-slate-500">
                  Customer ID: <code className="text-slate-700 bg-slate-100 px-1 py-0.5 rounded text-[11px]">{user?._id}</code>
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition"
            >
              <KeyRound className="w-4 h-4 text-slate-500" />
              <span>Change Password</span>
            </button>
          </div>
        </div>

        {/* Quick Navigation Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Products Catalog Card */}
          <Link
            to="/products"
            className="group bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-200 transition flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-emerald-600 transition">
                Product Catalog
              </h4>
              <p className="text-xs text-slate-500">
                Discover electronics, fashion, books, and home accessories with live dynamic filtering.
              </p>
            </div>
            <div className="mt-6 flex items-center text-xs font-semibold text-emerald-600">
              <span>Browse Catalog &rarr;</span>
            </div>
          </Link>

          {/* Wishlist Card */}
          <Link
            to="/wishlist"
            className="group bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-rose-200 transition flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-slate-900 text-lg group-hover:text-rose-600 transition">
                  My Wishlist
                </h4>
                <span className="text-xs font-bold bg-rose-100 text-rose-700 px-2.5 py-0.5 rounded-full">
                  {wishlistCount} saved
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Saved items waiting for you. Return anytime to view and move items directly to your cart.
              </p>
            </div>
            <div className="mt-6 flex items-center text-xs font-semibold text-rose-600">
              <span>Open Wishlist &rarr;</span>
            </div>
          </Link>

          {/* Shopping Cart Card */}
          <Link
            to="/cart"
            className="group bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-teal-200 transition flex flex-col justify-between sm:col-span-2"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg group-hover:text-teal-600 transition">
                    Shopping Cart
                  </h4>
                  <p className="text-xs text-slate-500">
                    Review selected items, adjust quantities, and check your real-time order subtotal.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                  {totalItems} items in cart
                </span>
                <span className="text-xs font-semibold text-teal-600 group-hover:translate-x-1 transition-transform">
                  View Cart &rarr;
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Change Password Modal (Bonus Task) */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-fadeIn">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Change Password</h3>
            <p className="text-xs text-slate-500 mb-6">
              Enter your current password and pick a new one with at least 6 characters.
            </p>

            {pwdError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{pwdError}</span>
              </div>
            )}

            {pwdSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>{pwdSuccess}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, oldPassword: e.target.value })
                  }
                  required
                  placeholder="Enter current password"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  required
                  placeholder="At least 6 characters"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  required
                  placeholder="Re-type new password"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pwdLoading}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition disabled:opacity-50"
                >
                  {pwdLoading ? "Saving..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
