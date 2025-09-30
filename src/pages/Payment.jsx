import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Formik } from "formik";
import * as Yup from "yup";
import { FaLock, FaCreditCard, FaWallet } from "react-icons/fa";
import Landing from "../comps/Landing";
import Features from "../comps/Features";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const  theme = "dark" ,{ cart, clearCartAndUpdateOrders } = useCart(), { user } =useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const subtotal = cart.reduce((t, i) => t + i.price * i.quantity, 0);
  const shipping = subtotal >= 100 ? 0 : 10;
  const total = subtotal + shipping;

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const status = query.get("payment_status");

    if (status === "success") {
      setPaymentStatus("success");
      clearCartAndUpdateOrders();
    } else if (status === "cancelled") {
      setPaymentStatus("cancelled");
    }
  }, [location, clearCartAndUpdateOrders]);

  const formatCardNumber = (v) => {
    v = v.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    return (v.match(/\d{4,16}/g)?.[0] || "").match(/.{1,4}/g)?.join(" ") || v;
  };

  const formatExpiryDate = (v) => {
    v = v.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    return v.length >= 2 ? `${v.substring(0, 2)}/${v.substring(2, 4)}` : v;
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    fullName: Yup.string().required("Full name is required"),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    zipCode: Yup.string().required("ZIP code is required"),
    cardNumber: Yup.string().min(19, "Card number must be 16 digits").required("Card number is required"),
    expiryDate: Yup.string().matches(/^\d{2}\/\d{2}$/, "Invalid expiry date").required("Expiry date is required"),
    cvv: Yup.string().min(3, "CVV must be 3 or 4 digits").max(4, "CVV must be 3 or 4 digits").required("CVV is required"),
    cardholderName: Yup.string().required("Cardholder name is required"),
  });

  const createCheckoutSession = async (values) => {
    setLoading(true);
    try {
      const res = await fetch("https://furniro-back-2-production.up.railway.app/api/payment/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          products: cart.map((i ) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
          customerInfo: {
            email: values.email,
            name: values.fullName,
            address: { line1: values.address, city: values.city, state: values.state, postal_code: values.zipCode },
          },
          success_url: `${window.location.origin}${location.pathname}?payment_status=success`,
          cancel_url: `${window.location.origin}${location.pathname}?payment_status=cancelled`,
        }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        window.alert("Payment Failure: " + (data.error || "Unknown error"));
      }
    } catch {
      window.alert("Network Error");
    } finally {
      setLoading(false);
    }
  };

  const handlePayWithPayPal = async () => {
    if (!user) {
      window.alert("User Not Found");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("https://furniro-back-2-production.up.railway.app/api/paypal/create-paypal-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          total: total.toFixed(2 ),
          userId: user.id,
          success_url: `${window.location.origin}${location.pathname}?payment_status=success`,
          cancel_url: `${window.location.origin}${location.pathname}?payment_status=cancelled`,
        }),
      });
      const data = await res.json();
      if (res.ok && data.approveUrl) {
        window.location.href = data.approveUrl;
      } else {
        window.alert("Payment Failure: " + (data.error || "Unknown error"));
      }
    } catch (e) {
      console.error("❌ PayPal error:", e);
      window.alert("Disconnected");
    } finally {
      setLoading(false);
    }
  };

  const getCardType = (number) => {
    const clean = number.replace(/\s+/g, "");
    if (/^4/.test(clean)) return "visa";
    if (/^5[1-5]/.test(clean) || /^2(2[2-9]|[3-6]|7[01]|720)/.test(clean)) return "mastercard";
    if (/^3[47]/.test(clean)) return "amex";
    return null;
  };

  // ===== ✅ [الحل] تعريف المكونات المساعدة هنا =====
  const InputField = ({ handleChange, handleBlur, value, placeholder, type = "text", maxLength, name }) => (
    <div className="mb-3">
      <input
        className="form-control"
        style={{ backgroundColor: theme.semiWhite, borderColor: theme.lightGray, color: theme.black }}
        onChange={handleChange(name)}
        onBlur={handleBlur(name)}
        value={value}
        placeholder={placeholder}
        type={type}
        maxLength={maxLength}
      />
    </div>
  );

  const InputCardField = ({ handleChange, handleBlur, value, placeholder, name }) => {
    const [cardType, setCardType] = useState(null);

    const handleInputChange = (e) => {
      const formatted = formatCardNumber(e.target.value);
      handleChange(name)(formatted);
      const type = getCardType(formatted);
      setCardType(type);
    };

    const renderCardLogo = () => {
      const logoStyle = "w-8 h-6 rounded bg-white";
      switch (cardType) {
        case "mastercard": return <img src="/images/mastercard.png" className={logoStyle} alt="Mastercard" />;
        case "visa": return <img src="/images/visa.png" className={logoStyle} alt="Visa" />;
        case "paypal": return <img src="/images/paypal.png" className={logoStyle} alt="PayPal" />;
        case "amex": return <img src="/images/amex.png" className={logoStyle} alt="Amex" />;
        default: return (
          <div className="d-flex gap-2">
            <img src="/images/mastercard.png" className={logoStyle} alt="Mastercard" />
            <img src="/images/visa.png" className={logoStyle} alt="Visa" />
            <img src="/images/paypal.png" className={logoStyle} alt="PayPal" />
            <img src="/images/amex.png" className={logoStyle} alt="Amex" />
          </div>
        );
      }
    };

    return (
      <div className="mb-3">
        <div className="d-flex align-items-center p-2 rounded border" style={{ backgroundColor: theme.semiWhite, borderColor: theme.lightGray }}>
          <input
            className="form-control flex-grow-1 border-0"
            style={{ color: theme.black, backgroundColor: "transparent" }}
            onChange={handleInputChange}
            onBlur={handleBlur(name)}
            value={value}
            placeholder={placeholder}
            type="text"
            maxLength={19}
          />
          <div className="d-flex gap-2 ms-2">{renderCardLogo()}</div>
        </div>
      </div>
    );
  };

  if (paymentStatus === "success") {
    return (
      <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center" style={{ backgroundColor: theme.white }}>
        <div className="text-center p-5 shadow-sm rounded" style={{ backgroundColor: theme.semiWhite }}>
          <h2 className="text-success">Payment Successful!</h2>
          <p style={{ color: theme.darkGray }}>Your order has been placed. Thank you for your purchase!</p>
          <button onClick={() => navigate("/")} className="btn btn-primary" style={{ backgroundColor: theme.primary }}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (paymentStatus === "cancelled") {
    return (
      <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center" style={{ backgroundColor: theme.white }}>
        <div className="text-center p-5 shadow-sm rounded" style={{ backgroundColor: theme.semiWhite }}>
          <h2 className="text-danger">Payment Cancelled</h2>
          <p style={{ color: theme.darkGray }}>Your payment was not completed. Your cart has not been cleared.</p>
          <button onClick={() => navigate("/cart")} className="btn btn-secondary me-2">
            Back to Cart
          </button>
          <button onClick={() => setPaymentStatus(null)} className="btn btn-primary" style={{ backgroundColor: theme.primary }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
  <>
  <Landing land="Check Out" />
    <div className="min-vh-100" style={{ backgroundColor: theme.white }}>
      <Formik
        initialValues={{
          email: user?.email || "",
          fullName: "",
          address: "",
          city: "",
          state: "",
          zipCode: "",
          cardNumber: "",
          expiryDate: "",
          cvv: "",
          cardholderName: "",
        }}
        validationSchema={validationSchema}
        onSubmit={createCheckoutSession}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <div className="container px-4 py-4" style={{ maxWidth: "720px" }}>
            <div className="p-4 rounded shadow-sm mb-4 mt-4" style={{ backgroundColor: theme.semiWhite }}>
              <h2 className="h5 fw-bold mb-3" style={{ color: theme.black }}>Order Summary</h2>
              {cart.map((item, i) => (
                <div key={i} className="d-flex justify-content-between mb-2">
                  <span style={{ color: theme.darkGray }}>{item.name} x {item.quantity}</span>
                  <span className="fw-medium" style={{ color: theme.black }}>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-top pt-3 mt-3" style={{ borderColor: theme.lightGray }}>
                <div className="d-flex justify-content-between mb-1">
                  <span style={{ color: theme.darkGray }}>Subtotal:</span>
                  <span style={{ color: theme.black }}>${subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span style={{ color: theme.darkGray }}>Shipping:</span>
                  <span style={{ color: shipping === 0 ? theme.green : theme.black }}>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="d-flex justify-content-between mt-2 pt-2 border-top">
                  <span className="h5 fw-bold" style={{ color: theme.black }}>Total:</span>
                  <span className="h5 fw-bold" style={{ color: theme.primary }}>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <InputField name="email" value={values.email} handleChange={handleChange} handleBlur={handleBlur} placeholder="Email Address" type="email" />
              <InputField name="fullName" value={values.fullName} handleChange={handleChange} handleBlur={handleBlur} placeholder="Full Name" />
              <InputField name="address" value={values.address} handleChange={handleChange} handleBlur={handleBlur} placeholder="Address" />
              <div className="row g-3">
                <div className="col-md-6"><InputField name="city" value={values.city} handleChange={handleChange} handleBlur={handleBlur} placeholder="City" /></div>
                <div className="col-md-6"><InputField name="state" value={values.state} handleChange={handleChange} handleBlur={handleBlur} placeholder="State" /></div>
              </div>
              <InputField name="zipCode" value={values.zipCode} handleChange={handleChange} handleBlur={handleBlur} placeholder="ZIP Code" type="text" maxLength={10} />
            </div>
            <div className="mb-4">
              <InputField name="cardholderName" value={values.cardholderName} handleChange={handleChange} handleBlur={handleBlur} placeholder="Cardholder Name" />
              <InputCardField name="cardNumber" value={values.cardNumber} handleChange={handleChange} handleBlur={handleBlur} placeholder="Card Number" />
              <div className="row g-3">
                <div className="col-md-6">
                  <InputField name="expiryDate" value={values.expiryDate} handleChange={(n) => (e) => handleChange(n)(formatExpiryDate(e.target.value))} handleBlur={handleBlur} placeholder="MM/YY" type="text" maxLength={5} />
                </div>
                <div className="col-md-6">
                  <InputField name="cvv" value={values.cvv} handleChange={(n) => (e) => handleChange(n)(e.target.value.replace(/[^0-9]/g, ""))} handleBlur={handleBlur} placeholder="CVV" type="password" maxLength={4} />
                </div>
              </div>
            </div>
            <div className="p-4 rounded shadow-sm mb-4 d-flex align-items-start" style={{ backgroundColor: theme.lightBeige }}>
              <FaLock className="me-3 mt-1" size={20} style={{ color: theme.primary }} />
              <div>
                <p className="mb-1 fw-medium" style={{ color: theme.black }}>Secure Payment</p>
                <p className="small" style={{ color: theme.darkGray }}>Your payment information is encrypted and secure. We use Stripe for payment processing.</p>
              </div>
            </div>
            <div className="p-4 border-top" style={{ borderColor: theme.lightGray }}>
              <button onClick={handleSubmit} disabled={loading} className={`w-100 btn btn-lg mb-3 ${loading ? "btn-secondary" : "btn-primary"} d-flex align-items-center justify-content-center`} style={loading ? {} : { backgroundColor: theme.primary }}>
                {loading ? (<span className="me-2">Processing...</span>) : (<> <FaCreditCard className="me-2" /> <span>Pay ${total.toFixed(2)}</span> </>)}
              </button>
              <button onClick={handlePayWithPayPal} disabled={loading} className="w-100 btn btn-lg btn-dark mb-3 d-flex align-items-center justify-content-center" style={{ backgroundColor: theme.black }}>
                <FaWallet className="me-2" />
                <span>Pay with PayPal</span>
              </button>
              <button onClick={() => navigate("/")} className="w-100 btn btn-lg btn-outline-primary" style={{ borderColor: theme.primary, color: theme.primary }}>
                Back to Cart
              </button>
            </div>
          </div>
        )}
      </Formik>
    </div>
    <Features />
    </>
  );
};

export default Payment;
