import { useAppContext } from "../tasks/MyContext";
import { Link } from "react-router-dom";
const CartSection = ({ toggle, settoggle }) => {
  const { cart, removeItemFromCart } = useAppContext(); // استيراد cart و removeItemFromCart

  const calculateSubtotal = () => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <section id="listcardparent" className={`${toggle ? "disp" : ""}`}>
      <div className="d-flex justify-content-between align-items-center p-2 pb-0">
        <h4 className="d-inline dont">Shopping Cart</h4>
        <img
          src="../images/cart.png"
          className="closing"
          style={{ cursor: "pointer" }}
          alt="Close"
          onClick={settoggle}
        />
      </div>
      <hr />
      <section id="listcard" className="dont mb-3">
        {cart.map((p, index) => (
          <div
            key={p.id || index}
            className="myitem d-flex justify-content-between align-items-center ps-3 dont"
            style={{ width: "92%" }}
          >
            <div className="image dont">
              <a className="dont">
                <img
                  width={"50"}
                  className="img-fluid dont sth"
                  src={`../${p.image}`}
                  alt={p.name}
                />
              </a>
            </div>
            <div className="dont">
              <div className="dont name">{p.name}</div>
              <div>{p.quantity}</div>
              <div className="dont">
                <span className="mx-2">X</span>
                <span className="dont" style={{ color: "var(--primary)" }}>
                  Rs {p.price * p.quantity}.00
                </span>
              </div>
            </div>
            <div className="dont">
              <img
                className="deleteitem dont"
                style={{ width: "20px", cursor: "pointer" }}
                src="../images/x.png"
                alt="Delete"
                onClick={() => removeItemFromCart(p.id)} // تفعيل الحذف
              />
            </div>
          </div>
        ))}
      </section>
      <div className="subtotal">
        Subtotal: <strong>Rs {calculateSubtotal()}</strong>
      </div>
      <hr style={{ width: "110%" }} className="me-5" />
      <div className="dont btncart d-flex">
        <button className="dont carting">
          <Link className={`nav-link mt-0 mb-0 text-black`} to="/cart">
            Cart
          </Link>
        </button>
        <a href="../checkout/checkout.html">
          <button className="dont checkout">Checkout</button>
        </a>
        <a href="#">
          <button className="dont">Comparison</button>
        </a>
      </div>
    </section>
  );
};

export default CartSection;
