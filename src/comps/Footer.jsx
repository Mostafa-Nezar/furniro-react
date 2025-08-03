import { useAppContext } from "../context/AppContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

const Copyright = () => {
  const currentYear = new Date().getFullYear();
  return <div id="copyright">© {currentYear}</div>;
};

export default function Myfooter() {
  const { user, toggleSubscription } = useAppContext();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (!user) return;
    const result = await toggleSubscription(values.email);
    setSubmitting(false);

    if (result.success) {
      console.log(
        result.user.isSubscribed ? "✅ Subscribed successfully" : "✅ Unsubscribed successfully"
      );
      // ممكن تفضّل تفضي الحقل بعد الاشتراك
      resetForm();
      alert(result.user.isSubscribed ? "تم الاشتراك بنجاح." : "تم إلغاء الاشتراك.");
    } else {
      console.warn("Subscription error:", result.message);
      alert(result.message || "حدث خطأ أثناء تحديث الاشتراك.");
    }
  };

  const isSubscribed = !!user?.isSubscribed;

  return (
    <div>
      <div className="footer p-5">
        <div className="row">
          <div className="col-lg-4 col-8">
            <h3 className="fw-bold pb-5">Furniro.</h3>
            <p className="text-black-50">
              300 university drive suit 500 carol <br /> gabels, <br />
              fl33134 usa
            </p>
            <Copyright />
          </div>

          <div className="col-lg-2 col-4">
            <h6 className="text-black-50 p-3">Links</h6>
            <ul className="list-unstyled lh-lg">
              <li><a className="nav-link p-3" href="/">Home</a></li>
              <li><a className="nav-link p-3" href="shop">Shop</a></li>
              <li><a className="nav-link p-3" href="about">About</a></li>
              <li><a className="nav-link p-3" href="contact">Contact</a></li>
            </ul>
          </div>

          <div className="col-lg-2 col-4">
            <h6 className="text-black-50 p-3">Help</h6>
            <ul className="list-unstyled lh-lg">
              <li><a className="nav-link p-3" href="">Payment Options</a></li>
              <li><a className="nav-link p-3" href="">Returns</a></li>
              <li><a className="nav-link p-3" href="">Privacy Policies</a></li>
            </ul>
          </div>

          <div className="col-lg-4 col-8">
            <h6 className="text-black-50 p-3">Newsletter</h6>
            <ul id="sub" className="list-unstyled lh-lg">
              <li>
                <Formik
                  initialValues={{ email: "" }}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <Field
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        className="myemail me-2"
                        // هنسيب الفيلد متاح علشان المستخدم يدخل الإيميل اللي لازم يطابق حسابه
                        disabled={false}
                      />
                      <ErrorMessage name="email" component="div" className="red" />
                      <button
                        type="submit"
                        className="subscribe"
                        disabled={isSubmitting}
                      >
                        {isSubscribed ? "Unsubscribe" : "Subscribe"}
                      </button>
                    </Form>
                  )}
                </Formik>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
