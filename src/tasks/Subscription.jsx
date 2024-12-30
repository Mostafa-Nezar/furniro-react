import { useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import MyContext from "./MyContext";

const EmailSubscription = () => {
  const { emails, updateEmails } = useContext(MyContext);

  const handleSubmit = (values, { resetForm }) => {
    const emailObject = {
      email: values.email,
      liked: false,
    };
    const updatedEmails = [...emails, emailObject];
    updateEmails(updatedEmails); // تحديث المصفوفة في الكونتكست
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
  const { updateEmails } = useContext(MyContext);

  const handleSubmit = (_, { resetForm }) => {
    updateEmails([]); // حذف جميع العناصر من المصفوفة
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
  const { emails } = useContext(MyContext);

  return (
    <>
      {emails.length > 0 ? ( // التحقق إذا كانت المصفوفة تحتوي على عناصر
        <EmailUnSubscription />
      ) : (
        <EmailSubscription />
      )}
    </>
  );
}

export default Subscription;
