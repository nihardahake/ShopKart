const express = require("express");
const router = express.Router();
const {
  createPaymentOrder,
  verifyPayment,
  getUserOrders,
  getOrderById,
  updateOrderStatus
} = require("../controllers/order.controller");
const { protect } = require("../middlewares/auth.middleware");

// All order routes require authentication
router.use(protect);

// Order creation & payment
router.post("/create-payment-order", createPaymentOrder);
router.post("/", createPaymentOrder); // Alias for standard POST /orders
router.post("/verify-payment", verifyPayment);

// Order retrieval
router.get("/", getUserOrders);
router.get("/:id", getOrderById);

// Order status update (Bonus challenge)
router.patch("/:id/status", updateOrderStatus);

module.exports = router;
