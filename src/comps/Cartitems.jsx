import { useState, useEffect } from 'react';

function Cartitem({ toggleCart }) {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    const fetchedCartItems = [
      {
        id: 1,
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        genre: "Fantasy",
        publicationYear: 1954,
        price: 19.99
      },
      {
        id: 2,
        title: "Pride and Prejudice",
        author: "Jane Austen",
        genre: "Romance",
        publicationYear: 1813,
        price: 12.99
      },
      {
        id: 3,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        genre: "Fiction",
        publicationYear: 1960,
        price: 14.99
      },
      {
        id: 4,
        title: "The Hitchhiker's Guide to the Galaxy",
        author: "Douglas Adams",
        genre: "Science Fiction",
        publicationYear: 1979,
        price: 11.99
      }
    ];
    
    setCartItems(fetchedCartItems);
    setSubtotal(calculateSubtotal(fetchedCartItems));
  }, []);

  const calculateSubtotal = (items) => {
    return items.reduce((total, item) => total + item.price, 0);
  };

  const handleRemoveItem = (itemId) => {
    const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCartItems);
    setSubtotal(calculateSubtotal(updatedCartItems));
  };

  return (
    <section 
    >
      <div className="d-flex justify-content-between align-items-center p-2 pb-0">
        <h4 className="d-inline dont">Shopping Cart</h4>
        <img onClick={toggleCart} src="images/cart.png" className="closing" style={{ cursor: 'pointer' }} alt="" />
      </div>
      <hr />
      <section id="listcard" className="dont mb-3">
        {cartItems.map((item) => (
          <div key={item.id}>
            <h5>{item.title}</h5>
            <p>{item.author}</p>
            <p>${item.price.toFixed(2)}</p>
            <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
          </div>
        ))}
      </section>
      <span className="subtotal">Subtotal: ${subtotal.toFixed(2)}</span>
      <hr style={{ width: '110%' }} className="me-5" />
      <div className="dont btncart d-flex">
        <button className="dont carting">
          <a style={{ border: 'none' }} href="cart/cart.html">
            cart
          </a>
        </button>
        <a href="checkout/checkout.html">
          <button className="dont checkout">checkout</button>
        </a>
        <a href="compare/compare.html?id=40">
          <button className="dont">compare</button>
        </a>
      </div>
    </section>
  );
}

export default Cartitem;
