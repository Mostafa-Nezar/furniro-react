import { useAppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useCallback } from "react";

const ProductItem = ({ product }) => {
  const {
    addToCart,
    toggleFavorite,
    favorites,
  } = useAppContext();

  const isFavorite = favorites.includes(product.id);

  const handleAddToCart = useCallback(() => {
    addToCart(product);
    toast.success(`Order Placed - ${product.name}`);
  }, [product, addToCart]);

  const handleToggleFavorite = useCallback(
    (e) => {
      e.preventDefault();
      toggleFavorite(product.id);
      toast.success(`${isFavorite ? "Removed from Favorites" : "Added to Favorites"} - ${product.name}`);
    },
    [product.id, isFavorite, toggleFavorite]
  );

  return (
    <div className="col-md-6 col-lg-3">
      <div className="cont semiwhite">
        <div className="innercontent">
          <img
            width="100%"
            className="img-fluid"
            src={product.image}
            alt={product.name}
            style={{ height: "316.85px" }}
          />
          <div className={`sale ${product.new ? "new" : ""}`}>
            {product.sale ? `${product.sale}%` : product.new ? "New" : ""}
          </div>
        </div>

        <div className="des">
          <h4 className="fw-bold">{product.name}</h4>
          <p className="text-black-50">{product.des}</p>
          <div className="d-inline me-5" style={{ fontWeight: 700 }}>
            {product.price}.000.00
          </div>
          <del className="gray">
            {product.oldprice ? `${product.oldprice}.000.00` : ""}
          </del>
        </div>

        <div className="lay d-grid align-items-center">
          <div className="text-center">
            <button className="addbutton mb-5" onClick={handleAddToCart}>
              Add To Cart
            </button>

            <div className="d-flex justify-content-center">
              <a
                className="text-white sharep fw-bold"
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  // setView(); // فعلها لو محتاجها
                }}
              >
                {/* Share SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81c1.66 0 3-1.34 3-3s-1.34-3-3-3s-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65c0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92"
                  ></path>
                </svg>{" "}
                Share
              </a>

              <a
                className="mx-2 text-white fw-bold hover-red"
                href={`../details/detail.html?id=${product.id}`}
              >
                {/* Compare Icon */}
                <svg fill="#ffffff" width="24px" height="24px" viewBox="0 0 16 16">
                  <path d="M10.08,7l1,1,3.44-3.45L11,1,10,2l1.8,1.8H2v1.4h9.82ZM5.86,9l-1-1L1.42,11.5,4.91,15l1-1L4.1,12.2H14V10.8H4.1Z" />
                </svg>{" "}
                Compare
              </a>

              <a
                className={`text-white fw-bold likex ${isFavorite ? "red" : ""}`}
                href="#"
                data-id={product.id}
                onClick={handleToggleFavorite}
              >
                {/* Like SVG */}
                <svg
                  className="likesvgitem"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 48 48"
                >
                  <path
                    className="pathsvgitem"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="5"
                    d="M15 8C8.925 8 4 12.925 4 19c0 11 13 21 20 23.326C31 40 44 30 44 19c0-6.075-4.925-11-11-11c-3.72 0-7.01 1.847-9 4.674A10.987 10.987 0 0 0 15 8"
                  ></path>
                </svg>{" "}
                Like
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
