import { useCart } from "../context/CartContext";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";
import Features from "../comps/Features";
import Landing from "../comps/Landing";
const Cart = () => {
  const { cart, removeFromCart } = useCart(), { theme } = useAppContext();

  return (
    <div className={`${theme ? "" : "bg-dark -white"}`}>
      <Landing land={"Cart"} />
      <div className="container">
        <div className="row py-5 my-5">
          <div className="col-lg-7">
            <div
              className="d-flex justify-content-evenly align-items-center p-2 mb-4"
              style={{
                backgroundColor: "var(--color3)",
                borderRadius: "10px",
              }}
            >
              <div></div>
              <div></div>
              <div>product</div>
              <div>price</div>
              <div>quantity</div>
              <div>subtotal</div>
              <div></div>
            </div>
            {cart.map((cartItem) => (
              <div
                className="d-flex justify-content-evenly align-items-center mb-2"
                key={cartItem.id}
              >
                <div className="image">
                  <Link to={`/details/${cartItem.id}`}>
                    <img
                      className="sth rounded"
                      width={"70"}
                      height={"70"}
                      src={`${cartItem.image || ""}`}
                      alt={cartItem.name || "Product"}
                    />
                  </Link>
                </div>
                <div className="name mb-2">{cartItem.name || "Unknown"}</div>
                <div className="quantity">Rs {cartItem.price}</div>
                <div className="price">{cartItem.quantity}</div>
                <div className="quantity">
                  Rs {cartItem.price * cartItem.quantity}
                </div>
                <div>
                  <img
                    data-id={cartItem.id}
                    className="deleteitem mt-3"
                    style={{ width: "20px", cursor: "pointer" }}
                    src="https://res.cloudinary.com/dutetsivc/image/upload/v1752665093/furniro/basket.png"
                    alt="Delete"
                    onClick={() => removeFromCart(cartItem.id)}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="col-lg-5 mt-lg-5">
            <div
              className="m-5 py-5 text-center"
              style={{ backgroundColor: "var(--color3)", borderRadius: "10px" }}
            >
              <h2 className="fw-bold mb-5">Cart Totals</h2>
              <div className="totalprice mb-4">
                <span className="subtotal ">Subtotal:</span>
                <br />
                <br />
                <span className="total">Subtotal: {cart.reduce((e,a)=>e + a.quantity * a.price,0)}</span>
                <br />
                <br />
              </div>
              <Link to={"/Payment"}>
                <button
                  className="fs-5 checkout w-50"
                  style={{
                    border: " 1px solid",
                    borderRadius: "16px",
                    paddingBlock: "0.6em",
                    backgroundColor: "transparent",
                  }}
                >
                  Check Out
                </button>
                </Link>
            </div>
          </div>
        </div>
      </div>
      <Features />
    </div>
  );
};

export default Cart;
