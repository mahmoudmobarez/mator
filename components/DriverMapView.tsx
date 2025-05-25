import React from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import { LatLngLiteral } from '../types'; // Assuming LatLngLiteral is defined in types

interface DriverMapViewProps {
  pickupCoords?: LatLngLiteral;
  destinationCoords?: LatLngLiteral;
  pickupAddress?: string; // Fallback if coords are not available
  destinationAddress?: string; // Fallback if coords are not available
  mapHeight?: string;
}

const containerStyle = {
  width: '100%',
  height: '400px' // Default height, can be overridden by props
};

// A default center (e.g., a central location) if no coords are provided initially
const defaultCenter = { lat: 34.0522, lng: -118.2437 }; // Example: Los Angeles

const DriverMapView: React.FC<DriverMapViewProps> = ({ 
  pickupCoords, 
  destinationCoords, 
  pickupAddress,
  destinationAddress,
  mapHeight 
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [directionsResponse, setDirectionsResponse] = React.useState<google.maps.DirectionsResult | null>(null);
  const [mapCenter, setMapCenter] = React.useState<LatLngLiteral>(defaultCenter);

  React.useEffect(() => {
    // Center map based on pickup location when available
    if (pickupCoords) {
      setMapCenter(pickupCoords);
    } else if (destinationCoords) {
      // Or destination if pickup isn't available
      setMapCenter(destinationCoords);
    }
    // Note: Geocoding addresses to center map is complex and costly, 
    // relying on coords is preferred. If only addresses are available,
    // the map might stay at the default center until directions are calculated.
  }, [pickupCoords, destinationCoords]);

  const directionsCallback = React.useCallback((response: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
    if (response !== null && status === 'OK') {
      setDirectionsResponse(response);
    } else {
      console.error(`Directions request failed due to ${status}`);
      // Optionally show an error message to the user
    }
  }, []);

  // Determine origin and destination for DirectionsService
  // Prioritize coordinates, fall back to addresses
  const origin = pickupCoords ? pickupCoords : pickupAddress;
  const destination = destinationCoords ? destinationCoords : destinationAddress;

  if (!apiKey) {
    return <div className="p-4 text-center text-red-500 bg-red-100 border border-red-400 rounded">Google Maps API Key is missing. Please configure VITE_GOOGLE_MAPS_API_KEY in your .env.local file.</div>;
  }

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={{ ...containerStyle, height: mapHeight || containerStyle.height }}
        center={mapCenter}
        zoom={11} // Adjust zoom as needed
      >
        {/* Render Directions if origin and destination are set */} 
        {origin && destination && !directionsResponse && (
          <DirectionsService
            options={{
              destination: destination,
              origin: origin,
              travelMode: google.maps.TravelMode.DRIVING
            }}
            callback={directionsCallback}
          />
        )}

        {directionsResponse && (
          <DirectionsRenderer
            options={{
              directions: directionsResponse
            }}
          />
        )}

        {/* Fallback: Show markers if directions fail or aren't requested (e.g., only one point) */} 
        {!directionsResponse && (
          <>
            {pickupCoords && <Marker position={pickupCoords} label="P" title="Pickup" />}
            {destinationCoords && <Marker position={destinationCoords} label="D" title="Destination" />}
          </>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default DriverMapView;

