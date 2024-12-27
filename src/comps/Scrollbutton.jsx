import { useState, useEffect } from "react";

const Scrollbutton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 20) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <button
      id="scrollToTopBtn"
      style={{
        display: isVisible ? "block" : "none"
      }}
      onClick={scrollToTop}
    >
      Scroll to Top
    </button>
  );
};

export default Scrollbutton;
