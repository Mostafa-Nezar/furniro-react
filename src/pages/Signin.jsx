import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../index.css";
import { useAppContext } from "../context/AppContext";
 

function Signin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { login } = useAuth(), { togglePopup }=useAppContext() ;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form.email, form.password);

    if (result.success) {
      togglePopup("✅ Login successful");
      navigate("/"); 
    } else {
      togglePopup(result.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-header navbar-brand fw-bold fs-4 mx-auto m-1">
        <img
          src="https://res.cloudinary.com/dutetsivc/image/upload/v1760013317/logo_ikqv7r.png"
          className="auth-logo d-inline-block align-text-top"
          alt="Furniro logo"
        />
        <span className="auth-brand">Furniro</span>
      </div>

      <div className="auth-container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2 className="auth-title">Login</h2>
          <input
            type="email"
            placeholder="Email"
            className="auth-input"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="auth-input"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button type="submit" className="auth-button">Sign In </button>
          <hr />
          <p className="text-center mt-3 small text-muted">Don’t have an account?{" "}</p>      
          <Link to="/signup" className="mx-auto m-3"><div className="auth-button">sign up</div></Link>
        </form>
      </div>
    </div>
  );
}

export default Signin;
