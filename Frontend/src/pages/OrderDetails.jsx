import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Package,
  ArrowLeft,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle,
  Truck,
  Star,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { fetchOrderById, updateOrderStatus } from "../services/api";

const statusConfig = {
  PENDING_PAYMENT: {
    label: "Pending Payment",
    icon: Clock,
    className: "bg-slate-100 text-slate-600"
  },
  PLACED: {
    label: "Order Placed",
    icon: CheckCircle,
    className: "bg-emerald-100 text-emerald-700"
  },
  CONFIRMED: {
    label: "Confirmed",
    icon: CheckCircle,
    className: "bg-blue-100 text-blue-700"
  },
  SHIPPED: {
    label: "Shipped",
    icon: Truck,
    className: "bg-amber-100 text-amber-700"
  },
  DELIVERED: {
    label: "Delivered",
    icon: Star,
    className: "bg-violet-100 text-violet-700"
  }
};

const STATUS_PROGRESSION = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];

const OrderDetails = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const loadOrder = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchOrderById(id);
      setOrder(data.order);
    } catch (err) {
      setError(err.message || "Failed to load order.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  // Bonus: Advance order status
  const handleAdvanceStatus = async () => {
    if (!order) return;
    const currentIdx = STATUS_PROGRESSION.indexOf(order.status);
    if (currentIdx === -1 || currentIdx === STATUS_PROGRESSION.length - 1) return;
    const nextStatus = STATUS_PROGRESSION[currentIdx + 1];
    try {
      setUpdatingStatus(true);
      const data = await updateOrderStatus(order._id, nextStatus);
      setOrder(data.order);
    } catch (err) {
      // Silently ignore status update failure in bonus section
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-100 rounded w-48"></div>
          <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
            <div className="h-4 bg-slate-100 rounded w-32"></div>
            <div className="h-3 bg-slate-100 rounded w-64"></div>
            <div className="h-16 bg-slate-100 rounded-xl"></div>
            <div className="h-16 bg-slate-100 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Order Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">{error || "This order does not exist or you don't have permission to view it."}</p>
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Orders
        </Link>
      </div>
    );
  }

  const config = statusConfig[order.status] || statusConfig["PLACED"];
  const StatusIcon = config.icon;
  const currentStatusIdx = STATUS_PROGRESSION.indexOf(order.status);
  const canAdvance = currentStatusIdx >= 0 && currentStatusIdx < STATUS_PROGRESSION.length - 1;

  const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <Link
        to="/orders"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 transition mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to My Orders
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Package className="w-3.5 h-3.5" />
            <span>Order Details</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Order #{order._id.slice(-8).toUpperCase()}</h1>
          <p className="text-sm text-slate-500 mt-1">{orderDate}</p>
        </div>
        <span className={`self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${config.className}`}>
          <StatusIcon className="w-4 h-4" />
          {config.label}
        </span>
      </div>

      <div className="space-y-4">
        {/* Status Progression (Bonus) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">
            Order Progress
          </h3>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {STATUS_PROGRESSION.map((status, idx) => {
              const stepConfig = statusConfig[status];
              const StepIcon = stepConfig.icon;
              const isCompleted = currentStatusIdx >= idx;
              const isCurrent = currentStatusIdx === idx;
              return (
                <React.Fragment key={status}>
                  <div className={`flex flex-col items-center gap-1 flex-shrink-0 ${isCompleted ? "opacity-100" : "opacity-35"}`}>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isCompleted ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"} ${isCurrent ? "ring-2 ring-emerald-400 ring-offset-2" : ""}`}>
                      <StepIcon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-600 text-center w-16 leading-tight">
                      {stepConfig.label}
                    </span>
                  </div>
                  {idx < STATUS_PROGRESSION.length - 1 && (
                    <div className={`h-0.5 flex-1 min-w-[16px] rounded-full transition-colors ${currentStatusIdx > idx ? "bg-emerald-400" : "bg-slate-100"}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Bonus: Advance Status Button */}
          {canAdvance && (
            <button
              onClick={handleAdvanceStatus}
              disabled={updatingStatus}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition disabled:opacity-50"
            >
              {updatingStatus ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )}
              Advance to {statusConfig[STATUS_PROGRESSION[currentStatusIdx + 1]]?.label}
            </button>
          )}
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-600" />
            Items Ordered ({order.items.length})
          </h3>
          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 py-2 border-b border-slate-50 last:border-0">
                {item.image && (
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100">
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
                  <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ₹{Number(item.price).toLocaleString("en-IN")} × {item.quantity}
                  </p>
                </div>
                <span className="text-sm font-bold text-slate-900 flex-shrink-0">
                  ₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
            <span className="font-bold text-slate-900">Order Total</span>
            <span className="text-2xl font-black text-slate-900">
              ₹{Number(order.totalAmount).toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            Payment Information
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Status</span>
              <span className={`font-bold px-2 py-0.5 rounded-full text-xs ${order.paymentStatus === "PAID" ? "bg-emerald-100 text-emerald-700" : order.paymentStatus === "FAILED" ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-600"}`}>
                {order.paymentStatus}
              </span>
            </div>
            {order.razorpayOrderId && (
              <div className="flex justify-between gap-4">
                <span className="text-slate-500 flex-shrink-0">Razorpay Order</span>
                <span className="font-mono text-xs text-slate-700 text-right break-all">{order.razorpayOrderId}</span>
              </div>
            )}
            {order.razorpayPaymentId && (
              <div className="flex justify-between gap-4">
                <span className="text-slate-500 flex-shrink-0">Payment ID</span>
                <span className="font-mono text-xs text-slate-700 text-right break-all">{order.razorpayPaymentId}</span>
              </div>
            )}
          </div>
        </div>

        {/* Shipping Address */}
        {order.shippingAddress && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              Delivery Address
            </h3>
            <div className="text-sm text-slate-600 space-y-1">
              <p className="font-semibold text-slate-900 text-base">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}
              </p>
              <p className="text-slate-500">{order.shippingAddress.phone}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
