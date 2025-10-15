import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Features() {
  const refs = [useRef(), useRef(), useRef(), useRef()];
  const views = refs.map(r => useInView(r, { once: true }));
  const data = [ ["trophy 1.svg", "High Quality", "crafted from top materials"], ["true.svg", "Warranty Protection", "over 2 years"], ["handcarrybox.svg", "Free Shipping", "order over 150 $"], ["girl.svg", "24 / 7 Support", "Dedicated Support"]];

  return (
    <div className="my-bg-light-lightBeige p-5">
      <div className="row">
        {data.map(([img, title, text], i) => (
          <motion.div key={i} ref={refs[i]} className="col-md-3 col-6 mb-md-0 mb-5" initial={{ opacity: 0, y: 50 }} animate={{ opacity: views[i] ? 1 : 0, y: views[i] ? 0 : 50 }} transition={{ duration: 1, delay: i * 0.2 }}>
            <div className=" d-flex">
              <img src={`https://res.cloudinary.com/dutetsivc/image/upload/v1752665093/furniro/${img}`} className="p-2" alt="" />
              <div className="p-2">
                <h6 className="fw-bold">{title}</h6>
                <div className="fs-7 text-black-50">{text}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
