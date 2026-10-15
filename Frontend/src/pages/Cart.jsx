import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Compass,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";

const Cart = () => {
  const { cartItems, loading, error, subtotal, totalItems, refreshCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Order Preparation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Cart
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {totalItems} {totalItems === 1 ? "unit" : "total units"} ({cartItems.length} distinct {cartItems.length === 1 ? "product" : "products"})
          </p>
        </div>

        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 hover:border-slate-300 bg-white rounded-xl text-xs sm:text-sm font-semibold text-slate-700 transition"
        >
          <Compass className="w-4 h-4 text-emerald-600" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm font-medium">Loading your cart...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="bg-white border border-rose-200 rounded-3xl p-10 text-center max-w-lg mx-auto shadow-sm my-12">
          <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Unable to load your cart.</h3>
          <p className="text-sm text-slate-500 mb-6">{error}</p>
          <button
            onClick={refreshCart}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && cartItems.length === 0 && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-sm my-12">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-emerald-100">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Your cart is empty 🛒</h3>
          <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto">
            Looks like you haven't added anything yet. Explore our wide range of products!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-600/30 transition"
          >
            <Compass className="w-4 h-4" />
            <span>Browse Products</span>
          </Link>
        </div>
      )}

      {/* Cart Content: Item List + Order Summary */}
      {!loading && !error && cartItems.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cartItems.map((item) => (
              <CartItem key={item._id || item.product._id} item={item} />
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">
              Order Summary
            </h2>

            <div className="space-y-3.5 text-sm">
              <div className="flex items-center justify-between text-slate-600">
                <span>Total Items</span>
                <span className="font-semibold text-slate-900">{totalItems} units</span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>Standard Delivery</span>
                <span className="font-semibold text-emerald-600">FREE</span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>Estimated Taxes</span>
                <span className="font-medium text-slate-500">Calculated at checkout</span>
              </div>

              <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-base">
                <span className="font-bold text-slate-900">Total</span>
                <span className="text-2xl font-black text-slate-900">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full mt-6 py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md shadow-emerald-600/30 hover:shadow-lg transition flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Safe &amp; Secure 256-Bit SSL Checkout</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
