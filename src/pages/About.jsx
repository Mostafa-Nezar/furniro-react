import Landing from "../comps/Landing.jsx";
import Features from "../comps/Features.jsx";
import { useAppContext } from "../context/AppContext.jsx";
import { useState, useEffect } from "react";
const Blog = () => {
  const { theme } = useAppContext();
  const [blogPosts, setblogPosts] = useState([])
  
  const fetchPosts = async () => {
    try {
      const res = await fetch("https://furniro-back-production.up.railway.app/api/post");
      const data = await res.json();
      setblogPosts(data)
      localStorage.setItem("blogPosts", JSON.stringify(data));
    } catch (err) {
      console.log("Error fetching posts:", err);
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    const loadPosts = async () => {
      const cached = localStorage.getItem("blogPosts");
      if (cached) {
        setblogPosts(JSON.parse(cached));
      } else {
        await fetchPosts();
      }
    };
    loadPosts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const postsPerPage = 3;
  const filteredPosts = blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className={`${theme ? "" : "bg-dark text-light"}`}>
      <div className="blog">
        <div className="container py-5 px-4 px-md-5">
          <div className="row gy-5">
            <div
              className={`col-md-8 ${
                theme
                  ? ""
                  : "bg-secondary bg-opacity-25 rounded-4 p-4 shadow-sm"
              }`}
            >
              {currentPosts.map((post, index) => (
                <div
                  key={index}
                  className={`mb-5 pb-4 border-bottom ${
                    theme ? "border-light-subtle" : "border-secondary"
                  }`}
                >
                  <img
                    className="img-fluid rounded-3 mb-3 shadow-sm"
                    src={post.image}
                    alt={post.title}
                  />

                  <div
                    className={`d-flex flex-wrap gap-4 mb-3 small align-items-center ${
                      theme ? "text-muted" : "text-light opacity-75"
                    }`}
                  >
                    <div className="d-flex align-items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 9.25c-2.27 0-2.73-3.44-2.73-3.44C7 4.02 7.82 2 9.97 2c2.16 0 2.98 2.02 2.71 3.81c0 0-.41 3.44-2.68 3.44m0 2.57L12.72 10c2.39 0 4.52 2.33 4.52 4.53v2.49s-3.65 1.13-7.24 1.13c-3.65 0-7.24-1.13-7.24-1.13v-2.49c0-2.25 1.94-4.48 4.47-4.48z" />
                      </svg>
                      <span className="ms-2">Admin</span>
                    </div>

                    <div className="d-flex align-items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M2 19c0 1.7 1.3 3 3 3h14c1.7 0 3-1.3 3-3v-8H2zM19 4h-2V3c0-.6-.4-1-1-1s-1 .4-1 1v1H9V3c0-.6-.4-1-1-1s-1 .4-1 1v1H5C3.3 4 2 5.3 2 7v2h20V7c0-1.7-1.3-3-3-3" />
                      </svg>
                      <span className="ms-2">{post.date}</span>
                    </div>

                    <div className="d-flex align-items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        viewBox="0 0 24 24"
                      >
                        <path d="m4.748 7.645l-.331 3.644c-.05.54-.074.811-.03 1.07a2 2 0 0 0 .238.655c.131.228.325.422.711.808l5.176 5.176c.787.787 1.18 1.18 1.636 1.328c.402.131.835.131 1.237 0c.456-.148.853-.544 1.645-1.336l3.96-3.96c.792-.792 1.187-1.188 1.336-1.644a2 2 0 0 0-.001-1.236c-.148-.457-.543-.853-1.335-1.645l-5.163-5.163c-.39-.39-.584-.584-.813-.716a2 2 0 0 0-.656-.238c-.26-.045-.535-.02-1.084.03l-3.63.33c-.944.086-1.417.129-1.787.335a2 2 0 0 0-.775.775c-.205.368-.248.838-.333 1.773z" />
                        <path d="M9.713 9.713a1 1 0 1 0-1.415-1.414a1 1 0 0 0 1.415 1.414" />
                      </svg>
                      <span className="ms-2">{post.category}</span>
                    </div>
                  </div>

                  <h2 className="fw-bold mb-3">{post.title}</h2>
                  <p
                    className={`${
                      theme ? "text-secondary" : "text-light opacity-75"
                    } mb-4`}
                  >
                    {post.content}
                  </p>
                  <button
                    className={`${
                      theme ? "read-more" : "read-more text-white"
                    }`}
                  >
                    Read More
                  </button>
                </div>
              ))}
            </div>

            <div className="col-md-4">
              <div className="p-3">
                <div
                  className={`d-flex align-items-center position-relative ${
                    theme ? "" : "bg-dark border-secondary"
                  }`}
                  style={{
                    borderRadius: "8px",
                    border: theme ? "1px solid #ced4da" : "1px solid #444",
                    paddingRight: "0.75rem",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`flex-grow-1 border-0 ps-3 py-2 ${
                      theme ? "text-dark" : "bg-dark text-light"
                    }`}
                    style={{
                      outline: "none",
                      background: "transparent",
                    }}
                  />

                  <svg
                    className={`${
                      theme ? "text-muted" : "text-light opacity-75"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                    style={{ flexShrink: 0 }}
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
              </div>

              {/* 🏷️ التصنيفات */}
              <div className="p-3 mb-5">
                <h4 className="mb-4 fw-bold">Categories</h4>
                {["Craft", "Design", "Handmade", "Art", "Decor"].map(
                  (cat, i) => (
                    <div
                      key={i}
                      className={`d-flex justify-content-between align-items-center border-bottom py-2 ${
                        theme
                          ? "text-muted"
                          : "text-light opacity-75 border-secondary"
                      }`}
                    >
                      <span>{cat}</span>
                      <span>{Math.floor(Math.random() * 10) + 1}</span>
                    </div>
                  )
                )}
              </div>

              {/* 🕓 بوستات حديثة */}
              <div className="p-3 mb-5">
                <h4 className="fw-bold mb-4">Recent Posts</h4>
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="d-flex align-items-center gap-3 mb-4"
                  >
                    <img
                      src={`https://res.cloudinary.com/dutetsivc/image/upload/v1752665093/furniro/Rectangle 69${
                        index > 0 ? `(${index})` : ""
                      }.png`}
                      className="rounded-3 shadow-sm"
                      width="70"
                      height="70"
                      alt={`Post ${index + 1}`}
                      style={{ objectFit: "cover" }}
                    />
                    <div>
                      <div className="fw-semibold small">
                        Going all-in With Millennial design
                      </div>
                      <span
                        className={`${
                          theme ? "text-muted" : "text-light opacity-75"
                        } small`}
                      >
                        03 Aug 2022
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="shop-carousel-indicators mb-5">
              {Array.from(
                { length: Math.ceil(filteredPosts.length / postsPerPage) },
                (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={currentPage === i + 1 ? "active" : ""}
                  >
                    {i + 1}
                  </button>
                )
              )}
              <button
                className="shop-carousel-control-next"
                onClick={() =>
                  setCurrentPage((prev) =>
                    prev < Math.ceil(filteredPosts.length / postsPerPage)
                      ? prev + 1
                      : prev
                  )
                }
              >
                <span>Next</span>
              </button>
            </div>
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
