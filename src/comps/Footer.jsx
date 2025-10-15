import { useAppContext } from "../context/AppContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

const Copyright = () => {
  const currentYear = new Date().getFullYear();
  return <div id="copyright">© {currentYear}</div>;
};

export default function Myfooter() {
  const { user } = useAuth(), { theme } = useAppContext();
  const isSubscribed = !!user?.isSubscribed;

  const textColor = theme ? "text-dark" : "text-light";
  const mutedColor = theme ? "text-black-50" : "text-white-50";
  const borderColor = theme ? "border-black" : "border-light";
  const bgColor = theme ? "bg-white" : "bg-dark border-top border-secondary";

  return (
    <div className={`footer p-5 ${bgColor} ${textColor}`}>
      <div className="row">
        <div className="col-lg-4 col-8">
          <h3 className="fw-bold pb-5">Furniro.</h3>
          <p className={`${mutedColor}`}>
            300 university drive suit 500 carol <br /> gabels, <br />
            fl33134 usa
          </p>
          <Copyright />
        </div>

        <div className="col-lg-2 col-4">
          <h6 className={`${mutedColor} p-3`}>Links</h6>
          <ul className="list-unstyled lh-lg">
            <li><a className={`nav-link p-3 ${textColor}`} href="/">Home</a></li>
            <li><a className={`nav-link p-3 ${textColor}`} href="shop">Shop</a></li>
            <li><a className={`nav-link p-3 ${textColor}`} href="about">About</a></li>
            <li><a className={`nav-link p-3 ${textColor}`} href="contact">Contact</a></li>
          </ul>
        </div>

        <div className="col-lg-2 col-4">
          <h6 className={`${mutedColor} p-3`}>Help</h6>
          <ul className="list-unstyled lh-lg">
            <li><a className={`nav-link p-3 ${textColor}`} href="">Payment Options</a></li>
            <li><a className={`nav-link p-3 ${textColor}`} href="">Returns</a></li>
            <li><a className={`nav-link p-3 ${textColor}`} href="">Privacy Policies</a></li>
          </ul>
        </div>

        <div className="col-lg-4 col-8">
          <h6 className={`${mutedColor} p-3`}>Newsletter</h6>
          <ul id="sub" className="list-unstyled lh-lg">
            <li>
              <Formik initialValues={{ email: "" }} validationSchema={validationSchema}>
                {({ isSubmitting }) => (
                  <Form>
                    <Field
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      className={`me-2 border-0 border-bottom border-3 ${borderColor} bg-transparent ${textColor}`}
                      style={{
                        width: "250px",
                        outline: "none",
                      }}
                      disabled={false}
                    />
                    <ErrorMessage name="email" component="div" className="red" />
                    <button
                      type="submit"
                      className={`subscribe border-0 border-bottom border-3 ${borderColor} bg-transparent ${textColor}`}
                      style={{
                        outline: "none"
                      }}
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
  );
}
