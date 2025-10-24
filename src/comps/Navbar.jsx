import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useAppContext } from "../context/AppContext"; 
import { useState } from "react";
function Navbar({ toggle }) {
  const location = useLocation();
  const { user } = useAuth();
  const { cart } = useCart();
  const { theme ,toggleTheme, searchQuery, setSearchQuery } = useAppContext();
  const [likewebsite, setlikewebsite] = useState(JSON.parse(localStorage.getItem("likewebsite") ) || false)
  const [showsearch, setshowsearch] =useState(false);
  const SunIcon = () => (
    <svg className="my-text-yellow" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path fill="currentColor" fillRule="evenodd" d="M13 3a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0zM6.343 4.929A1 1 0 0 0 4.93 6.343l1.414 1.414a1 1 0 0 0 1.414-1.414zm12.728 1.414a1 1 0 0 0-1.414-1.414l-1.414 1.414a1 1 0 0 0 1.414 1.414zM12 7a5 5 0 1 0 0 10a5 5 0 0 0 0-10m-9 4a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2zm16 0a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2zM7.757 17.657a1 1 0 1 0-1.414-1.414l-1.414 1.414a1 1 0 1 0 1.414 1.414zm9.9-1.414a1 1 0 0 0-1.414 1.414l1.414 1.414a1 1 0 0 0 1.414-1.414zM13 19a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0z" clipRule="evenodd" />
    </svg>
  );
  const MoonIcon = () => (
    <svg className="text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path fill="currentColor" d="M11.38 2.019a7.5 7.5 0 1 0 10.6 10.6C21.662 17.854 17.316 22 12.001 22C6.477 22 2 17.523 2 12c0-5.315 4.146-9.661 9.38-9.981" />
    </svg>
  );
  const Icon = !theme ? MoonIcon : SunIcon;

  const togglelikewebsite = () =>{
      const newValue = !likewebsite;
      setlikewebsite(newValue);
      localStorage.setItem("likewebsite", JSON.stringify(newValue));

  }
  const isAuthenticated = !!user;
  const cartLength = cart.reduce((total, item) => total + (item.quantity || 1), 0) || 0;
  const navClass = theme ? "navbar bg-white text-dark" : "navbar bg-dark text-light border-bottom border-secondary";
  const linkClass = (path) =>
    `nav-link ms-5 ${theme ? "text-dark" : "text-light"} ${
      isActive(path) ? "active text-primary" : ""
    }`;

  const iconColor = theme ? "text-dark" : "text-light";

  function Authicon() {
    if (!isAuthenticated) {
      return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="26"
        height="26"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M20 12V7h2v6h-2m0 4h2v-2h-2m-10-2c2.67 0 8 1.34 8 4v3H2v-3c0-2.66 5.33-4 8-4m0-9a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10.9c-2.97 0-6.1 1.46-6.1 2.1v1.1h12.2V17c0-.64-3.13-2.1-6.1-2.1m0-9A2.1 2.1 0 0 0 7.9 8a2.1 2.1 0 0 0 2.1 2.1A2.1 2.1 0 0 0 12.1 8A2.1 2.1 0 0 0 10 5.9"
        />
      </svg>
      );
    }
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="25"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="ai ai-PersonCheck"
      >
        <circle cx="12" cy="7" r="5" />
        <path d="M17 22H5.266a2 2 0 0 1-1.985-2.248l.39-3.124A3 3 0 0 1 6.649 14H7" />
        <path d="M17 16.5l1.5 1.5 2.5-3" />
      </svg>
    );
  }

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${navClass} navbar-expand-md ${location.pathname === "/shop" ? "sticky-top" : ""} sticky-top top-0`}>
      <div className="container-fluid">
        {/* Logo */}
        <Link className={`ms-4 navbar-brand fw-bold fs-4 ${theme ? "text-dark" : "text-light"}`} to="/">
          <img src="https://res.cloudinary.com/dutetsivc/image/upload/v1760013317/logo_ikqv7r.png" className="d-inline-block align-text-top" alt="Furniro logo" />
          Furniro
        </Link>
        {/* Toggler */}
        <button
          className={`navbar-toggler text-black ${iconColor}`}
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
        >
          <span className={`text-black ${iconColor}`}>
            <svg width="20" height="26" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M0 96C0 78.3 14.3 64 32 64H416..." />
            </svg>
          </span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={linkClass("/")} to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={linkClass("/shop")} to="/shop">
                Shop
              </Link>
            </li>
            <li className="nav-item">
              <Link className={linkClass("/About")} to="/About">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className={linkClass("/contact")} to="/contact">
                Contact
              </Link>
            </li>
          </ul>
            {showsearch && (
              <input
                type="text"
                className="w-25 my-form-control mx-2"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  fontSize: "14px",
                  maxWidth:"20%"
                }}
              />
            )}
          <ul className="navbar-nav ms-5 me-5">
            <li>
              <Link className={`nav-link mt-0 mb-0  ${iconColor} ${isActive("/Profile") ? "active text-primary" : ""}`} to={isAuthenticated ? "/Profile" : "/signin"}>
                <Authicon />
              </Link>
            </li>
            <li onClick={()=>{setshowsearch(!showsearch)}}>
              <Link className={`nav-link mt-0 mb-0 ${iconColor}`} to="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="23"
                  height="23"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ai ai-Search"
                >
                  <path d="M21 21l-4.486-4.494M19 10.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0z" />
                </svg>
              </Link>
            </li>
            <li onClick={toggleTheme} className={`nav-link mt-0 mb-0 ${iconColor} ${theme?"my-text-yellow":"moon"}`} >
             <Icon />
            </li>
            <li onClick = {togglelikewebsite}>
              <Link className={`nav-link mt-0 mb-0 ${iconColor}`} id="heart" to="#">
                <div id="heart" className={`heart-icon ${likewebsite ? "red" : ""}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 48 48" fill="none">
                    <path
                      className="pathsvg"
                      fill={likewebsite ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="4"
                      d="M15 8C8.925 8 4 12.925 4 19c0 11 13 21 20 23.326C31 40 44 30 44 19c0-6.075-4.925-11-11-11c-3.72 0-7.01 1.847-9 4.674A10.987 10.987 0 0 0 15 8z"
                    />
                  </svg>
                </div>
              </Link>
            </li>

            {/* سلة */}
            <li className="position-relative" onClick={toggle}>
              <Link className={`nav-link mt-0 mb-0 ${iconColor} ${isActive("/Cart") ? "active text-primary" : ""}`} to="Cart">
                <svg className="icon-cart" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 1024 1024"><path className="icon-cart" fill="currentColor" d="M922.9 701.9H327.4l29.9-60.9l496.8-.9c16.8 0 31.2-12 34.2-28.6l68.8-385.1c1.8-10.1-.9-20.5-7.5-28.4a34.99 34.99 0 0 0-26.6-12.5l-632-2.1l-5.4-25.4c-3.4-16.2-18-28-34.6-28H96.5a35.3 35.3 0 1 0 0 70.6h125.9L246 312.8l58.1 281.3l-74.8 122.1a34.96 34.96 0 0 0-3 36.8c6 11.9 18.1 19.4 31.5 19.4h62.8a102.43 102.43 0 0 0-20.6 61.7c0 56.6 46 102.6 102.6 102.6s102.6-46 102.6-102.6c0-22.3-7.4-44-20.6-61.7h161.1a102.43 102.43 0 0 0-20.6 61.7c0 56.6 46 102.6 102.6 102.6s102.6-46 102.6-102.6c0-22.3-7.4-44-20.6-61.7H923c19.4 0 35.3-15.8 35.3-35.3a35.42 35.42 0 0 0-35.4-35.2M305.7 253l575.8 1.9l-56.4 315.8l-452.3.8zm96.9 612.7c-17.4 0-31.6-14.2-31.6-31.6s14.2-31.6 31.6-31.6s31.6 14.2 31.6 31.6a31.6 31.6 0 0 1-31.6 31.6m325.1 0c-17.4 0-31.6-14.2-31.6-31.6s14.2-31.6 31.6-31.6s31.6 14.2 31.6 31.6a31.6 31.6 0 0 1-31.6 31.6"></path></svg>
              </Link>
                <span
                  className="position-absolute d-flex justify-content-center align-items-center text-white rounded-circle"
                  style={{backgroundColor: "var(--redcolor)", width: "20px", height: "20px", left: "25px", top: "0", fontSize: "12px", padding: "0"}}>{cartLength}</span>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
