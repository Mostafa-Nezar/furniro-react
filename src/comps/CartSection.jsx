import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
const CartSection = ({ toggle, settoggle }) => {
  const { cart, removeFromCart } = useCart(); 
  const calculateSubtotal = () => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <section id="listcardparent" className={`position-absolute bg-white p-3 top-0 ${toggle ? "disp" : ""}`} style={{zIndex:"2000"}}>
      <div className="d-flex justify-content-between align-items-center p-2 pb-0">
        <h4 className="d-inline ">Shopping Cart</h4>
        <button
          className="closing btn btn-link p-0"
          style={{ cursor: "pointer", border: "none", background: "none" }}
          onClick={settoggle}
          aria-label="Close cart"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <hr />
      <section id="listcard" className="mb-3">
        {cart.map((p, index) => (
          <div
            key={p.id || index}
            className="d-flex justify-content-between align-items-center ps-3 my-2"
            style={{ width: "92%" }}
          >
            <div>
              <a className="">
                <img
                  width={"50"}
                  className="img-fluid rounded"
                  src={p.image}
                  alt={p.name}
                  style={{ objectFit: "cover" }}
                />
              </a>
            </div>
            <div className="">
              <div className=" name">{p.name}</div>
              
              <div className="">
                {p.quantity}
                <span className="mx-2">X</span>
                <span className="my-text-primary">
                  Rs {p.price * p.quantity}.00
                </span>
              </div>
            </div>
            <div className="">
              <button
                className="deleteitem btn btn-link p-0"
                style={{ cursor: "pointer", border: "none", background: "none" }}
                onClick={() => removeFromCart(p.id)}
                aria-label="Remove item"
              >
               <img src="https://res.cloudinary.com/dutetsivc/image/upload/v1752665093/furniro/x.png" alt="" />
              </button>
            </div>
          </div>
        ))}
      </section>
      <div className="subtotal">
        Subtotal: <strong>Rs {calculateSubtotal()}</strong>
      </div>
      <hr style={{ width: "110%" }} className="me-5" />
      <div className=" btncart d-flex">
        <button className=" carting">
          <Link
            onClick={settoggle}
            className={`nav-link mt-0 mb-0 text-black`}
            to="/cart"
          >
            Cart
          </Link>
        </button>
        <Link to={'/Payment'}>
          <button className=" checkout">Checkout</button>

        </Link>        
        <a href="#">
          <button className="">Comparison</button>
        </a>
      </div>
    </section>
  );
};

export default CartSection;


