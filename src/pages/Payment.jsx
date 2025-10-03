import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext.jsx";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useCart } from "../context/CartContext.jsx";
import { MdPayment, MdSecurity } from "react-icons/md";

const InputField = ({ theme, handleChange, handleBlur, value, placeholder, type = "text", name }) => (
  <div className="mb-3">
    <input
      className="form-control p-3"
      style={{ backgroundColor: theme.semiWhite, color: theme.black }}
      onChange={handleChange(name)}
      onBlur={handleBlur(name)}
      value={value}
      placeholder={placeholder}
      type={type}
    />
  </div>
);

const Payment = () => {
  const nav = useNavigate();
  const theme = ""
  const { user } = useAuth();
  const { cart } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce((t, i) => t + i.price * i.quantity, 0);
  const shipping = subtotal >= 100 ? 0 : 0;
  const total = subtotal + shipping;

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    fullName: Yup.string().required("Full name is required"),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    zipCode: Yup.string().required("ZIP Code is required"),
  });

  const handlePaymentSubmit = async (formValues) => {
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }
    setLoading(true);

    let clientSecret;
    try {
      const response = await fetch("https://furniro-back-production.up.railway.app/api/payment2/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          total: total,
          userId: user.id,
          products: cart,
          customerInfo: {
            fullName: formValues.fullName,
            email: formValues.email,
            address: formValues.address,
            city: formValues.city,
            state: formValues.state,
            zipCode: formValues.zipCode
          }
        })
      });
      const data = await response.json();
      if (data.error || !data.clientSecret) {
        throw new Error(data.error || "Failed to get payment secret from server.");
      }
      clientSecret = data.clientSecret;
    } catch (error) {
      console.error("❌ Server Error (create-payment-intent):", error);
      alert("Server Error: " + error.message);
      setLoading(false);
      return;
    }

    try {
      const cardElement = elements.getElement(CardElement);
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: formValues.email,
            name: formValues.fullName,
            address: {
              line1: formValues.address,
              city: formValues.city,
              state: formValues.state,
              postal_code: formValues.zipCode,
              country: "US",
            },
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log("✅ Payment successful! Payment Intent ID:", paymentIntent.id);
      alert("Payment Successful!");
      nav("/ordersuccessscreen");
    } catch (paymentError) {
      console.error("❌ Stripe Payment Error:", paymentError);
      alert("Payment Failed: " + paymentError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4" style={{ backgroundColor: theme.white }}>
      <Formik
        initialValues={{
          email: user?.email || "",
          fullName: user?.name || "",
          address: user?.location || "",
          city: "",
          state: "",
          zipCode: ""
        }}
        validationSchema={validationSchema}
        onSubmit={handlePaymentSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <form onSubmit={handleSubmit} className="mt-4">
            {/* Order Summary */}
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Order Summary</h5>
                {cart.map((item, i) => (
                  <div key={i} className="d-flex justify-content-between mb-2">
                    <span>{item.name} x {item.quantity}</span>
                    <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                  </div>
                ))}
                <hr />
                <div className="d-flex justify-content-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Shipping:</span>
                  <span className="my-text-greencolor">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total:</span>
                  <span className="my-text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Payment Details</h5>

                <InputField theme={theme} name="email" value={values.email} handleChange={handleChange} handleBlur={handleBlur} placeholder="Email Address" type="email" />
                {errors.email && touched.email && <div className="my-text-redcolor">{errors.email}</div>}

                <InputField theme={theme} name="fullName" value={values.fullName} handleChange={handleChange} handleBlur={handleBlur} placeholder="Full Name" />
                {errors.fullName && touched.fullName && <div className="my-text-redcolor">{errors.fullName}</div>}

                <InputField theme={theme} name="address" value={values.address} handleChange={handleChange} handleBlur={handleBlur} placeholder="Address" />
                {errors.address && touched.address && <div className="my-text-redcolor">{errors.address}</div>}

                <div className="row">
                  <div className="col-md-6">
                    <InputField theme={theme} name="city" value={values.city} handleChange={handleChange} handleBlur={handleBlur} placeholder="City" />
                    {errors.city && touched.city && <div className="my-text-redcolor">{errors.city}</div>}
                  </div>
                  <div className="col-md-6">
                    <InputField theme={theme} name="state" value={values.state} handleChange={handleChange} handleBlur={handleBlur} placeholder="State" />
                    {errors.state && touched.state && <div className="my-text-redcolor">{errors.state}</div>}
                  </div>
                </div>
                <InputField theme={theme} name="zipCode" value={values.zipCode} handleChange={handleChange} handleBlur={handleBlur} placeholder="ZIP Code" type="number" />
                {errors.zipCode && touched.zipCode && <div className="my-text-redcolor">{errors.zipCode}</div>}
                <div className="mb-3">
                  <CardElement
  options={{
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": { color: "#aab7c4" },
      },
      invalid: { color: "#9e2146" },
    },
    hidePostalCode: true,
  }}
/>

                </div>
              </div>
            </div>

            <div className="alert alert-light d-flex align-items-start mb-4">
              <MdSecurity size={20} className="me-2 my-text-primary" />
              <div>
                <strong>Secure Payment</strong>
                <p className="mb-0 small">Your payment information is encrypted and secure. We use Stripe for payment processing.</p>
              </div>
            </div>

            {/* Pay Button */}
            <div className="text-center">
              <button type="submit" className="btn text-white my-bg-primary w-100 py-3" disabled={loading || !stripe}>
                {loading ? "Processing..." : <><MdPayment size={20} className="me-2" /> Pay ${total.toFixed(2)}</>}
              </button>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default Payment;
