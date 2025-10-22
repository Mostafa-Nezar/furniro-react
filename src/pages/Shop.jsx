import Features from "../comps/Features.jsx";
import Landing from "../comps/Landing.jsx";
import Productcart from "../comps/Productcart.jsx";
import { useAppContext } from "../context/AppContext";
const Edit = () => (
  <div className="edit p-3 pb-2">
    <div className="row">
      <div className="col-md-6 text-center">
        <div className="me-auto ps-auto pe-auto">
          <img
            className="mylist myfilter img-fluid p-2"
            src="https://res.cloudinary.com/dutetsivc/image/upload/v1752665093/furniro/filter.svg"
            alt="Filter"
          />
          <div className="mydivlist myfilter d-none">
            <div className="filter myfilter">
              Filter
              <svg
                className="myfilter rot"
                style={{ color: "black" }}
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                viewBox="0 0 20 20"
              >
                <path fill="currentColor" d="m6 15l5-5l-5-5l1-2l7 7l-7 7z" />
              </svg>
            </div>
            <ul className="myul myfilter">
              <li className="myownfilter myfilter">refresh</li>
              <li className="myfilter">100</li>
              <li className="myfilter">150</li>
              <li className="myfilter">200</li>
              <li className="myfilter">250</li>
              <li className="myfilter">300</li>
              <li className="myfilter">400</li>
              <li className="myfilter">500</li>
              <li className="myfilter">600</li>
              <li className="myfilter">700</li>
              <li className="myfilter">800</li>
            </ul>
          </div>
          <span className="p-2">Filter</span>
          <img
            className="p-2 img-fluid m-1"
            src="https://res.cloudinary.com/dutetsivc/image/upload/v1752665093/furniro/fourdots.svg"
            alt="Four Dots"
          />
          <img className="p-2 img-fluid m-1" src="https://res.cloudinary.com/dutetsivc/image/upload/v1752665093/furniro/tv.svg" alt="TV" />
          <p className="ps-3 ms-3 d-inline" style={{ borderLeft: "2px solid" }}>
            1-<span className="myshow">16</span> of 48 result
          </p>
        </div>
      </div>

      <div className="col-md-6 text-center">
        <div className="m-2 me-auto ps-auto pe-auto">
          <span className="m-3 show">
            Show
            <span style={{ backgroundColor: "white", padding: "5px" }}>48</span>
          </span>
          <span className="m-3">
            <div className="sort d-inline myfilter">
              Sort by
              <svg
                className="myfilter rot"
                style={{ color: "black", transition: "0.5s" }}
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                viewBox="0 0 20 20"
              >
                <path fill="currentColor" d="m6 15l5-5l-5-5l1-2l7 7l-7 7z" />
              </svg>
            </div>
            <ul className="myullet d-none myfilter">
              <li className="myfilter">a-z</li>
              <li className="myfilter">z-a</li>
              <li className="myfilter">default</li>
            </ul>
          </span>
        </div>
      </div>

      <div className="col-6 text-center"></div>
    </div>
  </div>
);

const Carousel = () => {
  const { products } = useAppContext();
  const chunkArray = (arr, chunkSize) => {
    return Array.from({ length: Math.ceil(arr.length / chunkSize) }, (_, i) =>
      arr.slice(i * chunkSize, (i + 1) * chunkSize)
    );
  };

  const chunkedProducts = chunkArray(products, Math.ceil(products.length / 3));

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
    <div className={`${theme ? "" : "bg-dark -white"}`}>
      <Landing land="Shop" showImage={false} />
      <Edit />
      <Carousel />
      <Features />
    </div>
  );
};

export default Shop;
