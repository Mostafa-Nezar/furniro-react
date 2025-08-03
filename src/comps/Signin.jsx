import { useState } from "react";
import axios from "axios";
import "../index.css";

function Signin() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://furniro-back-production.up.railway.app/api/auth/signin",
        form
      );
      alert(res.data.msg);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      console.log("✅ User saved:", res.data.user);
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
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