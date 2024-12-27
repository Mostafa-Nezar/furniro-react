import { useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import MyContext from "./MyContext"; // تأكد من المسار الصحيح

const EmailSubscription = () => {
  const { updateSubscription } = useContext(MyContext);

  const handleSubmit = (values, { resetForm }) => {
    const emailObject = {
      email: values.email,
      liked: false,
    };
    const storedData = JSON.parse(localStorage.getItem("emails")) || [];
    storedData.push(emailObject);
    localStorage.setItem("emails", JSON.stringify(storedData));
    updateSubscription(true);
    resetForm();
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
  });

  return (
    <Formik
      initialValues={{ email: "" }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form>
          <Field
            type="email"
            name="email"
            placeholder="Enter your email"
            className="myemail me-2"
          />
          <ErrorMessage name="email" component="div" className="red" />
          <button type="submit" className="subscribe">
            Subscribe
          </button>
        </Form>
      )}
    </Formik>
  );
};

const EmailUnSubscription = () => {
  const { updateSubscription } = useContext(MyContext);

  const handleSubmit = (_, { resetForm }) => {
    localStorage.removeItem("emails");
    updateSubscription(false); // تحديث حالة الاشتراك
    resetForm();
  };

  return (
    <Formik
      initialValues={{ email: "" }}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form>
          <Field
            type="email"
            name="email"
            placeholder="Enter your email"
            className="myemail me-2"
            disabled
          />
          <ErrorMessage name="email" component="div" className="red" />
          <button type="submit" className="subscribe">
            Unsubscribe
          </button>
        </Form>
      )}
    </Formik>
  );
};

function Subscription() {
  const { isSubscribed } = useContext(MyContext);

  return (
    <>
      {isSubscribed ? (
        <EmailUnSubscription />
      ) : (
        <EmailSubscription />
      )}
    </>
  );
}

export default Subscription;
