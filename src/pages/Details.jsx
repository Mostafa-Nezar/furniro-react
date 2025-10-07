import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import Productcart from "../comps/Productcart"
import Landing from "../comps/Landing"
export default function Details() {
  const { id } = useParams();
    const { products, theme, toggleFavorite, favorites, togglePopup } = useAppContext(), {cart, addToCart, updateCartQuantity, removeFromCart }=useCart(),{ user }=useAuth();
    const product = products.find((e) => e.id == id);
    const quantity = cart?.find((item) => item.id === product.id)?.quantity ?? 0;
    const [rating, setRating] = useState(0);
    const productImages = [ product.image1, product.image2, product.image3, product.image4].filter(Boolean);
    const [mainImage, setMainImage] = useState(productImages[0]); 
    const handleRatingSubmit = async (selectedRate) => {
      if (!user?.id) return;
        const rateId = `${user.id}-${product.id}`;
        await fetch("https://furniro-back-production.up.railway.app/api/ratings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userid: user.id, productid: product.id, rateid: rateId, rate: selectedRate }),
        });
        const res = await fetch("https://furniro-back-production.up.railway.app/api/ratings");
        const allRatings = await res.json();
        const productRatings = allRatings.filter((r) => r.productid === product.id);
        const avg = productRatings.reduce((acc, cur) => acc + cur.rate, 0) / productRatings.length;
        await fetch(`https://furniro-back-production.up.railway.app/api/products/db/${product.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ averagerate: +avg.toFixed(1), ratecount: productRatings.length }),
        });
        togglePopup(`Thanks! You rated this product ${selectedRate} stars `)
        setRating(selectedRate);
        product.averagerate = +avg.toFixed(1);
        product.ratecount = productRatings.length;
      };
      
  const modifyCartQuantity = (type) => {
     if (!product) return;
    if (!quantity) {
      if (type === "increase") {
        addToCart(product);
        togglePopup("Added to cart !")
        return;
      } 
    }
    const newQuantity = type === "increase" ? quantity + 1 : quantity - 1;
    if (newQuantity < 1) {
      removeFromCart(product.id);
      togglePopup("Removed from cart")
      return;
    }
    updateCartQuantity(product.id, newQuantity);
  };
  
  return (
    <>
    <Landing land={`${product.name} Details`}  />
    <div className="container mt-5">
          <div className="ms-5 row">
      <div className="col-md-1">
      <div className="d-grid w-75 my-auto align-items-center">
        {productImages.map((thumb, index) => (
          <div key={index} className="text-center my-2">
            <img className="img-fluid rounded cursor-pointer w-75" src={thumb} alt={`thumb-${index}`} onClick={() => setMainImage(thumb)}/>
          </div>
        ))}
      </div>
    </div>
      <div className="col-md-4">
      <img id="product-image" className="img-fluid" src={mainImage} alt={product.name} />
      </div>
      <div className="col-md-7 ps-5">
        <h1 id="product-name">{product.name}</h1>
        <h3 id="product-price" className="gray">Rs {product.price}</h3>
        <div className="stars w-25 ">
          {[5, 4, 3, 2, 1].map((star) => (
            <span key={star}>
              <input type="radio" name="star" id={`star${star}`} value={star} checked={product.averagerate === star} onChange={() => handleRatingSubmit(star)}/>
              <label htmlFor={`star${star}`} className="cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20" style={{ color: product.averagerate >= star ? "gold" : "gray" }} >
                  <path fill="currentColor" d="m10 1l3 6l6 .75l-4.12 4.62L16 19l-6-3l-6 3l1.13-6.63L1 7.75L7 7z" />
                </svg>
              </label>
            </span>
          ))}
        </div>

        <span className="d-inline w-25 gray ps-2 ms-4 ms-md-2" style={{ borderLeft: "2px solid var(--gray)" }}>
          <span id="rating-value">{product.ratecount || 0}</span> Customers Review
        </span>

        <p id="product-description" className="mt-3">
          {product.des}
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
            <div className="dont plus me-3" style={{ cursor: "pointer" }} 
              onClick={() => modifyCartQuantity("increase")}
            >
              +
            </div>
            <div className="q me-3">{quantity}</div>
            <div className="dont minus" style={{ cursor: "pointer" }}
              onClick={() => modifyCartQuantity("decrease")}

            >
              -
            </div>
          </div>

          <button className="me-2 text-black p-3 w-25 bg-white" style={{ borderRadius: "10px", border: "1px solid" }} onClick={() => modifyCartQuantity("increase")}>
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
    </div>

    <section>
  <div className="navbar navbar-expand-md">
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav ms-auto me-auto mb-2 mb-lg-0">
        <li className="nav-item m-3 fs-5">Description</li>
        <li className="nav-item m-3 gray fs-5">Additional information</li>
        <li className="nav-item gray m-3 fs-5">
          Reviews [<span className="v2">{product.ratecount}</span>]
        </li>
      </ul>
    </div>
  </div>

  <section className="gray p-5 m-5 mb-3 mt-0">
    <div className="px-5 mx-5">
      <p className="mx-4">
        Embodying the raw, wayward spirit of rock ‘n’ roll, the Kilburn portable
        active stereo speaker takes the unmistakable look and sound of Marshall,
        unplugs the chords, and takes the show on the road.
      </p>
      <p className="mx-4">
        Weighing in under 7 pounds, the Kilburn is a lightweight piece of vintage
        styled engineering. Setting the bar as one of the loudest speakers in its
        class, the Kilburn is a compact, stout-hearted hero with a well-balanced
        audio which boasts a clear midrange and extended highs for a sound that is
        both articulate and pronounced. The analogue knobs allow you to fine tune
        the controls to your personal preferences while the guitar-influenced
        leather strap enables easy and stylish travel.
      </p>
    </div>

    <div className="mx-5 mt-5 row">
      <div className="col-md-6">
        <img className="img-fluid" src="../images/g.png" alt="" />
      </div>
      <div className="col-md-6">
        <img className="img-fluid" src="../images/Group 107.png" alt="" />
      </div>
    </div>
  </section>
</section>

    <h2 className="text-center fw-bold my-5">Related products</h2>
          <div className="p-5 product-list">
        <div className="row">
          {products.filter((p) => p.id > product.id).slice(0, 4).map((product, index) => (
              <Productcart key={index} product={product} />
            ))}
        </div>
      </div>
    </>
  );
}
