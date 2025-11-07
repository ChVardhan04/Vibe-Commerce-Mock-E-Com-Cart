import { removeFromCart, addToCart } from "../api";

export default function Cart({ cart, refresh, onCheckoutClick }) {
  return (
    <div className="card">
      <h3>Cart</h3>
      {cart.items.length === 0 ? (
        <div className="small">Your cart is empty</div>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Line</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map(i => (
                <tr key={i.id}>
                  <td>{i.name}</td>
                  <td>
                    <div className="row">
                      <button className="btn" onClick={() => addToCart(i.id, -1).then(refresh)}>-</button>
                      <span>{i.qty}</span>
                      <button className="btn" onClick={() => addToCart(i.id, 1).then(refresh)}>+</button>
                    </div>
                  </td>
                  <td>₹{i.price}</td>
                  <td>₹{i.lineTotal}</td>
                  <td>
                    <button className="btn danger" onClick={() => removeFromCart(i.id).then(refresh)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="footer">
            <div><strong>Total: ₹{cart.total}</strong></div>
            <button className="btn primary" onClick={onCheckoutClick}>Checkout</button>
          </div>
        <div style={{ textAlign: "center", padding: 20, color: "#777" }}>
            Your cart is empty. Start shopping!
        </div>

        </>
      )}
    </div>
  );
}
