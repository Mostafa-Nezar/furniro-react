import Landing from "../comps/Landing.jsx";
import Features from "../comps/Features.jsx";
const Blog = () => {
  const blogPosts = [
    {
      image: "https://res.cloudinary.com/dutetsivc/image/upload/v1752665093/furniro/laptop-blog.png",
      date: "24 Oct 2022",
      category: "Wood",
      title: "Going all-in With Millennial design",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mus mauris vitae ultricies leo integer malesuada nunc. In nulla posuere sollicitudin aliquam ultrices. Morbi blandit cursus risus at ultrices mi tempus imperdiet. Libero enim sed faucibus turpis in. Cursus mattis molestie a iaculis at erat. Nibh cras pulvinar mattis nunc sed blandit libero. Pellentesque elit ullamcorper dignissim cras tincidunt. Pharetra et ultrices neque ornare aenean euismod elementum.",
    },
    {
      image: "https://res.cloudinary.com/dutetsivc/image/upload/v1752665093/furniro/Rectangle 68.png",
      date: "24 Oct 2022",
      category: "Wood",
      title: "Exploring new ways of decorating",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mus mauris vitae ultricies leo integer malesuada nunc. In nulla posuere sollicitudin aliquam ultrices. Morbi blandit cursus risus at ultrices mi tempus imperdiet. Libero enim sed faucibus turpis in. Cursus mattis molestie a iaculis at erat. Nibh cras pulvinar mattis nunc sed blandit libero. Pellentesque elit ullamcorper dignissim cras tincidunt. Pharetra et ultrices neque ornare aenean euismod elementum.",
    },
    {
      image: "https://res.cloudinary.com/dutetsivc/image/upload/v1752665093/furniro/Rectangle 68(1).png",
      date: "24 Oct 2022",
      category: "Wood",
      title: "Experimenting with color palettes",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mus mauris vitae ultricies leo integer malesuada nunc. In nulla posuere sollicitudin aliquam ultrices. Morbi blandit cursus risus at ultrices mi tempus imperdiet. Libero enim sed faucibus turpis in. Cursus mattis molestie a iaculis at erat. Nibh cras pulvinar mattis nunc sed blandit libero. Pellentesque elit ullamcorper dignissim cras tincidunt. Pharetra et ultrices neque ornare aenean euismod elementum.",
    },
  ];

  return (
    <div className="blog">
      <div className="container p-3 px-5">
        <div className="row">
          <div className="col-md-8">
            {blogPosts.map((post, index) => (
              <div className="me-5 my-5" key={index}>
                <img className="p-2 img-fluid" src={post.image} alt="" />
                <div className="m-2 gray mb-4 w-50 d-flex">
                  <div className="me-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill="currentColor"
                        d="M10 9.25c-2.27 0-2.73-3.44-2.73-3.44C7 4.02 7.82 2 9.97 2c2.16 0 2.98 2.02 2.71 3.81c0 0-.41 3.44-2.68 3.44m0 2.57L12.72 10c2.39 0 4.52 2.33 4.52 4.53v2.49s-3.65 1.13-7.24 1.13c-3.65 0-7.24-1.13-7.24-1.13v-2.49c0-2.25 1.94-4.48 4.47-4.48z"
                      ></path>
                    </svg>
                    <span className="ms-2">Admin</span>
                  </div>
                  <div className="me-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M2 19c0 1.7 1.3 3 3 3h14c1.7 0 3-1.3 3-3v-8H2zM19 4h-2V3c0-.6-.4-1-1-1s-1 .4-1 1v1H9V3c0-.6-.4-1-1-1s-1 .4-1 1v1H5C3.3 4 2 5.3 2 7v2h20V7c0-1.7-1.3-3-3-3"
                      ></path>
                    </svg>
                    <span className="ms-2">{post.date}</span>
                  </div>
                  <div className="me-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <g
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      >
                        <path d="m4.748 7.645l-.331 3.644c-.05.54-.074.811-.03 1.07a2 2 0 0 0 .238.655c.131.228.325.422.711.808l5.176 5.176c.787.787 1.18 1.18 1.636 1.328c.402.131.835.131 1.237 0c.456-.148.853-.544 1.645-1.336l3.96-3.96c.792-.792 1.187-1.188 1.336-1.644a2 2 0 0 0-.001-1.236c-.148-.457-.543-.853-1.335-1.645l-5.163-5.163c-.39-.39-.584-.584-.813-.716a2 2 0 0 0-.656-.238c-.26-.045-.535-.02-1.084.03l-3.63.33c-.944.086-1.417.129-1.787.335a2 2 0 0 0-.775.775c-.205.368-.248.838-.333 1.773z"></path>
                        <path d="M9.713 9.713a1 1 0 1 0-1.415-1.414a1 1 0 0 0 1.415 1.414"></path>
                      </g>
                    </svg>
                    <span className="ms-2">{post.category}</span>
                  </div>
                </div>
                <h2 className="mb-4">{post.title}</h2>
                <p className="mb-4">{post.content}</p>
                <button className="read-more">Read More</button>
              </div>
            ))}
          </div>
          <div className="col-md-4">
            <div className="p-2 m-3 my-5">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search..."
                  className="search-input"
                />
                <svg
                  className="search-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <ul className="d-none myul">
                <a className="d-block my-5 ms-5 gray" href="../index.html">
                  furniro
                </a>
                <a className="d-block my-5 ms-5" href="../shop/shop.html">
                  shop
                </a>
                <a className="d-block my-5 ms-5" href="#">
                  blog
                </a>
                <a
                  className="d-block my-5 ms-5"
                  href="../details/detail.html?id=23"
                >
                  detail
                </a>
                <a
                  className="d-block my-5 ms-5"
                  href="../checkout/checkout.html"
                >
                  checkout
                </a>
                <a className="d-block my-5 ms-5" href="../cart/cart.html">
                  cart
                </a>
                <a className="d-block my-5 ms-5" href="../compare/compare.html">
                  compare
                </a>
              </ul>
            </div>
            <div className="p-2 m-3 my-5">
              <h3 className="m-2 mb-4">Categories</h3>
              <div className="gray d-flex justify-content-between w-75 m-2 my-5">
                <span>Craft</span>
                <span>2</span>
              </div>
              <div className="gray d-flex justify-content-between w-75 m-2 mb-5">
                <span>Design</span>
                <span>8</span>
              </div>
              <div className="gray d-flex justify-content-between w-75 m-2 mb-5">
                <span>Handmade</span>
                <span>7</span>
              </div>
              <div className="gray d-flex justify-content-between w-75 m-2 mb-5">
                <span>Craft</span>
                <span>2</span>
              </div>
              <div className="gray d-flex justify-content-between w-75 m-2 mb-5">
                <span>Craft</span>
                <span>2</span>
              </div>
            </div>
            <div className="p-2 m-3 my-5">
              <h2>Recent Posts</h2>
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="my-5 d-flex align-items-center justify-content-evenly"
                >
                  <div>
                    <img
                      src={`https://res.cloudinary.com/dutetsivc/image/upload/v1752665093/furniro/Rectangle 69${
                        index > 0 ? `(${index})` : ""
                      }.png`}
                      className="img-fluid"
                      alt={`Post ${index + 1}`}
                    />
                  </div>
                  <div className="w-50 my-2">
                    Going all-in With Millennial design
                    <br />
                    <span>03 Aug 2022</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="shop-carousel-indicators mb-5">
            {blogPosts.map((_, index) => (
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
      </div>
    </div>
  );
};

const About = () => {
  return (
    <>
      <Landing land="Blog" />
      <Blog />
      <Features />
    </>
  );
};

export default About;