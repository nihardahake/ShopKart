const Razorpay = require("razorpay");

const keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_shopkart2026";
const keySecret = process.env.RAZORPAY_KEY_SECRET || "shopkart_test_secret_key_super_secure";

const razorpay = new Razorpay({
  key_id: keyId,
  key_secret: keySecret
});

module.exports = razorpay;
