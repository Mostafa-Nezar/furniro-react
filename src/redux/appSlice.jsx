import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchInstance } from "../context/api";

const mytheme =
  JSON.parse(localStorage.getItem("mytheme")) ||
  window.matchMedia("(prefers-color-scheme: light)").matches;

export const getProducts = createAsyncThunk("app/getProducts", async () => {
  console.log("hello redux");
  
  try {
    const data = await fetchInstance("/products/db");
    localStorage.setItem("products", JSON.stringify(data));
    return data;
  } catch {
    const cached = localStorage.getItem("products");
    return cached ? JSON.parse(cached) : [];
  }
});

export const fetchOrders = createAsyncThunk("app/fetchOrders", async (userId) => {
  const data = await fetchInstance(`/orders/user/${userId}`);
  return data;
});

const appSlice = createSlice({
  name: "app",
  initialState: {
    theme: mytheme,
    favorites: [],
    products: [],
    loadingCancel: null,
    orders: [],
    popup: { visible: false, message: "" },
    ShareButtons: false,
    searchQuery: "",
    filteredProducts: [],
    sortBy: "default",
    filterPrice: null,
  },
  reducers: {
    toggleTheme: (state) => {
      console.log("hi redux");
      
      state.theme = !state.theme;
      localStorage.setItem("mytheme", JSON.stringify(state.theme));
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setFilterPrice: (state, action) => {
      state.filterPrice = action.payload;
    },
    toggleFavorite: (state, action) => {
      const id = action.payload;
      if (state.favorites.includes(id)) {
        state.favorites = state.favorites.filter((f) => f !== id);
      } else {
        state.favorites.push(id);
      }
    },
    showPopup: (state, action) => {
      state.popup.visible = true;
      state.popup.message = action.payload;
    },
    hidePopup: (state) => {
      state.popup.visible = false;
    },
    toggleShare: (state) => {
      state.ShareButtons = !state.ShareButtons;
    },
    resetState: (state) => {
      state.favorites = [];
      state.orders = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.filteredProducts = action.payload;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      });
  },
});

export const {
  toggleTheme,
  setTheme,
  setSearchQuery,
  setSortBy,
  setFilterPrice,
  toggleFavorite,
  showPopup,
  hidePopup,
  toggleShare,
  resetState,
} = appSlice.actions;

export default appSlice.reducer;
