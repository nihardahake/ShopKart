const mongoose = require("mongoose");
const Product = require("../models/product.model");

/**
 * Task 2 — Create Product API
 * POST /products
 */
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, stock } = req.body;

    // Validation: Missing required field
    if (!name || !description || price === undefined || !category || !image || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: "Missing required field. name, description, price, category, image, and stock are required."
      });
    }

    const numericPrice = Number(price);
    const numericStock = Number(stock);

    // Validation: Invalid price (must be greater than 0)
    if (isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid price: Price must be greater than 0"
      });
    }

    // Validation: Invalid stock (cannot be negative)
    if (isNaN(numericStock) || numericStock < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid stock: Stock cannot be negative"
      });
    }

    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price: numericPrice,
      category: category.trim(),
      image: image.trim(),
      stock: numericStock
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message
    });
  }
};

/**
 * Task 3 & 5 — Get All Products API (with Search, Category, and Sorting)
 * GET /products
 */
const getAllProducts = async (req, res) => {
  try {
    const { search, category, sort } = req.query;
    const filter = {};

    // Dynamic search: case-insensitive match on name
    if (search && search.trim() !== "") {
      filter.name = { $regex: search.trim(), $options: "i" };
    }

    // Dynamic category filter (ignore if "All" or "All Categories")
    if (category && category.trim() !== "" && category.toLowerCase() !== "all" && category.toLowerCase() !== "all categories") {
      filter.category = { $regex: `^${category.trim()}$`, $options: "i" };
    }

    // Bonus Challenge: Sorting by price
    let sortOption = { createdAt: -1 }; // default: latest first
    if (sort === "price_asc") {
      sortOption = { price: 1 };
    } else if (sort === "price_desc") {
      sortOption = { price: -1 };
    }

    const products = await Product.find(filter).sort(sortOption);

    return res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message
    });
  }
};

/**
 * Task 4 — Get Single Product API
 * GET /products/:id
 */
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validation: Invalid product ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const product = await Product.findById(id);

    // Validation: Product not found
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById
};
