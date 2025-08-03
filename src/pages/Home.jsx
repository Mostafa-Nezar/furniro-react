import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Productcart from "../comps/Productcart";
import { useAppContext } from "../context/AppContext";
const useScrollObserver = (selector, threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = (entries, observer) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      setIsVisible(true); 
      observer.unobserve(entry.target);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleScroll, {
      threshold,
    });

    const element = document.querySelector(selector);
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [selector, threshold]);

  return isVisible;
};


const Banner = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        backgroundImage:
          'url("https://res.cloudinary.com/dutetsivc/image/upload/v1752665093/furniro/banner.png")',
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        height: "780px",
      }}
    >
      <motion.div
        className="container-fluid"
        style={{
          backgroundColor: "var(--color3)",
          height: "55%",
          width: "40%",
          position: "relative",
          left: "45%",
          top: "48%",
          transform: "translate(-50%, -50%)",
          padding: "50px",
          borderRadius: "10px",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <span
          style={{
            wordSpacing: "10px",
            letterSpacing: "5px",
            margin: "20px",
            fontWeight: "bold",
            display: "block",
          }}
        >
          New Arrival
        </span>
        <motion.h1
          style={{ color: "var(--primary)", fontWeight: "bold", margin: "20px" }}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Discover Our
          <br />
          New Collection
        </motion.h1>
        <motion.p
          style={{ margin: "20px" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. ut aperiam
          aspernatur error itaque minima odio.
        </motion.p>
        <a href="/shop" className="ms-5">
          <motion.button
            className="mt-4 text-white border-0"
            style={{
              backgroundColor: "var(--primary)",
              padding: "20px",
              width: "200px",
              fontWeight: "bold",
              margin: "20px",
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Buy Now
          </motion.button>
        </a>
      </motion.div>
    </div>
  );
};

const Landing = () => {
  const isVisible = useScrollObserver(".landing");
  return (
    <div className="landing mt-5 p-4 text-center">
      <div className="container">
        <motion.h1
          className="fw-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 1 }}
        >
          Browse The Range
        </motion.h1>
        <motion.p
          className="fs-5 mb-2 text-black-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </motion.p>
        <div className="row p-5">
          <motion.div
            className="col-lg-4 mb-sm-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <img
              className="img-fluid"
              src="https://res.cloudinary.com/dutetsivc/image/upload/v1752665093/furniro/Image-living room.png"
              alt="Dining"
            />
            <span className="d-block mt-3 fw-bold fs-4">Dining</span>
          </motion.div>
          <motion.div
            className="col-lg-4 mb-sm-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <img
              className="img-fluid"
              src="https://res.cloudinary.com/dutetsivc/image/upload/v1752665093/furniro/Mask Group.png"
              alt="Living"
            />
            <div className="d-block mt-3 fw-bold fs-4">Living</div>
          </motion.div>
          <motion.div
            className="col-lg-4 mb-sm-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <img
              className="img-fluid"
              src="https://res.cloudinary.com/dutetsivc/image/upload/v1752665093/furniro/Mask Group2.png"
              alt="Bedroom"
            />
            <div className="d-block mt-3 fw-bold fs-4">Bedroom</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const Inspiration = () => {
  const isVisible = useScrollObserver(".inspiration");

  return (
    <div className="inspiration pt-5">
      <div className="row">
        {/* Text Section */}
        <div className="col-lg-4 col-md-6">
          <motion.div
            className="position-relative top-50 start-50 translate-middle mb-lg-0 mb-5"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
            transition={{ duration: 1 }}
          >
            <h1 className="fw-bold">
              50 + Beautiful rooms <br /> inspiration
            </h1>
            <p className="p-3 text-black-50">
              Our designer already made a lot of Beautiful prototype of rooms
              that inspire you
            </p>
            <motion.button
              style={{
                backgroundColor: "var(--primary)",
                padding: "20px",
                width: "150px",
                fontWeight: "bold",
                color: "white",
                border: "none",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Explore More
            </motion.button>
          </motion.div>
        </div>

        {/* Image Section */}
        <div className="col-lg-4 mb-0 pb-0 col-md-6">
          <motion.img
            src="https://res.cloudinary.com/dutetsivc/image/upload/v1752665093/furniro/baby.png"
            alt="Baby Room"
            className="img-fluid"
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 1, delay: 1 }}
          />
          <motion.div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.638)",
              width: "230px",
            }}
            className="p-4"
            initial={{ opacity: 0, y: 20, x: "-85%" }}
            animate={{
              opacity: isVisible ? 1 : 0,
              y: isVisible ? -160 : 20,
              x: isVisible ? "15%" : "-85%",
            }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <p className="fw-bold">
              01{" "}
              <i className="fa-solid fa-minus" style={{ fontSize: "20px" }}></i>{" "}
              Bed Room
            </p>
            <h3 className="d-inline">Inner Peace</h3>
          </motion.div>

          <motion.div
            style={{
              transform: "translateY(-191px) translateX(265px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <svg
              style={{
                backgroundColor: "var(--primary)",
                color: "white",
                width: "40px",
              }}
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="30"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M4 12h16m0 0l-6-6m6 6l-6 6"
              ></path>
            </svg>
          </motion.div>
        </div>

        {/* Carousel Section */}
        <div className="col-lg-4 col-md-6">
          <div className="indicator">
            <motion.div
              id="carouselExampleCaptions"
              className="carousel slide"
              initial={{ opacity: 0 }}
              animate={{ opacity: isVisible ? 1 : 0 }}
              transition={{ duration: 1, delay: 1.5 }}
            >
              <div className="carousel-inner p-md-4 p-lg-0">
                <div className="carousel-item active">
                  <img
                    src="https://res.cloudinary.com/dutetsivc/image/upload/v1752665093/furniro/Rectangle 26.png"
                    className="d-block w-100 pe-5 carimg"
                  />
                </div>
                <div className="carousel-item">
                  <img
                    src="https://res.cloudinary.com/dutetsivc/image/upload/v1752665093/furniro/bed.png"
                    className="d-block w-100 pe-5 carimg"
                  />
                </div>
                <div className="carousel-item">
                  <img
                    src="https://res.cloudinary.com/dutetsivc/image/upload/v1752665093/furniro/library.png"
                    className="d-block w-100 pe-5 carimg"
                  />
                </div>
                <div className="carousel-item">
                  <img
                    src="https://res.cloudinary.com/dutetsivc/image/upload/v1752665093/furniro/kit.png"
                    className="d-block w-100 pe-5 carimg"
                  />
                </div>
              </div>
              <div className="home-carousel-indicators d-flex justify-content-center mt-4 me-4">
                {Array.from({ length: 4 }, (_, i) => (
                  <motion.div
                    key={i}
                    type="button"
                    data-bs-target="#carouselExampleCaptions"
                    data-bs-slide-to={i}
                    className={`indicator m-2 p-1 ${i === 0 ? "active" : ""}`}
                    aria-label={`Slide ${i + 1}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isVisible ? 1 : 0 }}
                    transition={{ duration: 0.6, delay: 1.8 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="27"
                      height="27"
                      viewBox="0 0 48 48"
                    >
                      <path
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="4"
                        d="M24 33a9 9 0 1 0 0-18a9 9 0 0 0 0 18Z"
                      ></path>
                    </svg>
                  </motion.div>
                ))}
              </div>
              <motion.button
                className="inspiration-carousel-control-next"
                style={{ opacity: 1, border: "none" }}
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide="next"
                initial={{ opacity: 0 }}
                animate={{ opacity: isVisible ? 1 : 0 }}
                transition={{ duration: 1, delay: 2 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m9 5l7 7l-7 7"
                  ></path>
                </svg>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Random = () => {
  const isVisible = useScrollObserver(".random");

  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: isVisible ? 1 : 0, y: 0 },
    transition: { duration: 1, delay: 0.3 },
  };

  return (
    <>
      <motion.div className="random" {...fadeIn}>
        <motion.p
          className="text-black-50 text-center mt-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Share Your Setup With
        </motion.p>
        <motion.h1
          className="text-center fw-bold"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isVisible ? 1 : 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          #Furnirofurnature
        </motion.h1>
        <motion.div
          className="hash mt-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isVisible ? 1 : 0, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="four"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isVisible ? 1 : 0, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <motion.img
              src="https://res.cloudinary.com/dutetsivc/image/upload/v1752665093/furniro/library.png"
              style={{
                gridArea: "m1",
                width: "100%",
                height: "80%",
                marginTop: "30%",
              }}
              className="img-fluid m1"
              alt=""
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: isVisible ? 1 : 0, x: 0 }}
              transition={{ duration: 0.8 }}
            />
            <motion.img
              src="https://res.cloudinary.com/dutetsivc/image/upload/v1752665093/furniro/table.png"
              className="img-fluid m3"
              style={{
                gridArea: "m3",
                width: "100%",
                height: "70%",
                marginTop: "30%",
              }}
              alt=""
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: isVisible ? 1 : 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <motion.div
              className="x"
              style={{ gridArea: "x" }}
              initial={{ scale: 0 }}
              animate={{ scale: isVisible ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            ></motion.div>
            <motion.img
              src="https://res.cloudinary.com/dutetsivc/image/upload/v1752665093/furniro/bed.png"
              className="img-fluid m4"
              style={{ gridArea: "m4", width: "100%", height: "80%" }}
              alt=""
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: isVisible ? 1 : 0, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
            <motion.img
              src="https://res.cloudinary.com/dutetsivc/image/upload/v1752665093/furniro/vas.png"
              className="img-fluid m5"
              style={{ gridArea: "m5", width: "100%", height: "70%" }}
              alt=""
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: isVisible ? 1 : 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
          </motion.div>

          <motion.div
            className="two"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <img className="img-fluid" src="https://res.cloudinary.com/dutetsivc/image/upload/v1752665093/furniro/lunch.png" alt="" />
          </motion.div>

          <motion.div
            className="three"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: isVisible ? 1 : 0, x: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <motion.img
              src="https://res.cloudinary.com/dutetsivc/image/upload/v1752665093/furniro/kit.png"
              className="img-fluid m6"
              style={{ gridArea: "m6", width: "100%", height: "100%" }}
              alt=""
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: isVisible ? 1 : 0, y: 0 }}
              transition={{ duration: 0.8 }}
            />
            <motion.img
              src="https://res.cloudinary.com/dutetsivc/image/upload/v1752665093/furniro/bedroom.png"
              className="img-fluid m8 mb-5"
              style={{ gridArea: "m8", width: "100%", marginTop: "30%" }}
              alt=""
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: isVisible ? 1 : 0, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <motion.img
              src="https://res.cloudinary.com/dutetsivc/image/upload/v1752665093/furniro/chef.png"
              className="img-fluid m9"
              style={{ gridArea: "m9", width: "100%", height: "40%" }}
              alt=""
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: isVisible ? 1 : 0, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
            <motion.img
              src="https://res.cloudinary.com/dutetsivc/image/upload/v1752665093/furniro/block.png"
              className="img-fluid m10"
              style={{ gridArea: "m10", width: "100%", height: "70%" }}
              alt=""
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: isVisible ? 1 : 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            />
          </motion.div>
        </motion.div>
        <hr style={{ width: "90%", margin: "20px auto", height: "0.5px" }} />
      </motion.div>
    </>
  );
};

const Home = () => {
  const { products } = useAppContext();
  const showPopup = false
  return (
    <div>
      <Banner />
      <Landing />
      <h1 className="fw-bold text-center" id="our-products">
        Our Products
      </h1>
      <div className="p-5 product-list">
        <div className="row">
          {products.slice(0, 8).map((product, index) => (
            <Productcart key={index} product={product} />
          ))}
        </div>
      </div>
      {/* <ShareButtons /> */}
      <div className="text-center my-5">
        <a href="/shop#car">
          <button className="show-more mb-5 mt-3 text-center">Show More</button>
        </a>
      </div>
      <div>
        <Inspiration />
        <Random />
        {showPopup && <div className="popup show">Added To Cart!</div>}
      </div>
    </div>
  );
};

export default Home;
