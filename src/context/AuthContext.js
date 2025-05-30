import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, logoutUser, isAuthenticated } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Initialize user state on app load
  useEffect(() => {
    const initializeAuth = () => {
      // Check JWT authentication first
      if (isAuthenticated()) {
        const username = localStorage.getItem("username");
        const token = getToken();
        setUser({ username, token, isJwtAuth: true });
      } else {
        // Fallback to localStorage-based auth (for existing functionality)
        const data = localStorage.getItem("loggedInUser");
        if (data) {
          const userData = JSON.parse(data);
          setUser({ ...userData, isJwtAuth: false });
        }
      }
    };

    initializeAuth();
  }, []);

  // JWT-based login
  const login = (userData) => {
    if (userData.token) {
      // JWT login
      setUser({ ...userData, isJwtAuth: true });
      navigate(userData.authorities?.some(auth => auth.authority === 'ROLE_ADMIN') 
        ? "/admin-dashboard" 
        : "/user-dashboard");
      return true;
    } else {
      // Fallback to localStorage-based login
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const found = users.find((u) => u.username === userData.username && u.password === userData.password);
      if (found) {
        setUser({ ...found, isJwtAuth: false });
        localStorage.setItem("loggedInUser", JSON.stringify(found));
        navigate(found.role === "admin" ? "/admin-dashboard" : "/user-dashboard");
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    logoutUser(); // Clear JWT tokens
    localStorage.removeItem("loggedInUser"); // Clear localStorage auth
    navigate("/login");
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: () => user !== null
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};