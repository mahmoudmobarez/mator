import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { useAppContext } from '../contexts/AppContext';
import Button from './common/Button';
import Input from './common/Input';
import PageWrapper from './common/PageWrapper';
import { ActiveRideDetails, Offer, LatLngLiteral } from '../types'; // Import LatLngLiteral
import { MIN_RIDE_PRICE, MOCK_DRIVER_OFFERS, MOCK_API_DELAY } from '../constants';
import Modal from './common/Modal';
import LocationPickerMap from './LocationPickerMap'; // Import the map component

// --- Nominatim Types (Simplified) ---
type NominatimSuggestion = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

// --- Debounce Hook ---
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

enum RiderFlowState {
  IDLE, // Inputting locations
  SET_PRICE, // Setting initial price
  VIEW_OFFERS, // Viewing driver offers
  TRACKING_RIDE, // Tracking accepted ride
}

// Helper function for basic reverse geocoding (using Nominatim - requires user consent/attribution)
// NOTE: In a real app, use a proper geocoding service with API keys and error handling.
const reverseGeocode = async (latlng: L.LatLng): Promise<string> => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`);
    if (!response.ok) throw new Error('Geocoding failed');
    const data = await response.json();
    return data.display_name || `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`;
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`; // Fallback to coordinates
  }
};

// Helper function for Nominatim search suggestions
const fetchNominatimSuggestions = async (query: string): Promise<NominatimSuggestion[]> => {
  if (!query || query.length < 3) return []; // Don't search for very short queries
  try {
    // Limit to 5 suggestions as before
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=0`);
    if (!response.ok) throw new Error('Nominatim search failed');
    const data: NominatimSuggestion[] = await response.json();
    return data;
  } catch (error) {
    console.error("Nominatim search error:", error);
    return [];
  }
};

const RiderHome: React.FC = () => {
  const { currentUser, addNotification, activeRide, setActiveRide, walletBalance, updateWalletBalance, setLoading, isLoading } = useAppContext();
  const navigate = useNavigate();

  // Location Text State
  const [pickupLocationText, setPickupLocationText] = useState('');
  const [destinationLocationText, setDestinationLocationText] = useState('');

  // Location Coordinates State (for submission)
  const [pickupCoords, setPickupCoords] = useState<L.LatLng | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<L.LatLng | null>(null);

  // --- Autocomplete State ---
  const [pickupSuggestions, setPickupSuggestions] = useState<NominatimSuggestion[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<NominatimSuggestion[]>([]);
  const [isPickupSearching, setIsPickupSearching] = useState(false);
  const [isDestinationSearching, setIsDestinationSearching] = useState(false);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);

  // State to pass selected suggestion coords to map
  const [pickupMapCoords, setPickupMapCoords] = useState<L.LatLng | null>(null);
  const [destinationMapCoords, setDestinationMapCoords] = useState<L.LatLng | null>(null);

  // Debounce search terms
  const debouncedPickupSearchTerm = useDebounce(pickupLocationText, 500); // 500ms delay
  const debouncedDestinationSearchTerm = useDebounce(destinationLocationText, 500);

  // Refs for suggestion boxes to handle outside clicks
  const pickupSuggestionsRef = useRef<HTMLDivElement>(null);
  const destinationSuggestionsRef = useRef<HTMLDivElement>(null);

  // --- End Autocomplete State ---

  const [riderPrice, setRiderPrice] = useState<number>(MIN_RIDE_PRICE); // Validated price
  const [riderPriceInput, setRiderPriceInput] = useState<string>(MIN_RIDE_PRICE.toString()); // Raw input string
  const [calculatedDistance, setCalculatedDistance] = useState<number | null>(null); // State for distance
  const [flowState, setFlowState] = useState<RiderFlowState>(RiderFlowState.IDLE);
  const [driverOffers, setDriverOffers] = useState<Offer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isCounterOfferModalOpen, setIsCounterOfferModalOpen] = useState(false);
  const [counterOfferPrice, setCounterOfferPrice] = useState<number>(0);

  const [showTrackingPopup, setShowTrackingPopup] = useState(false);

  // --- Map State ---
  const [initialMapCenter, setInitialMapCenter] = useState<L.LatLngTuple>([38.9637, 35.2433]); // Default to Turkey as a fallback
  const [mapFor, setMapFor] = useState<'pickup' | 'destination' | null>(null); // Which input the map is currently for

  // Get user's location on mount for initial map view
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setInitialMapCenter([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Geolocation error:", error);
          addNotification('Could not get current location. Map defaulting to a central view.', 'warning');
          // Keep the default fallback center
        },
        { timeout: 10000 } // Add a timeout
      );
    } else {
      addNotification('Geolocation is not supported by your browser.', 'warning');
      // Keep the default fallback center
    }
  }, [addNotification]); // Run once on mount

  // --- Calculate Distance --- 
  useEffect(() => {
    if (pickupCoords && destinationCoords) {
      const distanceMeters = pickupCoords.distanceTo(destinationCoords);
      setCalculatedDistance(distanceMeters / 1000); // Convert meters to kilometers
    } else {
      setCalculatedDistance(null); // Reset if coords are missing
    }
  }, [pickupCoords, destinationCoords]);

  // --- Map Integration Callbacks --- 
  const handlePickupSelect = useCallback(async (latlng: L.LatLng) => {
    setPickupCoords(latlng); // Set coords for submission
    setPickupMapCoords(latlng); // Update map coords immediately (if map is visible)
    setLoading(true); // Show loading while geocoding
    const address = await reverseGeocode(latlng);
    setPickupLocationText(address);
    setShowPickupSuggestions(false); // Hide suggestions after map select
    setMapFor(null); // Hide map after selection
    setLoading(false);
  }, [setLoading]);

  const handleDestinationSelect = useCallback(async (latlng: L.LatLng) => {
    setDestinationCoords(latlng); // Set coords for submission
    setDestinationMapCoords(latlng); // Update map coords immediately (if map is visible)
    setLoading(true);
    const address = await reverseGeocode(latlng);
    setDestinationLocationText(address);
    setShowDestinationSuggestions(false); // Hide suggestions after map select
    setMapFor(null); // Hide map after selection
    setLoading(false);
  }, [setLoading]);
  // --- End Map Integration Callbacks ---

  // --- Autocomplete Effects ---
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedPickupSearchTerm && showPickupSuggestions) {
        setIsPickupSearching(true);
        const suggestions = await fetchNominatimSuggestions(debouncedPickupSearchTerm);
        setPickupSuggestions(suggestions);
        setIsPickupSearching(false);
      } else {
        setPickupSuggestions([]); // Clear suggestions if search term is empty or box hidden
      }
    };
    fetchSuggestions();
  }, [debouncedPickupSearchTerm, showPickupSuggestions]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedDestinationSearchTerm && showDestinationSuggestions) {
        setIsDestinationSearching(true);
        const suggestions = await fetchNominatimSuggestions(debouncedDestinationSearchTerm);
        setDestinationSuggestions(suggestions);
        setIsDestinationSearching(false);
      } else {
        setDestinationSuggestions([]); // Clear suggestions
      }
    };
    fetchSuggestions();
  }, [debouncedDestinationSearchTerm, showDestinationSuggestions]);

  // Handle clicks outside suggestion boxes
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickupSuggestionsRef.current && !pickupSuggestionsRef.current.contains(event.target as Node)) {
        setShowPickupSuggestions(false);
      }
      if (destinationSuggestionsRef.current && !destinationSuggestionsRef.current.contains(event.target as Node)) {
        setShowDestinationSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- End Autocomplete Effects ---

  // --- Autocomplete Handlers ---
  const handlePickupInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPickupLocationText(e.target.value);
    setPickupCoords(null); // Clear submission coords if text is manually changed
    setPickupMapCoords(null); // Clear map coords as well
    setShowPickupSuggestions(true); // Show suggestions when typing
    setMapFor(null); // Hide map if user starts typing
  };

  const handleDestinationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDestinationLocationText(e.target.value);
    setDestinationCoords(null); // Clear submission coords
    setDestinationMapCoords(null); // Clear map coords
    setShowDestinationSuggestions(true); // Show suggestions
    setMapFor(null); // Hide map if user starts typing
  };

  const handleSelectSuggestion = (suggestion: NominatimSuggestion, type: 'pickup' | 'destination') => {
    const latlng = L.latLng(parseFloat(suggestion.lat), parseFloat(suggestion.lon));
    if (type === 'pickup') {
      setPickupLocationText(suggestion.display_name);
      setPickupCoords(latlng); // Set submission coords
      setPickupMapCoords(latlng); // Set map coords to trigger update
      setPickupSuggestions([]);
      setShowPickupSuggestions(false);
      setMapFor(null); // Hide map after selection
    } else {
      setDestinationLocationText(suggestion.display_name);
      setDestinationCoords(latlng); // Set submission coords
      setDestinationMapCoords(latlng); // Set map coords to trigger update
      setDestinationSuggestions([]);
      setShowDestinationSuggestions(false);
      setMapFor(null); // Hide map after selection
    }
  };

  // Handler for 'Use Current Location' button
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      addNotification('Getting current location...', 'info');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latlng = L.latLng(position.coords.latitude, position.coords.longitude);
          handlePickupSelect(latlng); // Reuse the map select logic
          setLoading(false); // Loading handled within handlePickupSelect
        },
        (error) => {
          console.error("Geolocation error:", error);
          addNotification('Could not get current location. Please select manually or type address.', 'error');
          setLoading(false);
        },
        { timeout: 10000, enableHighAccuracy: true } // Options
      );
    } else {
      addNotification('Geolocation is not supported by your browser.', 'warning');
    }
  };

  // --- End Autocomplete Handlers ---

  useEffect(() => {
    if (activeRide) {
      setFlowState(RiderFlowState.TRACKING_RIDE);
      setShowTrackingPopup(false); // Close popup if returning to tracking view
    } else {
      if (flowState === RiderFlowState.TRACKING_RIDE) {
        addNotification('Your ride has been completed! Thank you for using Mator.', 'success');
        setFlowState(RiderFlowState.IDLE);
        // Reset locations and coords for next ride
        setPickupLocationText('');
        setDestinationLocationText('');
        setPickupCoords(null);
        setDestinationCoords(null);
        setPickupMapCoords(null); // Reset map coords
        setDestinationMapCoords(null); // Reset map coords
        setRiderPrice(MIN_RIDE_PRICE);
        setRiderPriceInput(MIN_RIDE_PRICE.toString()); // Reset input string too
        setCalculatedDistance(null); // Reset distance
        setMapFor(null); // Ensure map is hidden
      }
    }
  }, [activeRide, flowState, addNotification]); // Added flowState and addNotification dependencies

  useEffect(() => {
    if (activeRide && flowState !== RiderFlowState.TRACKING_RIDE) {
        setShowTrackingPopup(true);
    } else {
        setShowTrackingPopup(false);
    }
  }, [activeRide, flowState, navigate]);

  // Function to get a displayable location string (address or coords)
  const getDisplayLocation = (text: string, coords: L.LatLng | null): string => {
      return text || (coords ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}` : '');
  }

  const handleLocationSubmit = () => {
    const pickupDisplay = getDisplayLocation(pickupLocationText, pickupCoords);
    const destinationDisplay = getDisplayLocation(destinationLocationText, destinationCoords);

    if (!pickupDisplay || !destinationDisplay) {
      addNotification('Please set both pickup and destination locations (use map or type).', 'warning');
      return;
    }
    // We proceed even if only text is entered, but coords are preferred for accuracy
    if (!pickupCoords || !destinationCoords) {
        addNotification('Consider selecting exact locations on the map for better accuracy.', 'info');
    }
    setFlowState(RiderFlowState.SET_PRICE);
    addNotification('Locations confirmed. Now, set your price!', 'info');
  };

  // --- Price Input Handlers ---
  const handlePriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRiderPriceInput(e.target.value); // Update raw input string
  };

  const handlePriceInputBlur = () => {
    const priceValue = parseFloat(riderPriceInput);
    if (isNaN(priceValue) || priceValue < MIN_RIDE_PRICE) {
      setRiderPrice(MIN_RIDE_PRICE);
      setRiderPriceInput(MIN_RIDE_PRICE.toString());
      addNotification(`Price must be at least $${MIN_RIDE_PRICE}. Adjusted automatically.`, 'warning');
    } else {
      setRiderPrice(priceValue);
      setRiderPriceInput(priceValue.toString()); // Update input to reflect validated number
    }
  };
  // --- End Price Input Handlers ---

  const handlePriceSubmit = async () => {
    // Final validation before submitting (already handled by onBlur, but good safeguard)
    if (riderPrice < MIN_RIDE_PRICE) {
      addNotification(`Price must be at least $${MIN_RIDE_PRICE}.`, 'warning');
      // Optionally force re-validation/update input here if needed
      handlePriceInputBlur(); 
      return;
    }
    setLoading(true);
    addNotification('Searching for drivers...', 'info');
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
    setDriverOffers(MOCK_DRIVER_OFFERS.map(offer => ({...offer, price: offer.price + Math.floor(Math.random()*5-2) })));
    setFlowState(RiderFlowState.VIEW_OFFERS);
    setLoading(false);
  };

  const handleAcceptOffer = async (offer: Offer) => {
    if (walletBalance < offer.price) {
      addNotification('Insufficient wallet balance. Please top up.', 'warning');
      navigate('/wallet');
      return;
    }
    setLoading(true);
    addNotification(`Accepted offer from ${offer.driverName} for $${offer.price}.`, 'success');
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));

    const pickupDisplay = getDisplayLocation(pickupLocationText, pickupCoords);
    const destinationDisplay = getDisplayLocation(destinationLocationText, destinationCoords);

    const mockActiveRide: ActiveRideDetails = {
      rideId: 'ride-' + Date.now(),
      driverName: offer.driverName,
      driverRating: offer.driverRating,
      vehicleDetails: 'Honda Wave - Black',
      plateNumber: 'XYZ 123',
      eta: `${Math.floor(Math.random() * 5) + 3} mins`,
      pickupLocation: pickupDisplay, // Use display string
      destinationLocation: destinationDisplay, // Use display string
      // Add coordinates if available
      pickupCoords: pickupCoords ? { lat: pickupCoords.lat, lng: pickupCoords.lng } : undefined,
      destinationCoords: destinationCoords ? { lat: destinationCoords.lat, lng: destinationCoords.lng } : undefined,
      // Add currentDriverLocation simulation if needed later
    };
    setActiveRide(mockActiveRide);
    updateWalletBalance(offer.price, 'subtract');
    setFlowState(RiderFlowState.TRACKING_RIDE);
    setLoading(false);
  };

  const openCounterOfferModal = (offer: Offer) => {
    setSelectedOffer(offer);
    setCounterOfferPrice(offer.price - 1);
    setIsCounterOfferModalOpen(true);
  };

  const handleCounterOfferSubmit = async () => {
    if (!selectedOffer || counterOfferPrice <= 0 || counterOfferPrice >= selectedOffer.price) {
      addNotification('Invalid counter offer price.', 'warning');
      return;
    }
    setLoading(true);
    addNotification(`Sent counter offer of $${counterOfferPrice.toFixed(2)} to ${selectedOffer.driverName}.`, 'info');
    setIsCounterOfferModalOpen(false);
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
    // Mock driver response (e.g., 50% chance of accepting)
    if (Math.random() > 0.5) {
      addNotification(`${selectedOffer.driverName} accepted your counter offer!`, 'success');
      handleAcceptOffer({ ...selectedOffer, price: counterOfferPrice });
    } else {
      addNotification(`${selectedOffer.driverName} rejected your counter offer.`, 'warning');
      // Optionally remove the offer or keep it as is
      setDriverOffers(prev => prev.filter(o => o.id !== selectedOffer.id));
    }
    setLoading(false);
  };

  // --- Render Functions ---
  const renderIdleState = () => (
    <div className="space-y-4 p-4 bg-slate-800 rounded-lg shadow-xl">
      <h2 className="text-xl font-semibold text-yellow-400">Where to?</h2>

      {/* Pickup Location Input & Suggestions */}
      <div className="relative" ref={pickupSuggestionsRef}>
        <Input
          label="Pickup Location"
          value={pickupLocationText}
          onChange={handlePickupInputChange}
          onFocus={() => { setShowPickupSuggestions(true); setMapFor('pickup'); }} // Show suggestions & potentially map on focus
          placeholder="Type address or select on map"
          disabled={isLoading}
          autoComplete="off" // Disable browser autocomplete
        />
        {/* 'Use Current Location' Button */} 
        <button 
            onClick={handleUseCurrentLocation}
            className="text-sm text-blue-400 hover:text-blue-300 absolute right-0 -bottom-5 disabled:opacity-50"
            disabled={isLoading}
        >
            Use Current Location
        </button>

        {showPickupSuggestions && (
          <div className="absolute z-40 w-full mt-1 bg-slate-700 border border-slate-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {isPickupSearching && <div className="px-4 py-2 text-slate-400">Searching...</div>}
            {!isPickupSearching && pickupSuggestions.length > 0 && pickupSuggestions.map((suggestion) => (
              <div
                key={suggestion.place_id}
                className="px-4 py-2 text-slate-200 hover:bg-slate-600 cursor-pointer"
                onClick={() => handleSelectSuggestion(suggestion, 'pickup')}
              >
                {suggestion.display_name}
              </div>
            ))}
            {!isPickupSearching && pickupSuggestions.length === 0 && debouncedPickupSearchTerm.length >= 3 && (
                 <div className="px-4 py-2 text-slate-400">No suggestions found. Try adjusting your search or use the map.</div>
            )}
            {/* Optional: Add a button here to explicitly open map for pickup */} 
            {/* <button onClick={() => setMapFor('pickup')} className="text-center w-full py-2 text-blue-400 hover:bg-slate-600">Select on Map</button> */} 
          </div>
        )}
      </div>

      {/* Destination Location Input & Suggestions */}
      <div className="relative mt-6" ref={destinationSuggestionsRef}> {/* Added margin-top */} 
        <Input
          label="Destination"
          value={destinationLocationText}
          onChange={handleDestinationInputChange}
          onFocus={() => { setShowDestinationSuggestions(true); setMapFor('destination'); }} // Show suggestions & potentially map on focus
          placeholder="Type address or select on map"
          disabled={isLoading}
          autoComplete="off"
        />
        {showDestinationSuggestions && (
          <div className="absolute z-40 w-full mt-1 bg-slate-700 border border-slate-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {isDestinationSearching && <div className="px-4 py-2 text-slate-400">Searching...</div>}
            {!isDestinationSearching && destinationSuggestions.length > 0 && destinationSuggestions.map((suggestion) => (
              <div
                key={suggestion.place_id}
                className="px-4 py-2 text-slate-200 hover:bg-slate-600 cursor-pointer"
                onClick={() => handleSelectSuggestion(suggestion, 'destination')}
              >
                {suggestion.display_name}
              </div>
            ))}
             {!isDestinationSearching && destinationSuggestions.length === 0 && debouncedDestinationSearchTerm.length >= 3 && (
                 <div className="px-4 py-2 text-slate-400">No suggestions found. Try adjusting your search or use the map.</div>
            )}
             {/* Optional: Add a button here to explicitly open map for destination */} 
             {/* <button onClick={() => setMapFor('destination')} className="text-center w-full py-2 text-blue-400 hover:bg-slate-600">Select on Map</button> */} 
          </div>
        )}
      </div>

      {/* Conditionally render Map */} 
      {mapFor && initialMapCenter && (
          <div className="mt-4">
              <h3 className="text-lg font-medium text-slate-300 mb-2">Select {mapFor === 'pickup' ? 'Pickup' : 'Destination'} Location</h3>
              <LocationPickerMap
                  key={mapFor} // Force re-mount when switching between pickup/destination
                  onLocationSelect={mapFor === 'pickup' ? handlePickupSelect : handleDestinationSelect}
                  initialPosition={initialMapCenter} // Set initial view based on user location
                  mapHeight="400px"
                  // Pass current coords if available to pre-select marker
                  selectedLocationCoords={mapFor === 'pickup' ? pickupMapCoords : destinationMapCoords} 
              />
          </div>
      )}

      <div className="pt-4"> {/* Add padding top */} 
        <Button 
          onClick={handleLocationSubmit} 
          disabled={isLoading || (!pickupLocationText && !pickupCoords) || (!destinationLocationText && !destinationCoords)} 
          className="w-full"
        >
          Confirm Locations
        </Button>
      </div>
    </div>
  );

  const renderSetPriceState = () => (
    <div className="space-y-4 p-4 bg-slate-800 rounded-lg shadow-xl">
      <h2 className="text-xl font-semibold text-yellow-400">Set Your Price</h2>
      <p className="text-slate-300">From: {getDisplayLocation(pickupLocationText, pickupCoords)}</p>
      <p className="text-slate-300">To: {getDisplayLocation(destinationLocationText, destinationCoords)}</p>
      {/* Display Distance */} 
      {calculatedDistance !== null && (
        <p className="text-slate-400 text-sm">Distance: {calculatedDistance.toFixed(2)} km</p>
      )}
      <Input
        label="Your Offer Price ($)"
        type="number"
        value={riderPriceInput} // Use raw input string for value
        onChange={handlePriceInputChange} // Update raw input string
        onBlur={handlePriceInputBlur} // Validate and clamp on blur
        min={MIN_RIDE_PRICE} // Keep min attribute for browser hints
        step="0.5"
        disabled={isLoading}
        placeholder={`Minimum $${MIN_RIDE_PRICE}`}
      />
      <Button onClick={handlePriceSubmit} disabled={isLoading || riderPrice < MIN_RIDE_PRICE} className="w-full">
        Find Drivers
      </Button>
      <Button onClick={() => setFlowState(RiderFlowState.IDLE)} variant="secondary" className="w-full mt-2">
        Back
      </Button>
    </div>
  );

  const renderViewOffersState = () => (
    <div className="space-y-4 p-4 bg-slate-800 rounded-lg shadow-xl">
      <h2 className="text-xl font-semibold text-yellow-400">Driver Offers</h2>
      {driverOffers.length === 0 && !isLoading && (
        <p className="text-slate-400">No drivers available currently. Try again later or adjust your price.</p>
      )}
      {driverOffers.map((offer) => (
        <div key={offer.id} className="p-3 bg-slate-700 rounded-md flex justify-between items-center">
          <div>
            <p className="text-slate-200 font-medium">{offer.driverName} ({offer.driverRating.toFixed(1)}&#9733;)</p>
            <p className="text-slate-300 text-sm">ETA: {offer.eta}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-yellow-400">${offer.price.toFixed(2)}</span>
            <Button onClick={() => handleAcceptOffer(offer)} size="sm" disabled={isLoading || walletBalance < offer.price}>
              Accept
            </Button>
            <Button onClick={() => openCounterOfferModal(offer)} size="sm" variant="secondary" disabled={isLoading}>
              Counter
            </Button>
          </div>
        </div>
      ))}
      <Button onClick={() => setFlowState(RiderFlowState.SET_PRICE)} variant="secondary" className="w-full mt-2">
        Back to Price
      </Button>
    </div>
  );

  const renderTrackingRideState = () => {
    // Function to generate Google Maps link
    const getGoogleMapsLink = (coords: LatLngLiteral | undefined, label: string) => {
      if (!coords) return null;
      // Use query for showing a point, or dir for directions
      // const url = `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`;
      return (
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-400 hover:text-blue-300 underline"
        >
          Open {label} in Google Maps
        </a>
      );
    };

    return (
      <div className="p-4 bg-slate-800 rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold text-yellow-400">Ride In Progress</h2>
        {activeRide ? (
          <div className="space-y-2 mt-2 text-slate-300">
            <p>Driver: {activeRide.driverName} ({activeRide.driverRating.toFixed(1)}&#9733;)</p>
            <p>Vehicle: {activeRide.vehicleDetails} ({activeRide.plateNumber})</p>
            <p>ETA: {activeRide.eta}</p>
            <p>From: {activeRide.pickupLocation}</p>
            {/* Add Google Maps link for Pickup */} 
            {getGoogleMapsLink(activeRide.pickupCoords, 'Pickup')}
            <p className="mt-1">To: {activeRide.destinationLocation}</p>
            {/* Add Google Maps link for Destination */} 
            {getGoogleMapsLink(activeRide.destinationCoords, 'Destination')}
            
            {/* Add map view for tracking here later */}
            <Button onClick={() => { /* Add cancel logic */ addNotification('Cancel requested', 'info'); }} variant="danger" className="w-full mt-4">
              Cancel Ride (Placeholder)
            </Button>
          </div>
        ) : (
          <p className="text-slate-400">Loading ride details...</p>
        )}
      </div>
    );
  };

  return (
    <PageWrapper title="Request a Ride">
      {/* Conditional Rendering based on Flow State */} 
      {flowState === RiderFlowState.IDLE && renderIdleState()}
      {flowState === RiderFlowState.SET_PRICE && renderSetPriceState()}
      {flowState === RiderFlowState.VIEW_OFFERS && renderViewOffersState()}
      {flowState === RiderFlowState.TRACKING_RIDE && renderTrackingRideState()}

      {/* Counter Offer Modal */} 
      {selectedOffer && (
        <Modal
          isOpen={isCounterOfferModalOpen}
          onClose={() => setIsCounterOfferModalOpen(false)}
          title={`Counter Offer to ${selectedOffer.driverName}`}
        >
          <div className="space-y-4">
            <p className="text-slate-300">Driver's offer: ${selectedOffer.price.toFixed(2)}</p>
            <Input
              label="Your Counter Offer ($)"
              type="number"
              value={counterOfferPrice.toString()}
              onChange={(e) => setCounterOfferPrice(parseFloat(e.target.value) || 0)}
              max={selectedOffer.price - 0.01} // Ensure counter is lower
              min="0.01"
              step="0.01"
              disabled={isLoading}
            />
            <Button onClick={handleCounterOfferSubmit} disabled={isLoading || counterOfferPrice <= 0 || counterOfferPrice >= selectedOffer.price} className="w-full">
              Send Counter Offer
            </Button>
          </div>
        </Modal>
      )}

       {/* Ride Active Popup */} 
       {showTrackingPopup && activeRide && (
           <div className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 cursor-pointer animate-pulse"
                onClick={() => {
                    setFlowState(RiderFlowState.TRACKING_RIDE);
                    setShowTrackingPopup(false);
                }}
           >
               <p className="font-semibold">Ride in progress!</p>
               <p>Driver {activeRide.driverName} is on the way.</p>
               <p className="text-sm">Click to view details.</p>
           </div>
       )}
    </PageWrapper>
  );
};

export default RiderHome;

