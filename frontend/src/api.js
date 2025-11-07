// frontend/src/api.js

const BASE_URL = "http://localhost:5000"; // your backend

async function api(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Request failed");
  }

  return res.json();
}

export const getProducts = () => api("/api/products");
export const getCart = () => api("/api/cart");
export const addToCart = (productId, qty) =>
  api("/api/cart", {
    method: "POST",
    body: JSON.stringify({ productId, qty }),
  });
export const removeFromCart = (id) =>
  api(`/api/cart/${id}`, { method: "DELETE" });
export const checkout = (payload) =>
  api("/api/checkout", {
    method: "POST",
    body: JSON.stringify(payload),
  });
