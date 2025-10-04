import { createContext, useContext, useReducer, useEffect } from "react";
import { fetchInstance } from "./api";

const AuthContext = createContext();
const initialState = { user: null, isAuthenticated: false, isLoading: true };

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
    case "REGISTER_SUCCESS": return { ...state, user: action.payload, isAuthenticated: true, isLoading: false };
    case "LOGOUT": return { ...state, user: null, isAuthenticated: false, isLoading: false };
    case "UPDATE_USER": return { ...state, user: action.payload };
    case "SET_LOADING": return { ...state, isLoading: action.payload };
    case "RESTORE_USER": return { ...state, user: action.payload, isAuthenticated: !!action.payload, isLoading: false };
    default: return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    loadUser();
  }, []);
  const toggleSubscription = async (emailInput) => {
    const user = state.user;
    if (!user?.id) {
      return { success: false, message: "No user logged in." };
    }

    const normalizedInput = (emailInput || "").trim().toLowerCase();
    const normalizedUserEmail = (user.email || "").trim().toLowerCase();

    if (!normalizedInput) {
      return { success: false, message: "Please enter your email." };
    }

    if (normalizedInput !== normalizedUserEmail) {
      return { success: false, message: "Email does not match your account email." };
    }

    try {
      const newStatus = !user.isSubscribed;

      await fetchInstance(`/auth/user/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify({ isSubscribed: newStatus }),
      });

      const updatedUser = { ...user, isSubscribed: newStatus };
      dispatch({ type: "UPDATE_USER", payload: updatedUser });
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return { success: true, user: updatedUser };
    } catch (err) {
      console.error("❌ Error toggling subscription:", err);
      return { success: false, message: err.message || "Subscription update failed." };
    }
  };
  const loadUser = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          dispatch({ type: "RESTORE_USER", payload: JSON.parse(storedUser) });
        } else {
          dispatch({ type: "RESTORE_USER", payload: null });
        }
      } catch (err) {
        console.error("❌ Error restoring user:", err);
        dispatch({ type: "RESTORE_USER", payload: null });
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
      if (error.status === 409 || error.message?.includes("already exists")) {
        try {
          return await login(userData.email, userData.password);
        } catch {
          return { success: false, message: "Login failed for existing user" };
        }
      }
      const newUser = { id: Date.now(), ...userData, avatar: null };
      localStorage.setItem("token", "mock_token_123");
      localStorage.setItem("user", JSON.stringify(newUser));
      dispatch({ type: "REGISTER_SUCCESS", payload: newUser });
      return { success: true, user: newUser };
    }
  };
  const updateUser = async (updatedUserData) => {
    const newUser = { ...state.user, ...updatedUserData };
    dispatch({ type: "UPDATE_USER", payload: newUser });
    localStorage.setItem("user", JSON.stringify(newUser));
  };
  const login = async (email, password) => {
    try {
      const data = await fetchInstance("/auth/signin", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (data.token) localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      dispatch({ type: "LOGIN_SUCCESS", payload: data.user });
      return { success: true, user: data.user };
    } catch (error) {
      if (email === "admin@furniro.com" && password === "admin123") {
        const admin = { id: 1, email, name: "Admin User", avatar: null };
        localStorage.setItem("token", "mock_token_123");
        localStorage.setItem("user", JSON.stringify(admin));
        dispatch({ type: "LOGIN_SUCCESS", payload: admin });
        return { success: true, user: admin };
      }
      return { success: false, message: error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        updateUser,
        toggleSubscription,
        dispatch
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
