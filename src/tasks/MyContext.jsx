import { createContext, useState, useContext } from "react";

const MyContext = createContext();

export const MyContextProvider = ({ children }) => {
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

  return (
    <MyContext.Provider value={{ emails, updateEmails }}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => useContext(MyContext);
export default MyContext;
