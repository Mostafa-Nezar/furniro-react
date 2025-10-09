import { useEffect, useState } from "react";
import {Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../index.css";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { register,updateUser } = useAuth(); 
  const navigate = useNavigate();

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
      const res = await axios.post(
        "https://furniro-back-production.up.railway.app/api/auth/google",
        { token: response.credential }
      );

      const { user, token, msg } = res.data;

      if (token) {
        localStorage.setItem("token", token); 
        updateUser(user);
      }

      alert(msg || "Google account created!");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.msg || "Google sign-up error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(form);

    if (result.success && result.token) {
      localStorage.setItem("token", result.token);
      updateUser(result.user);
      alert("✅ Account created successfully");
      navigate("/");
    } else {
      alert(result.message || "Sign-up failed");
    }
  };


  return (
    <div className="auth-page">
      <div className="auth-header navbar-brand fw-bold fs-4 mx-auto m-1">
        <img src="https://res.cloudinary.com/dutetsivc/image/upload/v1760013317/logo_ikqv7r.png" className="auth-logo d-inline-block align-text-top" alt="Furniro logo"/>
        <span className="auth-brand">Furniro</span>
      </div>
      <div className="auth-container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2 className="auth-title">Create Account</h2>
          <input type="text" placeholder="Name" required className="auth-input" onChange={(e) => setForm({ ...form, name: e.target.value })}/>
          <input type="email" placeholder="Email" required className="auth-input" onChange={(e) => setForm({ ...form, email: e.target.value })}/>
          <input type="password" placeholder="Password" required className="auth-input" onChange={(e) => setForm({ ...form, password: e.target.value })}/>
          <button type="submit" className="auth-button">Sign Up</button>
          <div className="google-divider">or</div>
          <div id="google-login" style={{ marginTop: "10px" }}></div>
          <hr />
          <Link to="/signin" className="mx-auto m-3"><div className="auth-button">sign in</div></Link>
        </form>
      </div>
    </div>
  );
}

export default Signup;
