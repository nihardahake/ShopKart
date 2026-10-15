import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/customers": "http://localhost:8008",
      "/products": "http://localhost:8008",
      "/wishlist": "http://localhost:8008",
      "/cart": "http://localhost:8008",
      "/orders": "http://localhost:8008",
      "/api": "http://localhost:8008"
    }
  }
});
