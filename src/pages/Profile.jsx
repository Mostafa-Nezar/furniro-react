import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";

const Profile = () => {
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    logout,
    favorites,
    updateUser,
    products,
    getImageUrl,
  } = useAppContext();

  const [isUploading, setIsUploading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarContent, setSidebarContent] = useState(null);

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await fetch(
        `https://furniro-back-2-production.up.railway.app/api/upload/${user?.id}/update-image`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${user?.token}` },
          body: formData,
        }
      );

      const data = await res.json();
      if (data.success && data.imageUrl) {
        const updated = { ...user, image: data.imageUrl };
        updateUser(updated);
        localStorage.setItem("user", JSON.stringify(updated));
        alert("✅ Image updated successfully");
      } else {
        alert("❌ Upload failed");
      }
    } catch (err) {
      alert("Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    localStorage.clear();
    navigate("/signin");
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center my-5">
        <h2>Welcome</h2>
        <p>Please sign in to access your profile</p>
        <button className="btn btn-primary me-2" onClick={() => navigate("/login")}>
          Sign In
        </button>
        <button className="btn btn-outline-primary" onClick={() => navigate("/register")}>
          Create Account
        </button>
      </div>
    );
  }

  return (
<div className="container my-5">
  <h3 className="mb-4 my-text-primary">My Profile</h3>

  {/* Avatar + Info */}
  <div className="row align-items-center mb-5">
    <div className="col-auto">
      <div className="position-relative">
        <img
          src={user?.image || "/assets/images/avatar-placeholder.png"}
          className="rounded-circle border"
          width="100"
          height="100"
          alt="avatar"
          style={{ objectFit: "cover" }}
        />
        <label
          htmlFor="upload-image"
          className="btn btn-sm my-bg-gray my-text-black position-absolute bottom-0 end-0"
        >
          {isUploading ? "..." : "✎"}
        </label>
        <input
          id="upload-image"
          type="file"
          className="d-none"
          onChange={handleImageChange}
        />
      </div>
    </div>
    <div className="col">
      <h5 className="mb-1 my-text-black">{user?.name}</h5>
      <p className="text-muted mb-0">{user?.email}</p>
    </div>
  </div>

  {/* Stats */}
  <div className="row mb-5">
    <div className="col-md-6 mb-3 mb-md-0">
      <div className="p-4 rounded text-center my-bg-gray">
        <h4 className="my-text-black mb-1">{user?.cart?.length || 0}</h4>
        <p className="mb-0">In Cart</p>
      </div>
    </div>
    <div className="col-md-6">
      <div className="p-4 rounded text-center my-bg-gray">
        <h4 className="my-text-black mb-1">{favorites.length}</h4>
        <p className="mb-0">Favorites</p>
      </div>
    </div>
  </div>

  {/* Sidebar Options */}
  <div className="list-group mb-4">
    <button
      className="list-group-item list-group-item-action d-flex align-items-center"
      onClick={() => {
        setSidebarContent("favorites");
        setShowSidebar(true);
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        fill="currentColor"
        className="bi bi-heart me-2 my-text-redcolor"
        viewBox="0 0 16 16"
      >
        <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385C2.885 9.279 5.481 11.9 8 14.058c2.519-2.158 5.115-4.78 6.286-6.62.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748z" />
      </svg>
      Favorites ({favorites.length})
    </button>
    <button
      className="list-group-item list-group-item-action d-flex align-items-center"
      onClick={() => {
        setSidebarContent("orders");
        setShowSidebar(true);
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        fill="currentColor"
        className="bi bi-box-seam me-2 my-text-primary"
        viewBox="0 0 16 16"
      >
        <path d="M8.44.146a.5.5 0 0 0-.88 0L5.162 3H2.5a.5.5 0 0 0-.5.5v9.6a.5.5 0 0 0 .257.437l6 3.2a.5.5 0 0 0 .486 0l6-3.2a.5.5 0 0 0 .257-.437V3.5a.5.5 0 0 0-.5-.5h-2.662L8.44.146zM3 4h2.661l1.377 2.297a.5.5 0 0 0 .866 0L9.339 4H13v1.5l-5 2.667L3 5.5V4z" />
      </svg>
      Order History
    </button>
  </div>

  {/* Logout */}
  <button className="btn my-bg-redcolor my-text-semi-white" onClick={handleLogout}>
    Logout
  </button>

  {/* Sidebar Modal */}
  <div
    className={`modal fade ${showSidebar ? "show d-block" : ""}`}
    tabIndex="-1"
    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    onClick={() => setShowSidebar(false)}
  >
    <div
      className="modal-dialog modal-dialog-end"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">
            {sidebarContent === "favorites" ? "My Favorites" : "Order History"}
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowSidebar(false)}
          ></button>
        </div>
        <div className="modal-body">
          {sidebarContent === "favorites" ? (
            favoriteProducts.length > 0 ? (
              favoriteProducts.map((item, i) => (
                <div key={i} className="d-flex mb-3">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    width="60"
                    height="60"
                    className="rounded me-3"
                  />
                  <div>
                    <strong>{item.name}</strong>
                    <p className="mb-0">${item.price}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No favorites yet.</p>
            )
          ) : (
            <p>Order history will appear here soon.</p>
          )}
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default Profile;
