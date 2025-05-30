import React, { useState } from 'react';
import IssueService from '../services/issueService';

export default function StatusBadge({ status, onStatusChange, isUpdating, issueId }) {
  const [showDropdown, setShowDropdown] = useState(false);

  // Map backend status to display text
  const getDisplayStatus = (status) => {
    return IssueService.getStatusDisplayText(status);
  };

  // Status color mapping
  const getStatusColor = (status) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case 'pending':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'in progress':
      case 'in_progress':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'resolved':
        return 'bg-green-500 hover:bg-green-600';
      default:
        return 'bg-gray-400 hover:bg-gray-500';
    }
  };

  // Available status options
  const statusOptions = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'RESOLVED', label: 'Resolved' }
  ];

  const handleStatusSelect = (newStatus) => {
    setShowDropdown(false);
    if (onStatusChange && newStatus !== status) {
      onStatusChange(newStatus);
    }
  };

  const displayStatus = getDisplayStatus(status);
  const currentColor = getStatusColor(displayStatus);

  return (
    <div className="relative">
      {/* Status Badge */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={isUpdating || !onStatusChange}
        className={`px-3 py-1 text-white text-sm rounded-full font-medium transition-all duration-200 ${currentColor} ${
          onStatusChange && !isUpdating 
            ? 'cursor-pointer transform hover:scale-105' 
            : 'cursor-default'
        } ${isUpdating ? 'opacity-70' : ''}`}
      >
        {isUpdating ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Updating...
          </span>
        ) : (
          displayStatus
        )}
      </button>

      {/* Dropdown Menu */}
      {showDropdown && onStatusChange && !isUpdating && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowDropdown(false)}
          ></div>
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="py-1">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStatusSelect(option.value)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                    option.value === status ? 'bg-gray-50 font-medium' : ''
                  }`}
                >
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${getStatusColor(option.label).replace('hover:bg-', 'bg-').split(' ')[0]}`}></span>
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}