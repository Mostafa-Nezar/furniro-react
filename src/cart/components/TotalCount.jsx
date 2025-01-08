import { useContext } from "react";
import { CartContext } from "../context/CartContext";

const TotalCount = () => {
  const { cartItems } = useContext(CartContext);

  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <div className="bg-blue-100 text-blue-800 rounded-lg shadow-md p-4 flex items-center justify-between max-w-sm mx-auto">
      <span className="text-lg font-semibold">Total Items:</span>
      <h3 className="text-2xl font-bold">{totalQuantity}</h3>
    </div>
  );
};

export default TotalCount;
