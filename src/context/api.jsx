const API_BASE_URL = "http://127.0.0.1:3001/api";

export const fetchInstance = async (endpoint, options = {} ) => {
  const token = localStorage.getItem("token");

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
