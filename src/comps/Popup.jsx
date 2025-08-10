import { useEffect } from "react";
import { useAppContext } from "../context/AppContext";

export default function Popup() {
  const { user, popup, setpopup } = useAppContext();
  const message = !user?.id ? "Not Authenticated !" : "Added To Cart !";

  useEffect(() => {
    if (popup) {
      const timer = setTimeout(() => setpopup(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [popup, setpopup]);

  return (<div className={`popup ${popup? "show":""}`}>{message}</div>);
}
