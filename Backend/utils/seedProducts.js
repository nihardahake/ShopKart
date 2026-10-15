const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const Product = require("../models/product.model");

dotenv.config({ path: path.join(__dirname, "../.env") });

const sampleProducts = [
  {
    name: "Noise Cancelling Headphones",
    description: "Premium wireless over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear acoustic sound.",
    price: 4999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    stock: 25
  },
  {
    name: "Mechanical Keyboard",
    description: "Custom RGB mechanical keyboard featuring tactile blue switches, durable PBT keycaps, and customizable backlighting profiles.",
    price: 2999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
    stock: 15
  },
  {
    name: "Wireless Gaming Mouse",
    description: "Ultra-lightweight ergonomic optical gaming mouse with 16,000 DPI sensor, PTFE feet, and ultra-fast lag-free wireless response.",
    price: 1899,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80",
    stock: 40
  },
  {
    name: "4K Ultra-Wide Monitor",
    description: "34-inch curved ultra-wide IPS display with 144Hz refresh rate, HDR400 support, and USB-C power delivery connectivity.",
    price: 24999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
    stock: 8
  },
  {
    name: "Classic Cotton Hoodie",
    description: "Heavyweight 100% organic cotton fleece pullover hoodie with double-needle stitching, pouch pocket, and relaxed fit.",
    price: 1499,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80",
    stock: 35
  },
  {
    name: "Slim-Fit Denim Jacket",
    description: "Timeless vintage wash denim jacket made from premium durable selvedge cotton denim with metal button closure.",
    price: 2799,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80",
    stock: 20
  },
  {
    name: "Running Sports Shoes",
    description: "Engineered breathable mesh road running sneakers with high-rebound responsive foam cushioning and carbon rubber traction.",
    price: 3499,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    stock: 18
  },
  {
    name: "Clean Code",
    description: "A handbook of agile software craftsmanship by Robert C. Martin. Learn how to write cleaner, maintainable, and readable code.",
    price: 899,
    category: "Books",
    image: "https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=800&q=80",
    stock: 50
  },
  {
    name: "The Pragmatic Programmer",
    description: "20th Anniversary Edition: Your journey to mastery in software development, practical tips for modern engineering excellence.",
    price: 1099,
    category: "Books",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
    stock: 30
  },
  {
    name: "Smart LED Desk Lamp",
    description: "Dimmable minimalist architect desk lamp with touch controls, 5 color temperature modes, and wireless charging pad base.",
    price: 1999,
    category: "Home",
    image: "https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=800&q=80",
    stock: 22
  },
  {
    name: "Ceramic Coffee Mug Set",
    description: "Handcrafted matte ceramic stoneware mugs set of 2, 350ml capacity, microwave and dishwasher safe with ergonomic handle.",
    price: 699,
    category: "Home",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80",
    stock: 60
  },
  {
    name: "Ergonomic Office Chair",
    description: "Breathable mesh executive desk chair with adjustable lumbar support, 3D armrests, and pneumatic seat height adjustment.",
    price: 8999,
    category: "Home",
    image: "https://images.unsplash.com/photo-1580481077195-c3a821a58875?w=800&q=80",
    stock: 12
  }
];

const seedProducts = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shopkart";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for seeding...");

    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(sampleProducts);
      console.log(`Successfully seeded ${sampleProducts.length} products into ShopKart database!`);
    } else {
      console.log(`Database already contains ${count} products. Skipping seeding.`);
    }

    if (require.main === module) {
      await mongoose.disconnect();
      process.exit(0);
    }
  } catch (error) {
    console.error("Error seeding products:", error.message);
    if (require.main === module) {
      process.exit(1);
    }
  }
};

if (require.main === module) {
  seedProducts();
}

module.exports = seedProducts;
