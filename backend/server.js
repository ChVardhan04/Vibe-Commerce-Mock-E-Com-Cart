import express from "express";
import cors from "cors";
import { z } from "zod";
import { products as localProducts } from "./data/products.js";
import * as store from "./lib/cartStore.js";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Schemas for validation
const addSchema = z.object({
  productId: z.string(),
  qty: z.number().int().min(-100).max(100)
});

const checkoutSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  cartItems: z.array(
    z.object({
      productId: z.string(),
      qty: z.number().int().positive()
    })
  )
});

// We'll keep a cached product list in memory
let liveProducts = [...localProducts];

// Fetch real products (with fallback)
app.get("/api/products", async (req, res) => {
  try {
    const response = await fetch("https://fakestoreapi.com/products?limit=8");
    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      liveProducts = data.map(p => ({
        id: String(p.id),
        name: p.title,
        price: Math.round(p.price * 100),
        image: p.image
      }));
      return res.json(liveProducts);
    }

    // fallback
    liveProducts = [...localProducts];
    res.json(liveProducts);
  } catch (err) {
    console.error("Fake Store fetch failed:", err);
    liveProducts = [...localProducts];
    res.json(liveProducts);
  }
});

// CART ROUTES
app.get("/api/cart", (req, res) => {
  res.json(store.getCart(liveProducts));
});

app.post("/api/cart", (req, res) => {
  const parsed = addSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid cart input" });

  const { productId, qty } = parsed.data;
  try {
    store.addToCart(productId, qty, liveProducts);
    res.status(201).json(store.getCart(liveProducts));
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

app.delete("/api/cart/:id", (req, res) => {
  try {
    store.removeFromCart(req.params.id);
    res.json(store.getCart(liveProducts));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// CHECKOUT
app.post("/api/checkout", (req, res) => {
  const parsed = checkoutSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: "Invalid checkout data" });

  const { name, email, cartItems } = parsed.data;
  let total = 0;

  for (const item of cartItems) {
    const product = liveProducts.find(p => String(p.id) === String(item.productId));
    if (!product)
      return res.status(400).json({ error: `Invalid product: ${item.productId}` });
    total += product.price * item.qty;
  }

  const receipt = {
    id: "rcpt_" + Math.random().toString(36).slice(2, 10),
    name,
    email,
    total,
    timestamp: new Date().toISOString()
  };

  store.resetCart();
  res.status(201).json({ receipt });
});

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
