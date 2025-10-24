import { useState } from "react";
import Features from "../comps/Features.jsx";
import Landing from "../comps/Landing.jsx";
import Productcart from "../comps/Productcart.jsx";
import { useAppContext } from "../context/AppContext";



const Edit = () => {
  const {  searchQuery, filteredProducts, setSortBy, setFilterPrice } = useAppContext();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const handleSortClick = (value) => {
    setSortBy(value);
    setIsSortOpen(false); 
  };

  const handleFilterClick = (value) => {
    if (value === "refresh") setFilterPrice(null);
    else setFilterPrice(Number(value));
    setIsFilterOpen(false); 
  };

  return (
    <div className="edit p-3 pb-2 position-relative">
      <div className="row align-items-center">
        <div className="col-md-6 text-center">
          <div className="me-auto ps-auto pe-auto position-relative">
            <img
              className="img-fluid p-2"
              src="https://res.cloudinary.com/dutetsivc/image/upload/v1752665093/furniro/filter.svg"
              alt="Filter"
              onClick={() => setIsFilterOpen((prev) => !prev)}
              style={{ cursor: "pointer" }}
            />

            {isFilterOpen && (
              <div
                className="my-bg-white shadow-lg p-2 rounded-4"
                style={{
                  position: "absolute",
                  top: "60px",
                  left: "30px",
                  zIndex: 1000,
                  width: "140px",
                  border: "1px solid var(--lightGray)",
                }}
              >
                <div className="d-flex align-items-center justify-content-between my-text-black fw-bold">
                  Filter
                  <svg
                    style={{ color: "black" }}
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                  >
                    <path fill="currentColor" d="m6 15l5-5l-5-5l1-2l7 7l-7 7z" />
                  </svg>
                </div>
                <ul className="list-unstyled my-2">
                  {["refresh", 100, 150, 200, 250, 300, 400, 500, 600, 700, 800].map(
                    (price, i) => (
                      <li
                        key={i}
                        className="py-1 px-2 rounded-3 my-text-darkGray hover-item"
                        style={{ cursor: "pointer", transition: "0.3s" }}
                        onClick={() => handleFilterClick(price)}
                      >
                        {price}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            <span className="p-2 my-text-black">Filter</span>
            <img
              className="p-2 img-fluid m-1"
              src="https://res.cloudinary.com/dutetsivc/image/upload/v1752665093/furniro/fourdots.svg"
              alt="Four Dots"
            />
            <img
              className="p-2 img-fluid m-1"
              src="https://res.cloudinary.com/dutetsivc/image/upload/v1752665093/furniro/tv.svg"
              alt="TV"
            />
            <p
              className="ps-3 ms-3 d-inline my-text-gray"
              style={{ borderLeft: "2px solid var(--lightGray)" }}
            >
              1-<span >{(filteredProducts.length / 3).toFixed(0)}</span> of {filteredProducts.length || searchQuery.length} result
            </p>
          </div>
        </div>

        <div className="col-md-6 text-center position-relative">
          <div className="m-2 me-auto ps-auto pe-auto">
            <span className="m-3 show my-text-black">
              Show
              <span
                className="my-bg-lightBeige ms-2 rounded-3"
                style={{ padding: "5px 10px" }}
              >
                {filteredProducts.length}
              </span>
            </span>
            <span className="m-3 position-relative">
              <div
                className="sort d-inline fw-bold my-text-black"
                style={{ cursor: "pointer" }}
                onClick={() => setIsSortOpen((prev) => !prev)}
              >
                Sort by
                <svg
                  className="ms-1"
                  style={{ color: "var(--black)", transition: "0.5s" }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                >
                  <path fill="currentColor" d="m6 15l5-5l-5-5l1-2l7 7l-7 7z" />
                </svg>
              </div>

              {isSortOpen && (
                <ul
                  className="list-unstyled my-bg-white shadow-lg p-2 rounded-4"
                  style={{
                    position: "absolute",
                    top: "45px",
                    right: "0",
                    width: "130px",
                    zIndex: 1000,
                    border: "1px solid var(--lightGray)",
                  }}
                >
                  {["a-z", "z-a", "default"].map((sort, i) => (
                    <li
                      key={i}
                      className="py-2 px-3 rounded-3 my-text-darkGray hover-item"
                      style={{ cursor: "pointer", transition: "0.3s" }}
                      onClick={() => handleSortClick(sort)}
                    >
                      {sort.toUpperCase()}
                    </li>
                  ))}
                </ul>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};


const Carousel = () => {
    const { filteredProducts } = useAppContext();
  const chunkArray = (arr, chunkSize) => {
    return Array.from({ length: Math.ceil(arr.length / chunkSize) }, (_, i) =>
      arr.slice(i * chunkSize, (i + 1) * chunkSize)
    );
  };

  const chunkedProducts = chunkArray(filteredProducts, Math.ceil(filteredProducts.length / 3));

  return (
    <div id="carouselExampleIndicators" className="carousel slide">
      <div className="carousel-inner">
        {chunkedProducts.map((chunk, index) => (
          <div
            key={index}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
          >
            <div className="p-5 product-list">
              <div className="row">
                {chunk.map((product, idx) => (
                  <Productcart key={idx} product={product} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="shop-carousel-indicators mb-5">
        {chunkedProducts.map((_, index) => (
          <button
            key={index}
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to={index}
            className={index === 0 ? "active" : ""}
            aria-current={index === 0 ? "true" : "false"}
            aria-label={`Slide ${index + 1}`}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="shop-carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="next"
        >
          <span>Next</span>
        </button>
      </div>
    </div>
  );
};

const Shop = () => {
  const { theme } = useAppContext();
  return (
    <div className={`${theme ? "" : "bg-dark"}`}>
      <Landing land="Shop" />
      <Edit />
      <Carousel />
      <Features />
    </div>
  );
};

export default Shop;
