import React from "react";
import { Link } from "react-router-dom";
import { Heart, RefreshCw, Compass, AlertCircle } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import WishlistCard from "../components/WishlistCard";

const Wishlist = () => {
  const { wishlistItems, loading, error, refreshWishlist } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Heart className="w-3.5 h-3.5 fill-rose-600" />
            <span>Saved Items</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Wishlist
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {wishlistItems.length} {wishlistItems.length === 1 ? "product" : "products"} saved
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
          <div className="w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm font-medium">Loading your wishlist...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="bg-white border border-rose-200 rounded-3xl p-10 text-center max-w-lg mx-auto shadow-sm my-12">
          <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Unable to load wishlist.</h3>
          <p className="text-sm text-slate-500 mb-6">{error}</p>
          <button
            onClick={refreshWishlist}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && wishlistItems.length === 0 && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-sm my-12">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-rose-100">
            <Heart className="w-8 h-8 fill-rose-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Your wishlist is empty ❤️</h3>
          <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto">
            Save products you love and find them here later to review or move to your cart.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold shadow-md transition"
          >
            <Compass className="w-4 h-4" />
            <span>Browse Products</span>
          </Link>
        </div>
      )}

      {/* Wishlist Grid */}
      {!loading && !error && wishlistItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <WishlistCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
