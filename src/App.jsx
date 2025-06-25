import { AppProvider } from "./tasks/MyContext.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./comps/Footer.jsx";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Contact from "./pages/Contact";
import Scrollbutton from "./comps/Scrollbutton.jsx";
import "./main.css";
import Navbar from "./comps/Navbar.jsx";
import Cart from "./pages/Cart.jsx";
import CartSection from "./comps/CartSection.jsx";
import React, { useState } from "react";
const LazyAbout = React.lazy(() => import(`./pages/About`));

function App() {
  const [toggle, settoggle] = useState(false);
  function setmytoggle() {
    toggle ? settoggle(false) : settoggle(true);
  }

  return (
    <AppProvider>
      <Router>
        <Navbar toggle={setmytoggle} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route
            path="/about"
            element={
              <React.Suspense fallback={`loading ...`}>
                <LazyAbout />
              </React.Suspense>
            }
          />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
        <Scrollbutton />
        <Footer />
        <CartSection toggle={toggle} settoggle={setmytoggle} />
      </Router>
    </AppProvider>
  );
}

export default App;
