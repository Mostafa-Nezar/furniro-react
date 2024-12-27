const ShoppingCart = ({ cart, toggleCart, setCart }) => {
    const removeFromCart = (id) => {
      const updatedCart = cart.filter(item => item.productid !== id);
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    };
  
    const calculateTotal = () => {
      return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };
  
    return (
      <div className="shopping-cart-container">
        <button onClick={toggleCart} className="close-cart">Close</button>
        <h2>Your Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty!</p>
        ) : (
          <>
            <div>
              {cart.map((item) => (
                <div key={item.productid} className="cart-item">
                  <div>{item.name}</div>
                  <div>{item.quantity} x {item.price}</div>
                  <button onClick={() => removeFromCart(item.productid)}>Remove</button>
                </div>
              ))}
            </div>
            <div>Total: {calculateTotal()} Rs</div>
          </>
        )}
      </div>
    );
  };
  
  export default ShoppingCart;
  