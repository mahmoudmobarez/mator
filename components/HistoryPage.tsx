
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Ride, UserRole } from '../types';
import PageWrapper from './common/PageWrapper';
import { MOCK_HISTORY_RIDES, MOCK_API_DELAY } from '../constants';
import Modal from './common/Modal';
import Button from './common/Button';

const HistoryItem: React.FC<{ ride: Ride, role: UserRole, onViewReceipt: (ride: Ride) => void }> = ({ ride, role, onViewReceipt }) => {
  const otherParty = role === UserRole.RIDER ? ride.driver : ride.rider;
  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-md space-y-2">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-400">{ride.startTime?.toLocaleDateString()} - {ride.startTime?.toLocaleTimeString()}</p>
        <p className="text-lg font-bold text-yellow-400">${ride.price.toFixed(2)}</p>
      </div>
      <p className="text-slate-200 font-semibold">
        {role === UserRole.RIDER ? `Driver: ${otherParty?.name || 'N/A'}` : `Rider: ${otherParty?.name || 'N/A'}`}
      </p>
      <p className="text-sm text-slate-300">From: {ride.pickupLocation}</p>
      <p className="text-sm text-slate-300">To: {ride.destinationLocation}</p>
      <div className="flex justify-between items-center pt-2">
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
            ride.status === 'completed' ? 'bg-green-500/30 text-green-400' :
            ride.status === 'cancelled' ? 'bg-red-500/30 text-red-400' :
            'bg-slate-600 text-slate-300'
        }`}>
            {ride.status.replace('_', ' ').toUpperCase()}
        </span>
        <Button onClick={() => onViewReceipt(ride)} variant="ghost" className="text-xs px-2 py-1">View Receipt</Button>
      </div>
    </div>
  );
};

const HistoryPage: React.FC = () => {
  const { currentUser, userRole, setLoading, isLoading } = useAppContext();
  const [history, setHistory] = useState<Ride[]>([]);
  const [selectedRideForReceipt, setSelectedRideForReceipt] = useState<Ride | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!currentUser || !userRole) return;
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY)); // Simulate API call
      // Filter mock history based on user role (in real app, API would do this)
      const userHistory = MOCK_HISTORY_RIDES.filter(ride => 
        (userRole === UserRole.RIDER && ride.rider.id === currentUser.id) ||
        (userRole === UserRole.DRIVER && ride.driver && ride.driver.id === currentUser.id)
      );
      setHistory(userHistory);
      setLoading(false);
    };
    fetchHistory();
  }, [currentUser, userRole, setLoading]);

  const handleViewReceipt = (ride: Ride) => {
    setSelectedRideForReceipt(ride);
  };

  if (isLoading && history.length === 0) {
    return <PageWrapper title="Ride History"><p className="text-center text-slate-300">Loading history...</p></PageWrapper>;
  }

  return (
    <PageWrapper title="Ride History">
      {history.length === 0 ? (
        <p className="text-slate-400 text-center py-8">No ride history found.</p>
      ) : (
        <div className="space-y-4">
          {history.map(ride => (
            <HistoryItem key={ride.id} ride={ride} role={userRole!} onViewReceipt={handleViewReceipt} />
          ))}
        </div>
      )}
      <Modal isOpen={!!selectedRideForReceipt} onClose={() => setSelectedRideForReceipt(null)} title="Ride Receipt">
        {selectedRideForReceipt && (
          <div className="space-y-3 text-slate-200">
            <p><span className="font-semibold">Ride ID:</span> {selectedRideForReceipt.id}</p>
            <p><span className="font-semibold">Date:</span> {selectedRideForReceipt.startTime?.toLocaleDateString()}</p>
            <p><span className="font-semibold">Amount:</span> <span className="text-yellow-400 font-bold">${selectedRideForReceipt.price.toFixed(2)}</span></p>
            <hr className="border-slate-700 my-2"/>
            <p><span className="font-semibold">From:</span> {selectedRideForReceipt.pickupLocation}</p>
            <p><span className="font-semibold">To:</span> {selectedRideForReceipt.destinationLocation}</p>
            <hr className="border-slate-700 my-2"/>
            <p><span className="font-semibold">Rider:</span> {selectedRideForReceipt.rider.name}</p>
            <p><span className="font-semibold">Driver:</span> {selectedRideForReceipt.driver?.name || 'N/A'}</p>
            <p><span className="font-semibold">Status:</span> <span className="capitalize">{selectedRideForReceipt.status.replace('_', ' ')}</span></p>
            <Button onClick={() => setSelectedRideForReceipt(null)} fullWidth className="mt-4">Close</Button>
          </div>
        )}
      </Modal>
    </PageWrapper>
  );
};

export default HistoryPage;
