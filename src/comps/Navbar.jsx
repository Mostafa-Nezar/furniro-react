import { Link, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

function Navbar({ toggle }) {
  const location = useLocation();
  const { user } = useAppContext();

  const isAuthenticated = !!user;
  const cartLength = user?.cart?.length || 0;

  function SubscribeIcon() {
    if (!isAuthenticated) {
      return (
        <Link className="" to="/register">
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M20 12V7h2v6h-2m0 4h2v-2h-2m-10-2c2.67 0 8 1.34 8 4v3H2v-3c0-2.66 5.33-4 8-4
            m0-9a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4"
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
    <nav className={`navbar navbar-expand-md ${location.pathname === "/shop" ? "sticky-top" : ""} sticky-top top-0`}>
      <div className="container-fluid">
        {/* Logo */}
        <Link className="ms-4 navbar-brand fw-bold fs-4 text-black" to="/">
          <img src="../../images/logo.png" className="d-inline-block align-text-top" alt="Furniro logo" />
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
              <Link className={`nav-link ms-5 text-black ${isActive("/about") ? "active text-primary" : ""}`} to="/about">
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
              <Link className="nav-link mt-0 mb-0 vali text-black" to="#sub">
                <SubscribeIcon />
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
                  {false && <div className="popup show">Not Subscribed!</div>}
                </div>
              </Link>
            </li>

            {/* سلة */}
            <li className="icon-cart" onClick={toggle}>
              <Link className="nav-link mt-0 mb-0 text-black" to="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="26"
                  viewBox="0 0 1024 1024"
                  className={`${isActive("/cart") ? "active text-primary" : ""}`}
                >
                  <path fill="currentColor" d="M922.9 701.9H327.4l29.9-60.9..." />
                </svg>
              </Link>
              <span>{cartLength}</span>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
