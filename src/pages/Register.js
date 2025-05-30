import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService"; // ✅ import the service

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "USER", 
    name: "",
    email: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await registerUser(form); 
      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      alert("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-wrapper">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit} className="register-form">
          
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              disabled={isLoading}
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
