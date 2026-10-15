const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const customerRouter = require("./routes/customer.routes");
const productRouter = require("./routes/product.routes");
const wishlistRouter = require("./routes/wishlist.routes");
const cartRouter = require("./routes/cart.routes");
const orderRouter = require("./routes/order.routes");
const path = require("path");
dotenv.config();
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const port = process.env.PORT || 8008;
const dbUrl = process.env.dbURL || process.env.dburl || process.env.MONGO_URI;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/customers", customerRouter);
app.use("/products", productRouter);
app.use("/wishlist", wishlistRouter);
app.use("/cart", cartRouter);
app.use("/orders", orderRouter);

if (!dbUrl) {
  console.error("Missing MongoDB connection URL in environment variables.");
} else {
  mongoose
    .connect(dbUrl)
    .then(() => {
      console.log("DB Connected Successfully");
    })
    .catch((err) => {
      console.log("MongoDB Error:", err.message);
    });
}

app.listen(port, () => {
  console.log(`Server Has Started at port ${port}`);
});

module.exports = app;
