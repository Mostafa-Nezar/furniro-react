// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import Features from "../comps/Features.jsx";
// import Landing from "../comps/Landing.jsx";
// import { useAppContext } from "../tasks/MyContext";
// import { useState } from "react";

// const Contact = () => {
//   const { emails, updateEmails } = useAppContext();

//   const [showPopup, setShowPopup] = useState(false);
//   const validationSchema = Yup.object({
//     name: Yup.string()
//       .min(3, "Name must be at least 3 characters")
//       .required("name is required"),
//     mail: Yup.string().email("Invalid email address"),
//     message: Yup.string().min(10, "Message must be at least 10 characters"),
//     subject: Yup.string().min(5, "Subject must be at least 5 characters"),
//   });

//   const initialValues = {
//     name: "",
//     mail: "",
//     message: "",
//     subject: "",
//   };

//   const handleSubmit = (values, { resetForm }) => {
//     if (emails.length > 0) {
//       const updatedEmail = { ...emails[0], ...values };
//       updateEmails([updatedEmail]);
//       resetForm();
//     } else {
//       setShowPopup(true);
//       setTimeout(() => setShowPopup(false), 3000);
//     }
//   };

//   return (
//     <>
//       <Landing land="Contact" />

//       <div className="validation p-5 m-5">
//         <h4 className="p-1 text-center">Get In Touch With Us</h4>
//         <p className="text-center text-black-50">
//           For more information about our products & services, please feel free
//           to drop us an email. Our staff will always be there to help you. Do
//           not hesitate!
//         </p>
//       </div>

//       <div className="row">
//         <div className="col-md-6 p-5 pe-md-0 fieldsx mb-3">
//           <div>
//             <div className="mb-5">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="24"
//                 height="24"
//                 viewBox="0 0 32 32"
//               >
//                 <path
//                   fill="currentColor"
//                   d="M16 2A11.013 11.013 0 0 0 5 13a10.9 10.9 0 0 0 2.216 6.6s.3.395.349.452L16 30l8.439-9.953c.044-.053.345-.447.345-.447l.001-.003A10.9 10.9 0 0 0 27 13A11.013 11.013 0 0 0 16 2m0 15a4 4 0 1 1 4-4a4.005 4.005 0 0 1-4 4"
//                 />
//                 <circle cx="16" cy="13" r="4" fill="none" />
//               </svg>
//               <span>
//                 <span>Address</span>
//                 <p className="ml-4">
//                   236 5th SE Avenue, <br /> New York, NY 10000, <br /> United
//                   States
//                 </p>
//               </span>
//             </div>

//             <div className="my-5">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="24"
//                 height="24"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   fill="currentColor"
//                   d="m20.487 17.14l-4.065-3.696a1.001 1.001 0 0 0-1.391.043l-2.393 2.461c-.576-.11-1.734-.471-2.926-1.66c-1.192-1.193-1.553-2.354-1.66-2.926l2.459-2.394a1 1 0 0 0 .043-1.391L6.859 3.513a1 1 0 0 0-1.391-.087l-2.17 1.861a1 1 0 0 0-.29.649c-.015.25-.301 6.172 4.291 10.766C11.305 20.707 16.323 21 17.705 21c.202 0 .326-.006.359-.008a.992.992 0 0 0 .648-.291l1.86-2.171a.997.997 0 0 0-.085-1.39"
//                 />
//               </svg>
//               <span>
//                 <span>Phone</span>
//                 <p className="ml-4">
//                   Mobile: +(84) 546-67895 <br /> Hotline: +(84) 456-67895
//                 </p>
//               </span>
//             </div>

//             <div>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="24"
//                 height="24"
//                 viewBox="0 0 16 16"
//               >
//                 <path
//                   fill="currentColor"
//                   d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"
//                 />
//               </svg>
//               <span>
//                 <span>Working Time</span>
//                 <p className="ml-4">
//                   Monday-Friday: 9:00 - 22:00 <br /> Saturday-Sunday: 9:00 -
//                   21:00
//                 </p>
//               </span>
//             </div>
//           </div>
//         </div>

//         <div className="col-md-6 p-5 ps-md-0 fields">
//           <Formik
//             initialValues={initialValues}
//             validationSchema={validationSchema}
//             onSubmit={handleSubmit}
//           >
//             <Form>
//               <div>
//                 <label>Your name</label>
//                 <br />

//                 <Field
//                   type="text"
//                   className="namefield mb-3"
//                   name="name"
//                   placeholder="Abc"
//                 />
//                 <ErrorMessage name="name" component="div" className="red" />
//               </div>
//               <div>
//                 <label>Email address</label>
//                 <br />
//                 <Field
//                   type="email"
//                   className="mailfield mb-3"
//                   name="mail"
//                   placeholder="example@mail.com"
//                 />
//               </div>
//               <div>
//                 <label>Message</label>
//                 <br />
//                 <Field
//                   type="text"
//                   className="messagefield mb-3"
//                   name="message"
//                   placeholder="Hi! I'd like to ask about..."
//                 />
//               </div>
//               <div>
//                 <label>Subject</label>
//                 <br />
//                 <Field
//                   type="text"
//                   name="subject"
//                   className="subjectfield mb-4"
//                   placeholder="Hi! I'd like to ask about..."
//                 />
//                 <br />
//                 <ErrorMessage name="subject" component="div" className="red" />
//               </div>
//               <button type="submit" className="submit">
//                 Submit
//               </button>
//             </Form>
//           </Formik>
//         </div>
//       </div>
//       {showPopup && <div className="popup show">Not Subscribed!</div>}

//       <Features />
//     </>
//   );
// };

// export default Contact;
