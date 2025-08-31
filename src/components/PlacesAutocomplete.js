import React, { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { Input } from './ui/input';
import config from '../config/environment';

const PlacesAutocomplete = ({ 
  value, 
  onChange, 
  placeholder, 
  className = "",
  onAddressSelect 
}) => {
  const [autocomplete, setAutocomplete] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const autocompleteService = useRef(null);
  const placesService = useRef(null);

  useEffect(() => {
    // Initialize Google Places services when component mounts
    if (window.google && window.google.maps) {
      initializeServices();
    } else {
      // Load Google Maps script if not already loaded
      loadGoogleMapsScript();
    }
  }, []);

  const loadGoogleMapsScript = () => {
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      // Script already exists, wait for it to load
      const checkGoogleMaps = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkGoogleMaps);
          initializeServices();
        }
      }, 100);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${config.GOOGLE_PLACES_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google && window.google.maps) {
        initializeServices();
      }
    };
    document.head.appendChild(script);
  };

  const initializeServices = () => {
    if (!window.google || !window.google.maps) return;

    autocompleteService.current = new window.google.maps.places.AutocompleteService();
    placesService.current = new window.google.maps.places.PlacesService(
      document.createElement('div')
    );
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    if (inputValue.length < 3) {
      setPredictions([]);
      setShowPredictions(false);
      return;
    }

    if (!autocompleteService.current) {
      console.warn('Google Places service not initialized');
      return;
    }

    setIsLoading(true);

    // Create search request without restrictions
    const request = {
      input: inputValue,
      types: ['address'] // Only return addresses (cannot mix with geocode)
    };

    autocompleteService.current.getPlacePredictions(request, (predictions, status) => {
      setIsLoading(false);
      
      if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
        setPredictions(predictions);
        setShowPredictions(predictions.length > 0);
      } else {
        setPredictions([]);
        setShowPredictions(false);
      }
    });
  };

  const handlePredictionSelect = (prediction) => {
    if (!placesService.current) return;

    placesService.current.getDetails(
      {
        placeId: prediction.place_id,
        fields: ['formatted_address', 'address_components', 'geometry']
      },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
          const fullAddress = place.formatted_address;
          
          // Update the input value
          onChange(fullAddress);
          
          // Call the callback with the selected address
          if (onAddressSelect) {
            onAddressSelect(fullAddress, place);
          }
          
          // Hide predictions
          setShowPredictions(false);
          setPredictions([]);
        }
      }
    );
  };

  const handleInputFocus = () => {
    if (predictions.length > 0) {
      setShowPredictions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding predictions to allow for clicks
    setTimeout(() => {
      setShowPredictions(false);
    }, 200);
  };

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
        <Input
          ref={inputRef}
          placeholder={placeholder}
          className={`pl-11 h-12 text-base ${className}`}
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
        {isLoading && (
          <div className="absolute right-3 top-3.5">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-500"></div>
          </div>
        )}
      </div>

      {/* Predictions Dropdown */}
      {showPredictions && predictions.length > 0 && (
        <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-xl mt-2 shadow-xl max-h-48 overflow-y-auto">
          {predictions.map((prediction, index) => (
            <button
              key={prediction.place_id || index}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0 transition-colors"
              onClick={() => handlePredictionSelect(prediction)}
            >
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {prediction.structured_formatting?.main_text || prediction.description}
                  </div>
                  <div className="text-xs text-gray-500">
                    {prediction.structured_formatting?.secondary_text || ''}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Helper text */}
      <div className="mt-2 text-xs text-gray-500">
        Start typing to see address suggestions
      </div>
    </div>
  );
};

export default PlacesAutocomplete;
