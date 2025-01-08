import { useContext } from "react";
import { CartContext } from "../context/CartContext";

const CartSection = () => {
  const { cartItems, removeItemFromCart } = useContext(CartContext);

  return (
    <div>
      <h2>Cart</h2>
      {cartItems.length === 0 ? (
        <p>No items in the cart</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              {item.name}
              <div>{item.quantity}</div>

              <button onClick={() => removeItemFromCart(item.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CartSection;
