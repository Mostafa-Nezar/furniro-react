import { createContext, useState, useContext } from "react";

const MyContext = createContext();

export const MyContextProvider = ({ children }) => {
  const [isSubscribed, setIsSubscribed] = useState(
    !!JSON.parse(localStorage.getItem("emails"))
  );

  const updateSubscription = (status) => {
    setIsSubscribed(status);
  };

  return (
    <MyContext.Provider value={{ isSubscribed, updateSubscription }}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => useContext(MyContext);
export default MyContext;