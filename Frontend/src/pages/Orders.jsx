import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Package,
  Compass,
  RefreshCw,
  AlertCircle,
  ChevronRight,
  Clock,
  CheckCircle,
  Truck,
  Star
} from "lucide-react";
import { fetchOrders } from "../services/api";

const statusConfig = {
  PENDING_PAYMENT: {
    label: "Pending Payment",
    icon: Clock,
    className: "bg-slate-100 text-slate-600"
  },
  PLACED: {
    label: "Placed",
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

const OrderCard = ({ order }) => {
  const config = statusConfig[order.status] || statusConfig["PLACED"];
  const StatusIcon = config.icon;

  const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Order Header */}
      <div className="p-5 sm:p-6 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-xs text-slate-400 font-medium mb-1">
              Order placed on {orderDate}
            </p>
            <p className="font-mono text-xs text-slate-600 font-semibold break-all">
              #{order._id}
            </p>
          </div>
          <span className={`self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${config.className}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            {config.label}
          </span>
        </div>
      </div>

      {/* Order Items Preview */}
      <div className="p-5 sm:p-6 border-b border-slate-100">
        <div className="space-y-2">
          {order.items.slice(0, 3).map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              {item.image && (
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=80&q=80";
                    }}
                  />
                </div>
              )}
              <p className="text-sm text-slate-700 flex-1 line-clamp-1">
                <span className="font-semibold">{item.name}</span>
                <span className="text-slate-500"> × {item.quantity}</span>
              </p>
              <span className="text-sm font-semibold text-slate-800 flex-shrink-0">
                ₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}
              </span>
            </div>
          ))}
          {order.items.length > 3 && (
            <p className="text-xs text-slate-400 font-medium pl-1">
              +{order.items.length - 3} more item{order.items.length - 3 > 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      {/* Order Footer */}
      <div className="px-5 sm:px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 font-medium">Order Total</p>
          <p className="text-lg font-black text-slate-900">
            ₹{Number(order.totalAmount).toLocaleString("en-IN")}
          </p>
        </div>
        <Link
          to={`/orders/${order._id}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition"
        >
          View Details
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchOrders();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
          <Package className="w-3.5 h-3.5" />
          <span>Purchase History</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Orders
          </h1>
          <button
            onClick={loadOrders}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:border-slate-300 bg-white rounded-xl text-xs font-semibold text-slate-600 transition disabled:opacity-50"
            title="Refresh orders"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 animate-pulse"
            >
              <div className="h-4 bg-slate-100 rounded w-48"></div>
              <div className="h-3 bg-slate-100 rounded w-32"></div>
              <div className="h-10 bg-slate-100 rounded-xl w-full"></div>
              <div className="flex justify-between">
                <div className="h-6 bg-slate-100 rounded w-24"></div>
                <div className="h-8 bg-slate-100 rounded-xl w-28"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="bg-white border border-rose-200 rounded-3xl p-10 text-center max-w-lg mx-auto shadow-sm">
          <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Unable to load orders</h3>
          <p className="text-sm text-slate-500 mb-6">{error}</p>
          <button
            onClick={loadOrders}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && orders.length === 0 && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-sm">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No orders yet</h3>
          <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto">
            You haven't placed any orders yet. Start shopping to see your order history here.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-600/30 transition"
          >
            <Compass className="w-4 h-4" />
            Start Shopping
          </Link>
        </div>
      )}

      {/* Orders List */}
      {!loading && !error && orders.length > 0 && (
        <div className="space-y-4">
          <p className="text-xs text-slate-400 font-medium">
            Showing {orders.length} order{orders.length !== 1 ? "s" : ""}, newest first
          </p>
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
