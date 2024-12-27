import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function Features() {
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);

  const isInView1 = useInView(ref1, { once: true });
  const isInView2 = useInView(ref2, { once: true });
  const isInView3 = useInView(ref3, { once: true });
  const isInView4 = useInView(ref4, { once: true });

  return (
    <div className="features p-5">
      <div className="row">
        <motion.div
          ref={ref1}
          className="col-md-3 col-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isInView1 ? 1 : 0, y: isInView1 ? 0 : 50 }}
          transition={{ duration: 1 }}
        >
          <div className="feature d-flex mb-md-0 mb-5">
            <img src="images/trophy 1.svg" className="p-2" alt="" />
            <div className="p-2">
              <h6 className="fw-bold">High Quality</h6>
              <div className="fs-7 text-black-50">crafted from top materials</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          ref={ref2}
          className="col-md-3 col-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isInView2 ? 1 : 0, y: isInView2 ? 0 : 50 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="feature d-flex mb-md-0 mb-5">
            <img src="images/true.svg" className="p-2" alt="" />
            <div className="p-2">
              <h6 className="fw-bold">Warranty Protection</h6>
              <div className="fs-7 text-black-50">over 2 years</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          ref={ref3}
          className="col-md-3 col-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isInView3 ? 1 : 0, y: isInView3 ? 0 : 50 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <div className="feature d-flex">
            <img src="images/handcarrybox.svg" className="p-2" alt="" />
            <div className="p-2">
              <h6 className="fw-bold">Free Shipping</h6>
              <div className="fs-7 text-black-50">order over 150 $</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          ref={ref4}
          className="col-md-3 col-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isInView4 ? 1 : 0, y: isInView4 ? 0 : 50 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <div className="feature d-flex">
            <img src="images/girl.svg" className="p-2" alt="" />
            <div className="p-2">
              <h6 className="fw-bold">24 / 7 Support</h6>
              <div className="fs-7 text-black-50">Dedicated Support</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
