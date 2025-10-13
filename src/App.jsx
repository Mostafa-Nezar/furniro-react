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
import Ordersuccessscreen from "./pages/ordersuccessscreen.jsx";
import Details from "./pages/Details.jsx";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Paypal from "./pages/Paypal.jsx";

const stripePromise = loadStripe("pk_test_51RfzAo4hpzh6swtTe5XoqvV6DcUlufkptuTb7Q4DKfuVgnDDH76ICrTlrw8pXwKGpHscUSZCr9vwniO6e0zc0VT900tEcvmgjR");

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
        <Route path="/Paypal" element={<Paypal />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/About" element={<About />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/Details/:id" element={<Details />} />
        <Route path="/ordersuccessscreen" element={<Ordersuccessscreen />} />
      </Routes>
      <Myfooter />
    </>
  );
}

function App() {
  return (
    <Elements stripe={stripePromise}>
      <AuthProvider>
        <CartProvider>
          <AppProvider>
            <SocketProvider>
              <Router>
                <Scrollbutton />
                <Layout />
                <CartSection />
                <ShareButtons />
                <Popup />
              </Router>
            </SocketProvider>
          </AppProvider>
        </CartProvider>
      </AuthProvider>
    </Elements>
  );
}

export default App;
