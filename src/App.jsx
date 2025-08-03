import { AppProvider } from "./context/AppContext.jsx";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./comps/Navbar.jsx";
import Signup from "./comps/Signup.jsx"; 
import Signin from "./comps/Signin.jsx";
import Profile from "./comps/Profile.jsx";
import Home from "./pages/Home.jsx";
import Payment from "./comps/Payment.jsx";
import Myfooter from "./comps/Footer.jsx";

function Layout() {
  const location = useLocation();
  const hideLayout = ["/Signup", "/Signin", "/signup", "/signin",].includes(location.pathname);
  return (
    <>
      {!hideLayout && <Navbar />}
      <Routes>
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Signin" element={<Signin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<Home />} />
        <Route path="/Payment" element={<Payment />} />
      </Routes>
      {!hideLayout && <Myfooter />}
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout />
      </Router>
    </AppProvider>
  );
}

export default App;
