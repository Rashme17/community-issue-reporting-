import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authService";

const Login = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await loginUser(form);
      console.log("Login Success:", response);

      // Store JWT token and username in localStorage - FIXED KEY NAME
      localStorage.setItem("token", response.token); // Changed from "jwtToken" to "token"
      localStorage.setItem("username", response.username);

      // Update auth context with user data
      login({
        username: response.username,
        token: response.token,
        authorities: response.authorities
      });

      alert("Login successful!");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Login failed: Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Please sign in to your account</p>
        </div>

        {error && (
          <div className="error-message" style={{
            color: 'red',
            backgroundColor: '#ffe6e6',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '15px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input 
              id="username"
              type="text"
              placeholder="Enter your username" 
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })} 
              required 
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              placeholder="Enter your password" 
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} 
              required 
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? <a href="#register">Contact your administrator</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;