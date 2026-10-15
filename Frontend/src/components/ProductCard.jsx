import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Eye, Check, AlertCircle } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

const ProductCard = ({ product }) => {
  const { addToCart, actionLoadingId, getProductCartQuantity } = useCart();
  const { isInWishlist, toggleItemWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  const isWishlisted = isInWishlist(product._id);
  const cartQty = getProductCartQuantity(product._id);
  const isCartLoading = actionLoadingId === product._id;
  const isOutOfStock = product.stock <= 0;

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      setWishlistLoading(true);
      await toggleItemWishlist(product._id);
    } catch (err) {
      setFeedbackMsg(err.message || "Failed to update wishlist");
      setTimeout(() => setFeedbackMsg(null), 3000);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (isOutOfStock) return;

    try {
      await addToCart(product._id);
      setFeedbackMsg("Added to cart!");
      setTimeout(() => setFeedbackMsg(null), 2500);
    } catch (err) {
      setFeedbackMsg(err.message || "Could not add to cart");
      setTimeout(() => setFeedbackMsg(null), 3500);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Product Image and Wishlist Button Overlay */}
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80";
          }}
        />

        {/* Category Badge */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-slate-700 shadow-sm border border-slate-200/50">
          {product.category}
        </span>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          disabled={wishlistLoading}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
            isWishlisted
              ? "bg-rose-50 text-rose-600 border border-rose-200"
              : "bg-white/90 text-slate-500 hover:text-rose-500 border border-slate-200/50 hover:bg-white"
          }`}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {wishlistLoading ? (
            <span className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin inline-block"></span>
          ) : (
            <Heart
              className={`w-4 h-4 transition-transform ${
                isWishlisted ? "fill-rose-500 text-rose-500 scale-110" : ""
              }`}
            />
          )}
        </button>

        {/* Transient feedback toast */}
        {feedbackMsg && (
          <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 text-white text-xs px-3 py-1.5 rounded-lg text-center backdrop-blur-sm animate-fadeIn">
            {feedbackMsg}
          </div>
        )}
      </div>

      {/* Product Details Section */}
      <div className="p-5 flex flex-col flex-1">
        <Link to={`/products/${product._id}`} className="group-hover:text-emerald-600 transition">
          <h3 className="font-semibold text-slate-900 text-base line-clamp-1 mb-1" title={product.name}>
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-slate-500 line-clamp-2 mb-3 flex-1">
          {product.description}
        </p>

        {/* Stock Status and Pricing */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 mb-4">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Price</span>
            <span className="text-lg font-bold text-slate-900">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">Availability</span>
            {isOutOfStock ? (
              <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                Out of Stock
              </span>
            ) : product.stock <= 5 ? (
              <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                Only {product.stock} left
              </span>
            ) : (
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                {product.stock} in stock
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons: View Details & Add to Cart */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <Link
            to={`/products/${product._id}`}
            className="inline-flex items-center justify-center gap-1.5 py-2 px-3 border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-700 transition"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </Link>

          <button
            onClick={handleAddToCart}
            disabled={isCartLoading || isOutOfStock}
            className={`inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition ${
              isOutOfStock
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : isCartLoading
                ? "bg-emerald-700 text-white cursor-wait"
                : cartQty > 0
                ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                : "bg-slate-900 text-white hover:bg-emerald-600 shadow-sm"
            }`}
          >
            {isCartLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Adding...</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>{cartQty > 0 ? "Add Another" : "Add to Cart"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
