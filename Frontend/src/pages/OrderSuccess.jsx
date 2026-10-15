import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  CheckCircle2,
  Package,
  ShoppingBag,
  Compass,
  MapPin,
  CreditCard
} from "lucide-react";

const statusBadge = (status) => {
  const map = {
    PLACED: "bg-emerald-100 text-emerald-700",
    CONFIRMED: "bg-blue-100 text-blue-700",
    SHIPPED: "bg-amber-100 text-amber-700",
    DELIVERED: "bg-violet-100 text-violet-700",
    PENDING_PAYMENT: "bg-slate-100 text-slate-600"
  };
  return map[status] || "bg-slate-100 text-slate-600";
};

const OrderSuccess = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const order = state?.order;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Success Header */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-emerald-50 border-2 border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Order Placed Successfully!</h1>
        <p className="text-slate-500 text-sm">
          Your payment has been verified and your order is confirmed.
        </p>
      </div>

      {/* Order Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Order ID & Status */}
        <div className="p-6 sm:p-8 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Order ID</p>
              <p className="font-mono text-sm font-bold text-slate-900 break-all">{order?._id || id}</p>
            </div>
            {order?.status && (
              <span className={`self-start px-3 py-1.5 rounded-full text-xs font-bold ${statusBadge(order.status)}`}>
                {order.status}
              </span>
            )}
          </div>
        </div>

        {/* Order Items */}
        {order?.items && order.items.length > 0 && (
          <div className="p-6 sm:p-8 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-600" />
              Items Ordered
            </h3>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  {item.image && (
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=100&q=80";
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 line-clamp-1">{item.name}</p>
                    <p className="text-xs text-slate-500">₹{Number(item.price).toLocaleString("en-IN")} × {item.quantity}</p>
                  </div>
                  <span className="text-sm font-bold text-slate-900">
                    ₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Total & Payment */}
        {order?.totalAmount && (
          <div className="p-6 sm:p-8 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                Amount Paid
              </span>
              <span className="text-2xl font-black text-slate-900">
                ₹{Number(order.totalAmount).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                {order.paymentStatus}
              </span>
              {order.razorpayPaymentId && (
                <span className="text-xs text-slate-400 font-mono">
                  Payment ID: {order.razorpayPaymentId}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Shipping Address */}
        {order?.shippingAddress && (
          <div className="p-6 sm:p-8 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              Delivery Address
            </h3>
            <div className="text-sm text-slate-600 space-y-0.5">
              <p className="font-semibold text-slate-900">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}</p>
              <p className="text-slate-500">{order.shippingAddress.phone}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-3">
          <Link
            to="/orders"
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition"
          >
            <ShoppingBag className="w-4 h-4" />
            View My Orders
          </Link>
          <Link
            to="/products"
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 border border-slate-200 hover:border-emerald-300 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-xl text-sm font-semibold transition"
          >
            <Compass className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
