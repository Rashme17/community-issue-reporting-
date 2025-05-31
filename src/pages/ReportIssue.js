import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import IssueService from "../services/issueService";
import LocationSelector from "../components/LocationSelector";
import "../styles/ReportIssue.css";

const ReportIssue = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    latitude: null,
    longitude: null,
    categoryId: "",
    severity: "",
    image: null,
    severity: ""
  });
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    setCategories([
      { id: 1, name: "Pothole" },
      { id: 2, name: "Garbage Collection" },
      { id: 3, name: "Street Light" }
    ]);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    setForm({ ...form, image: file });

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    setError("");
  };

  const handleLocationChange = (locationData) => {
    setForm({
      ...form,
      location: locationData.address,
      latitude: locationData.latitude,
      longitude: locationData.longitude
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      const userId = user?.id || user?.userId || user?.sub || user?.username;
      if (!userId) {
        throw new Error("Unable to determine user ID. Please login again.");
      }

      if (form.image) {
        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("description", form.description);
        formData.append("location", form.location);
        formData.append("userId", userId);
        formData.append("categoryId", form.categoryId);
        formData.append("image", form.image);

        if (form.latitude !== null && form.longitude !== null) {
          formData.append("latitude", form.latitude.toString());
          formData.append("longitude", form.longitude.toString());
        }

        // Severity can be added later when backend is ready
        // formData.append("severity", form.severity);

        await IssueService.createIssueWithImage(formData);
      } else {
        const locationWithCoords =
          form.latitude && form.longitude
            ? `${form.location} (${form.latitude}, ${form.longitude})`
            : form.location;

        const issueData = {
          title: form.title,
          description: form.description,
          location: locationWithCoords,
          reportedBy: { id: userId },
          category: { id: form.categoryId },
          status: "PENDING"
          // severity: form.severity  // for future backend support
        };

        await IssueService.createIssue(issueData);
      }

      navigate("/user-dashboard");
    } catch (error) {
      console.error("Error creating issue:", error);
      if (error.message.includes("403")) {
        setError("Access denied. Please check your permissions or login again.");
      } else if (error.message.includes("401")) {
        setError("Authentication failed. Please login again.");
        navigate("/login");
      } else if (error.message.includes("400")) {
        setError("Invalid data format. Please check all fields and try again.");
      } else {
        setError(error.message || "Failed to create issue. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = () => {
    setForm({ ...form, image: null });
    setImagePreview(null);
  };

  return (
    <div className="report-container">
      <div className="report-wrapper">
        <div className="report-header">
          <h2>Report an Issue</h2>
          <p>Help us improve by reporting problems you've encountered</p>
        </div>

        {error && (
          <div className="error-message">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="report-form">
          <div className="form-group">
            <label htmlFor="title">Issue Title</label>
            <input
              id="title"
              type="text"
              placeholder="Brief description of the issue"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              required
              disabled={isLoading}
              className="category-select"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
  <label htmlFor="severity">Severity</label>
  <select
    id="severity"
    value={form.severity}
    onChange={(e) => setForm({ ...form, severity: e.target.value })}
    required
    disabled={isLoading}
    className="severity-select"
  >
    <option value="">Select severity</option>
    <option value="LOW">Low</option>
    <option value="MEDIUM">Medium</option>
    <option value="HIGH">High</option>
  </select>
</div>


          <LocationSelector
            location={form.location}
            latitude={form.latitude}
            longitude={form.longitude}
            onLocationChange={handleLocationChange}
            disabled={isLoading}
            onError={setError}
          />

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Please provide detailed information about the issue"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              disabled={isLoading}
              rows={5}
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Attach Image (Optional)</label>
            <div className="file-upload-wrapper">
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isLoading}
                className="file-input"
              />
              <label htmlFor="image" className="file-upload-label">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
                Choose Image
              </label>
            </div>

            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="remove-image"
                  disabled={isLoading}
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            className={`report-button ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Submitting Report...
              </>
            ) : (
              <>
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
                </svg>
                Submit Report
              </>
            )}
          </button>
        </form>

        <div className="report-footer">
          <p>Need immediate help? <a href="/contact">Contact support</a></p>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;
