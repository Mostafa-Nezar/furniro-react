import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import Productcart from "../comps/Productcart"
import Landing from "../comps/Landing"
export default function Details() {
  const { id } = useParams();
    const { products, theme, togglePopup } = useAppContext(), {cart, addToCart, updateCartQuantity, removeFromCart, syncCart }=useCart(),{ user }=useAuth();
    const [userRating, setUserRating] = useState(null);
    const product = products.find((e) => e.id == id);
    const [mainImage, setMainImage] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(0);
    const [productImages, setProductImages] = useState([]);
    const [selectedColor, setSelectedColor] = useState(null);
    useEffect(() => {
      if (!product) return;
      setProductImages([ product.image, product.image1, product.image2, product.image3, product.image4 ].filter(Boolean));
      setMainImage(product.image);
    }, [product]);
    useEffect(() => {
      if (!product) return;
      setQuantity(cart?.find((item) => item.id === product.id)?.quantity ?? 0);
      setSelectedSize(cart.find((item) => item.id === product.id)?.size || "l");
    }, [cart]);


    function SelectOrColor(productId, key, value) {
        const existingItem = cart.find((item) => item.id === productId);
        if (!existingItem) {
          togglePopup("Not In Cart");
          return;
        }
        const updatedCart = cart.map((item) =>item.id === productId ? { ...item, [key]: value } : item);
        syncCart(updatedCart);
        togglePopup(`Updated ${key}`);
      }
    const handleRatingSubmit = async (selectedRate) => {
       setUserRating(selectedRate);
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
  if (!product) return(<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z" opacity="0.5"/><path fill="currentColor" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z"><animateTransform attributeName="transform" dur="1s" from="0 12 12" repeatCount="indefinite" to="360 12 12" type="rotate"/></path></svg>); 
  
  return (
    <>
    <Landing land={`${product.name} Details`}  />
      <div className="container mt-5">
        <div className="ms-5 row">
          <div className="col-md-1">
            <div className="d-grid w-75 my-auto align-items-center">
              {productImages.slice(1).map((thumb, index) => (
                <div key={index} className="text-center my-2">
                  <img className="img-fluid w-100 h-100" src={thumb} alt={`thumb-${index}`} onClick={() => setMainImage(thumb)} style={{ height: "70px", cursor: "pointer", borderRadius:"10px" }} />
                </div>
              ))}
        </div>
      </div>
      <div className="col-md-4">
        <img id="product-image" className="img-fluid" src={mainImage} alt={product.name} style={{ height: "542px", objectFit: "cover" }} onClick={() => setMainImage(product.image)}/>
      </div>
    <div className="col-md-7 ps-5">
      <h1 id="product-name" className="fw-bold mb-3">
        {product.name}
      </h1>
      <h3 id="product-price" className="gray mb-3">
        Rs {`${product.price},000.00`}
      </h3>
      <div className="d-flex align-items-baseline">
  <div className="stars w-25 d-flex align-items-center">
    {[5, 4, 3, 2, 1].map((star) => (
      <span key={star}>
        <input type="radio" name="star" id={`star${star}`} value={star} checked={(userRating ?? product.averagerate) === star} onChange={() => handleRatingSubmit(star)} className="d-none"/>
        <label htmlFor={`star${star}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20" style={{ color: (userRating ?? product.averagerate) >= star ? "gold" : "gray" }}>
            <path fill="currentColor" d="m10 1l3 6l6 .75l-4.12 4.62L16 19l-6-3l-6 3l1.13-6.63L1 7.75L7 7z"/>
          </svg>
        </label>
      </span>
    ))}
  </div>
  <span className="d-inline-block gray ps-2 ms-2 mt-1" style={{ borderLeft: "2px solid var(--gray)" }}>
    <span id="rating-value">{product.averagerate || 0}</span> Customers Reviews
  </span>
  <span className="d-inline-block gray ps-2 ms-2 mt-1" style={{ borderLeft: "2px solid var(--gray)" }}>
    <span id="rating-value">{product.ratecount || 0}</span> Customers
  </span>
</div>
  <p id="product-description" className="mt-4 gray">
    {product.des}
  </p>
  <div className="mb-2 mt-3 fw-bold">Size</div>
  <p>
    {["l", "xl", "xs"].map((size) => (
      <span key={size} className={`p-2 size m-2 my-bg-color3 ${selectedSize === size ? "active" : ""}`}
        style={{ cursor: "pointer" }} onClick={() => { setSelectedSize(size); SelectOrColor(product.id,"size", size)}}>
        {size}
      </span>
    ))}
  </p>

<span className="fw-bold">Color</span>
<div>
  {["mediumslateblue", "black", "#B88E2F"].map((color, index) => (
    <svg key={index} className={`me-2 ${selectedColor === color ? "border" : ""}`} style={{ color, cursor: "pointer" }} onClick={() =>{setSelectedColor(color); SelectOrColor(product.id,"color", color)}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 15 15">
      <path fill="currentColor" d="M7.5 0a7.5 7.5 0 1 0 0 15a7.5 7.5 0 0 0 0-15"/>
    </svg>
  ))}
</div>


      <div className="w-100">
        <div className="me-2 mb-2 d-inline-flex p-3 border border-dark px-0 justify-content-evenly rounded" style={{ width: "15%", borderColor: "var(--gray)" }}>
          <div className="dont plus me-3" style={{ cursor: "pointer" }} onClick={() => modifyCartQuantity("increase")}>+</div>
          <div className="q me-3">{quantity}</div>
          <div className=" minus"
            style={{ cursor: "pointer" }}
            onClick={() => modifyCartQuantity("decrease")}
          >
            -
          </div>
        </div>
        <button className="me-2 text-black p-3 w-25 bg-white"style={{ borderRadius: "10px", border: "1px solid var(--gray)" }}  onClick={() => modifyCartQuantity("increase")}>
          Add to Cart
        </button>
        <button className="text-black p-3 w-25 bg-white" style={{ borderRadius: "10px", border: "1px solid var(--gray)" }}>
          + Compare
        </button>
      </div>
      <div className="m-5 ms-0 mt-0">
        <hr />
      </div>

  <div className="row mb-3 align-items-start">
    <div className="col-md-2 text-secondary"> {["SKU", "Category", "Tags", "Share"].map((label) => (<p key={label} className="mb-2 fw-semibold">{label}</p>))}
  </div>
  <div className="col-auto text-secondary px-0">
    {Array(4).fill(":").map((dot, i) => (<p key={i} className="mb-2">{dot}</p>))}
  </div>
  <div className="col-md-6 text-secondary">
    <p className="mb-2">{product.key}</p>
    <p className="mb-2">Sofas</p>
    <p className="mb-2">Sofa, Chair, Home, Shop</p>
    <div className="d-flex align-items-center gap-3 mt-1">
      <svg className="share-icon twitter text-black cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 1024 1024">
        <path fill="currentColor" d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448s448-200.6 448-448S759.4 64 512 64m215.3 337.7c.3 4.7.3 9.6.3 14.4c0 146.8-111.8 315.9-316.1 315.9c-63 0-121.4-18.3-170.6-49.8c9 1 17.6 1.4 26.8 1.4c52 0 99.8-17.6 137.9-47.4c-48.8-1-89.8-33-103.8-77c17.1 2.5 32.5 2.5 50.1-2a111 111 0 0 1-88.9-109v-1.4c14.7 8.3 32 13.4 50.1 14.1a111.13 111.13 0 0 1-49.5-92.4c0-20.7 5.4-39.6 15.1-56a315.28 315.28 0 0 0 229 116.1C492 353.1 548.4 292 616.2 292c32 0 60.8 13.4 81.1 35c25.1-4.7 49.1-14.1 70.5-26.7c-8.3 25.7-25.7 47.4-48.8 61.1c22.4-2.4 44-8.6 64-17.3c-15.1 22.2-34 41.9-55.7 57.6"/>
      </svg>
      <svg className="share-icon whatsapp text-black cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M1 2.838A1.838 1.838 0 0 1 2.838 1H21.16A1.837 1.837 0 0 1 23 2.838V21.16A1.838 1.838 0 0 1 21.161 23H2.838A1.838 1.838 0 0 1 1 21.161V2.838zm8.708 6.55h2.979v1.496c.43-.86 1.53-1.634 3.183-1.634 3.169 0 3.92 1.713 3.92 4.856v5.822h-3.207v-5.106c0-1.79-.43-2.8-1.522-2.8-1.515 0-2.145 1.089-2.145 2.8v5.106H9.708V9.388zm-5.5 10.403h3.208V9.25H4.208v10.54zM7.875 5.812a2.063 2.063 0 1 1-4.125 0 2.063 2.063 0 0 1 4.125 0z"/>
      </svg>
      <svg className="share-icon facebook text-black  cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M0 12.067C0 18.033 4.333 22.994 10 24v-8.667H7V12h3V9.333c0-3 1.933-4.666 4.667-4.666.866 0 1.8.133 2.666.266V8H15.8c-1.467 0-1.8.733-1.8 1.667V12h3.2l-.533 3.333H14V24c5.667-1.006 10-5.966 10-11.933C24 5.43 18.6 0 12 0S0 5.43 0 12.067z"/>
      </svg>
    </div>
  </div>
</div>

    </div>
  </div>
</div>

<hr />
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
        <img className="img-fluid" src="https://res.cloudinary.com/dutetsivc/image/upload/v1759269253/furniro/g.png" alt="" />
      </div>
      <div className="col-md-6">
        <img className="img-fluid" src="https://res.cloudinary.com/dutetsivc/image/upload/v1759269253/furniro/Group 107.png" alt="" />
      </div>
    </div>
  </section>
</section>

    <h2 className="text-center fw-bold my-5">Related products</h2>
          <div className="p-5 product-list">
        <div className="row">
          {products.filter((p) => p.id > product.id).slice(0, 4).map((product, index) => (<Productcart key={index} product={product} />))}
        </div>
      </div>
    </>
  );
}
