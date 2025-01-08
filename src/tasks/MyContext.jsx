import { createContext, useState, useContext, useEffect } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Emails State and Functions
  const [emails, setEmails] = useState(() => {
    const savedEmails = localStorage.getItem("emails");
    return savedEmails ? JSON.parse(savedEmails) : [];
  });

  const updateEmails = (newEmails) => {
    setEmails(newEmails);
    if (newEmails) {
      localStorage.setItem("emails", JSON.stringify(newEmails));
    } else {
      localStorage.removeItem("emails");
    }
  };

  // Cart State and Functions
  const [cart, setCart] = useState(() => {
    const storedItems = localStorage.getItem("cart");
    return storedItems ? JSON.parse(storedItems) : [];
  });

  const [total, setTotal] = useState(0);

  useEffect(() => {
    const newTotal = cart.reduce((acc, item) => acc + item.quantity, 0);
    setTotal(newTotal);
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // View State and Functions
  const [show, setShow] = useState("d-none");

  const setView = () => {
    setShow((prevShow) => (prevShow === "" ? "d-none" : ""));
  };

  // Add and Remove Item Functions
  const addItemToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    let updatedCart = [...cart];

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      item.quantity = 1;
      updatedCart.push(item);
    }

    setCart(updatedCart);
  };

  const removeItemFromCart = (id) => {
    setCart((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        emails,
        updateEmails,
        cart,
        setCart,
        total,
        show,
        setView,
        addItemToCart,
        removeItemFromCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
export default AppContext;
