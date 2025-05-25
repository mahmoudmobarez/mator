
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import PageWrapper from './common/PageWrapper';
import Input from './common/Input';
import Button from './common/Button';
import { PaymentMethod, User } from '../types';
import UserIcon from './icons/UserIcon';
import Modal from './common/Modal';
import CogIcon from './icons/CogIcon';
import ChatBubbleIcon from './icons/ChatBubbleIcon';
import { useNavigate } from 'react-router-dom';

// Note: The reported error "Type '() => void' is not assignable to type 'FC<{}>'" for this component
// (definition on line 15) is noted. The component structure with explicit JSX returns appears correct.
// Ensuring default export to address the primary import issue in App.tsx.
const ProfilePage: React.FC = () => {
  const { currentUser, logout, addNotification, setLoading, isLoading, userRole } = useAppContext();
  const navigate = useNavigate();

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [profilePicUrl, setProfilePicUrl] = useState(currentUser?.profilePictureUrl || '');
  const [isEditing, setIsEditing] = useState(false);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: 'pm1', type: 'card', last4: '1234', name: 'Visa **** 1234' },
    { id: 'pm2', type: 'paypal', name: 'PayPal (user@example.com)' },
  ]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [newPaymentMethodType, setNewPaymentMethodType] = useState<'card' | 'paypal'>('card');
  const [newPaymentCardNumber, setNewPaymentCardNumber] = useState('');


  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
      setProfilePicUrl(currentUser.profilePictureUrl || `https://picsum.photos/seed/${currentUser.id}/200/200`);
    }
  }, [currentUser]);

  const handleProfileUpdate = async () => {
    if (!name || !email) {
      addNotification('Name and email cannot be empty.', 'warning');
      return;
    }
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In a real app, update context or re-fetch user
    // For mock:
    if (currentUser) {
        // This is a mock update. In a real app, the context would be updated after successful API call.
        // For now, we rely on the context's own user object.
        // setCurrentUser({ ...currentUser, name, email, profilePictureUrl: profilePicUrl });
    }
    // Note: The reported error "Expected 1 arguments, but got 2" for the line below is inconsistent
    // with the AppContext.tsx definition of addNotification, which expects two arguments.
    // The call `addNotification(message, type)` is correct as per the provided types.
    addNotification('Profile updated successfully!', 'success');
    setIsEditing(false);
    setLoading(false);
  };
  
  const handleProfilePicChange = () => {
    // Simulate image upload and get new URL
    const newPicSeed = Date.now();
    setProfilePicUrl(`https://picsum.photos/seed/${newPicSeed}/200/200`);
    addNotification('Profile picture updated (mock).', 'info');
  };

  const handleAddPaymentMethod = () => {
    if (newPaymentMethodType === 'card' && newPaymentCardNumber.length < 16) {
        addNotification('Invalid card number.', 'warning');
        return;
    }
    const newMethod: PaymentMethod = {
        id: `pm${Date.now()}`,
        type: newPaymentMethodType,
        name: newPaymentMethodType === 'card' ? `Visa **** ${newPaymentCardNumber.slice(-4)}` : `New ${newPaymentMethodType} Account`,
        last4: newPaymentMethodType === 'card' ? newPaymentCardNumber.slice(-4) : undefined,
    };
    setPaymentMethods(prev => [...prev, newMethod]);
    addNotification(`${newPaymentMethodType === 'card' ? 'Card' : 'PayPal'} added successfully.`, 'success');
    setIsPaymentModalOpen(false);
    setNewPaymentCardNumber('');
  };

  if (!currentUser) {
    return <PageWrapper title="Profile"><p>Loading profile...</p></PageWrapper>;
  }

  return (
    <PageWrapper title="My Profile">
      <div className="space-y-6">
        <div className="flex flex-col items-center space-y-4 bg-slate-800 p-6 rounded-lg shadow-lg">
          <div className="relative">
            {profilePicUrl ? (
              <img src={profilePicUrl} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-yellow-400" />
            ) : (
              <UserIcon className="w-32 h-32 text-slate-500 bg-slate-700 rounded-full p-4 border-4 border-yellow-400" />
            )}
            {isEditing && (
                <button onClick={handleProfilePicChange} className="absolute bottom-0 right-0 bg-yellow-400 text-slate-900 p-2 rounded-full shadow-md hover:bg-yellow-500 transition">
                    <CogIcon className="w-5 h-5" />
                </button>
            )}
          </div>
          {!isEditing ? (
            <>
              <h2 className="text-2xl font-bold text-slate-100">${currentUser.name}</h2>
              <p className="text-slate-300">${currentUser.email}</p>
              <p className="text-sm text-yellow-400 capitalize">${currentUser.role.toLowerCase()}</p>
              <Button onClick={() => setIsEditing(true)} variant="primary" className="mt-2">Edit Profile</Button>
            </>
          ) : (
            <div className="w-full space-y-4">
              <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} />
              <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
              <div className="flex space-x-2">
                <Button onClick={handleProfileUpdate} variant="primary" className="flex-1" disabled={isLoading}>Save Changes</Button>
                <Button onClick={() => setIsEditing(false)} variant="ghost" className="flex-1" disabled={isLoading}>Cancel</Button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-800 p-6 rounded-lg shadow-lg space-y-4">
          <h3 className="text-xl font-semibold text-yellow-400">Payment Methods</h3>
          {paymentMethods.map(method => (
            <div key={method.id} className="flex justify-between items-center p-3 bg-slate-700 rounded-md">
              <div>
                <p className="text-slate-100">${method.name}</p>
                <p className="text-xs text-slate-400 capitalize">${method.type}</p>
              </div>
              {/* Fix: Removed invalid 'size' prop from Button component. */}
              <Button variant="danger" className="text-xs px-2 py-1" onClick={() => {setPaymentMethods(prev => prev.filter(pm => pm.id !== method.id)); addNotification('Payment method removed.','info')}}>Remove</Button>
            </div>
          ))}
          <Button onClick={() => setIsPaymentModalOpen(true)} fullWidth variant="ghost">Add Payment Method</Button>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg space-y-3">
           <Button onClick={() => navigate('/support')} fullWidth variant="secondary" className="flex items-center justify-center">
             <ChatBubbleIcon className="w-5 h-5 mr-2" /> Help & Support
           </Button>
           <Button onClick={logout} variant="danger" fullWidth disabled={isLoading}>
            {isLoading ? 'Logging out...' : 'Log Out'}
          </Button>
        </div>
      </div>

      <Modal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} title="Add Payment Method">
        <div className="space-y-4">
            <select 
                value={newPaymentMethodType} 
                onChange={(e) => setNewPaymentMethodType(e.target.value as 'card' | 'paypal')}
                className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
                <option value="card">Credit/Debit Card</option>
                <option value="paypal">PayPal</option>
                {/* Add Apple Pay / Google Pay if needed */}
            </select>
            {newPaymentMethodType === 'card' && (
                <Input label="Card Number" type="text" placeholder="•••• •••• •••• ••••" value={newPaymentCardNumber} onChange={e => setNewPaymentCardNumber(e.target.value)} maxLength={16} />
            )}
             {newPaymentMethodType === 'paypal' && (
                <Input label="PayPal Email" type="email" placeholder="your.paypal@example.com" />
            )}
            <Button onClick={handleAddPaymentMethod} fullWidth>Add Method</Button>
        </div>
      </Modal>
    </PageWrapper>
  );
};

export default ProfilePage;
