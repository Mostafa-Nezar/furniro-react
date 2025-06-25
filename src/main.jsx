import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Signup from "./comps/signup";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./main.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

// نتحقق هل في يوزر في localStorage
const user = JSON.parse(localStorage.getItem("user"));

root.render(
  <React.StrictMode>
    {user ? <App /> : <Signup />}
  </React.StrictMode>
);
