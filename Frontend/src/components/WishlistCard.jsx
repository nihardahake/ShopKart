import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Eye, ShoppingCart } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const WishlistCard = ({ product }) => {
  const { removeItem, actionLoadingId } = useWishlist();
  const { addToCart, actionLoadingId: cartActionId } = useCart();
  const [feedback, setFeedback] = useState(null);

  const isRemoving = actionLoadingId === product._id;
  const isAddingToCart = cartActionId === product._id;

  const handleRemove = async () => {
    try {
      await removeItem(product._id);
    } catch (err) {
      setFeedback(err.message || "Failed to remove");
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id);
      setFeedback("Added to cart!");
      setTimeout(() => setFeedback(null), 2500);
    } catch (err) {
      setFeedback(err.message || "Could not add to cart");
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col relative">
      <div className="relative aspect-video sm:aspect-square bg-slate-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80";
          }}
        />
        <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full text-xs font-semibold text-slate-700 shadow-sm">
          {product.category}
        </span>
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <Link to={`/products/${product._id}`} className="hover:text-emerald-600 transition mb-1">
          <h3 className="font-semibold text-slate-900 text-sm sm:text-base line-clamp-1" title={product.name}>
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mb-4 mt-2">
          <span className="text-base sm:text-lg font-bold text-slate-900">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </span>
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
            {product.stock > 0 ? `${product.stock} units left` : "Out of stock"}
          </span>
        </div>

        {feedback && (
          <div className="mb-3 text-xs bg-slate-800 text-white px-2 py-1 rounded text-center">
            {feedback}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 mt-auto pt-3 border-t border-slate-100">
          <Link
            to={`/products/${product._id}`}
            className="inline-flex items-center justify-center gap-1.5 py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View</span>
          </Link>

          <button
            onClick={handleRemove}
            disabled={isRemoving}
            className="inline-flex items-center justify-center gap-1.5 py-2 px-3 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition"
          >
            {isRemoving ? (
              <span className="w-3.5 h-3.5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </>
            )}
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart || product.stock <= 0}
          className="mt-2 w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition disabled:bg-slate-200 disabled:text-slate-400"
        >
          {isAddingToCart ? (
            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Move to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default WishlistCard;
