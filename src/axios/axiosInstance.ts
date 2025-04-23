import axios from "axios";

// Define fallback URLs
const LOCAL_API_URL = "http://localhost:5000";
// const PRODUCTION_API_URL = "https://lms-backend2-zob0.onrender.com";

// Get API URL from window.env (runtime) or fallback to default
const getApiUrl = (): string => {
  // Check if window.env is available (browser environment)
  if (typeof window !== 'undefined' && window.env) {
    return window.env.VITE_REACT_APP_API_URL || window.env.REACT_APP_API_URL || LOCAL_API_URL;
  }
  
  // Fallback to default URL
  return LOCAL_API_URL;
};

// Export the API URL
export const apiUrl = getApiUrl();

// Log which API URL is being used (helpful for debugging)
console.log("API URL:", apiUrl);

// Create and export the axios instance
export const axiosInstance = axios.create({
  baseURL: apiUrl,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
