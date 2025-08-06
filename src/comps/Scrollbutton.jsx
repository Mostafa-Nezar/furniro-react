import { useState, useEffect } from "react";

const Scrollbutton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    setIsVisible(window.scrollY > 20);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      className={`position-fixed text-white border-0 rounded my-bg-black ${isVisible ?"d-block":"d-none"}`}
      style={{ bottom: "20px",right: "20px",zIndex: 99,cursor: "pointer", padding: "15px",borderRadius: "10px",outline: "none"}}
      onClick={scrollToTop}
      onMouseOver={(e) => (e.currentTarget.classList.toggle("my-bg-primary"))}
      onMouseOut={(e) => (e.currentTarget.classList.toggle("my-bg-primary"))}
    >
      S
    </button>
  );
};

export default Scrollbutton;
