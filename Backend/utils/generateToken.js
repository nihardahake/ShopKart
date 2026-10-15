const jwt = require("jsonwebtoken");

/**
 * Generate JWT and set HttpOnly cookie
 * @param {Object} res - Express response object
 * @param {string|mongoose.Types.ObjectId} customerId - Customer identifier
 * @returns {string} token
 */
const generateToken = (res, customerId) => {
  const token = jwt.sign(
    { customerId },
    process.env.JWT_SECRET || "shopkart_jwt_secret_key_2026_engineering_lab_super_secure",
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
  });

  return token;
};

module.exports = generateToken;
