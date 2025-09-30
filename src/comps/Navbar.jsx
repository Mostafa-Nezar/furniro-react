import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Navbar({ toggle }) {
  const location = useLocation();
  const { user } = useAuth();
  const { cart } = useCart();

  const isAuthenticated = !!user;
  const cartLength = cart.reduce((total, item) => total + (item.quantity || 1), 0) || 0;


  function Authicon() {
    if (!isAuthenticated) {
      return (
        <Link className="" to="/signin">
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
        </Link>
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
    <nav className={`navbar bg-white navbar-expand-md ${location.pathname === "/shop" ? "sticky-top" : ""} sticky-top top-0`}>
      <div className="container-fluid">
        {/* Logo */}
        <Link className="ms-4 navbar-brand fw-bold fs-4 text-black" to="/">
          <img src="/images/logo.png" className="d-inline-block align-text-top" alt="Furniro logo" />
          Furniro
        </Link>

        {/* Toggler */}
        <button
          className="navbar-toggler text-black"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
        >
          <span className="text-black">
            <svg width="20" height="26" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M0 96C0 78.3 14.3 64 32 64H416..." />
            </svg>
          </span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={`nav-link ms-5 text-black ${isActive("/") ? "active text-primary" : ""}`} to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ms-5 text-black ${isActive("/shop") ? "active text-primary" : ""}`} to="/shop">
                Shop
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ms-5 text-black ${isActive("/About") ? "active text-primary" : ""}`} to="/About">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ms-5 text-black ${isActive("/contact") ? "active text-primary" : ""}`} to="/contact">
                Contact
              </Link>
            </li>
          </ul>

          <ul className="navbar-nav ms-5 me-5">
            <li>
              <Link className={`nav-link mt-0 mb-0 vali ${isActive("/Profile") ? "active text-primary" : ""}`} to="Profile">
                <Authicon />
              </Link>
            </li>
            <li>
              <Link className="nav-link mt-0 mb-0 text-black" to="#">
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

            <li>
              <Link className="nav-link mt-0 mb-0 text-black" id="heart" to="#">
                <div id="heart" className={`heart-icon ${false ? "red" : ""}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 48 48" fill="none">
                    <path
                      className="pathsvg"
                      fill={false ? "currentColor" : "none"}
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
              <Link className={`nav-link mt-0 mb-0 vali ${isActive("/Cart") ? "active text-primary" : ""}`} to="Cart">
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
