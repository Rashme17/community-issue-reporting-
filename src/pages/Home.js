import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import IssueService from "../services/issueService";
import "../styles/home.css";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [resolvedIssues, setResolvedIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalIssues: 0,
    resolvedIssues: 0,
    pendingIssues: 0
  });

  useEffect(() => {
    fetchResolvedIssues();
    fetchStats();
  }, []);

  const fetchResolvedIssues = async () => {
    try {
      setIsLoading(true);
      // Fetch resolved issues - adjust the API call based on your backend
      const issues = await IssueService.getResolvedIssues();
      setResolvedIssues(issues.slice(0, 6)); // Show only latest 6 resolved issues
    } catch (error) {
      console.error("Error fetching resolved issues:", error);
      setError("Failed to load resolved issues");
      // Set some mock data for demonstration
      setResolvedIssues([
        {
          id: 1,
          title: "Pothole on Main Street Fixed",
          location: "Main Street, Downtown",
          resolvedDate: "2024-01-15",
          category: "Road Maintenance"
        },
        {
          id: 2,
          title: "Street Light Restored",
          location: "Park Avenue",
          resolvedDate: "2024-01-14",
          category: "Street Light"
        },
        {
          id: 3,
          title: "Garbage Collection Resumed",
          location: "Residential Area Block A",
          resolvedDate: "2024-01-13",
          category: "Garbage Collection"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Fetch statistics - adjust based on your API
      const statsData = await IssueService.getStats();
      setStats(statsData);
    } catch (error) {
      console.error("Error fetching stats:", error);
      // Set mock stats for demonstration
      setStats({
        totalIssues: 247,
        resolvedIssues: 189,
        pendingIssues: 58
      });
    }
  };

  const handleReportIssue = () => {
    navigate("/report-issue");
  };

  const handleAnonymousReport = () => {
    // Navigate to report issue page with anonymous flag
    navigate("/report-issue", { state: { anonymous: true } });
  };

  const handleViewAllResolved = () => {
    navigate("/resolved-issues");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to the Community Issue Reporting Platform
          </h1>
          <p className="hero-subtitle">
            Help your community by reporting civic issues and tracking their resolution.
            Together, we can make our neighborhood a better place to live.
          </p>
          
          <div className="hero-actions">
            <button 
              onClick={handleReportIssue}
              className="btn btn-primary"
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
              </svg>
              Report an Issue
            </button>
            
            <button 
              onClick={handleAnonymousReport}
              className="btn btn-secondary"
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.4C15.4,11.8 16,12.4 16,13.3V16.8C16,17.4 15.4,18 14.7,18H9.2C8.6,18 8,17.4 8,16.7V13.2C8,12.3 8.4,11.7 9,11.3V10C9,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.2,9.2 10.2,10V11.3H13.8V10C13.8,9.2 12.8,8.2 12,8.2Z" />
              </svg>
              Report Anonymously
            </button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="stats-container">
          <h2 className="section-title">Community Impact</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16,9H19L14,16M10,9H13L8,16M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z" />
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.totalIssues}</div>
                <div className="stat-label">Total Issues Reported</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon success">
                <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.5,8L11,13.5L7.5,10L6,11.5L11,16.5Z" />
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.resolvedIssues}</div>
                <div className="stat-label">Issues Resolved</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon warning">
                <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" />
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.pendingIssues}</div>
                <div className="stat-label">Pending Issues</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Resolved Issues Section */}
      <section className="resolved-issues-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Recently Resolved Issues</h2>
            <button 
              onClick={handleViewAllResolved}
              className="btn btn-outline"
            >
              View All Resolved
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" />
              </svg>
            </button>
          </div>

          {isLoading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading resolved issues...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z" />
              </svg>
              {error}
            </div>
          ) : (
            <div className="issues-grid">
              {resolvedIssues.map((issue) => (
                <div key={issue.id} className="issue-card">
                  <div className="issue-header">
                    <h3 className="issue-title">{issue.title}</h3>
                    <div className="issue-status resolved">
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" />
                      </svg>
                      Resolved
                    </div>
                  </div>
                  
                  <div className="issue-details">
                    <div className="issue-location">
                      <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" />
                      </svg>
                      {issue.location}
                    </div>
                    
                    <div className="issue-category">
                      <span className="category-tag">{issue.category}</span>
                    </div>
                    
                    <div className="issue-date">
                      Resolved on {formatDate(issue.resolvedDate)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Make a Difference in Your Community</h2>
          <p>
            Every report helps us prioritize and address the issues that matter most 
            to our community. Your voice makes a difference.
          </p>
          <div className="cta-actions">
            <button 
              onClick={handleReportIssue}
              className="btn btn-primary"
            >
              Get Started - Report an Issue
            </button>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <section className="info-section">
        <div className="info-container">
          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z" />
                </svg>
              </div>
              <h3>How It Works</h3>
              <p>Report issues, track progress, and see real community improvements happen.</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z" />
                </svg>
              </div>
              <h3>Anonymous Reporting</h3>
              <p>Report sensitive issues anonymously while still helping your community.</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z" />
                </svg>
              </div>
              <h3>Track Progress</h3>
              <p>Follow your reported issues from submission to resolution.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;