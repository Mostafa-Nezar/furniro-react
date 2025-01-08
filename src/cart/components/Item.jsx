import{ useContext } from "react";
import { CartContext } from "../context/CartContext";

const Item = ({ item }) => {
    const { addItemToCart } = useContext(CartContext);

    const handleAddToCart = () => {
        addItemToCart(item);
    };

    return (
        <div>
            <h3>{item.name}</h3>
            <button onClick={handleAddToCart}>Add to Cart</button>
        </div>
    );
};

export default Item;
