# Map Integration Strategy

## 1. User Location Setting (Free API)

*   **API/Library:** Leaflet.js with OpenStreetMap (OSM) tiles.
*   **React Wrapper:** `react-leaflet`.
*   **Geocoding (Address Search):** Nominatim (via a fetch call or a Leaflet geocoding plugin).
*   **Integration Point:** `RiderHome.tsx`. Replace or augment existing location input fields.
*   **Component:** Create `LocationPickerMap.tsx`.
*   **Functionality:** Display map, allow address search, allow pin dropping, return selected coordinates/address.
*   **State Management:** Update pickup/destination in `AppContext`.

## 2. Driver Map View (Google Maps)

*   **API/Library:** Google Maps JavaScript API.
*   **React Wrapper:** `@react-google-maps/api`.
*   **Integration Point:** `DriverHome.tsx`.
*   **Component:** Create `DriverMapView.tsx`.
*   **Functionality:** Display map with markers for pickup and destination locations based on ride data.
*   **API Key:** **Requires a Google Maps API key.** A placeholder will be added (`VITE_GOOGLE_MAPS_API_KEY` in `.env.local`). The user must obtain and configure their own key.

## 3. Implementation Notes

*   Install necessary dependencies: `leaflet`, `react-leaflet`, `@types/leaflet`, `@react-google-maps/api`.
*   Modify `AppContext.tsx` to handle map coordinates/addresses.
*   Update `RiderHome.tsx` and `DriverHome.tsx` to integrate the new map components.
