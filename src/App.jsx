import { MyContextProvider } from './tasks/MyContext.jsx'; // تأكد من المسار الصحيح
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from "./comps/Footer.jsx";
import Home from './pages/Home';
import Shop from './pages/Shop';
import About from './pages/About';
import Contact from './pages/Contact';
import Scrollbutton from './comps/Scrollbutton.jsx';
import './main.css';
import Navbar from './comps/Navbar.jsx';
function App() {
  return (
    <MyContextProvider> {/* التأكد من أن MyContextProvider يلف تطبيقك */}
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Scrollbutton />
        <Footer />
      </Router>
    </MyContextProvider>
  );
}

export default App;
