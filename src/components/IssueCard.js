import React, { useState } from "react";
import StatusBadge from "./StatusBadge";
import IssueService from "../services/issueService";

export default function IssueCard({ issue, onUpdate }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  // Handle status update
  const handleStatusUpdate = async (newStatus) => {
    try {
      setIsUpdating(true);
      setError(null);
      
      await IssueService.updateIssueStatus(issue.id, newStatus);
      
      // Refresh the parent component's data
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Get image URL (handle both API and local storage formats)
  const getImageUrl = () => {
    if (issue.imageUrl) {
      // If it's a relative path from backend, prepend the base URL
      if (issue.imageUrl.startsWith('uploads/')) {
        return `${process.env.REACT_APP_API_URL || 'http://localhost:8081'}/${issue.imageUrl}`;
      }
      return issue.imageUrl;
    }
    // Fallback for local storage format
    return issue.image;
  };

  return (
    <div className="issue-card border rounded-xl p-6 shadow-lg mb-6 bg-white max-w-4xl mx-auto transition hover:shadow-xl">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
          <button 
            onClick={() => setError(null)}
            className="ml-2 text-red-600 hover:text-red-800 font-medium"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ─── Image Section ─── */}
        {(issue.imageUrl || issue.image) && (
          <div className="flex-shrink-0">
            <img
              src={getImageUrl()}
              alt={issue.title}
              className="w-full lg:w-48 lg:h-48 h-48 object-cover rounded-lg border shadow-sm"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* ─── Content Section ─── */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
            <h2 className="text-xl font-semibold text-gray-800 break-words">
              {issue.title}
            </h2>
            <div className="flex flex-col items-start sm:items-end gap-2">
              <StatusBadge 
                status={issue.status} 
                onStatusChange={handleStatusUpdate}
                isUpdating={isUpdating}
                issueId={issue.id}
              />
              {issue.id && (
                <span className="text-xs text-gray-500">
                  ID: {issue.id}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-700 mb-4 break-words">
            {issue.description || issue.desc}
          </p>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Location */}
            <div>
              <span className="text-sm font-medium text-gray-600">Location:</span>
              <p className="text-sm text-gray-800 break-words">{issue.location}</p>
            </div>

            {/* Category */}
            {(issue.category || issue.categoryName) && (
              <div>
                <span className="text-sm font-medium text-gray-600">Category:</span>
                <p className="text-sm text-gray-800">
                  {issue.category?.name || issue.categoryName || issue.category}
                </p>
              </div>
            )}

            {/* Reported By */}
            {(issue.reportedBy || issue.username) && (
              <div>
                <span className="text-sm font-medium text-gray-600">Reported By:</span>
                <p className="text-sm text-gray-800">
                  {issue.reportedBy?.username || issue.username}
                </p>
              </div>
            )}

            {/* Date */}
            {(issue.createdAt || issue.date) && (
              <div>
                <span className="text-sm font-medium text-gray-600">Reported:</span>
                <p className="text-sm text-gray-800">
                  {formatDate(issue.createdAt || issue.date)}
                </p>
              </div>
            )}
          </div>

          {/* Coordinates */}
          {(issue.latitude && issue.longitude) && (
            <div className="pt-3 border-t border-gray-100">
              <span className="text-sm font-medium text-gray-600">Coordinates:</span>
              <p className="text-sm text-gray-800">
                {issue.latitude.toFixed(6)}, {issue.longitude.toFixed(6)}
              </p>
              <a
                href={`https://maps.google.com/?q=${issue.latitude},${issue.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                View on Map
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}