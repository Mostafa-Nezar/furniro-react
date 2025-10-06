import { useEffect } from "react";
import { useCart } from "../context/CartContext";

export default function Ordersuccessscreen() {
        const { clearCart } = useCart();
        useEffect(()=>{clearCart()},[])
        

  return (
    <div>ordersuccessscreen</div>
  )
}
