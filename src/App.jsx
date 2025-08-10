import { AppProvider } from "./context/AppContext.jsx";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./comps/Navbar.jsx";
import Signup from "./pages/Signup.jsx"; 
import Signin from "./pages/Signin.jsx";
import Profile from "./pages/Profile.jsx";
import Home from "./pages/Home.jsx";
import Payment from "./pages/Payment.jsx";
import Myfooter from "./comps/Footer.jsx";
import Shop from "./pages/Shop.jsx";
import Cart from "./pages/Cart.jsx";
import About from "./pages/About.jsx";
import Scrollbutton from "./comps/Scrollbutton.jsx";
import CartSection from "./comps/CartSection.jsx";
import ShareButtons from "./comps/Share.jsx";
import Popup from "./comps/Popup.jsx";

function Layout() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const hideLayout = ["/signup", "/signin"].includes(location.pathname);

  if (!user?.id && !hideLayout) {
    window.location.href = "/signin";
    return null;
  }

  return (
    <>
      {!hideLayout && <Navbar />}
      <Routes>
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Signin" element={<Signin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<Home />} />
        <Route path="/Payment" element={<Payment />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/About" element={<About />} />
        <Route path="/Cart" element={<Cart />} />
      </Routes>
      {!hideLayout && <Myfooter />}
    </>
  );
}


function App() {
  return (
    <AppProvider>
      <Router>
        <Scrollbutton/>
        <Layout />
        <CartSection/>
        <ShareButtons/>
        <Popup/>
      </Router>
    </AppProvider>
  );
}

export default App;
