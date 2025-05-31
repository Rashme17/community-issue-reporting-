// src/App.js
import React from "react";
import { Link } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider, useAuth } from "./context/AuthContext";


const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ccc", marginBottom: 20 }}>
      <Link to="/" style={{ marginRight: 15 }}>Home</Link>
      {!user && (
        <>
          <Link to="/login" style={{ marginRight: 15 }}>Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
      {user && (
        <>
          {/* Show different dashboard links based on JWT auth or localStorage auth */}
          {user.isJwtAuth ? (
            // For JWT authenticated users, check authorities
            user.authorities?.some(auth => auth.authority === 'ROLE_ADMIN') ? (
              <Link to="/admin-dashboard" style={{ marginRight: 15 }}>Admin Dashboard</Link>
            ) : (
              <>
                <Link to="/user-dashboard" style={{ marginRight: 15 }}>Dashboard</Link>
                <Link to="/report-issue" style={{ marginRight: 15 }}>Report Issue</Link>
              </>
            )
          ) : (
            // For localStorage authenticated users, check role
            user.role === "admin" ? (
              <Link to="/admin-dashboard" style={{ marginRight: 15 }}>Admin Dashboard</Link>
            ) : (
              <>
                <Link to="/user-dashboard" style={{ marginRight: 15 }}>Dashboard</Link>
                <Link to="/report-issue" style={{ marginRight: 15 }}>Report Issue</Link>
              </>
            )
          )}
          
          <span style={{ marginLeft: 15, marginRight: 10 }}>
            Welcome, {user.username}!
          </span>
          <button 
            onClick={logout} 
            style={{ 
              marginLeft: 10,
              padding: "5px 10px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </>
      )}
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <div className="container">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}

export default App;