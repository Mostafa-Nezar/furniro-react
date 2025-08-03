import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";

const Profile = () => {
  const navigate = useNavigate();
  const {
    theme,
    user,
    isAuthenticated,
    logout,
    isDarkMode,
    toggleTheme,
    favorites,
    updateUser,
    products,
    getImageUrl,
    toggleFavorite
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
        `http://localhost:3001/api/upload/${user?.id}/update-image`,
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
    navigate("/login");
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
      <h3 className="mb-4">My Profile</h3>

      {/* Avatar */}
      <div className="d-flex align-items-center mb-4">
        <div className="position-relative me-4">
          <img
            src={user?.image || "/assets/images/avatar-placeholder.png"}
            className="rounded-circle"
            width="100"
            height="100"
            alt="avatar"
            style={{ objectFit: "cover" }}
          />
          <label
            htmlFor="upload-image"
            className="btn btn-sm btn-secondary position-absolute bottom-0 end-0"
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
        <div>
          <h5>{user?.name}</h5>
          <p className="text-muted mb-0">{user?.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="row mb-4">
        <div className="col">
          <div className="bg-light p-3 rounded text-center">
            <h4>{user?.cart?.length || 0}</h4>
            <p>In Cart</p>
          </div>
        </div>
        <div className="col">
          <div className="bg-light p-3 rounded text-center">
            <h4>{favorites.length}</h4>
            <p>Favorites</p>
          </div>
        </div>
      </div>

      {/* Dark Mode */}
      <div className="form-check form-switch mb-4">
        <input
          className="form-check-input"
          type="checkbox"
          id="darkModeSwitch"
          checked={isDarkMode}
          onChange={toggleTheme}
        />
        <label className="form-check-label" htmlFor="darkModeSwitch">
          Dark Mode: {isDarkMode ? "On" : "Off"}
        </label>
      </div>

      {/* Sidebar Options */}
      <div className="list-group mb-4">
        <button
          className="list-group-item list-group-item-action"
          onClick={() => {
            setSidebarContent("favorites");
            setShowSidebar(true);
          }}
        >
          ❤️ Favorites ({favorites.length})
        </button>
        <button
          className="list-group-item list-group-item-action"
          onClick={() => {
            setSidebarContent("orders");
            setShowSidebar(true);
          }}
        >
          📦 Order History
        </button>
      </div>

      {/* Logout */}
      <button className="btn btn-danger" onClick={handleLogout}>
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
