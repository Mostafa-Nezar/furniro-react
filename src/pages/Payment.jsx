import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { Formik } from "formik";
import * as Yup from "yup";
import "bootstrap/dist/css/bootstrap.min.css";

const Payment = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const cart = user?.cart || [];
  const subtotal = cart.reduce((t, i) => t + i.price * i.quantity, 0);
  const shipping = subtotal >= 100 ? 0 : 10;
  const total = subtotal + shipping;

  const formatCardNumber = (v) => {
    v = v.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const match = v.match(/\d{4,16}/g);
    const parts = [];
    const m = (match && match[0]) || "";
    for (let i = 0; i < m.length; i += 4) parts.push(m.substring(i, i + 4));
    return parts.length ? parts.join(" ") : v;
  };

  const formatExpiryDate = (v) => {
    v = v.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    return v.length >= 2 ? v.substring(0, 2) + "/" + v.substring(2, 4) : v;
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    fullName: Yup.string().required("Required"),
    address: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
    state: Yup.string().required("Required"),
    zipCode: Yup.string().required("Required"),
    cardNumber: Yup.string().min(19).required("Required"),
    expiryDate: Yup.string().matches(/^\d{2}\/\d{2}$/, "MM/YY").required("Required"),
    cvv: Yup.string().min(3).max(4).required("Required"),
    cardholderName: Yup.string().required("Required"),
  });

  const createCheckoutSession = async (values) => {
    setLoading(true);
    try {
      const res = await fetch("https://furniro-back-2-production.up.railway.app/api/payment/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
          customerInfo: {
            email: values.email,
            name: values.fullName,
            address: {
              line1: values.address,
              city: values.city,
              state: values.state,
              postal_code: values.zipCode,
            },
          },
          paymentMethod: {
            card: {
              number: values.cardNumber.replace(/\s/g, ""),
              exp_month: values.expiryDate.split("/")[0],
              exp_year: "20" + values.expiryDate.split("/")[1],
              cvc: values.cvv,
            },
            billing_details: { name: values.cardholderName },
          },
        }),
      });
      const data = await res.json();
      if (res.ok && data.url) window.location.href = data.url;
      else alert(data.error || "Payment failed");
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Payment</h2>
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
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <form onSubmit={handleSubmit}>
            <div className="row mb-4">
              <div className="col-md-6">
                <label>Email</label>
                <input className="form-control" type="email" name="email" onChange={handleChange} onBlur={handleBlur} value={values.email} />
                {touched.email && errors.email && <small className="text-danger">{errors.email}</small>}
              </div>
              <div className="col-md-6">
                <label>Full Name</label>
                <input className="form-control" type="text" name="fullName" onChange={handleChange} onBlur={handleBlur} value={values.fullName} />
                {touched.fullName && errors.fullName && <small className="text-danger">{errors.fullName}</small>}
              </div>
            </div>
            <div className="mb-3">
              <label>Address</label>
              <input className="form-control" type="text" name="address" onChange={handleChange} onBlur={handleBlur} value={values.address} />
              {touched.address && errors.address && <small className="text-danger">{errors.address}</small>}
            </div>
            <div className="row mb-4">
              <div className="col-md-4">
                <label>City</label>
                <input className="form-control" type="text" name="city" onChange={handleChange} onBlur={handleBlur} value={values.city} />
              </div>
              <div className="col-md-4">
                <label>State</label>
                <input className="form-control" type="text" name="state" onChange={handleChange} onBlur={handleBlur} value={values.state} />
              </div>
              <div className="col-md-4">
                <label>ZIP Code</label>
                <input className="form-control" type="text" name="zipCode" onChange={handleChange} onBlur={handleBlur} value={values.zipCode} />
              </div>
            </div>
            <hr className="my-4" />
            <h5 className="mb-3">Card Details</h5>
            <div className="mb-3">
              <label>Cardholder Name</label>
              <input className="form-control" type="text" name="cardholderName" onChange={handleChange} onBlur={handleBlur} value={values.cardholderName} />
            </div>
            <div className="mb-3">
              <label>Card Number</label>
              <input className="form-control" type="text" name="cardNumber" maxLength={19} value={values.cardNumber} onChange={(e) => handleChange("cardNumber")(formatCardNumber(e.target.value))} onBlur={handleBlur} />
            </div>
            <div className="row">
              <div className="col-md-6">
                <label>Expiry Date (MM/YY)</label>
                <input className="form-control" type="text" name="expiryDate" maxLength={5} value={values.expiryDate} onChange={(e) => handleChange("expiryDate")(formatExpiryDate(e.target.value))} onBlur={handleBlur} />
              </div>
              <div className="col-md-6">
                <label>CVV</label>
                <input className="form-control" type="text" name="cvv" maxLength={4} value={values.cvv} onChange={(e) => handleChange("cvv")(e.target.value.replace(/[^0-9]/g, ""))} onBlur={handleBlur} />
              </div>
            </div>
            <div className="mt-4">
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? "Processing..." : `Pay $${total.toFixed(2)}`}
              </button>
              <button type="button" onClick={() => navigate("/cart")} className="btn btn-outline-secondary w-100 mt-2">
                Back to Cart
              </button>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default Payment;
