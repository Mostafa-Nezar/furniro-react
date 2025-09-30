import { AppProvider } from "./context/AppContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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


  return (
    <>
       <Navbar />
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
      <Myfooter />
    </>
  );
}


function App() {
  return (
    <AuthProvider>
  <CartProvider>
    <AppProvider>
      <SocketProvider>
      <Router>
        <Scrollbutton/>
        <Layout />
        <CartSection/>
        <ShareButtons/>
        <Popup/>
      </Router>
      </SocketProvider>
    </AppProvider>
  </CartProvider>
</AuthProvider>
  );
}

export default App;
