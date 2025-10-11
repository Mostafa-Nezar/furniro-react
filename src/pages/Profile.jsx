import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import Features from "../comps/Features.jsx";
import Landing from "../comps/Landing.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useSocket } from "../context/SocketContext.jsx";

const Profile = () => {
  const navigate = useNavigate();
  const { notifications,unreadCount, refreshing, fetchNotifications, handleDeleteNotification, formatDate, markAllAsReadInDB } = useSocket();
  const { logout, favorites, fetchOrders, toggleFavorite, orders } = useAppContext();
  const { user, isAuthenticated, updateUser } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const { cart, removeFromCart } = useCart();
  const { products } = useAppContext();
  const favoriteProducts = products.filter(p => favorites.includes(p.id));
  const [phone, setPhone] = useState(user?.phoneNumber);
  const token = localStorage.getItem("token");
  const [locationLoading, setLocationLoading] = useState(false);
  const handleImageChange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      const res = await fetch(`https://furniro-back-production.up.railway.app/api/upload/${user?.id}/update-image`, {
        method: "PATCH", headers: { Authorization: `Bearer ${token}` }, body: formData
      });
      const data = await res.json();
      if (data.success && data.imageUrl) {
        const updated = { ...user, image: data.imageUrl };
        updateUser(updated);
        localStorage.setItem("user", JSON.stringify(updated));
        alert("✅ Image updated successfully");
      } else alert("❌ Upload failed");
    } catch (err) { alert("Error uploading image"); } finally { setIsUploading(false); }
  };
  const renderNotificationsContent = () => (
    <motion.div className="p-4 my-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="my-text-black mb-0">Notifications</h5>
        <button className="btn my-bg-primary text-white btn-md" onClick={()=>{fetchNotifications(); markAllAsReadInDB();}} disabled={refreshing}>
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>
      {notifications.length > 0 ? notifications.map((notif, i) => (
        <motion.div key={notif._id} className="d-flex align-items-center mb-3 rounded" style={{ backgroundColor: "#fff", borderLeft: "4px solid", padding: "14px 16px", gap: "14px" }} initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 50, opacity: 0 }} transition={{ delay: i * 0.1, duration: 0.4 }}>
          <div className="d-flex align-items-center justify-content-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
              <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                <g>
                  <path strokeDasharray="4" strokeDashoffset="4" d="M12 3v2"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="4;0" /></path>
                  <path strokeDasharray="28" strokeDashoffset="28" d="M12 5c-3.31 0 -6 2.69 -6 6l0 6c-1 0 -2 1 -2 2h8M12 5c3.31 0 6 2.69 6 6l0 6c1 0 2 1 2 2h-8"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.4s" values="28;0" /><animateTransform fill="freeze" attributeName="transform" begin="0.9s" dur="6s" keyTimes="0;0.05;0.15;0.2;1" type="rotate" values="0 12 3;3 12 3;-3 12 3;0 12 3;0 12 3" /></path>
                </g>
                <path strokeDasharray="8" strokeDashoffset="8" d="M10 20c0 1.1 0.9 2 2 2c1.1 0 2 -0.9 2 -2"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="8;0" /><animateTransform fill="freeze" attributeName="transform" begin="1.1s" dur="6s" keyTimes="0;0.05;0.15;0.2;1" type="rotate" values="0 12 8;6 12 8;-6 12 8;0 12 8;0 12 8" /></path>
              </g>
            </svg>
          </div>
          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <p className="mb-0 my-text-black" style={{ fontWeight: 600, fontSize: "15px" }}>{notif.message}</p>
              <small className="text-muted" style={{ fontSize: "13px" }}>{formatDate(notif.createdAt)}</small>
            </div>
          </div>
          <button className="btn my-text-redcolor btn-sm" style={{ padding: "4px 8px" }} onClick={() => handleDeleteNotification(notif._id)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m18 9l-.84 8.398c-.127 1.273-.19 1.909-.48 2.39a2.5 2.5 0 0 1-1.075.973C15.098 21 14.46 21 13.18 21h-2.36c-1.279 0-1.918 0-2.425-.24a2.5 2.5 0 0 1-1.076-.973c-.288-.48-.352-1.116-.48-2.389L6 9m7.5 6.5v-5m-3 5v-5m-6-4h4.615m0 0l.386-2.672c.112-.486.516-.828.98-.828h3.038c.464 0 .867.342.98.828l.386 2.672m-5.77 0h5.77m0 0H19.5"/></svg>
          </button>
        </motion.div>
      )) : renderEmptyContent("notifications", "No Notifications", "You have no notifications")}
    </motion.div>
  );
  const updatePhone = async (userId, newPhone) => {
      const res = await fetch(`https://furniro-back-production.up.railway.app/api/auth/users/${userId}/phone`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phoneNumber: newPhone }) });
      const data = await res.json();
      if (res.ok) {
        const updatedUser = { ...user, phoneNumber: data.phoneNumber };
        updateUser(updatedUser);
      } 
  };
  const getAddressFromCoords = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`,
        { headers: { "User-Agent": "furniro-app/1.0" } }
      );
      const data = await res.json();
      return data?.display_name || "Unknown location";
    } catch {
      return "Could not fetch address";
    }
  };
  const getCurrentLocation = async () => {
    try {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
      }

      setLocationLoading(true);

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          const address = await getAddressFromCoords(latitude, longitude);

          const token = localStorage.getItem("token");
          const res = await fetch(
            `https://furniro-back-production.up.railway.app/api/auth/users/${user.id}/location`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ location: address }),
            }
          );
          const data = await res.json();
          if (!res.ok) throw new Error(data?.msg || "Failed to update location");

          updateUser({ ...user, location: address });
        },
        (err) => {
          alert("Location permission denied or unavailable");
        },
        { enableHighAccuracy: true }
      );
    } catch (e) {
      alert(`Update failed: ${e.message}`);
    } finally {
      setLocationLoading(false);
    }
  };
  const renderEmptyContent = (icon, title, subtitle) => (
    <motion.div className="text-center py-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="#6c757d" className={`bi bi-${icon} mb-3`} viewBox="0 0 16 16">
        <path d={icon === "favorite-border" ? "m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385C2.885 9.279 5.481 11.9 8 14.058c2.519-2.158 5.115-4.78 6.286-6.62.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748z" :
          icon === "history" ? "M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zm0 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.5 2.5v5.5l4.5 2.7.7-1.2-3.8-2.3V3.5H7.5z" :
          icon === "location-on" ? "M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" :
          icon === "payment" ? "M2.5 4A1.5 1.5 0 0 0 1 5.5V6h14v-.5A1.5 1.5 0 0 0 13.5 4h-11zM1 7.5v5A1.5 1.5 0 0 0 2.5 14h11a1.5 1.5 0 0 0 1.5-1.5v-5H1zm1 2h12v1H2v-1z" :
          icon === "notifications" ? "M8 16a2 2 0 0 0 1.985-1.75c.017-.137-.097-.25-.235-.25h-3.5c-.138 0-.252.113-.235.25A2 2 0 0 0 8 16zM3 5a5 5 0 0 1 10 0v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5z" :
          "M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0-2a5 5 0 1 0 0-10 5 5 0 0 0 0 10z"} />
      </svg>
      <h5 className="my-text-black">{title}</h5>
      <p className="text-muted">{subtitle}</p>
    </motion.div>
  );
  const renderFavoritesContent = () => (
    <motion.div className="p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {favoriteProducts.length > 0 ? favoriteProducts.map((item, i) => (
        <motion.div key={i} className="d-flex mb-3 p-3 rounded bg-light" initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1, duration: 0.4 }}>
          <img src={item.image} alt={item.name} width="60" height="60" className="rounded me-3" />
          <div className="flex-grow-1">
            <strong className="my-text-black">{item.name}</strong>
            <p className="mb-0 text-muted">${item.price}</p>
          </div>
          <button className="btn btn-outline-danger btn-sm" onClick={() => toggleFavorite(item.id)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill={favorites.includes(item.id) ? "#dc3545" : "#6c757d"} className="bi bi-heart-fill" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
            </svg>
          </button>
        </motion.div>
      )) : renderEmptyContent("favorite-border", "No Favorites", "Add items to your favorites")}
    </motion.div>
  );
  const renderCartContent = () => (
    <motion.div className="p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {cart.length > 0 ? cart.map((item, i) => (
        <motion.div key={i} className="d-flex mb-3 p-3 rounded bg-light" initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1, duration: 0.4 }}>
          <img src={item.image} alt={item.name} width="60" height="60" className="rounded me-3" />
          <div className="flex-grow-1">
            <strong className="my-text-black">{item.name}</strong>
            <p className="mb-0 text-muted">${item.price}</p>
          </div>
          <button className="my-text-redcolor border-0 bg-transparent btn btn-sm" onClick={() => removeFromCart(item.id)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m18 9l-.84 8.398c-.127 1.273-.19 1.909-.48 2.39a2.5 2.5 0 0 1-1.075.973C15.098 21 14.46 21 13.18 21h-2.36c-1.279 0-1.918 0-2.425-.24a2.5 2.5 0 0 1-1.076-.973c-.288-.48-.352-1.116-.48-2.389L6 9m7.5 6.5v-5m-3 5v-5m-6-4h4.615m0 0l.386-2.672c.112-.486.516-.828.98-.828h3.038c.464 0 .867.342.98.828l.386 2.672m-5.77 0h5.77m0 0H19.5"/></svg>
          </button>
        </motion.div>
      )) : renderEmptyContent("cart-border", "Cart is empty", "Add items to your favorites")}
    </motion.div>
  );
  const renderLocationContent = () => {
  const hasLocation = !!user?.location;

  return (
    <div className="p-3 border rounded mx-3 my-3 mt-4">
      <h5 className="my-text-primary d-flex align-items-center gap-2 my-2">
        {hasLocation ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="my-text-greencolor">
              <path fill="currentColor" d="M10.115 21.811c.606.5 1.238.957 1.885 1.403a27 27 0 0 0 1.885-1.403a28 28 0 0 0 2.853-2.699C18.782 16.877 21 13.637 21 10a9 9 0 1 0-18 0c0 3.637 2.218 6.876 4.262 9.112a28 28 0 0 0 2.853 2.7M12 13.25a3.25 3.25 0 1 1 0-6.5a3.25 3.25 0 0 1 0 6.5"/>
            </svg>
            Your Saved Location
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="my-text-redcolor">
              <path fill="currentColor" d="M2.22 2.22a.75.75 0 0 1 1.06 0l18.5 18.5l.051.056a.75.75 0 0 1-1.055 1.055l-.056-.05l-3.738-3.738l-.012.014q-1.312 1.288-3.406 3.312a2.25 2.25 0 0 1-3.129 0l-3.49-3.396q-.66-.646-1.102-1.09A8.71 8.71 0 0 1 4.787 5.848L2.22 3.28a.75.75 0 0 1 0-1.06m4.65 1.468a8.708 8.708 0 0 1 12.166 12.166l-4.13-4.128A3 3 0 0 0 15 11a3 3 0 0 0-3.726-2.91zm2.245 6.488a3 3 0 0 0 3.708 3.708z"/>
            </svg>
            No location saved
          </>
        )}
      </h5>

      {hasLocation && (
        <p className="my-text-black">
          <strong >location:</strong> {user.location}
        </p>
      )}

      <button
        className="btn my-bg-primary my-text-semi-white mt-4 d-flex align-items-center gap-2"
        onClick={async () => {
          setLocationLoading(true);
          try {
            await getCurrentLocation();
          } finally {
            setLocationLoading(false);
          }
        }}
        disabled={locationLoading}
      >
        {locationLoading ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" >
              <path fill="currentColor" d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z" opacity="0.5"/>
              <path fill="currentColor" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z">
                <animateTransform attributeName="transform" dur="1s" from="0 12 12" to="360 12 12" type="rotate" repeatCount="indefinite"/>
              </path>
            </svg>
            Loading...
          </>
        ) : "Get Current Location"}
      </button>
    </div>
  );
};

  const renderPhoneContent = () => {
    const handleSavePhone = async () => {
      if (!/^0\d{9,11}$/.test(phone)) {
        return alert("Invalid phone number. Must start with 0 and be 10–12 digits.");
      }
      try {
        await updatePhone(user.id, phone); 
        alert("Phone number saved successfully!");
      } catch (err) {
        console.error("Error saving phone number:", err);
        alert("Failed to save phone number");
      }
    };
    return (
  <div className="p-3 rounded">
    <h5 className="d-flex align-items-center my-text-primary mb-3">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-phone me-2 my-text-primary" viewBox="0 0 16 16">
      <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H5z"/>
        <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
      </svg> Your Phone Number
    </h5>
    <input type="text" className="mb-2 px-3 py-2 rounded border my-text-black w-100" style={{ borderColor: "#ced4da", fontSize: "1rem", outline: "none" }} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter your phone number"/>
    <button className="btn my-bg-greencolor my-text-semi-white" onClick={handleSavePhone}>
      Save Phone Number
    </button>
  </div>
);

  };
  const renderOrdersContent = () => {
    if (activeSection === "orders" && orders.length === 0) fetchOrders();
    return (
      <motion.div className="p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} >
        {orders.length > 0 ? (
          orders.map((order, i) => (
            <motion.div key={order._id} className="mb-3 p-3 rounded my-bg-semi-white" initial={{ x: -50, opacity: 0 }}animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1, duration: 0.4 }} onClick={() => navigate(`/orders/${order._id}`)} style={{cursor:"pointer"}}>
              <div className="d-flex align-items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="my-text-primary" viewBox="0 0 24 24">
                  <path d="M20 6H4V4h16v2zm0 2v12H4V8h16zm-2 2H6v8h12v-8z" />
                </svg>
                <strong className="my-text-black">Order #{order._id.slice(-6)}</strong>
              </div>
              <p className="mb-0 my-text-gray d-flex align-items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="my-text-primary" viewBox="0 0 24 24"> <path d="M7 10h5v5H7z" /><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" /></svg>
                Date: {formatDate(order.date)}
              </p>

              <p className="mb-0 my-text-black d-flex align-items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M11.25 7.847c-.936.256-1.5.975-1.5 1.653s.564 1.397 1.5 1.652zm1.5 5.001v3.304c.936-.255 1.5-.974 1.5-1.652s-.564-1.397-1.5-1.652"/><path fill="currentColor" fill-rule="evenodd" d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10M12 5.25a.75.75 0 0 1 .75.75v.317c1.63.292 3 1.517 3 3.183a.75.75 0 0 1-1.5 0c0-.678-.564-1.397-1.5-1.653v3.47c1.63.292 3 1.517 3 3.183s-1.37 2.891-3 3.183V18a.75.75 0 0 1-1.5 0v-.317c-1.63-.292-3-1.517-3-3.183a.75.75 0 0 1 1.5 0c0 .678.564 1.397 1.5 1.652v-3.469c-1.63-.292-3-1.517-3-3.183s1.37-2.891 3-3.183V6a.75.75 0 0 1 .75-.75" clip-rule="evenodd"/></svg>
                Total: ${order.total}
              </p>
              <p className="mb-0 d-flex align-items-center gap-1">
                {["paid", "deliverd"].includes(order.status)?
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 18 16" className="my-text-greencolor"><path fill="currentColor" d="m7.536 8.657l2.828-2.83a1 1 0 0 1 1.414 1.416l-3.535 3.535a1 1 0 0 1-1.415.001l-2.12-2.12a1 1 0 1 1 1.413-1.415zM8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16m0-2A6 6 0 1 0 8 2a6 6 0 0 0 0 12"/></svg>:
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48" className="my-text-redcolor"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"><path d="m20 33l6 2s15-3 17-3s2 2 0 4s-9 8-15 8s-10-3-14-3H4"/><path d="M4 29c2-2 6-5 10-5s13.5 4 15 6s-3 5-3 5M16 18v-8a2 2 0 0 1 2-2h24a2 2 0 0 1 2 2v16"/><path fill="currentColor" d="M25 8h10v9H25z"/></g></svg>
                  }
                <span className="my-text-black">Status: {order.status}</span>
              </p>
            </motion.div>
          ))
        ) : (
          renderEmptyContent("history", "No Orders",
            "You have no order history yet"
          )
        )}
      </motion.div>
    );
  };
  const renderGenericContent = (title, icon) => (
    <motion.div className="p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {renderEmptyContent(icon, "Coming Soon", "This feature will be available soon")}
    </motion.div>
  );
  const handleLogout = async () => { await logout(); localStorage.clear(); navigate("/signin"); };

  const menuItems = [
    { icon: "cart", title: "Cart", subtitle: `${cart.length} items`, onClick: () => setActiveSection(activeSection === "cart" ? null : "cart"), content: renderCartContent() },
    { icon: "heart", title: "Favorites", subtitle: `${favorites.length} items`, onClick: () => setActiveSection(activeSection === "favorites" ? null : "favorites"), content: renderFavoritesContent() },
    { icon: "box-seam", title: "Order History", subtitle: "Your previous orders", onClick: () => setActiveSection(activeSection === "order history" ? null : "order history"), content: renderOrdersContent() },
    { icon: "geo-alt", title: "Addresses", subtitle: "Manage delivery", onClick: () => setActiveSection(activeSection === "addresses" ? null : "addresses"), content: renderLocationContent() },
    { icon: "credit-card", title: "Payment", subtitle: "Manage cards", onClick: () => setActiveSection(activeSection === "payment" ? null : "payment"), content: renderGenericContent("Payment Methods", "payment") },
    { icon: "bell", title: "Notifications", subtitle: "Notification settings", onClick: () => setActiveSection(activeSection === "notifications" ? null : "notifications"), content: renderNotificationsContent() },
    { icon: "phone", title: "Phone", subtitle: user?.phoneNumber ?"phone saved":"set phone number", onClick: () => setActiveSection(activeSection === "phone" ? null : "phone"), content: renderPhoneContent() },
    { icon: "info-circle", title: "About App", subtitle: "App info", onClick: () => alert("Furniro v1.0.0", "Modern furniture app"), content: null },

  ];

  if (!isAuthenticated) return (
    <motion.div className="text-center my-5" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
      <h2 className="my-text-black">Welcome</h2>
      <p className="text-muted">Please sign in to access your profile</p>
      <button className="btn my-bg-primary me-2" onClick={() => navigate("/signin")}>Sign In</button>
      <button className="btn my-bg-primary" onClick={() => navigate("/signup")}>Create Account</button>
    </motion.div>
  );

  return (
    <>
      <Landing land="profile" />
      <div className="container my-5">
        <motion.div className="row align-items-center mb-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="col-auto">
            <motion.div className="position-relative" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
              <img src={user?.image || "/images/avatar-placeholder.png"} className="rounded-circle border" width="100" height="100" alt="avatar" style={{ objectFit: "cover" }} />
              <label htmlFor="upload-image" className="btn btn-sm my-bg-gray my-text-black position-absolute bottom-0 end-0">
                {isUploading ? "..." : "✎"}
              </label>
              <input id="upload-image" type="file" className="d-none" onChange={handleImageChange} />
            </motion.div>
          </div>
          <div className="col">
            <h5 className="mb-1 my-text-black">{user?.name}</h5>
            <p className="text-muted mb-0">{user?.email}</p>
          </div>
        </motion.div>
        <div className="list-group">
          {menuItems.map((item, i) => (
            <motion.div key={i} initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1, duration: 0.4 }}>
              <motion.button className="list-group-item list-group-item-action d-flex align-items-center" style={{borderRadius:12}} onClick={item.onClick} whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className={`bi bi-${item.icon} me-2 ${item.icon === "heart" ? "my-text-redcolor" : "my-text-primary"}`} viewBox="0 0 16 16">
                  <path d={item.icon === "heart" ? "m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385C2.885 9.279 5.481 11.9 8 14.058c2.519-2.158 5.115-4.78 6.286-6.62.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748z" :
                    item.icon === "box-seam" ? "M8.44.146a.5.5 0 0 0-.88 0L5.162 3H2.5a.5.5 0 0 0-.5.5v9.6a.5.5 0 0 0 .257.437l6 3.2a.5.5 0 0 0 .486 0l6-3.2a.5.5 0 0 0 .257-.437V3.5a.5.5 0 0 0-.5-.5h-2.662L8.44.146zM3 4h2.661l1.377 2.297a.5.5 0 0 0 .866 0L9.339 4H13v1.5l-5 2.667L3 5.5V4z" :
                    item.icon === "geo-alt" ? "M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" :
                    item.icon === "credit-card" ? "M2.5 4A1.5 1.5 0 0 0 1 5.5V6h14v-.5A1.5 1.5 0 0 0 13.5 4h-11zM1 7.5v5A1.5 1.5 0 0 0 2.5 14h11a1.5 1.5 0 0 0 1.5-1.5v-5H1zm1 2h12v1H2v-1z" :
                    item.icon === "bell" ? "M8 16a2 2 0 0 0 1.985-1.75c.017-.137-.097-.25-.235-.25h-3.5c-.138 0-.252.113-.235.25A2 2 0 0 0 8 16zM3 5a5 5 0 0 1 10 0v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5z" :
                    item.icon === "question-circle" ? "M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.5-5a.5.5 0 0 1-1 0V6a.5.5 0 0 1 1 0v5zm0 2.5a.5.5 0 0 1-.5.5h-.5a.5.5 0 0 1 0-1h.5a.5.5 0 0 1 .5.5z" :
                    item.icon === "phone" ? "M21 16.42v3.536a1 1 0 0 1-.93.998Q19.415 21 19 21C10.163 21 3 13.837 3 5q0-.414.046-1.07A1 1 0 0 1 4.044 3H7.58a.5.5 0 0 1 .498.45q.034.344.064.552A13.9 13.9 0 0 0 9.35 8.003c.095.2.033.439-.147.567l-2.158 1.542a13.05 13.05 0 0 0 6.844 6.844l1.54-2.154a.46.46 0 0 1 .573-.149a13.9 13.9 0 0 0 4 1.205q.208.03.55.064a.5.5 0 0 1 .449.498":
                    "M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"} />
                </svg>
                {item.icon === "bell" && unreadCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge my-bg-redcolor d-flex justify-content-center " style={{borderRadius:"100%", padding:"12px"}}>
                    {unreadCount}
                  </span>
                )}
                <div className="flex-grow-1">
                  <span className="my-text-black">{item.title}</span>
                  <p className="mb-0 text-muted">{item.subtitle}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-chevron-right text-muted" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                </svg>
              </motion.button>
              <AnimatePresence>
                {activeSection === item.title.toLowerCase().replace(" & ", "-") && item.content && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="mt-2">
                    {item.content}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        <motion.button className="btn my-bg-redcolor my-text-semi-white mt-3" onClick={handleLogout} whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
          Logout
        </motion.button>
      </div>
      <Features />
    </>
  );
};

export default Profile;