// src/pages/AdminDashboard.js
import React, { useState, useEffect } from "react";
import IssueCard from "../components/IssueCard";
import IssueService from "../services/issueService";

const AdminDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Fetch all issues on component mount
  useEffect(() => {
    fetchAllIssues();
  }, []);

  const fetchAllIssues = async () => {
    try {
      setLoading(true);
      setError(null);
      const allIssues = await IssueService.getAllIssues();
      setIssues(allIssues);
    } catch (error) {
      console.error('Error fetching issues:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (issueId, newStatus) => {
    try {
      // Update status via API
      const updatedIssue = await IssueService.updateIssueStatus(issueId, newStatus);
      
      // Update local state
      setIssues(prevIssues => 
        prevIssues.map(issue => 
          issue.id === issueId 
            ? { ...issue, status: newStatus.toUpperCase() }
            : issue
        )
      );
      
      console.log('Status updated successfully:', updatedIssue);
    } catch (error) {
      console.error('Error updating status:', error);
      setError(`Failed to update status: ${error.message}`);
      
      // Optionally refresh the issues list to ensure consistency
      fetchAllIssues();
    }
  };

  const handleStatusFilterChange = async (filter) => {
    setStatusFilter(filter);
    
    try {
      setLoading(true);
      setError(null);
      
      let filteredIssues;
      if (filter === 'ALL') {
        filteredIssues = await IssueService.getAllIssues();
      } else {
        filteredIssues = await IssueService.getIssuesByStatus(filter);
      }
      
      setIssues(filteredIssues);
    } catch (error) {
      console.error('Error filtering issues:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshIssues = () => {
    fetchAllIssues();
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-spinner">
          <p>Loading issues...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="error-message">
          <h3>Error Loading Issues</h3>
          <p>{error}</p>
          <button onClick={refreshIssues} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Admin Dashboard - All Reported Issues</h2>
        <button onClick={refreshIssues} className="refresh-button">
          Refresh Issues
        </button>
      </div>

      {/* Status Filter */}
      <div className="filter-section">
        <label htmlFor="status-filter">Filter by Status:</label>
        <select 
          id="status-filter"
          value={statusFilter} 
          onChange={(e) => handleStatusFilterChange(e.target.value)}
          className="status-filter"
        >
          <option value="ALL">All Issues</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>

      {/* Issues Count */}
      <div className="issues-summary">
        <p>Total Issues: {issues.length}</p>
      </div>

      {/* Issues List */}
      <div className="issues-container">
        {issues.length === 0 ? (
          <div className="no-issues">
            <p>No issues found{statusFilter !== 'ALL' ? ` with status: ${IssueService.getStatusDisplayText(statusFilter)}` : ''}.</p>
          </div>
        ) : (
          issues.map((issue) => (
            <div key={issue.id} className="issue-item">
              <IssueCard issue={issue} />
              
              {/* Status Update Controls */}
              <div className="status-controls">
                <label htmlFor={`status-${issue.id}`}>Update Status:</label>
                <select 
                  id={`status-${issue.id}`}
                  onChange={(e) => updateStatus(issue.id, e.target.value)} 
                  value={issue.status || 'PENDING'}
                  className="status-select"
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
                
                {/* Display current status */}
                <span className={`status-badge status-${issue.status?.toLowerCase()}`}>
                  Current: {IssueService.getStatusDisplayText(issue.status)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;