const mongoose = require("mongoose");
const Customer = require("../models/customer.model");
const Product = require("../models/product.model");

/**
 * Task 2 — Add Product to Cart API
 * POST /cart/:productId
 */
const addToCart = async (req, res) => {
  try {
    const { productId } = req.params;

    // Validate productId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    // Find product in database
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const user = await Customer.findById(req.user._id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    if (!user.cart) user.cart = [];

    // Optional quantity increment from body, defaulting to 1
    const qtyToAdd =
      req.body && typeof req.body.quantity === "number" && Number.isInteger(req.body.quantity) && req.body.quantity > 0
        ? req.body.quantity
        : 1;

    // Check if product is already in cart
    const cartItem = user.cart.find(
      (item) => item.product && item.product.toString() === productId
    );

    if (!cartItem) {
      // Check stock for initial quantity
      if (product.stock < qtyToAdd) {
        return res.status(400).json({
          success: false,
          message: product.stock <= 0 ? "Product is out of stock" : `Cannot add ${qtyToAdd}. Only ${product.stock} units available.`
        });
      }

      user.cart.push({
        product: productId,
        quantity: qtyToAdd
      });
    } else {
      // Validate that new quantity does not exceed product stock
      const newQuantity = cartItem.quantity + qtyToAdd;
      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more. Only ${product.stock} units available in stock.`
        });
      }

      cartItem.quantity = newQuantity;
    }

    await user.save();

    // Populate product information before returning
    const updatedUser = await Customer.findById(req.user._id).populate({
      path: "cart.product",
      select: "name price image stock category description"
    });

    const validCart = (updatedUser.cart || []).filter(item => item.product !== null);

    return res.status(200).json({
      success: true,
      message: "Cart updated",
      cart: validCart
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message
    });
  }
};

/**
 * Task 3 — Get Current User Cart
 * GET /cart
 */
const getCart = async (req, res) => {
  try {
    const user = await Customer.findById(req.user._id).populate({
      path: "cart.product",
      select: "name price image stock category description"
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    // Filter out any null products if a product was deleted
    const validCart = (user.cart || []).filter(item => item.product !== null);

    return res.status(200).json({
      success: true,
      cart: validCart
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message
    });
  }
};

/**
 * Task 4 — Update Product Quantity
 * PATCH /cart/:productId
 */
const updateQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    // Validate productId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    // Validate quantity is a valid integer number
    if (quantity === undefined || typeof quantity !== "number" || isNaN(quantity) || !Number.isInteger(quantity)) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a valid integer number"
      });
    }

    // Quantity must be at least 1
    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1"
      });
    }

    // Find product to check existence & stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const user = await Customer.findById(req.user._id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    if (!user.cart) user.cart = [];

    // Find item in cart
    const cartItem = user.cart.find(
      (item) => item.product && item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Product not in cart"
      });
    }

    // Validate quantity does not exceed stock
    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Quantity exceeds available stock. Only ${product.stock} units available.`
      });
    }

    cartItem.quantity = quantity;
    await user.save();

    const updatedUser = await Customer.findById(req.user._id).populate({
      path: "cart.product",
      select: "name price image stock category description"
    });

    const validCart = (updatedUser.cart || []).filter(item => item.product !== null);

    return res.status(200).json({
      success: true,
      message: "Quantity updated",
      cart: validCart
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message
    });
  }
};

/**
 * Task 5 — Remove Product from Cart
 * DELETE /cart/:productId
 */
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    // Validate productId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const user = await Customer.findById(req.user._id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    if (!user.cart) user.cart = [];

    const initialLength = user.cart.length;
    user.cart = user.cart.filter(
      (item) => item.product && item.product.toString() !== productId
    );

    if (user.cart.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart"
      });
    }

    await user.save();

    const updatedUser = await Customer.findById(req.user._id).populate({
      path: "cart.product",
      select: "name price image stock category description"
    });

    const validCart = (updatedUser.cart || []).filter(item => item.product !== null);

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart: validCart
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateQuantity,
  removeFromCart
};
