import { useState } from "react";
import { checkout } from "../api";

export default function CheckoutModal({ open, onClose, cart, onSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState(null);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        name,
        email,
        cartItems: cart.items.map(i => ({ productId: i.id, qty: i.qty }))
      };
      const res = await checkout(payload);
      setReceipt(res.receipt);
      onSuccess();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {!receipt ? (
          <form onSubmit={handleSubmit}>
            <h3>Checkout</h3>
            <div className="row" style={{ gap: 12, flexDirection: "column" }}>
              <input
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
              <input
                placeholder="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            {error && <div className="small" style={{ color: "#b00" }}>{error}</div>}
            <div className="footer">
              <button className="btn" type="button" onClick={onClose}>Cancel</button>
              <button className="btn primary" type="submit">Mock Pay</button>
            </div>
          </form>
        ) : (
          <div>
            <h3>Receipt</h3>
            <p className="small">ID: {receipt.id}</p>
            <p>Total: ₹{receipt.total}</p>
            <p className="small">Time: {new Date(receipt.timestamp).toLocaleString()}</p>
            <div className="footer">
              <button className="btn primary" onClick={onClose}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
