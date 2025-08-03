import { useEffect, useState } from "react";
import axios from "axios";
import "../index.css";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  // ⬇️ تهيئة Google Sign-Up
  useEffect(() => {
    window.google?.accounts.id.initialize({
      client_id:
        "866938789864-hfj30l2ktsbdb4t78r3cl1lj3p4vehmh.apps.googleusercontent.com",
      callback: handleGoogleSignup,
    });

    window.google?.accounts.id.renderButton(
      document.getElementById("google-login"),
      { theme: "outline", size: "large", width: "100%" }
    );
  }, []);

  const handleGoogleSignup = async (response) => {
    try {
      const res = await axios.post("https://furniro-back-production.up.railway.app/api/auth/google", {
        token: response.credential,
      });
      alert(res.data.msg || "Google account created!");
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (err) {
      alert(err.response?.data?.msg || "Google sign-up error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://furniro-back-production.up.railway.app/api/auth/signup",
        form
      );
      alert(res.data.msg);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (err) {
      alert(err.response?.data?.msg || "Error");
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
          <h2 className="auth-title">Create Account</h2>

          <input
            type="text"
            placeholder="Name"
            required
            className="auth-input"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            required
            className="auth-input"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="auth-input"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button type="submit" className="auth-button">
            Sign Up
          </button>

          <div className="google-divider">or</div>

          <div id="google-login" style={{ marginTop: "10px" }}></div>
        </form>
      </div>
    </div>
  );
}

export default Signup;