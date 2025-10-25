import { useCart } from "../context/CartContext";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";
import Features from "../comps/Features";
import Landing from "../comps/Landing";
const Cart = () => {
  const { cart, removeFromCart } = useCart(), { theme } = useAppContext();

  return (
    <>
<div className={`${theme ? "my-bg-semiWhite" : "bg-dark my-text-white"}`}>
  <Landing land={"Cart"} />

  <div className="container py-5">
    <div className="row g-5">
      {/* 🛒 قائمة المنتجات */}
      <div className="col-lg-8">
        {/* ✅ شريط العناوين متناسق مع الأعمدة */}
        <div className="my-bg-lightGray rounded-3 px-4 py-3 mb-3 shadow-sm">
          <div className="d-flex align-items-center justify-content-between text-uppercase fw-semibold my-text-darkGray" style={{ fontSize: "0.9rem" }}>
            <div style={{ width: "20%" }}>Product</div>
            <div style={{ width: "20%" }}>Price</div>
            <div style={{ width: "20%" }}>Quantity</div>
            <div style={{ width: "25%" }}>Subtotal</div>
            <div style={{ width: "10%" }}></div>
          </div>
        </div>

        {/* ✅ العناصر */}
        {cart.length > 0 ? (
          cart.map((cartItem) => (
            <div
              key={cartItem.id}
              className="d-flex align-items-center justify-content-between px-4 py-3 mb-3 my-bg-white rounded-3 shadow-sm"
            >
              {/* صورة المنتج + الاسم */}
              <div style={{ width: "20%" }} className="d-flex align-items-center gap-2">
                <Link to={`/details/${cartItem.id}`}>
                  <img
                    className="rounded-3"
                    width="65"
                    height="65"
                    src={cartItem.image || ""}
                    alt={cartItem.name || "Product"}
                    style={{ objectFit: "cover" }}
                  />
                </Link>
                <span className="fw-semibold my-text-darkGray text-truncate" style={{ maxWidth: "100px" }}>
                  {cartItem.name || "Unknown"}
                </span>
              </div>

              {/* السعر */}
              <div style={{ width: "20%" }} className="my-text-gray fw-medium">
                Rs {cartItem.price}
              </div>

              {/* الكمية */}
              <div style={{ width: "20%" }} className="my-text-gray fw-medium">
                {cartItem.quantity}
              </div>

              {/* الإجمالي */}
              <div style={{ width: "25%" }} className="my-text-green fw-bold">
                Rs {cartItem.price * cartItem.quantity}
              </div>

              {/* حذف */}
<div style={{ width: "10%" }} className="text-center">
  <img
    data-id={cartItem.id}
    className=" my-text-primary"
    style={{
      width: "26px",
      cursor: "pointer",
      transition: "0.3s ease",
    }}
    src="https://res.cloudinary.com/dutetsivc/image/upload/v1752665093/furniro/basket.png"
    alt="Delete"
    onClick={() => removeFromCart(cartItem.id)}
  />
</div>

            </div>
          ))
        ) : (
          <div className="text-center py-5 my-text-gray fs-5">
            Your cart is empty 🛍️
          </div>
        )}
      </div>

      {/* 💰 المجموع النهائي */}
      <div className="col-lg-4">
        <div className="p-5 text-center my-bg-lightBeige rounded-4 shadow">
          <h3 className="fw-bold mb-4 my-text-primary">Cart Totals</h3>
          <div className="mb-4">
            <span className="d-block my-text-gray fs-6">Subtotal:</span>
            <span className="d-block fs-4 fw-semibold my-text-green mt-2">
              Rs {cart.reduce((e, a) => e + a.quantity * a.price, 0)}
            </span>
          </div>
          <Link to="/Payment">
            <button
              className="fs-5 fw-semibold w-75 py-2 my-bg-primary my-text-white rounded-pill border-0 shadow-sm"
              style={{ transition: "0.3s" }}
              onMouseEnter={(e) => (e.target.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.target.style.opacity = "1")}
            >
              Check Out
            </button>
          </Link>
        </div>
      </div>
    </div>
  </div>

</div>
  <Features />

</>

  );
};

export default Cart;
