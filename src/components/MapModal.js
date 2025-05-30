// src/components/MapModal.js
import { useState, useEffect, useRef } from 'react';
import '../styles/MapModal.css';

const MapModal = ({ onSelect, onClose, initialLocation = null }) => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [address, setAddress] = useState("");
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    if (window.L && mapRef.current) {
      initializeMap();
    }
  }, []);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Cleanup map on unmount
  useEffect(() => {
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [map]);

  const initializeMap = () => {
    const defaultCenter = [11.9139, 79.8145]; // Puducherry coordinates [lat, lng]
    const center = initialLocation ? [initialLocation.lat, initialLocation.lng] : defaultCenter;

    // Create map instance
    const mapInstance = window.L.map(mapRef.current, {
      center: center,
      zoom: initialLocation ? 15 : 13,
      zoomControl: true,
    });

    // Add OpenStreetMap tiles
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstance);

    setMap(mapInstance);

    // Add existing marker if there's an initial location
    if (initialLocation) {
      const existingMarker = window.L.marker([initialLocation.lat, initialLocation.lng])
        .addTo(mapInstance);
      setMarker(existingMarker);
      
      // Get address for initial location
      reverseGeocode(initialLocation.lat, initialLocation.lng);
    }

    // Add click listener to map
    mapInstance.on('click', (event) => {
      const lat = event.latlng.lat;
      const lng = event.latlng.lng;
      selectLocation(lat, lng, mapInstance);
    });

    // Try to get user's current location if no initial location
    if (!initialLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = [position.coords.latitude, position.coords.longitude];
          mapInstance.setView(userLocation, 15);
        },
        (error) => {
          console.log('Could not get user location:', error);
        }
      );
    }
  };

  const selectLocation = (lat, lng, mapInstance) => {
    // Remove existing marker
    if (marker) {
      mapInstance.removeLayer(marker);
    }

    // Add new marker
    const newMarker = window.L.marker([lat, lng]).addTo(mapInstance);
    setMarker(newMarker);
    setSelectedLocation({ lat, lng });

    // Get address for selected location
    reverseGeocode(lat, lng);
  };

  const reverseGeocode = async (lat, lng) => {
    setIsLoadingAddress(true);
    try {
      // Using Nominatim (OpenStreetMap) for reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'YourAppName/1.0' // Replace with your app name
          }
        }
      );
      const data = await response.json();
      
      if (data && data.display_name) {
        setAddress(data.display_name);
      } else {
        setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    }
    setIsLoadingAddress(false);
  };

  const handleConfirmSelection = () => {
    if (selectedLocation) {
      onSelect(selectedLocation.lat, selectedLocation.lng, address);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('map-modal-overlay')) {
      onClose();
    }
  };

  return (
    <div className="map-modal-overlay" onClick={handleOverlayClick}>
      <div className="map-modal">
        <div className="map-modal-header">
          <h3>Select Location</h3>
          <p className="map-modal-subtitle">Click on the map to select a location</p>
          <button onClick={onClose} className="close-btn">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
            </svg>
          </button>
        </div>
        
        <div className="map-container">
          <div 
            ref={mapRef} 
            id="leaflet-map" 
            style={{ width: "100%", height: "400px" }}
          ></div>
          {isLoadingAddress && (
            <div className="map-loading-overlay">
              <div className="spinner"></div>
              <span>Getting address...</span>
            </div>
          )}
        </div>

        {selectedLocation && (
          <div className="selected-location-info">
            <div className="location-info-header">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" />
              </svg>
              <strong>Selected Location</strong>
            </div>
            <p className="location-address">
              {address || `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`}
            </p>
            <p className="location-coordinates">
              Coordinates: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
            </p>
          </div>
        )}

        <div className="map-modal-actions">
          <button onClick={onClose} className="cancel-btn">
            Cancel
          </button>
          <button 
            onClick={handleConfirmSelection} 
            className="confirm-btn"
            disabled={!selectedLocation}
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
            </svg>
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapModal;