import { motion } from "framer-motion";

export default function Landing({ land, showImage = true }) {
  return (
    <motion.div
      className="contacting"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="container p-5">
        <motion.div
          className="text-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {showImage && (
            <motion.img
              src="/images/logo.png"
              alt="Meubel House Logo"
              className="logo"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            />
          )}
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {land}
          </motion.h1>
          <a className="d-inline myhome" href="/">Home</a>
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 20 20"
            className="nxt"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            whileHover={{ scale: 1.2 }}
          >
            <path
              fill="currentColor"
              d="m6 15l5-5l-5-5l1-2l7 7l-7 7z"
            ></path>
          </motion.svg>
          <motion.p
            className="d-inline p-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {land}
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}
