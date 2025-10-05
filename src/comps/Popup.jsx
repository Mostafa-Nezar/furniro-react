import { useAppContext } from "../context/AppContext.jsx";

export default function Popup() {
  const { popup } = useAppContext();

  return (
    <div className={`popup ${popup.visible ? "show" : ""}`}>
      {popup.message}
    </div>
  );
}
