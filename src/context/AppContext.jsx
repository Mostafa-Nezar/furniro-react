import { createContext, useContext, useState, useEffect, useMemo } from "react";

const AppContext = createContext();

const API_BASE_URL = "https://furniro-back-production.up.railway.app/api";

const storage = {
  getItem(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {}
  },
  removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch {}
  },
};
const fetchInstance = async (endpoint, options = {}) => {
  const token = storage.getItem("token");

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const finalOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, finalOptions);
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data?.msg || "Unknown error");
    error.response = response;
    error.data = data;
    throw error;
  }

  return data;
};
function getInitialState() {
  let isDarkMode = false;
  let favorites = [];
  let isAuthenticated = false;
  let user = null;

  try {
    const appDataRaw = storage.getItem("appData");
    const userRaw = storage.getItem("user");

    if (appDataRaw) {
      const appData = JSON.parse(appDataRaw);
      isDarkMode = !!appData.isDarkMode;
      favorites = Array.isArray(appData.favorites) ? appData.favorites : [];
      isAuthenticated = !!appData.isAuthenticated;
    }
    if (userRaw) {
      user = JSON.parse(userRaw);
      if (user) isAuthenticated = true;
    }
  } catch (err) {
    console.error("Initial state load error:", err);
  }

  return { isDarkMode, favorites, isAuthenticated, user };
}

export const AppProvider = ({ children }) => {
  const initial = useMemo(() => getInitialState(), []);

  const [favorites, setFavorites] = useState(initial.favorites);
  const [isAuthenticated, setIsAuthenticated] = useState(initial.isAuthenticated);
  const [user, setUser] = useState(initial.user);
  const [products, setProducts] = useState([]);
  const [isOffline, setIsOffline] = useState(false);
  useEffect(()=>{
    getProducts()
  },[])
  useEffect(() => {
    const appData = {
      favorites,
      isAuthenticated,
    };
    storage.setItem("appData", JSON.stringify(appData));
    storage.setItem("user", JSON.stringify(user));
  }, [ favorites, isAuthenticated, user]);
  const getUserCart = () => (user?.cart ? [...user.cart] : []);
  const addToCart = async (product) => {
    if (!user?.id) return;
    try {
      const cart = getUserCart();
      const existingItem = cart.find((item) => item.id === product.id);
      let updatedCart;
      if (existingItem) {
        updatedCart = cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 0) + 1 }
            : item
        );
      } else {
        updatedCart = [
          ...cart,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
          },
        ];
      }

      await fetchInstance(`/auth/user/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify({ cart: updatedCart }),
      });

      const updatedUser = { ...user, cart: updatedCart };
      setUser(updatedUser);
      storage.setItem("user", JSON.stringify(updatedUser));
      console.log("✅ Product added to cart:", product.name);
    } catch (err) {
      console.error("❌ Error adding to cart:", err);
    }
  };
  const removeFromCart = async (productId) => {
    if (!user?.id) return;
    try {
      const cart = getUserCart().filter((item) => item.id !== productId);

      await fetchInstance(`/auth/user/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify({ cart }),
      });

      const updatedUser = { ...user, cart };
      setUser(updatedUser);
      storage.setItem("user", JSON.stringify(updatedUser));
      console.log("🗑️ Product removed from cart:", productId);
    } catch (err) {
      console.error("❌ Error removing from cart:", err);
    }
  };
  const updateCartQuantity = async (productId, newQuantity) => {
    if (!user?.id) return;
    try {
      let cart = getUserCart();
      if (newQuantity < 1) {
        cart = cart.filter((item) => item.id !== productId);
      } else {
        cart = cart.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        );
      }

      await fetchInstance(`/auth/user/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify({ cart }),
      });

      const updatedUser = { ...user, cart };
      setUser(updatedUser);
      storage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("❌ Error updating quantity:", err);
    }
  };
  const clearCartAndUpdateOrsers = async () => {
    if (!user?.id) return;
    try {
      const cart = getUserCart();
      await fetchInstance("/orders", {
        method: "POST",
        body: JSON.stringify({
          userId: user.id,
          products: cart,
          date: new Date().toISOString(),
          total: cart.reduce((sum, p) => sum + p.price * (p.quantity || 1), 0),
        }),
      });
      await fetchInstance(`/auth/user/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify({ cart: [] }),
      });
      const updatedUser = { ...user, cart: [] };
      setUser(updatedUser);
      storage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("❌ Error clearing cart / creating order:", err);
    }
  };
  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };
  const updateUser = async (updatedUser) => {
    setUser(updatedUser);
    storage.setItem("user", JSON.stringify(updatedUser));
  };
  const login = async (email, password) => {
    try {
      const data = await fetchInstance("/auth/signin", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (data.token) storage.setItem("token", data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true, user: data.user };
    } catch (error) {
      if (email === "admin@furniro.com" && password === "admin123") {
        const admin = {
          id: 1,
          email,
          name: "Admin User",
          image: null,
          cart: [],
        };
        storage.setItem("token", "mock_token_123");
        storage.setItem("user", JSON.stringify(admin));
        setUser(admin);
        setIsAuthenticated(true);
        return { success: true, user: admin };
      }
      return { success: false, message: error.message };
    }
  };
  const register = async (userData) => {
    try {
      const data = await fetchInstance("/auth/signup", {
        method: "POST",
        body: JSON.stringify(userData),
      });
      return await login(data.user.email, userData.password);
    } catch (error) {
      const newUser = {
        id: Date.now(),
        ...userData,
        image: null,
        cart: [],
      };
      storage.setItem("token", "mock_token_123");
      storage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
      setIsAuthenticated(true);
      return { success: true, user: newUser };
    }
  };
  const toggleSubscription = async (emailInput) => {
    if (!user?.id) {
      return { success: false, message: "No user logged in." };
    }

    const normalizedInput = (emailInput || "").trim().toLowerCase();
    const normalizedUserEmail = (user.email || "").trim().toLowerCase();

    if (!normalizedInput) {
      return { success: false, message: "Please enter your email." };
    }

    if (normalizedInput !== normalizedUserEmail) {
      return {
        success: false,
        message: "Email does not match your account email.",
      };
    }

    try {
      const newStatus = !user.isSubscribed;
      await fetchInstance(`/auth/user/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify({ isSubscribed: newStatus }),
      });

      const updatedUser = { ...user, isSubscribed: newStatus };
      setUser(updatedUser);
      storage.setItem("user", JSON.stringify(updatedUser));

      return { success: true, user: updatedUser };
    } catch (err) {
      console.error("❌ Error toggling subscription:", err);
      return {
        success: false,
        message: err.message || "Subscription update failed.",
      };
    }
  };
  const logout = async () => {
    try {
      storage.removeItem("token");
      storage.removeItem("user");
      setUser(null);
      setIsAuthenticated(false);
      setFavorites([]);
      return true;
    } catch {
      return false;
    }
  };
  const getProducts = async () => {
    try {
      const data = await fetchInstance("/products/db");
      setProducts(data);
      storage.setItem("products", JSON.stringify(data));
      return data;
    } catch {
      const cached = storage.getItem("products");
      if (cached) {
        const parsed = JSON.parse(cached);
        setProducts(parsed);
        return parsed;
      }
      return [];
    }
  };
  const searchProducts = async (q) => {
    try {
      const data = await fetchInstance(
        `/products/db/search?q=${encodeURIComponent(q)}`
      );
      return data;
    } catch {
      const cached = storage.getItem("products");
      if (cached) {
        const list = JSON.parse(cached);
        return list.filter(
          (p) =>
            p.name.toLowerCase().includes(q.toLowerCase()) ||
            p.des.toLowerCase().includes(q.toLowerCase())
        );
      }
      return [];
    }
  };
  const cart = getUserCart();
  
  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        user,
        cart,
        favorites,
        products,
        isOffline,
        login,
        register,
        logout,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        toggleFavorite,
        setOfflineStatus: setIsOffline,
        updateUser,
        getProducts,
        toggleSubscription,
        setProducts,
        searchProducts,
        clearCartAndUpdateOrsers,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
