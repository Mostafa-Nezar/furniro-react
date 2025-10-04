import { useEffect, useState } from "react";

export default function Popup({message = "hello !"}) {
  const [ popup, setpopup ] = useState(false);

  useEffect(() => {
    if (popup) {
      const timer = setTimeout(() => setpopup(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [popup, setpopup]);

  return (<div className={`popup ${popup? "show":""}`}>{message}</div>);
}
