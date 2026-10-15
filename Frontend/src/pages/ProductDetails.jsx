import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Shield,
  Truck,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  Eye
} from "lucide-react";
import { fetchProductById } from "../services/api";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart, actionLoadingId, getProductCartQuantity } = useCart();
  const { isInWishlist, toggleItemWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProductById(id);
        setProduct(data.product);
      } catch (err) {
        setError(err.message || "Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium text-sm">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Product Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">{error || "The requested item is not available."}</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product._id);
  const cartQty = getProductCartQuantity(product._id);
  const isCartLoading = actionLoadingId === product._id;
  const isOutOfStock = product.stock <= 0;

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      setWishlistLoading(true);
      await toggleItemWishlist(product._id);
    } catch (err) {
      setFeedback(err.message || "Failed to update wishlist");
      setTimeout(() => setFeedback(null), 3000);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (isOutOfStock) return;
    try {
      await addToCart(product._id);
      setFeedback("Added to your shopping cart!");
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      setFeedback(err.message || "Failed to add to cart");
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-8">
        <Link to="/products" className="hover:text-emerald-600 transition flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Products</span>
        </Link>
        <span>/</span>
        <span className="text-slate-400">{product.category}</span>
        <span>/</span>
        <span className="font-semibold text-slate-900 truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm">
        {/* Large Product Image */}
        <div className="aspect-square rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 flex items-center justify-center relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80";
            }}
          />
          <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-slate-700 shadow-sm border border-slate-200/60">
            {product.category}
          </span>
        </div>

        {/* Product Details Information */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                {product.category}
              </span>

              {isOutOfStock ? (
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md">
                  Out of Stock
                </span>
              ) : (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  {product.stock} units available
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              {product.name}
            </h1>

            <div className="text-3xl font-black text-slate-900 mb-6">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </div>

            <div className="border-t border-b border-slate-100 py-6 mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Product Description
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quality assurances */}
            <div className="grid grid-cols-3 gap-3 mb-8 text-center text-xs text-slate-600">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center gap-1.5">
                <Truck className="w-5 h-5 text-emerald-600" />
                <span className="font-semibold text-slate-800">Free Delivery</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center gap-1.5">
                <Shield className="w-5 h-5 text-emerald-600" />
                <span className="font-semibold text-slate-800">1 Year Warranty</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center gap-1.5">
                <RotateCcw className="w-5 h-5 text-emerald-600" />
                <span className="font-semibold text-slate-800">7-Day Returns</span>
              </div>
            </div>

            {feedback && (
              <div className="mb-4 p-3 rounded-xl bg-slate-900 text-white text-xs font-medium text-center animate-fadeIn">
                {feedback}
              </div>
            )}
          </div>

          {/* Action Buttons: Add to Cart and Wishlist Toggle */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={handleAddToCart}
              disabled={isCartLoading || isOutOfStock}
              className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 ${
                isOutOfStock
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : isCartLoading
                  ? "bg-emerald-700 text-white cursor-wait"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30 hover:shadow-lg"
              }`}
            >
              {isCartLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>
                    {cartQty > 0
                      ? "Add Another"
                      : "Add to Cart"}
                  </span>
                </>
              )}
            </button>

            <button
              onClick={handleWishlistToggle}
              disabled={wishlistLoading}
              className={`py-3.5 px-5 rounded-2xl font-semibold text-sm border transition flex items-center justify-center gap-2 ${
                isWishlisted
                  ? "border-rose-300 bg-rose-50 text-rose-600 hover:bg-rose-100"
                  : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:border-slate-300"
              }`}
            >
              {wishlistLoading ? (
                <span className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <Heart
                    className={`w-4 h-4 ${
                      isWishlisted ? "fill-rose-500 text-rose-500" : ""
                    }`}
                  />
                  <span>
                    {isWishlisted ? "Saved in Wishlist" : "Save to Wishlist"}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
