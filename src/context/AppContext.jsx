import { createContext, useContext, useReducer, useEffect } from "react";
import { fetchInstance } from "./api";
import { useAuth } from "./AuthContext"; 
import { useCart } from "./CartContext"; 

const AppContext = createContext();
const initialState = { theme: false, favorites: [], products: [],  loadingCancel: null, orders: [],popup: { visible: false, message: "" }, ShareButtons: false, searchQuery: "", filteredProducts: [], sortBy: "default", filterPrice: null };
const appReducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE_THEME":return { ...state, theme: !state.theme };
    case "SET_THEME":return { ...state, theme: action.payload };
    case "SET_SEARCH_QUERY": return { ...state, searchQuery: action.payload };
    case "SET_SORT_BY": return { ...state, sortBy: action.payload };
    case "SET_FILTER_PRICE": return { ...state, filterPrice: action.payload };
    case "SET_FILTERED_PRODUCTS": return { ...state, filteredProducts: action.payload };
    case "SET_FAVORITES": return { ...state, favorites: action.payload };
    case "SHOW_POPUP": return { ...state, popup: { visible: true, message: action.payload || state.popup.message }};
    case "HIDE_POPUP": return { ...state, popup: { visible: false, message: state.popup.message }};
    case "TOGGLE_SHARE": return { ...state, ShareButtons:!state.ShareButtons};
    case "TOGGLE_FAVORITE": return state.favorites.includes(action.payload) ? { ...state, favorites: state.favorites.filter((id) => id !== action.payload) } : { ...state, favorites: [...state.favorites, action.payload] };
    case "SET_PRODUCTS": return { ...state, products: action.payload };
    case "SET_ORDERS": return { ...state, orders: action.payload };
    case "SET_LOADING_CANCEL": return { ...state, loadingCancel: action.payload };
    case "RESET": return { ...state, favorites: [], orders: [] };
    default: return state;
  }
};

export const AppProvider = ({ children }) => {
  const { user, isAuthenticated, updateUser, dispatch: authDispatch } = useAuth();
  const { clearCartAndUpdateOrsers } = useCart();
  const [state, dispatch] = useReducer(appReducer, initialState);
  useEffect(() => { loadStoredData();  }, []);
  useEffect(() => { saveDataToStorage(); }, [ state.favorites, user, isAuthenticated]);
  useEffect(() => { (user && user.id) ? fetchOrders(user.id):dispatch({ type: "SET_ORDERS", payload: [] }) }, [user]);
  useEffect(() => {getProducts()}, []);
  useEffect(() => {
  let updated = [...state.products];

  if (state.searchQuery.trim()) {
    updated = updated.filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(state.searchQuery.toLowerCase())) ||
        (p.des && p.des.toLowerCase().includes(state.searchQuery.toLowerCase()))
    );
  }

  if (state.filterPrice !== null) {
    updated = updated.filter((p) => p.price == state.filterPrice);
  }

  if (state.sortBy === "a-z") {
    updated.sort((a, b) => a.name.localeCompare(b.name));
  } else if (state.sortBy === "z-a") {
    updated.sort((a, b) => b.name.localeCompare(a.name));
  }

  dispatch({ type: "SET_FILTERED_PRODUCTS", payload: updated });
}, [state.products, state.searchQuery, state.sortBy, state.filterPrice]);


  const toggleTheme = () => {dispatch({ type: "TOGGLE_THEME" })};
  const toggleFavorite = (id) => { dispatch({ type: "TOGGLE_FAVORITE", payload: id })};
  const fetchOrders = async (userId) => {
    const data = await fetchInstance(`/orders/user/${userId}`);
    dispatch({ type: "SET_ORDERS", payload: data });
    return data;
  };
  const loadStoredData = async () => {
    try {
      const appDataRaw = localStorage.getItem("appData");
      const userRaw = localStorage.getItem("user");
      const appData = appDataRaw ? JSON.parse(appDataRaw) : {};
      const storedUser = userRaw ? JSON.parse(userRaw) : null;

      dispatch({ type: "SET_THEME", payload: appData.theme || false });
      dispatch({ type: "SET_FAVORITES", payload: appData.favorites || [] });

      authDispatch({ type: "SET_USER", payload: storedUser });
      authDispatch({ type: "SET_AUTH", payload: !!storedUser });
    } catch (error) {
      console.error("Error loading stored data:", error);
    }
  };
  const saveDataToStorage = async () => {
    const appData = { 
      theme: state.theme, 
      favorites: state.favorites, 
      isAuthenticated 
    };
    localStorage.setItem("appData", JSON.stringify(appData));
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  };
  const togglePopup = (message = "") => {
    dispatch({ type: "SHOW_POPUP", payload: message });
    setTimeout(() => {
      dispatch({ type: "HIDE_POPUP" });
    }, 1500);
  };
  const toggleShareButtons = () =>{dispatch({type: "TOGGLE_SHARE"})};
  const setSortBy = (value) => dispatch({ type: "SET_SORT_BY", payload: value });
  const setFilterPrice = (value) => dispatch({ type: "SET_FILTER_PRICE", payload: value });
  const setSearchQuery = (value) => {dispatch({ type: "SET_SEARCH_QUERY", payload: value })};
  const logout = async () => {
     localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    localStorage.removeItem("products");
    authDispatch({ type: "LOGOUT" });
    dispatch({ type: "RESET" });
    return true;
  };
  const getProducts = async () => {
    try {
      const data = await fetchInstance("/products/db");
      dispatch({ type: "SET_PRODUCTS", payload: data });
      localStorage.setItem("products", JSON.stringify(data));
      return data;
    } catch {
      const cached = localStorage.getItem("products");
      if (cached) {
        const parsed = JSON.parse(cached);
        dispatch({ type: "SET_PRODUCTS", payload: parsed });
        return parsed;
      }
      return [];
    }
  };
  const searchProducts = async (q) => {
    try {
      return await fetchInstance(`/products/db/${q}`);
    } catch {
      const cached = localStorage.getItem("products");
      if (cached) {
        const list = JSON.parse(cached);
        return list.filter(
          (p) =>
            (p.name && p.name.toLowerCase().includes(q.toLowerCase())) ||
            (p.des && p.des.toLowerCase().includes(q.toLowerCase()))
        );

      }
      return [];
    }
  };
  const cancelOrder = async (orderId) => {
    try {
      dispatch({ type: "SET_LOADING_CANCEL", payload: orderId });
      const data = await fetchInstance(`/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: "canceled" })
      });
      dispatch({
        type: "SET_ORDERS",
        payload: state.orders.map((o) =>
          o._id === orderId ? { ...o, status: "canceled" } : o
        )
      });
      return data;
    } finally {
      dispatch({ type: "SET_LOADING_CANCEL", payload: null });
    }
  };

  return (
    <AppContext.Provider value={{ ...state, toggleTheme, toggleShareButtons, togglePopup, toggleFavorite, getProducts, searchProducts,  cancelOrder, logout, user, isAuthenticated, updateUser, clearCartAndUpdateOrsers, fetchOrders, setSearchQuery, setSortBy, setFilterPrice }} >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
