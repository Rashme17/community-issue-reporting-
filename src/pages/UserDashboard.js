// src/pages/UserDashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import IssueCard from "../components/IssueCard";
import IssueService from "../services/issueService";

const UserDashboard = () => {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debug: Log user state changes
  useEffect(() => {
    console.log('User state changed:', user);
  }, [user]);

  useEffect(() => {
    fetchUserIssues();
  }, [user]);

  const fetchUserIssues = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user is available
      if (!user) {
        console.log('User not available yet, skipping fetch');
        setLoading(false);
        return;
      }

      console.log('Fetching issues for user:', user);
      
      // Since backend doesn't have user-specific endpoint yet,
      // fetch all issues and filter on frontend
      const allIssues = await IssueService.getAllIssues();
      console.log('All issues fetched:', allIssues);
      
      // Filter issues for current user
      const userIssues = allIssues.filter(issue => {
        // Check different possible user identifier formats
        const issueUser = issue.reportedBy?.username || issue.reportedBy?.id || issue.username;
        const currentUser = user.username || user.id;
        
        console.log('Comparing:', { issueUser, currentUser, issue });
        
        return issueUser === currentUser || 
               issueUser === currentUser.toString() ||
               (issue.reportedBy?.id && issue.reportedBy.id.toString() === currentUser.toString());
      });

      console.log('Filtered user issues:', userIssues);
      setIssues(userIssues);
    } catch (err) {
      console.error('Error fetching user issues:', err);
      setError('Failed to load your issues. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="text-lg">Loading your issues...</div>
    </div>;
  }

  if (error) {
    return <div className="text-red-600 text-center p-4">
      {error}
    </div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Issues</h1>
      
      {issues.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">You haven't reported any issues yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;