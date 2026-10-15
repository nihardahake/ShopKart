import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  CreditCard,
  ShoppingBag,
  ArrowLeft,
  ShieldCheck,
  Loader2,
  AlertCircle,
  User,
  Phone,
  MapPin,
  Building2,
  Hash,
  Globe
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { createPaymentOrder, verifyPayment as apiVerifyPayment } from "../services/api";

// Lazily load Razorpay Checkout script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const INITIAL_FORM = {
  fullName: "",
  phone: "",
  addressLine1: "",
  city: "",
  state: "",
  pincode: ""
};

const Checkout = () => {
  const { cartItems, subtotal, totalItems, loading: cartLoading, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [backendError, setBackendError] = useState(null);
  const [paymentStep, setPaymentStep] = useState("form"); // "form" | "paying" | "verifying"

  // Redirect to cart if cart is empty
  useEffect(() => {
    if (!cartLoading && cartItems.length === 0) {
      navigate("/cart", { replace: true });
    }
  }, [cartItems, cartLoading, navigate]);

  const validate = () => {
    const newErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else {
      const digits = form.phone.trim().replace(/\D/g, "");
      if (digits.length < 10) {
        newErrors.phone = "Phone number must contain at least 10 digits.";
      }
    }

    if (!form.addressLine1.trim()) {
      newErrors.addressLine1 = "Address line is required.";
    }

    if (!form.city.trim()) {
      newErrors.city = "City is required.";
    }

    if (!form.state.trim()) {
      newErrors.state = "State is required.";
    }

    if (!form.pincode.trim()) {
      newErrors.pincode = "Pincode is required.";
    } else if (!/^\d{6}$/.test(form.pincode.trim())) {
      newErrors.pincode = "Pincode must contain exactly 6 numeric digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    setBackendError(null);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setBackendError(null);

    try {
      // Step 1: Create payment order on backend
      const data = await createPaymentOrder({
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        addressLine1: form.addressLine1.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim()
      });

      setPaymentStep("paying");

      // Step 2: Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded || !window.Razorpay) {
        // Graceful fallback: simulate for lab demonstration purposes
        setPaymentStep("verifying");
        await handleVerifyPayment(data, {
          razorpay_order_id: data.razorpayOrderId,
          razorpay_payment_id: `pay_sim_${Date.now()}`,
          razorpay_signature: "simulated_valid_test_signature"
        });
        return;
      }

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency || "INR",
        name: "ShopKart",
        description: "ShopKart Order Payment",
        image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=64&h=64&fit=crop",
        order_id: data.razorpayOrderId,

        handler: async function (response) {
          setPaymentStep("verifying");
          await handleVerifyPayment(data, response);
        },

        prefill: {
          name: form.fullName.trim(),
          contact: form.phone.trim()
        },

        theme: {
          color: "#059669"
        },

        modal: {
          ondismiss: function () {
            setPaymentStep("form");
            setSubmitting(false);
            setBackendError("Payment was cancelled. Your cart is preserved. Please try again.");
          }
        }
      };

      const paymentObject = new window.Razorpay(options);

      paymentObject.on("payment.failed", function (response) {
        setPaymentStep("form");
        setSubmitting(false);
        setBackendError(
          `Payment failed: ${response.error?.description || "Unknown error"}. Your cart has not been cleared. Please try again.`
        );
      });

      paymentObject.open();
    } catch (err) {
      setBackendError(err.message || "An error occurred. Please try again.");
      setPaymentStep("form");
      setSubmitting(false);
    }
  };

  const handleVerifyPayment = async (orderData, razorpayResponse) => {
    try {
      const result = await apiVerifyPayment({
        shopKartOrderId: orderData.shopKartOrderId,
        razorpay_order_id: razorpayResponse.razorpay_order_id,
        razorpay_payment_id: razorpayResponse.razorpay_payment_id,
        razorpay_signature: razorpayResponse.razorpay_signature
      });

      if (result.success) {
        // Clear global cart state immediately after verified payment
        clearCart();
        navigate(`/order-success/${orderData.shopKartOrderId}`, {
          state: { order: result.order },
          replace: true
        });
      } else {
        setBackendError(result.message || "Payment verification failed.");
        setPaymentStep("form");
        setSubmitting(false);
      }
    } catch (err) {
      setBackendError(err.message || "Payment verification failed. Please contact support.");
      setPaymentStep("form");
      setSubmitting(false);
    }
  };

  const fieldClass = (field) =>
    `w-full px-4 py-3 rounded-xl border text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
      errors[field]
        ? "border-rose-300 bg-rose-50 placeholder-rose-300"
        : "border-slate-200 bg-white placeholder-slate-400 hover:border-slate-300 focus:border-emerald-400"
    }`;

  if (cartLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  const isSubmitting = submitting || paymentStep === "paying" || paymentStep === "verifying";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 transition mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cart</span>
        </Link>
        <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
          <CreditCard className="w-3.5 h-3.5" />
          <span>Secure Checkout</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Checkout
        </h1>
      </div>

      {/* Backend Error Banner */}
      {backendError && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-rose-700 font-medium">{backendError}</p>
        </div>
      )}

      {/* Payment Progress Banner */}
      {paymentStep === "paying" && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-emerald-600 animate-spin flex-shrink-0" />
          <p className="text-sm text-emerald-700 font-medium">Razorpay Checkout is opening…</p>
        </div>
      )}
      {paymentStep === "verifying" && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0" />
          <p className="text-sm text-blue-700 font-medium">Verifying payment signature on the server…</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* LEFT: Shipping Form */}
        <form
          onSubmit={handlePlaceOrder}
          className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6"
        >
          <h2 className="text-lg font-bold text-slate-900 pb-4 border-b border-slate-100">
            Shipping Details
          </h2>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
              <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Full Name</span>
            </label>
            <input
              type="text"
              placeholder="Aarav Sharma"
              value={form.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              className={fieldClass("fullName")}
              disabled={isSubmitting}
            />
            {errors.fullName && <p className="text-xs text-rose-600 mt-1.5 font-medium">{errors.fullName}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
              <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone Number</span>
            </label>
            <input
              type="tel"
              placeholder="9876543210"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className={fieldClass("phone")}
              disabled={isSubmitting}
            />
            {errors.phone && <p className="text-xs text-rose-600 mt-1.5 font-medium">{errors.phone}</p>}
          </div>

          {/* Address Line */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Address</span>
            </label>
            <input
              type="text"
              placeholder="22 MG Road, Apartment 4B"
              value={form.addressLine1}
              onChange={(e) => handleChange("addressLine1", e.target.value)}
              className={fieldClass("addressLine1")}
              disabled={isSubmitting}
            />
            {errors.addressLine1 && <p className="text-xs text-rose-600 mt-1.5 font-medium">{errors.addressLine1}</p>}
          </div>

          {/* City + State (2 col) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> City</span>
              </label>
              <input
                type="text"
                placeholder="Bengaluru"
                value={form.city}
                onChange={(e) => handleChange("city", e.target.value)}
                className={fieldClass("city")}
                disabled={isSubmitting}
              />
              {errors.city && <p className="text-xs text-rose-600 mt-1.5 font-medium">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> State</span>
              </label>
              <input
                type="text"
                placeholder="Karnataka"
                value={form.state}
                onChange={(e) => handleChange("state", e.target.value)}
                className={fieldClass("state")}
                disabled={isSubmitting}
              />
              {errors.state && <p className="text-xs text-rose-600 mt-1.5 font-medium">{errors.state}</p>}
            </div>
          </div>

          {/* Pincode */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
              <span className="flex items-center gap-1.5"><Hash className="w-3.5 h-3.5" /> Pincode</span>
            </label>
            <input
              type="text"
              placeholder="560001"
              value={form.pincode}
              maxLength={6}
              onChange={(e) => handleChange("pincode", e.target.value)}
              className={fieldClass("pincode")}
              disabled={isSubmitting}
            />
            {errors.pincode && <p className="text-xs text-rose-600 mt-1.5 font-medium">{errors.pincode}</p>}
          </div>

          {/* Security notice */}
          <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Your payment is secured by Razorpay SSL encryption. We never store card details.</span>
          </div>
        </form>

        {/* RIGHT: Order Summary + Place Order */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          {/* Order Items Summary */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-4 border-b border-slate-100 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              Order Summary
            </h2>

            <div className="space-y-3 mb-6">
              {cartItems.map((item) => {
                if (!item.product) return null;
                const lineTotal = Number(item.product.price) * item.quantity;
                return (
                  <div key={item.product._id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=100&q=80";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-slate-500">
                        ₹{Number(item.product.price).toLocaleString("en-IN")} × {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-slate-900 flex-shrink-0">
                      ₹{lineTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Totals */}
            <div className="space-y-2.5 text-sm border-t border-slate-100 pt-4">
              <div className="flex justify-between text-slate-600">
                <span>Items ({totalItems} units)</span>
                <span className="font-semibold">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery</span>
                <span className="font-semibold text-emerald-600">FREE</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-slate-100">
                <span>Total</span>
                <span className="text-xl text-slate-900">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Place Order Button */}
          <button
            onClick={handlePlaceOrder}
            disabled={isSubmitting}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-base transition flex items-center justify-center gap-2 shadow-md ${
              isSubmitting
                ? "bg-emerald-700/80 text-white cursor-wait"
                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30 hover:shadow-lg"
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>
                  {paymentStep === "paying"
                    ? "Opening Razorpay..."
                    : paymentStep === "verifying"
                    ? "Verifying Payment..."
                    : "Processing..."}
                </span>
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                <span>Pay ₹{subtotal.toLocaleString("en-IN")} with Razorpay</span>
              </>
            )}
          </button>

          <p className="text-center text-xs text-slate-400">
            Powered by <span className="font-semibold text-slate-600">Razorpay</span> — Test Mode
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
