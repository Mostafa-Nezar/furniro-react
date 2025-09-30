import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import Features from "../comps/Features.jsx";
import Landing from "../comps/Landing.jsx";
import { FaShoppingCart } from "react-icons/fa";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
const Profile = () => {
  const navigate = useNavigate();
  const { logout, favorites,   toggleFavorite, } = useAppContext();
  const { user, isAuthenticated, updateUser } = useAuth();
  const {  products } = useCart();
  const [isUploading, setIsUploading] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const favoriteProducts = products.filter(p => favorites.includes(p.id));
  console.log(user);
  console.log(user.image);
  
  const API = "https://furniro-back-production.up.railway.app/api/notifications";
  const getToken = () => localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const res = await fetch("https://furniro-back-production.up.railway.app/api/orders", { headers: { Authorization: `Bearer ${user?.token}` } });
      const data = await res.json();
      if (data.success) setOrders(data.orders || []);
    } catch (err) { console.error("Error fetching orders:", err); }
  };

  const fetchNotifications = async () => {
    try {
      const token = getToken(), user = JSON.parse(localStorage.getItem("user"));
      if (!token || !user?.id) return;
      const res = await fetch(API, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } });
      if (res.ok) setNotifications((await res.json()).notifications.filter(n => n.userId === user.id) || []);
    } catch (err) { console.error("Fetch error:", err); } finally { setRefreshing(false); }
  };

  const markAllAsReadInDB = async () => {
    try {
      await fetch(`${API}/mark-all-read`, { method: "PUT", headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" } });
    } catch (err) { console.error("Mark all read error:", err); }
  };

  const handleDeleteNotification = async id => {
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
      if (res.ok) setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) { console.error("Delete error:", err); }
  };

  const formatDate = str => {
    const date = new Date(str), now = new Date(), diff = (now - date) / 60000;
    return diff < 1 ? "Just now" : diff < 60 ? `${Math.floor(diff)}m ago` : diff < 1440 ? `${Math.floor(diff / 60)}h ago` : date.toLocaleDateString();
  };

  useEffect(() => {
    if (activeSection === "notifications") (async () => { await fetchNotifications(); await markAllAsReadInDB(); })();
  }, [activeSection]);

  const handleImageChange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      const res = await fetch(`https://furniro-back-production.up.railway.app/api/upload/${user?.id}/update-image`, {
        method: "PATCH", headers: { Authorization: `Bearer ${user?.token}` }, body: formData
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

  const handleLogout = async () => { await logout(); localStorage.clear(); navigate("/signin"); };

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

  const renderOrdersContent = () => {
    if (activeSection === "orders" && orders.length === 0) fetchOrders();
    return (
      <motion.div className="p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        {orders.length > 0 ? orders.map((order, i) => (
          <motion.div key={order._id} className="mb-3 p-3 rounded bg-light" initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1, duration: 0.4 }}>
            <strong>Order #{order._id.slice(-6)}</strong>
            <p className="mb-0">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            <p className="mb-0">Total: ${order.totalPrice}</p>
            <p className="mb-0">Status: {order.status}</p>
          </motion.div>
        )) : renderEmptyContent("history", "No Orders", "You have no order history yet")}
      </motion.div>
    );
  };

  const renderNotificationsContent = () => (
    <motion.div className="p-4 my-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="my-text-black mb-0">Notifications</h5>
        <button className="btn my-bg-primary text-white btn-md" onClick={fetchNotifications} disabled={refreshing}>
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

  const renderGenericContent = (title, icon) => (
    <motion.div className="p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {renderEmptyContent(icon, "Coming Soon", "This feature will be available soon")}
    </motion.div>
  );

  const menuItems = [
    { icon: "cart", title: "Cart", subtitle: `${cart.length} items`, onClick: () => setActiveSection(activeSection === "cart" ? null : "cart"), content: renderCartContent() },
    { icon: "heart", title: "Favorites", subtitle: `${favorites.length} items`, onClick: () => setActiveSection(activeSection === "favorites" ? null : "favorites"), content: renderFavoritesContent() },
    { icon: "box-seam", title: "Order History", subtitle: "Your previous orders", onClick: () => setActiveSection(activeSection === "orders" ? null : "orders"), content: renderOrdersContent() },
    { icon: "geo-alt", title: "Addresses", subtitle: "Manage delivery", onClick: () => setActiveSection(activeSection === "addresses" ? null : "addresses"), content: renderGenericContent("Addresses", "location-on") },
    { icon: "credit-card", title: "Payment", subtitle: "Manage cards", onClick: () => setActiveSection(activeSection === "payment" ? null : "payment"), content: renderGenericContent("Payment Methods", "payment") },
    { icon: "bell", title: "Notifications", subtitle: "Notification settings", onClick: () => setActiveSection(activeSection === "notifications" ? null : "notifications"), content: renderNotificationsContent() },
    { icon: "question-circle", title: "Help & Support", subtitle: "FAQs", onClick: () => setActiveSection(activeSection === "help" ? null : "help"), content: renderGenericContent("Help & Support", "help") },
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
        <motion.div className="row mb-5 align-items-stretch"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
      {/* أيقونة وعدد العناصر */}
      <div className="col-md-3 text-center"
      >
        <div className="p-4 rounded my-bg-gray">
          <FaShoppingCart size={40} className="mb-2 my-text-black" />
          <h4 className="my-text-black mb-1">{cart.length}</h4>
          <p className="mb-0">In Cart</p>
        </div>
      </div>

          <div className="col-md-6">
            <div className="p-3 bg-light rounded h-100 overflow-auto" style={{ maxHeight: 200 }}>
              {cart.length ? cart.map((item, i) => (
                <div key={i} className="d-flex align-items-center mb-2 border-bottom pb-2">
                  <img src={item.image} alt={item.name} className="rounded" width="50" height="50" />
                  <div className="ms-3">
                    <p className="m-0 fw-bold">{item.name}</p>
                    <small className="text-muted">${item.price}</small>
                  </div>
                  <button className="btn btn-sm btn-danger ms-auto" onClick={() => removeFromCart(item.id)}>×</button>
                </div>
              )) : <p className="text-center m-0">Cart is empty</p>}
            </div>
          </div>
        </motion.div>
        <div className="list-group">
          {menuItems.map((item, i) => (
            <motion.div key={i} initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1, duration: 0.4 }}>
              <motion.button className="list-group-item list-group-item-action d-flex align-items-center rounded" onClick={item.onClick} whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className={`bi bi-${item.icon} me-2 ${item.icon === "heart" ? "my-text-redcolor" : "my-text-primary"}`} viewBox="0 0 16 16">
                  <path d={item.icon === "heart" ? "m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385C2.885 9.279 5.481 11.9 8 14.058c2.519-2.158 5.115-4.78 6.286-6.62.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748z" :
                    item.icon === "box-seam" ? "M8.44.146a.5.5 0 0 0-.88 0L5.162 3H2.5a.5.5 0 0 0-.5.5v9.6a.5.5 0 0 0 .257.437l6 3.2a.5.5 0 0 0 .486 0l6-3.2a.5.5 0 0 0 .257-.437V3.5a.5.5 0 0 0-.5-.5h-2.662L8.44.146zM3 4h2.661l1.377 2.297a.5.5 0 0 0 .866 0L9.339 4H13v1.5l-5 2.667L3 5.5V4z" :
                    item.icon === "geo-alt" ? "M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" :
                    item.icon === "credit-card" ? "M2.5 4A1.5 1.5 0 0 0 1 5.5V6h14v-.5A1.5 1.5 0 0 0 13.5 4h-11zM1 7.5v5A1.5 1.5 0 0 0 2.5 14h11a1.5 1.5 0 0 0 1.5-1.5v-5H1zm1 2h12v1H2v-1z" :
                    item.icon === "bell" ? "M8 16a2 2 0 0 0 1.985-1.75c.017-.137-.097-.25-.235-.25h-3.5c-.138 0-.252.113-.235.25A2 2 0 0 0 8 16zM3 5a5 5 0 0 1 10 0v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5z" :
                    item.icon === "question-circle" ? "M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.5-5a.5.5 0 0 1-1 0V6a.5.5 0 0 1 1 0v5zm0 2.5a.5.5 0 0 1-.5.5h-.5a.5.5 0 0 1 0-1h.5a.5.5 0 0 1 .5.5z" :
                    "M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"} />
                </svg>
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