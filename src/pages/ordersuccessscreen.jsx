import { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function OrderSuccessScreen() {
  const { clearCart } = useCart(), {theme, fetchOrders, getProducts } = useAppContext(),{ user }=useAuth();
  useEffect(() => {
    clearCart();
    getProducts();
    fetchOrders(user?.id);
  }, []);

  return (
    <div className={`${theme ? "" : "bg-dark"}`}>
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <div className="my-text-green bg-white shadow p-5 rounded text-center" style={{ maxWidth: "400px" }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><defs><mask id="SVGIQLGgV2F"><g fill="none" strokeLinejoin="round" strokeWidth="4"><path fill="#fff" stroke="#fff" d="M24 44a19.94 19.94 0 0 0 14.142-5.858A19.94 19.94 0 0 0 44 24a19.94 19.94 0 0 0-5.858-14.142A19.94 19.94 0 0 0 24 4A19.94 19.94 0 0 0 9.858 9.858A19.94 19.94 0 0 0 4 24a19.94 19.94 0 0 0 5.858 14.142A19.94 19.94 0 0 0 24 44Z"/><path stroke="#000" strokeLinecap="round" d="m16 24l6 6l12-12"/></g></mask></defs><path fill="currentColor" d="M0 0h48v48H0z" mask="url(#SVGIQLGgV2F)"/></svg>
        <h1 className="h3 fw-bold mb-3 text-dark">Order Successful </h1>
        <h1 className="h3 fw-bold mb-3 text-dark">🎉 </h1>
        <p className="text-muted mb-4">
          Thank you for your purchase! Your order has been placed successfully.
        </p>

        <Link
          to="/"
          className="my-bg-green px-4 py-2 fw-semibold rounded-pill shadow-sm text-white"
        >
          Back to Home
        </Link>
      </div>
    </div>
    </div>
  );
}
