import React from "react";
import { Link } from "react-router-dom";
import { Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart, actionLoadingId } = useCart();

  if (!item || !item.product) return null;

  const product = item.product;
  const quantity = item.quantity;
  const isUpdating = actionLoadingId === product._id;
  const isAtMaxStock = quantity >= product.stock;
  const isAtMinQuantity = quantity <= 1;

  const handleIncrement = () => {
    if (!isAtMaxStock && !isUpdating) {
      updateQuantity(product._id, quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (!isAtMinQuantity && !isUpdating) {
      updateQuantity(product._id, quantity - 1);
    }
  };

  const handleRemove = () => {
    if (!isUpdating) {
      removeFromCart(product._id);
    }
  };

  const lineTotal = (Number(product.price) || 0) * quantity;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 bg-white border border-slate-200/80 rounded-2xl gap-4 transition hover:border-slate-300">
      {/* Product Image & Details */}
      <div className="flex items-center gap-4 flex-1">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200/60">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80";
            }}
          />
        </div>

        <div className="flex flex-col flex-1">
          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-0.5">
            {product.category}
          </span>
          <Link
            to={`/products/${product._id}`}
            className="font-semibold text-slate-900 text-sm sm:text-base hover:text-emerald-600 transition line-clamp-1"
          >
            {product.name}
          </Link>
          <span className="text-xs text-slate-500 mt-1">
            Unit Price: ₹{Number(product.price).toLocaleString("en-IN")}
          </span>
          {isAtMaxStock && (
            <span className="text-[11px] text-amber-600 font-medium mt-1">
              Max available stock reached ({product.stock})
            </span>
          )}
        </div>
      </div>

      {/* Quantity Controls & Line Item Total */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        {/* Quantity Controls */}
        <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
          <button
            onClick={handleDecrement}
            disabled={isAtMinQuantity || isUpdating}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            title="Decrease quantity"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <span className="w-10 text-center text-sm font-bold text-slate-900">
            {isUpdating ? (
              <span className="w-3 h-3 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin inline-block"></span>
            ) : (
              quantity
            )}
          </span>

          <button
            onClick={handleIncrement}
            disabled={isAtMaxStock || isUpdating}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            title="Increase quantity"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Line Total */}
        <div className="text-right min-w-[90px]">
          <span className="text-xs text-slate-400 block font-medium">Subtotal</span>
          <span className="text-base sm:text-lg font-bold text-slate-900">
            ₹{lineTotal.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          disabled={isUpdating}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition border border-rose-200/60 disabled:opacity-50"
          title="Remove from Cart"
          aria-label="Remove item"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Remove</span>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
