import { AppProvider } from "./tasks/MyContext.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./comps/Footer.jsx";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Scrollbutton from "./comps/Scrollbutton.jsx";
import "./main.css";
import Navbar from "./comps/Navbar.jsx";
import CartSection from "./pages/CartSection.jsx";
import { useState } from "react";
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
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Scrollbutton />
        <Footer />
        <CartSection toggle={toggle} settoggle={setmytoggle} />
      </Router>
    </AppProvider>
  );
}

export default App;
