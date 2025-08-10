import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext"; // استدعاء الكونتكست
import "../index.css";

function Signin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { login } = useAppContext(); // جلب login من الكونتكست

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form.email, form.password);

    if (result.success) {
      alert("✅ Login successful");
      navigate("/"); // يروح للصفحة الرئيسية
    } else {
      alert(result.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-header navbar-brand fw-bold fs-4 mx-auto m-1">
        <img
          src="/images/logo.png"
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
          <button type="submit" className="auth-button">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signin;
