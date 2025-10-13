import { useState } from "react";
import { useAppContext } from "../context/AppContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function PayPalCheckout() {
  const { user } = useAuth();
  const { cart } = useCart();
  const { togglePopup } = useAppContext();
  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce((t, i) => t + i.price * i.quantity, 0);
  const total = subtotal; 

  const handlePayPal = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://furniro-back-production.up.railway.app/api/paypal2/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          total,
          userId: user.id,
          products: cart,
          customerInfo: {
            fullName: user.name,
            email: user.email,
            address: user.address || "",
            city: user.city || "",
            state: user.state || "",
            zipCode: user.zipCode || ""
          }
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to create order");
      const approveLink = data.links.find(l => l.rel === "approve")?.href;
      if (!approveLink) throw new Error("No approval link found");

      window.open(approveLink, "_blank");
      setLoading(false);
    } catch (err) {
      console.error(err);
      togglePopup(err.message || "Payment failed");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayPal}
      disabled={loading}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      {loading ? "Processing..." : `Pay $${total.toFixed(2)} with PayPal`}
    </button>
  );
}
