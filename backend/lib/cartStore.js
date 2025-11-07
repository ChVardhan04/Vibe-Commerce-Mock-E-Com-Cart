// lib/cartStore.js

// Simple in-memory store keyed by productId → qty
const cart = new Map();

export function resetCart() {
  cart.clear();
}

export function addToCart(productId, qty, products) {
  const product = products.find(p => String(p.id) === String(productId));
  if (!product) throw new Error("Product not found");

  const prev = cart.get(productId) || 0;
  const newQty = Math.max(0, prev + qty);

  if (newQty === 0) cart.delete(productId);
  else cart.set(productId, newQty);
}

export function removeFromCart(productId) {
  cart.delete(productId);
}

export function getCart(products) {
  const items = [];
  for (const [productId, qty] of cart.entries()) {
    const product = products.find(p => String(p.id) === String(productId));
    if (product)
      items.push({ ...product, qty, lineTotal: product.price * qty });
  }
  const total = items.reduce((sum, i) => sum + i.lineTotal, 0);
  return { items, total };
}
