import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon issue with webpack/vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface LocationPickerMapProps {
  onLocationSelect: (latlng: L.LatLng) => void;
  initialPosition?: L.LatLngTuple; // Optional initial position
  mapHeight?: string; // Optional map height
  selectedLocationCoords?: L.LatLng | null; // Coordinates from selected suggestion
}

// Internal component to handle map events and updates
const MapEventsHandler: React.FC<{ 
    position: L.LatLng | null;
    setPosition: (pos: L.LatLng | null) => void;
    onLocationSelect: (latlng: L.LatLng) => void;
    selectedLocationCoords?: L.LatLng | null;
}> = ({ position, setPosition, onLocationSelect, selectedLocationCoords }) => {
    const map = useMap();

    // Handle map clicks
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
            onLocationSelect(e.latlng);
            // Optional: Fly to the selected location on click
            // map.flyTo(e.latlng, map.getZoom());
        },
    });

    // Handle updates from selected suggestion coordinates
    useEffect(() => {
        if (selectedLocationCoords) {
            setPosition(selectedLocationCoords);
            map.flyTo(selectedLocationCoords, map.getZoom() < 13 ? 13 : map.getZoom()); // Fly to the location, ensure reasonable zoom
        }
    }, [selectedLocationCoords, map]); // Dependency array includes map instance

    return position === null ? null : (
        <Marker position={position}>
            <Popup>Selected Location</Popup>
        </Marker>
    );
};

const LocationPickerMap: React.FC<LocationPickerMapProps> = ({ 
  onLocationSelect, 
  initialPosition = [51.505, -0.09], // Default to London
  mapHeight = '300px', // Default height
  selectedLocationCoords = null // Default to null
}) => {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const mapRef = useRef<L.Map>(null);

  // Effect to set initial marker if initialPosition changes and no position is set yet
  // This runs only once or when initialPosition changes significantly
  useEffect(() => {
    if (initialPosition && !position && !selectedLocationCoords) {
      const latLng = L.latLng(initialPosition[0], initialPosition[1]);
      setPosition(latLng);
      // Do not call onLocationSelect here, only set initial view
    }
  }, [initialPosition]); // Only depends on initialPosition

  // Set position initially if selectedLocationCoords is provided on mount
  useEffect(() => {
      if (selectedLocationCoords && !position) {
          setPosition(selectedLocationCoords);
      }
  }, [selectedLocationCoords]); // Run once on mount if coords are present

  return (
    <MapContainer 
      center={position ? [position.lat, position.lng] : initialPosition} // Center on position if set, else initial
      zoom={13} 
      scrollWheelZoom={true} 
      style={{ height: mapHeight, width: '100%' }}
      whenCreated={(mapInstance) => { (mapRef as any).current = mapInstance; }}
      key={selectedLocationCoords ? `${selectedLocationCoords.lat}-${selectedLocationCoords.lng}` : 'initial'} // Force re-render if coords change drastically (optional)
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEventsHandler 
        position={position} 
        setPosition={setPosition} 
        onLocationSelect={onLocationSelect} 
        selectedLocationCoords={selectedLocationCoords} 
      />
    </MapContainer>
  );
};

export default LocationPickerMap;

