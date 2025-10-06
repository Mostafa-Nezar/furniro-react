import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useCart } from "../context/CartContext";

export default function Details() {
  const { id } = useParams();
  const { products } = useAppContext();
  const { addToCart } = useCart();

  const product = products.find((e) => e.id == id);

  if (!product)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z"
            opacity="0.5"
          />
          <path
            fill="currentColor"
            d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z"
          >
            <animateTransform
              attributeName="transform"
              dur="1s"
              from="0 12 12"
              repeatCount="indefinite"
              to="360 12 12"
              type="rotate"
            />
          </path>
        </svg>
      </div>
    );

  return (
    <div className="ms-5 row">
      {/* الصور الصغيرة */}
      <div className="col-md-1">
        <div className="d-grid w-75 my-auto align-items-center">
          {product.thumbnails?.map((thumb, index) => (
            <div key={index} className="text-center my-2">
              <img
                className="img-fluid ph"
                style={{ borderRadius: "10px", height: "61px", cursor: "pointer" }}
                src={thumb}
                alt={`thumb-${index}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* الصورة الأساسية */}
      <div className="col-md-4">
        <img
          id="product-image"
          className="img-fluid"
          src={product.image}
          alt={product.name}
        />
      </div>

      {/* تفاصيل المنتج */}
      <div className="col-md-7 ps-5">
        <h1 id="product-name">{product.name}</h1>
        <h3 id="product-price" className="gray">
          Rs {product.price}
        </h3>

        {/* ستار ريتنج (ثابت دلوقتي، تقدر تربطه بالـ state أو بالـ context بعدين) */}
        <div className="stars w-25">
          {[5, 4, 3, 2, 1].map((star) => (
            <span key={star}>
              <input type="radio" name="star" id={`star${star}`} value={star} />
              <label htmlFor={`star${star}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill="currentColor"
                    d="m10 1l3 6l6 .75l-4.12 4.62L16 19l-6-3l-6 3l1.13-6.63L1 7.75L7 7z"
                  />
                </svg>
              </label>
            </span>
          ))}
        </div>

        <span className="d-inline w-25 gray ps-2 ms-4 ms-md-2" style={{ borderLeft: "2px solid var(--gray)" }}>
          <span id="rating-value">{product.reviewsCount || 0}</span> Customers Review
        </span>

        <p id="product-description" className="mt-3">
          {product.description}
        </p>

        <div className="mb-2">Size</div>
        <p>
          {product.sizes?.map((s, i) => (
            <span key={i} className="size">{s}</span>
          ))}
        </p>

        <span>Color</span>
        <div>
          {product.colors?.map((c, i) => (
            <svg
              key={i}
              className="me-2"
              style={{ color: c }}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 15 15"
            >
              <path
                fill="currentColor"
                d="M7.5 0a7.5 7.5 0 1 0 0 15a7.5 7.5 0 0 0 0-15"
              />
            </svg>
          ))}
        </div>

        <br />
        <div className="w-100">
          <div
            className="me-2 mb-2 d-inline-flex p-3 border border-dark px-0 justify-content-evenly rounded"
            style={{ width: "15%", borderColor: "var(--gray)" }}
          >
            <div className="dont plus me-3" style={{ cursor: "pointer" }}>
              +
            </div>
            <div className="q me-3">0</div>
            <div className="dont minus" style={{ cursor: "pointer" }}>
              -
            </div>
          </div>

          <button className="me-2 text-black p-3 w-25 bg-white" style={{ borderRadius: "10px", border: "1px solid" }} onClick={()=>addToCart(product)}>
            Add to Cart
          </button>
          <button className="text-black p-3 w-25 bg-white" style={{ borderRadius: "10px", border: "1px solid" }}>
            + Compare
          </button>
        </div>

        <div className="m-5 ms-0 mt-0">
          <hr />
        </div>
      </div>
    </div>
  );
}
