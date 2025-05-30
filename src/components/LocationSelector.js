// src/components/LocationSelector.js
import { useState, useEffect } from 'react';
import MapModal from './MapModal';
import '../styles/LocationSelector.css';

const LocationSelector = ({ 
  location, 
  latitude, 
  longitude, 
  onLocationChange, 
  disabled = false,
  onError 
}) => {
  const [showMapModal, setShowMapModal] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Load Leaflet CSS and JS
  useEffect(() => {
    if (!window.L) {
      // Load Leaflet CSS
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      cssLink.crossOrigin = '';
      document.head.appendChild(cssLink);

      // Load Leaflet JS
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      script.async = true;
      script.defer = true;
      script.onload = () => setLeafletLoaded(true);
      script.onerror = () => {
        console.error('Failed to load Leaflet');
        setLeafletLoaded(false);
      };
      document.head.appendChild(script);
    } else {
      setLeafletLoaded(true);
    }
  }, []);

  const handleLocationInputChange = (e) => {
    const address = e.target.value;
    onLocationChange({
      address,
      latitude: null,
      longitude: null
    });
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      // Using Nominatim (OpenStreetMap) for reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();
      return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  };

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      setIsLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Get address using reverse geocoding
          const address = await reverseGeocode(latitude, longitude);
          
          onLocationChange({
            address,
            latitude,
            longitude
          });
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          onError && onError("Unable to get your location. Please select manually or enter location manually.");
          setIsLoadingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      onError && onError("Geolocation is not supported by your browser.");
    }
  };

  const openMapModal = () => {
    if (!leafletLoaded) {
      onError && onError("Map is still loading. Please wait...");
      return;
    }
    setShowMapModal(true);
  };

  const handleMapSelection = (lat, lng, address) => {
    onLocationChange({
      address: address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      latitude: lat,
      longitude: lng
    });
    setShowMapModal(false);
  };

  const clearLocation = () => {
    onLocationChange({
      address: '',
      latitude: null,
      longitude: null
    });
  };

  return (
    <div className="form-group location-selector">
      <label htmlFor="location">Location</label>
      <div className="location-input-group">
        <input
          id="location"
          type="text"
          placeholder="Enter location or select on map"
          value={location}
          onChange={handleLocationInputChange}
          required
          disabled={disabled}
          className="location-input"
        />
        <div className="location-buttons">
          <button
            type="button"
            onClick={getCurrentLocation}
            className="location-btn current-location-btn"
            disabled={disabled || isLoadingLocation}
            title="Use current location"
          >
            {isLoadingLocation ? (
              <div className="spinner-small"></div>
            ) : (
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M3.05,13H1V11H3.05C3.5,6.83 6.83,3.5 11,3.05V1H13V3.05C17.17,3.5 20.5,6.83 20.95,11H23V13H20.95C20.5,17.17 17.17,20.5 13,20.95V23H11V20.95C6.83,20.5 3.5,17.17 3.05,13M12,5A7,7 0 0,0 5,12A7,7 0 0,0 12,19A7,7 0 0,0 19,12A7,7 0 0,0 12,5Z" />
              </svg>
            )}
          </button>
          <button
            type="button"
            onClick={openMapModal}
            className="location-btn map-btn"
            disabled={disabled || !leafletLoaded}
            title="Select on map"
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" />
            </svg>
          </button>
          {(latitude || longitude || location) && (
            <button
              type="button"
              onClick={clearLocation}
              className="location-btn clear-btn"
              disabled={disabled}
              title="Clear location"
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
              </svg>
            </button>
          )}
        </div>
      </div>
      {latitude && longitude && (
        <small className="coordinates-info">
          📍 {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </small>
      )}

      {/* Map Modal */}
      {showMapModal && (
        <MapModal 
          onSelect={handleMapSelection} 
          onClose={() => setShowMapModal(false)}
          initialLocation={latitude && longitude ? { lat: latitude, lng: longitude } : null}
        />
      )}
    </div>
  );
};

export default LocationSelector;