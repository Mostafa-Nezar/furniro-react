import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext.jsx";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useCart } from "../context/CartContext.jsx";
import { MdPayment, MdSecurity } from "react-icons/md";
import { useAppContext } from "../context/AppContext.jsx";
import Landing from "../comps/Landing.jsx"
import Features from "../comps/Features.jsx"
const InputField = ({ handleChange, handleBlur, value, placeholder, type = "text", name }) => (
  <div className="mb-3">
    <input className="my-form-control p-3" onChange={handleChange(name)} onBlur={handleBlur(name)} value={value} placeholder={placeholder} type={type} />
  </div>
);

const Payment = () => {
  const nav = useNavigate(), { user } = useAuth(), { cart, clearCartAndUpdateOrsers } = useCart(), { togglePopup } = useAppContext();
  const stripe = useStripe(), elements = useElements();
  const [loading, setLoading] = useState(false), [paymentMethod, setPaymentMethod] = useState("bank");
  const subtotal = cart.reduce((t, i) => t + i.price * i.quantity, 0), total = subtotal;

  const schema = Yup.object({
    email: Yup.string().email().required(), firstName: Yup.string().required(),
    lastName: Yup.string().required(), address: Yup.string().required(),
    city: Yup.string().required(), state: Yup.string().required(), zipCode: Yup.string().required(),
  });

  const handlePaymentSubmit = async (formValues) => {
    if (cart.length === 0) {
      togglePopup("Your cart is empty !");
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
            fullName: `${formValues.firstName} ${formValues.lastName}`,
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
            name:`${formValues.firstName} ${formValues.lastName}`,
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
      togglePopup("Payment Successful!");
      nav("/ordersuccessscreen");
    } catch (paymentError) {
      console.error("❌ Stripe Payment Error:", paymentError);
      alert("Payment Failed: " + paymentError.message);
    } finally {
      setLoading(false);
    }
  };
  const handleCashOrder = async () => {
  if (paymentMethod !== "cod") return; 

  if (cart.length === 0) {
    togglePopup("Your cart is empty!");
    return;
  }

  await clearCartAndUpdateOrsers();
  togglePopup("Order placed successfully!");
  nav("/ordersuccessscreen");
};

  
  return (
    <>
    <Landing land={"Check Out"}/>
    <div className="container py-5">
      <Formik initialValues={{ email: user?.email || "", firstName: user?.name || "", lastName: "", address: user?.location || "", city: "", state: "", zipCode: "" }} validationSchema={schema} onSubmit={handlePaymentSubmit}>
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <form onSubmit={handleSubmit} className="row">
            <div className="ms-5 col-md-5 mb-5 px-5">
              <h3 className="fw-bold mb-4">Billing Details</h3>
              {["firstName", "lastName"].map((f,i) => (
                <div key={f} className="col-md-6 mb-1 d-inline-block pe-2">
                  <label className="form-label">{f.replace(/^\w/, c => c.toUpperCase())}</label>
                  <input type="text" className="my-form-control"  onChange={handleChange(f)} onBlur={handleBlur(f)} value={values[f]} />
                  {errors[f] && touched[f] && <div className="my-text-redcolor small">{errors[f]}</div>}
                </div>
              ))}
              {["address", "city", "state", "zipCode", "email"].map((f) => (
                <div key={f}>
                  <label className="form-label">{f.replace(/^\w/, c => c.toUpperCase())}</label>
                  <input type="text" className="my-form-control"  onChange={handleChange(f)} onBlur={handleBlur(f)} value={values[f]} />
                  {errors[f] && touched[f] && <div className="my-text-redcolor small">{errors[f]}</div>}
                </div>
              ))}
              <div className="alert alert-light d-flex align-items-start my-3">
                <MdSecurity size={20} className="me-2 my-text-primary" />
                <div><strong>Secure Payment</strong><p className="mb-0 small">Your payment info is encrypted and secure.</p></div>
              </div>
              <div className="border border-black rounded p-3 mb-3">
              <CardElement options={{ style: { base: { fontSize: "16px", color: "black", "::placeholder": { color: "#aab7c4" } }, invalid: { color: "#9e2146" } }, hidePostalCode: true }} />
              </div>
              {/* <button type="submit" className="my-btn text-white my-bg-primary w-100 py-3" disabled={loading || !stripe}>
                {loading ? "Processing..." : <><MdPayment size={20} className="me-2" /> Pay ${total.toFixed(2)}</>}
              </button> */}
            </div>
            <div className="col-md-6 mt-5">
              <div className="my-4 text-center">
                <div className="d-flex justify-content-between">
                  <h4 className="mb-2 w-50">Product</h4><h4 className="w-50 mb-2">Subtotal</h4>
                </div>
                {cart.map((i, x) => (
                  <div key={x} className="d-flex justify-content-between fs-7 mb-1">
                    <div className="text-black-50 ms-3 w-50">{i.name}<span className="text-dark mx-2">x{i.quantity}</span></div>
                    <div className="w-50 me-3">${(i.price * i.quantity).toFixed(2)}</div>
                  </div>
                ))}
                <div className="d-flex justify-content-around mt-2">
                  <p className="mb-1">Subtotal</p><p className="mb-1">${subtotal.toFixed(2)}</p>
                </div>
                <div className="d-flex justify-content-around fs-4">
                  <p className="mb-1">Total</p><p className="mb-1 fw-bold" style={{ color: "var(--primary)" }}>${total.toFixed(2)}</p>
                </div>
                <hr style={{ width: "65%", margin: "0.7em auto" }} />

                {/* ✅ Payment method toggle */}
                <div className="text-start" style={{ marginLeft: "8rem" }}>
                  {["bank", "cod"].map(id => (
                    <div key={id} className="mb-3 d-flex align-items-center" style={{ cursor: "pointer" }} onClick={() => setPaymentMethod(id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" style={{ marginBottom: "2px", marginRight: "6px" }}>
                        <path fill={paymentMethod === id ? "black" : "currentColor"} d={paymentMethod === id ? "M12 2a10 10 0 1 0 0 20a10 10 0 0 0 0-20Z" : "M12 2a10 10 0 1 0 0 20a10 10 0 0 0 0-20Zm0 18a8 8 0 1 1 0-16a8 8 0 0 1 0 16Z"} />
                      </svg>
                      <span style={{ color: paymentMethod === id ? "black" : "var(--gray)" }}>
                        {id === "bank" ? "Direct Bank Transfer" : "Cash on Delivery"}
                      </span>
                    </div>
                  ))}
                  {paymentMethod === "bank" && (
                    <p style={{ lineHeight: "1.6", color: "var(--gray)", fontSize: "14px", width: "80%" }}>
                      Make your payment directly into our bank account. Please use your Order ID as reference. Your order will not be shipped until funds are cleared.
                    </p>
                  )}
                  <p style={{ lineHeight: "1.4", fontSize: "14px", width: "80%" }}>
                    Your personal data will be used for account access and for purposes described in our{" "}
                    <span style={{ cursor: "pointer", fontWeight: "bold", fontSize: "16px" }}>Privacy Policy.</span>
                  </p>
                </div>
                <button   onClick={handleCashOrder} style={{border: "1px solid",    borderRadius: "20px", color: "black", backgroundColor: "transparent", padding: "1em 8em", margin: "2em auto", display: "block"}}>
                  Place Order
                </button>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </div>
    <Features/>
    </>
  );
};
export default Payment;
