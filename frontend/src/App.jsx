import { useEffect, useState } from "react";
import ProductGrid from "./components/ProductGrid";
import Cart from "./components/Cart";
import CheckoutModal from "./components/CheckoutModal";
import { getCart } from "./api";
import { Toaster } from "react-hot-toast";

export default function App() {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const refresh = async () => {
  const data = await getCart();
  setCart(data);
  localStorage.setItem("cart", JSON.stringify(data));
};

useEffect(() => {
  const saved = localStorage.getItem("cart");
  if (saved) setCart(JSON.parse(saved));
  refresh();
}, []);


  useEffect(() => {
    refresh();
  }, []);

  return (
    <>
      <header>
        <div
          className="container row"
          style={{ justifyContent: "space-between" }}
        >
          <h2 style={{ margin: 0 }}>Vibe Store</h2>
          <div className="badge">{cart.items.length} items</div>
        </div>
        <Toaster position="top-right" />
      </header>

      <main className="container" style={{ display: "grid", gap: 16 }}>
        <ProductGrid onChanged={refresh} />
        <Cart
          cart={cart}
          refresh={refresh}
          onCheckoutClick={() => setCheckoutOpen(true)}
        />
      </main>

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cart={cart}
        onSuccess={refresh}
      />
      
    </>
    
  );
}
