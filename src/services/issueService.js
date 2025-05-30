// src/Services/IssueService.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081/api';

class IssueService {
  // Get authentication token
  getAuthToken() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found. Please login again.');
    }
    return token;
  }

  // Create issue without image (JSON payload)
  async createIssue(issueData) {
    try {
      const token = this.getAuthToken();
      const response = await fetch(`${API_BASE_URL}/issues`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(issueData)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating issue:', error);
      throw error;
    }
  }

  // Create issue with image (FormData payload) - image is required
  async createIssueWithImage(formData) {
    try {
      const token = this.getAuthToken();
      
      // Validate that image is present in FormData
      if (!formData.has('image')) {
        throw new Error('Image is required for this endpoint');
      }

      const response = await fetch(`${API_BASE_URL}/issues/with-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type for FormData - browser will set it with boundary
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating issue with image:', error);
      throw error;
    }
  }

  // Get all issues
async getAllIssues() {
    try {
      const token = this.getAuthToken();
      const response = await fetch(`${API_BASE_URL}/issues`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching issues:', error);
      throw error;
    }
  }


  // Get issue by ID
  async getIssueById(id) {
    try {
      const token = this.getAuthToken();
      const response = await fetch(`${API_BASE_URL}/issues/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Issue with ID ${id} not found`);
        }
        const errorData = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching issue:', error);
      throw error;
    }
  }

  // Get issues by user ID (accepts both username and numeric ID)
  async getIssuesByUserId(userId) {
    try {
      const token = this.getAuthToken();
      const response = await fetch(`${API_BASE_URL}/issues/user/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`No issues found for user: ${userId}`);
        }
        const errorData = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user issues:', error);
      throw error;
    }
  }

  // Get issues by status
  async getIssuesByStatus(status) {
    try {
      const token = this.getAuthToken();
      
      // Validate status values (matches your backend enum)
      const validStatuses = ['PENDING', 'IN_PROGRESS', 'RESOLVED'];
      if (!validStatuses.includes(status.toUpperCase())) {
        throw new Error(`Invalid status: ${status}. Valid statuses are: ${validStatuses.join(', ')}`);
      }

      const response = await fetch(`${API_BASE_URL}/issues/status/${status}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching issues by status:', error);
      throw error;
    }
  }

  // Update issue status
  async updateIssueStatus(id, status) {
    try {
      const token = this.getAuthToken();
      
      // Validate status values
      const validStatuses = ['PENDING', 'IN_PROGRESS', 'RESOLVED'];
      if (!validStatuses.includes(status.toUpperCase())) {
        throw new Error(`Invalid status: ${status}. Valid statuses are: ${validStatuses.join(', ')}`);
      }

      const response = await fetch(`${API_BASE_URL}/issues/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: status.toUpperCase() })
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Issue with ID ${id} not found`);
        }
        const errorData = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating issue status:', error);
      throw error;
    }
  }

  // Helper method to create FormData for issue with image
  createIssueFormData(issueData) {
    const formData = new FormData();
    
    // Required fields
    formData.append('title', issueData.title);
    formData.append('description', issueData.description);
    formData.append('location', issueData.location);
    formData.append('userId', issueData.userId || issueData.username);
    formData.append('categoryId', issueData.categoryId);
    
    // Image is required for with-image endpoint
    if (issueData.image) {
      formData.append('image', issueData.image);
    }
    
    // Optional coordinates
    if (issueData.latitude !== undefined && issueData.latitude !== null) {
      formData.append('latitude', issueData.latitude);
    }
    if (issueData.longitude !== undefined && issueData.longitude !== null) {
      formData.append('longitude', issueData.longitude);
    }
    
    return formData;
  }

  // Helper method to convert file to base64 (if needed for preview)
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  // Helper method to convert base64 to file
  base64ToFile(base64String, filename) {
    const arr = base64String.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, { type: mime });
  }

  // Helper method for status display mapping
  getStatusDisplayText(status) {
    const statusMap = {
      'PENDING': 'Pending',
      'IN_PROGRESS': 'In Progress',
      'RESOLVED': 'Resolved'
    };
    return statusMap[status] || status;
  }

  // Helper method to validate issue data before submission
  validateIssueData(issueData, requireImage = false) {
    const errors = [];
    
    if (!issueData.title || issueData.title.trim().length === 0) {
      errors.push('Title is required');
    }
    
    if (!issueData.description || issueData.description.trim().length === 0) {
      errors.push('Description is required');
    }
    
    if (!issueData.location || issueData.location.trim().length === 0) {
      errors.push('Location is required');
    }
    
    if (!issueData.userId && !issueData.username) {
      errors.push('User ID or username is required');
    }
    
    if (!issueData.categoryId) {
      errors.push('Category is required');
    }
    
    if (requireImage && !issueData.image) {
      errors.push('Image is required');
    }
    
    if (errors.length > 0) {
      throw new Error('Validation failed: ' + errors.join(', '));
    }
    
    return true;
  }

  
}

export default new IssueService();