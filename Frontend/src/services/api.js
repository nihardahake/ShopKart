import axios from "axios";

// Create Axios instance with withCredentials enabled for HttpOnly cookie authentication
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8008",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

// Response interceptor for consistent error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Return structured error message if available
    const customMessage =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";
    return Promise.reject(new Error(customMessage));
  }
);

// Customer Authentication APIs (Lab 01 & 02)
export const registerCustomer = async (data) => {
  const res = await API.post("/customers/register", data);
  return res.data;
};

export const loginCustomer = async (data) => {
  const res = await API.post("/customers/login", data);
  return res.data;
};

export const getCustomerProfile = async () => {
  const res = await API.get("/customers/me");
  return res.data;
};

export const logoutCustomer = async () => {
  const res = await API.post("/customers/logout");
  return res.data;
};

export const changeCustomerPassword = async (data) => {
  const res = await API.patch("/customers/change-password", data);
  return res.data;
};

// Product APIs (Lab 03)
export const fetchProducts = async (params = {}) => {
  const res = await API.get("/products", { params });
  return res.data;
};

export const fetchProductById = async (id) => {
  const res = await API.get(`/products/${id}`);
  return res.data;
};

export const createProduct = async (productData) => {
  const res = await API.post("/products", productData);
  return res.data;
};

// Wishlist APIs (Lab 04)
export const fetchWishlist = async () => {
  const res = await API.get("/wishlist");
  return res.data;
};

export const addToWishlist = async (productId) => {
  const res = await API.post(`/wishlist/${productId}`);
  return res.data;
};

export const removeFromWishlist = async (productId) => {
  const res = await API.delete(`/wishlist/${productId}`);
  return res.data;
};

export const toggleWishlist = async (productId) => {
  const res = await API.patch(`/wishlist/${productId}/toggle`);
  return res.data;
};

// Cart APIs (Lab 05)
export const fetchCart = async () => {
  const res = await API.get("/cart");
  return res.data;
};

export const addToCart = async (productId) => {
  const res = await API.post(`/cart/${productId}`);
  return res.data;
};

export const updateCartQuantity = async (productId, quantity) => {
  const res = await API.patch(`/cart/${productId}`, { quantity });
  return res.data;
};

export const removeFromCart = async (productId) => {
  const res = await API.delete(`/cart/${productId}`);
  return res.data;
};

// Order APIs (Lab 06)
export const createPaymentOrder = async (shippingAddress) => {
  const res = await API.post("/orders/create-payment-order", { shippingAddress });
  return res.data;
};

export const verifyPayment = async (paymentData) => {
  const res = await API.post("/orders/verify-payment", paymentData);
  return res.data;
};

export const fetchOrders = async () => {
  const res = await API.get("/orders");
  return res.data;
};

export const fetchOrderById = async (id) => {
  const res = await API.get(`/orders/${id}`);
  return res.data;
};

export const updateOrderStatus = async (id, status) => {
  const res = await API.patch(`/orders/${id}/status`, { status });
  return res.data;
};

export default API;
