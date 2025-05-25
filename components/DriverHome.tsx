import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import Button from './common/Button';
import Input from './common/Input';
import PageWrapper from './common/PageWrapper';
import { RideRequest, ActiveRideDetails, UserRole, LatLngLiteral } from '../types'; // Import LatLngLiteral
import { MOCK_RIDE_REQUESTS_FOR_DRIVER, MOCK_API_DELAY, BRAND_COLORS, MOCK_HISTORY_RIDES } from '../constants';
import Modal from './common/Modal';
import DriverMapView from './DriverMapView'; // Import the map component

interface DriverOffer extends RideRequest { // Extend RideRequest which now includes optional coords
  driverOfferPrice?: number;
  status: RideRequest['status'] | 'offer_sent' | 'counter_received';
  riderCounterOffer?: number;
}

const DriverHome: React.FC = () => {
  const { currentUser, addNotification, activeRide, setActiveRide, walletBalance, updateWalletBalance, isDriverWalletSufficient, setLoading, isLoading } = useAppContext();

  // Ensure mock requests also potentially have coords for testing
  const initialRequests = MOCK_RIDE_REQUESTS_FOR_DRIVER.map((r, index) => ({
      ...r,
      status: r.status as RideRequest['status'],
      // Add mock coords for some requests for testing DriverMapView
      pickupCoords: index % 2 === 0 ? { lat: 34.0522 + index * 0.01, lng: -118.2437 + index * 0.01 } : undefined,
      destinationCoords: index % 2 === 0 ? { lat: 34.0722 + index * 0.01, lng: -118.2637 + index * 0.01 } : undefined,
  }));
  const [availableRequests, setAvailableRequests] = useState<DriverOffer[]>(initialRequests);

  const [selectedRequest, setSelectedRequest] = useState<DriverOffer | null>(null);
  const [offerPrice, setOfferPrice] = useState<number>(0);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isNavigationMode, setIsNavigationMode] = useState(false);
  const [isRiderPickedUp, setIsRiderPickedUp] = useState(false);
  const [currentRidePrice, setCurrentRidePrice] = useState(0);


  useEffect(() => {
    if (activeRide) {
        setIsNavigationMode(true);
        // Attempt to find the price for the active ride
        // In a real app, the agreed price should be part of ActiveRideDetails
        // For mock, let's try to find it or use a default
        const originalRequest = MOCK_HISTORY_RIDES.find( // Check mock history or similar source if needed
            (ride) => ride.rideId === activeRide.rideId
        );
        // Price should be set during acceptance
        // setCurrentRidePrice(originalRequest?.price || 0);
    } else {
        setIsNavigationMode(false);
        setIsRiderPickedUp(false);
        setCurrentRidePrice(0);
        // Reset available requests when ride ends
        setAvailableRequests(initialRequests);
    }
  }, [activeRide]);

  const handleSelectRequest = (request: DriverOffer) => {
    if (!isDriverWalletSufficient) {
        addNotification("Insufficient wallet balance. Please top up to make offers.", "warning");
        return;
    }
    setSelectedRequest(request);
    setOfferPrice(request.offeredPrice);
    setIsOfferModalOpen(true);
  };

  const handleSubmitOffer = async () => {
    if (!selectedRequest || offerPrice <= 0) {
      addNotification('Invalid offer price.', 'warning');
      return;
    }
    setLoading(true);
    addNotification(`Offer of $${offerPrice} sent for ${selectedRequest.riderName}'s ride.`, 'info');

    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));

    setAvailableRequests(prev => prev.map(r =>
        r.id === selectedRequest.id ? { ...r, status: 'offer_sent', driverOfferPrice: offerPrice } : r
    ));

    const randomOutcome = Math.random();
    if (randomOutcome < 0.3 && selectedRequest) {
        const riderCounter = Math.max(5, offerPrice - Math.floor(Math.random() * 3 + 1));
        addNotification(`${selectedRequest.riderName} made a counter offer: $${riderCounter}`, 'warning');
        setAvailableRequests(prev => prev.map(r =>
            r.id === selectedRequest.id ? { ...r, status: 'counter_received', riderCounterOffer: riderCounter } : r
        ));
    } else if (randomOutcome < 0.7 && selectedRequest) {
        addNotification(`${selectedRequest.riderName} accepted your offer!`, 'success');
        // Pass the final agreed price
        handleOfferAccepted(selectedRequest, offerPrice);
    } else {
        addNotification(`No response yet from ${selectedRequest.riderName}. Offer remains active.`, 'info');
    }

    setIsOfferModalOpen(false);
    setSelectedRequest(null);
    setLoading(false);
  };

  const handleAcceptCounterOffer = async (request: DriverOffer) => {
    if (!request.riderCounterOffer) return;
    setLoading(true);
    addNotification(`Accepted ${request.riderName}'s counter offer of $${request.riderCounterOffer}.`, 'success');
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
    // Pass the final agreed price (the counter offer price)
    handleOfferAccepted(request, request.riderCounterOffer);
    setLoading(false);
  };

  // This function now correctly receives the final agreed price
  const handleOfferAccepted = (request: DriverOffer, finalPrice: number) => {
    const mockActiveRide: ActiveRideDetails = {
      rideId: 'ride-' + Date.now(),
      driverName: currentUser!.name,
      driverRating: 4.9,
      vehicleDetails: 'My Motorbike - Model X',
      plateNumber: 'DRV 789',
      eta: 'Calculating...', // ETA can be updated based on map data later
      pickupLocation: request.pickupLocation,
      destinationLocation: request.destinationLocation,
      // Pass coordinates to ActiveRideDetails if they exist in the request
      pickupCoords: request.pickupCoords,
      destinationCoords: request.destinationCoords,
    };
    setActiveRide(mockActiveRide);
    setCurrentRidePrice(finalPrice); // Store the agreed price for this ride
    addNotification(`Ride confirmed with ${request.riderName}. Price: $${finalPrice}. Navigate to pickup.`, 'success');
    setAvailableRequests(prev => prev.filter(r => r.id !== request.id));
    setIsNavigationMode(true);
    setIsRiderPickedUp(false); // Ensure this is reset
  };

  const handleMarkAsPickedUp = () => {
    setIsRiderPickedUp(true);
    addNotification("Rider picked up! Navigate to destination.", "info");
    if (activeRide) {
      // Update ETA based on map directions if available, otherwise mock
      setActiveRide({...activeRide, eta: `${Math.floor(Math.random() * 10) + 5} mins to destination`});
    }
  };

  const handleCompleteRide = () => {
    if (!activeRide) return;
    setLoading(true);
    // Simulate API call for completion
    setTimeout(() => {
      const ridePrice = currentRidePrice; // Use the stored price for the current ride
      const earnings = ridePrice * 0.9; // Assume 10% Mator fee
      updateWalletBalance(earnings, 'add');

      addNotification(`Ride completed! You earned $${earnings.toFixed(2)}.`, 'success');
      setActiveRide(null); // Reset active ride
      setLoading(false);
      // No need to reset requests here, useEffect handles it
    }, MOCK_API_DELAY);
  };

  const renderRequestCard = (request: DriverOffer) => {
    let priceColor = BRAND_COLORS.primaryYellow;
    let statusText = `Rider Offer: $${request.offeredPrice.toFixed(2)}`;

    if (request.status === 'offer_sent' && request.driverOfferPrice) {
        priceColor = BRAND_COLORS.green;
        statusText = `Your Offer: $${request.driverOfferPrice.toFixed(2)}`;
    } else if (request.status === 'counter_received' && request.riderCounterOffer) {
        priceColor = BRAND_COLORS.accentRed;
        statusText = `Rider Counter: $${request.riderCounterOffer.toFixed(2)}`;
    }

    return (
      <div key={request.id} className="bg-slate-800 p-4 rounded-lg shadow-md space-y-2">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-lg font-semibold text-slate-100">{request.riderName} ({request.riderRating} <span className="text-yellow-400">★</span>)</h3>
                <p className="text-sm text-slate-300">From: {request.pickupLocation}</p>
                <p className="text-sm text-slate-300">To: {request.destinationLocation}</p>
                {/* Optionally show coordinates if available */}
                {request.pickupCoords && <p className="text-xs text-slate-500">Pickup: {request.pickupCoords.lat.toFixed(4)}, {request.pickupCoords.lng.toFixed(4)}</p>}
                {request.destinationCoords && <p className="text-xs text-slate-500">Dest: {request.destinationCoords.lat.toFixed(4)}, {request.destinationCoords.lng.toFixed(4)}</p>}
            </div>
            <p className="text-xl font-bold" style={{color: priceColor}}>{statusText.split(': ')[1]}</p>
        </div>
        <p className="text-sm text-slate-400" style={{color: priceColor}}>{statusText.split(': ')[0]}</p>

        {request.status === 'counter_received' && request.riderCounterOffer ? (
            <div className="flex space-x-2 pt-2">
                <Button onClick={() => handleAcceptCounterOffer(request)} variant="primary" className="flex-1 text-sm" disabled={isLoading || !isDriverWalletSufficient}>Accept Counter</Button>
                <Button onClick={() => handleSelectRequest(request)} variant="ghost" className="flex-1 text-sm" disabled={isLoading || !isDriverWalletSufficient}>Re-Offer</Button>
            </div>
        ) : request.status !== 'offer_sent' ? (
            <Button onClick={() => handleSelectRequest(request)} variant="primary" fullWidth disabled={isLoading || !isDriverWalletSufficient}>
                Make Offer
            </Button>
        ) : (
            <p className="text-sm text-green-400 text-center pt-2">Offer Sent. Waiting for rider...</p>
        )}
      </div>
    );
  };

  const renderNavigationMode = () => {
    // Check for active ride first
    if (!activeRide) {
        return <p className="text-slate-400 text-center py-8">Error: No active ride data found.</p>;
    }

    // Check for API Key (redundant if DriverMapView handles it, but safe)
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
        return <div className="p-4 text-center text-red-500 bg-red-100 border border-red-400 rounded">Google Maps API Key is missing. Map cannot be displayed.</div>;
    }

    // Check if coordinates are available for map view
    const hasPickupCoords = !!activeRide.pickupCoords;
    const hasDestinationCoords = !!activeRide.destinationCoords;
    const canDisplayMap = hasPickupCoords && hasDestinationCoords;

    return (
        <div className="space-y-4 p-4 bg-slate-800 rounded-lg shadow-xl">
            <h2 className="text-2xl font-semibold text-yellow-400 text-center">Ride in Progress</h2>

            {/* Integrate DriverMapView here, conditionally */}
            <div className="my-4">
                {canDisplayMap ? (
                    <DriverMapView
                        pickupCoords={activeRide.pickupCoords}
                        destinationCoords={activeRide.destinationCoords}
                        mapHeight="350px" // Adjust height as needed
                    />
                ) : (
                    <div className="p-4 text-center text-orange-500 bg-orange-100 border border-orange-400 rounded">
                        Map view requires precise coordinates for both pickup and destination. Displaying text details only.
                    </div>
                )}
            </div>

            <div className="text-center">
                {!isRiderPickedUp ? (
                    <>
                        <p className="text-lg text-slate-100">Navigate to Pickup:</p>
                        <a
                          href={`geo:30.0444,31.2357?q=${encodeURIComponent(activeRide.pickupLocation)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-slate-50 mb-2 block underline hover:text-yellow-400 transition-colors"
                        >
                          {activeRide.pickupLocation}
                        </a>
                        <Button onClick={handleMarkAsPickedUp} variant="primary" fullWidth disabled={isLoading}>Mark as Picked Up</Button>
                    </>
                ) : (
                    <>
                        <p className="text-lg text-slate-100">Navigate to Destination:</p>
                        <a
                          href={`geo:31.2001,29.9187?q=${encodeURIComponent(activeRide.destinationLocation)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-slate-50 mb-2 block underline hover:text-yellow-400 transition-colors"
                        >
                          {activeRide.destinationLocation}
                        </a>
                        <Button onClick={handleCompleteRide} variant="primary" fullWidth disabled={isLoading}>Complete Ride</Button>
                    </>
                )}
                <p className="text-slate-200 mt-3">Rider ETA: {activeRide.eta}</p>
                <p className="text-slate-400 text-sm mt-1">Agreed Price: ${currentRidePrice.toFixed(2)}</p>
                <Button onClick={() => { setActiveRide(null); addNotification("Ride cancelled by you.", "warning");}} variant="danger" fullWidth className="mt-4" disabled={isLoading}>Cancel Ride</Button>
            </div>
        </div>
    );
  };

  // Main component return logic
  if (isNavigationMode) {
      // Ensure activeRide exists before rendering navigation mode
      if (activeRide) {
          return <PageWrapper title="Active Ride">{renderNavigationMode()}</PageWrapper>;
      } else {
          // Handle the case where navigation mode is true but activeRide is null (should ideally not happen)
          console.error("Navigation mode active but no active ride data!");
          // Optionally reset state or show an error message
          setIsNavigationMode(false); // Attempt to recover state
          return <PageWrapper title="Error"><p className='text-red-500 text-center p-4'>An error occurred loading ride details. Please refresh.</p></PageWrapper>;
      }
  }

  // Default view: Available Requests
  return (
    <PageWrapper title="Available Ride Requests">
      {!isDriverWalletSufficient && (
        <div className="bg-red-500/20 text-red-400 p-3 rounded-md text-sm mb-4 text-center">
          Your wallet balance is low (${walletBalance.toFixed(2)}). <a href="#/wallet" className="font-semibold underline">Top up</a> to accept rides.
        </div>
      )}
      {isLoading && availableRequests.length === 0 && <p className="text-slate-300 text-center py-8">Loading requests...</p>}
      <div className="space-y-4">
        {!isLoading && availableRequests.length > 0 ?
            availableRequests.map(renderRequestCard) :
            !isLoading && <p className="text-slate-400 text-center py-8">No ride requests currently available. Check back soon!</p>
        }
      </div>

      <Modal isOpen={isOfferModalOpen && !!selectedRequest} onClose={() => setIsOfferModalOpen(false)} title={`Offer for ${selectedRequest?.riderName}`}>
        {selectedRequest && (
          <div className="space-y-4">
            <p className="text-slate-300">Rider's initial offer: <span className="font-bold text-yellow-400">${selectedRequest.offeredPrice.toFixed(2)}</span></p>
            <p className="text-sm text-slate-400">From: {selectedRequest.pickupLocation}</p>
            <p className="text-sm text-slate-400">To: {selectedRequest.destinationLocation}</p>
            <Input
              label="Your Offer Price"
              type="number"
              value={offerPrice.toString()}
              onChange={e => setOfferPrice(parseFloat(e.target.value) || 0)}
              min="1"
              step="0.5"
              disabled={isLoading}
            />
            <Button onClick={handleSubmitOffer} fullWidth disabled={isLoading || offerPrice <= 0}>Submit Offer</Button>
          </div>
        )}
      </Modal>
    </PageWrapper>
  );
};

export default DriverHome;

