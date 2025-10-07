import { useAppContext } from "../context/AppContext.jsx";

export default function Popup() {
  const { popup } = useAppContext();

  return (
    <div className={`position-fixed start-50 translate-middle my-bg-primary text-white p-3 rounded shadow popup ${popup.visible ? "show" : ""}`}>
      {popup.message}
    </div>
  );
}
