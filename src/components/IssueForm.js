import React, { useState } from 'react';
import './styles/common.css';

export default function IssueForm({ onSubmit }) {
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    category: '', 
    image: null 
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = e => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-gradient-to-br from-gray-50 to-gray-200">
      <div className="w-full max-w-2xl bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-black/5 overflow-hidden relative">
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800"></div>
        
        {/* Header */}
        <div className="px-10 pt-10 pb-5 text-center border-b border-black/5">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 tracking-tight">Report an Issue</h2>
          <p className="text-gray-500 text-sm">Help us improve your community</p>
        </div>
        
        {/* Form */}
        <div className="p-10">
          <div className="space-y-6">
            {/* Title Input */}
            <div>
              <label htmlFor="title" className="block mb-2 text-sm font-semibold text-gray-600 tracking-wide">
                ISSUE TITLE
              </label>
              <input 
                type="text" 
                id="title"
                name="title" 
                placeholder="Brief description of the issue" 
                onChange={handleChange}
                disabled={isSubmitting}
                required
                className="w-full px-5 py-4 border-2 border-black/8 rounded-xl text-base transition-all duration-300 ease-out bg-gray-50/80 text-gray-600 focus:border-gray-600 focus:outline-none focus:shadow-lg focus:shadow-gray-600/10 focus:bg-white/95 focus:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
            
            {/* Description Textarea */}
            <div>
              <label htmlFor="description" className="block mb-2 text-sm font-semibold text-gray-600 tracking-wide">
                DESCRIPTION
              </label>
              <textarea 
                id="description"
                name="description" 
                placeholder="Provide detailed information about the issue" 
                onChange={handleChange}
                disabled={isSubmitting}
                rows="4"
                required
                className="w-full px-5 py-4 border-2 border-black/8 rounded-xl text-base transition-all duration-300 ease-out bg-gray-50/80 text-gray-600 resize-y min-h-24 focus:border-gray-600 focus:outline-none focus:shadow-lg focus:shadow-gray-600/10 focus:bg-white/95 focus:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
            
            {/* Category Select */}
            <div>
              <label htmlFor="category" className="block mb-2 text-sm font-semibold text-gray-600 tracking-wide">
                CATEGORY
              </label>
              <div className="relative">
                <select 
                  id="category"
                  name="category" 
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                  className="w-full px-5 py-4 pr-12 border-2 border-black/8 rounded-xl text-base transition-all duration-300 ease-out bg-gray-50/80 text-gray-600 cursor-pointer appearance-none focus:border-gray-600 focus:outline-none focus:shadow-lg focus:shadow-gray-600/10 focus:bg-white/95 focus:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="">Select Issue Category</option>
                  <option value="pothole">Pothole</option>
                  <option value="garbage">Garbage Collection</option>
                  <option value="light">Street Light</option>
                </select>
                <div className="absolute right-5 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* File Input */}
            <div>
              <label htmlFor="image" className="block mb-2 text-sm font-semibold text-gray-600 tracking-wide">
                PHOTO EVIDENCE
              </label>
              <div className="relative">
                <input 
                  type="file" 
                  id="image"
                  name="image" 
                  onChange={handleChange}
                  disabled={isSubmitting}
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex items-center gap-3 w-full px-5 py-4 border-2 border-black/8 rounded-xl text-base transition-all duration-300 ease-out bg-gray-50/80 text-gray-600 cursor-pointer hover:border-gray-600 hover:shadow-lg hover:shadow-gray-600/10 hover:bg-white/95 hover:-translate-y-0.5">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21,15 16,10 5,21"/>
                  </svg>
                  <span>{formData.image ? formData.image.name : 'Choose image file'}</span>
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <button 
              type="submit" 
              onClick={handleSubmit}
              className={`w-full px-6 py-4 bg-gradient-to-br from-gray-600 to-gray-700 border-0 rounded-xl text-white text-base font-bold tracking-wide cursor-pointer transition-all duration-300 ease-out shadow-lg shadow-gray-600/25 relative overflow-hidden flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-gray-600/35 hover:-translate-y-0.5 hover:from-gray-700 hover:to-gray-800 disabled:opacity-80 disabled:cursor-not-allowed disabled:transform-none ${isSubmitting ? 'pointer-events-none' : ''}`}
              disabled={isSubmitting}
            >
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/15 to-transparent transform -translate-x-full transition-transform duration-600 hover:translate-x-full"></div>
              {isSubmitting && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              )}
              {isSubmitting ? 'Submitting...' : 'Submit Issue Report'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}