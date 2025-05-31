// src/pages/AdminDashboard.js
import React, { useState, useEffect } from "react";
import IssueCard from "../components/IssueCard";
import IssueService from "../services/issueService";
import "../styles/admin.css";

const AdminDashboard = () => {
  const [allIssues, setAllIssues] = useState([]); // Store all issues
  const [displayedIssues, setDisplayedIssues] = useState([]); // Issues currently displayed
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  
  const ISSUES_PER_PAGE = 4;

  // Fetch all issues on component mount
  useEffect(() => {
    fetchAllIssues();
  }, []);

  // Update displayed issues when allIssues or currentPage changes
  useEffect(() => {
    updateDisplayedIssues();
  }, [allIssues, currentPage]);

  const fetchAllIssues = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedIssues = await IssueService.getAllIssues();
      
      // Sort issues by date (latest first) - assuming issues have a createdAt or timestamp field
      const sortedIssues = fetchedIssues.sort((a, b) => {
        // Adjust these field names based on your actual issue object structure
        const dateA = new Date(a.createdAt || a.timestamp || a.date);
        const dateB = new Date(b.createdAt || b.timestamp || b.date);
        return dateB - dateA; // Latest first
      });
      
      setAllIssues(sortedIssues);
      setCurrentPage(1); // Reset to first page
    } catch (error) {
      console.error('Error fetching issues:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateDisplayedIssues = () => {
    const startIndex = 0;
    const endIndex = currentPage * ISSUES_PER_PAGE;
    setDisplayedIssues(allIssues.slice(startIndex, endIndex));
  };

  const loadMoreIssues = async () => {
    try {
      setLoadingMore(true);
      setCurrentPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error('Error loading more issues:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const updateStatus = async (issueId, newStatus) => {
    try {
      // Update status via API
      const updatedIssue = await IssueService.updateIssueStatus(issueId, newStatus);
      
      // Update local state for both allIssues and displayedIssues
      const updateIssue = (issue) => 
        issue.id === issueId 
          ? { ...issue, status: newStatus.toUpperCase() }
          : issue;
      
      setAllIssues(prevIssues => prevIssues.map(updateIssue));
      setDisplayedIssues(prevIssues => prevIssues.map(updateIssue));
      
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
      
      // Sort filtered issues by date (latest first)
      const sortedFilteredIssues = filteredIssues.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.timestamp || a.date);
        const dateB = new Date(b.createdAt || b.timestamp || b.date);
        return dateB - dateA; // Latest first
      });
      
      setAllIssues(sortedFilteredIssues);
      setCurrentPage(1); // Reset to first page when filtering
    } catch (error) {
      console.error('Error filtering issues:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshIssues = () => {
    setCurrentPage(1);
    fetchAllIssues();
  };

  // Check if there are more issues to load
  const hasMoreIssues = displayedIssues.length < allIssues.length;

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
        <p>
          Showing {displayedIssues.length} of {allIssues.length} issues
          {statusFilter !== 'ALL' && ` (filtered by: ${IssueService.getStatusDisplayText(statusFilter)})`}
        </p>
      </div>

      {/* Issues List */}
      <div className="issues-container">
        {allIssues.length === 0 ? (
          <div className="no-issues">
            <p>No issues found{statusFilter !== 'ALL' ? ` with status: ${IssueService.getStatusDisplayText(statusFilter)}` : ''}.</p>
          </div>
        ) : (
          <>
            {displayedIssues.map((issue) => (
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
            ))}
            
            {/* Load More Button */}
            {hasMoreIssues && (
              <div className="load-more-section">
                <button 
                  onClick={loadMoreIssues} 
                  className="load-more-button"
                  disabled={loadingMore}
                >
                  {loadingMore ? 'Loading...' : `Load More (${allIssues.length - displayedIssues.length} remaining)`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;