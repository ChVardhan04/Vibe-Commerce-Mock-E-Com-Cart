import { useEffect, useState } from "react";
import { getProducts, addToCart } from "../api";
import toast from "react-hot-toast";
export default function ProductGrid({ onChanged }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProducts()
      .then(setItems)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="small">Loading products...</div>;
  if (error) return <div className="small" style={{ color: "#b00" }}>{error}</div>;

  return (
    <div className="grid">
      {items.map(p => (
        <div key={p.id} className="card">
          <h3>{p.name}</h3>
          <div className="price">₹{p.price}</div>
          <div className="row">
            <button className="btn" onClick={() => addToCart(p.id, -1).then(onChanged)}>-1</button>
            <button className="btn primary" onClick={() =>
  addToCart(p.id, 1).then(() => {
    onChanged();
    toast.success(`${p.name} added to cart`);
  }).catch(() => toast.error("Failed to add"))
}>Add to Cart</button>
          </div>
        </div>
      ))}
    </div>

    





    
  );
}
