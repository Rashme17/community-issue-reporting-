const API_URL = "http://localhost:8081/api/auth";

// Register user
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || "Failed to register user");
    }

    return await response.json();
  } catch (error) {
    console.error("Registration error:", error.message);
    throw error;
  }
};

// Login user - Simplified without credentials
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials), // ← YOU FORGOT THIS!
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error("Login error:", error.message);
    throw error;
  }
};

// Logout function
export const logoutUser = () => {
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("username");
  localStorage.removeItem("loggedInUser");
};

// Get stored token
export const getToken = () => {
  return localStorage.getItem("jwtToken");
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    // Basic token structure check (you can add more validation)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
};

// API call with authentication
export const authenticatedRequest = async (url, options = {}) => {
  const token = getToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  };
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(url, config);
    
    if (response.status === 401) {
      // Token expired or invalid
      logoutUser();
      window.location.href = '/login';
      throw new Error('Session expired');
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};