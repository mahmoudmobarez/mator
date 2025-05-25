
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { User, UserRole, NotificationItem, ActiveRideDetails } from '../types';
import { MOCK_API_DELAY } from '../constants';

interface AppContextType {
  currentUser: User | null;
  userRole: UserRole | null;
  isAuthenticated: boolean;
  notifications: NotificationItem[];
  walletBalance: number;
  activeRide: ActiveRideDetails | null;
  isDriverWalletSufficient: boolean; // For drivers
  isLoading: boolean; // Global loading state

  login: (email: string, role: UserRole) => Promise<void>;
  logout: () => void;
  addNotification: (message: string, type: NotificationItem['type']) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  updateWalletBalance: (amount: number, type: 'add' | 'subtract') => void;
  setActiveRide: (details: ActiveRideDetails | null) => void;
  setLoading: (loading: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(50); // Mock initial balance
  const [activeRideData, _setActiveRide] = useState<ActiveRideDetails | null>(null);
  const [isLoadingData, _setIsLoading] = useState<boolean>(false);

  const addNotification = useCallback((message: string, type: NotificationItem['type']) => {
    const newNotification: NotificationItem = {
      id: 'notif-' + Date.now(),
      message,
      type,
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep max 10 notifications
  }, []); // setNotifications is stable

  const login = useCallback(async (email: string, role: UserRole) => {
    _setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY)); // Simulate API call
    const mockUser: User = {
      id: 'user-' + Date.now(),
      email: email,
      name: role === UserRole.DRIVER ? 'Mock Driver' : 'Mock Rider',
      role: role,
      profilePictureUrl: `https://picsum.photos/seed/matoruser-${Date.now()}/100/100`
    };
    setCurrentUser(mockUser);
    setUserRole(role);
    setWalletBalance(role === UserRole.DRIVER ? 20 : 50); // Set initial balance based on role
    addNotification(`Welcome back, ${mockUser.name}! Logged in as ${role.toLowerCase()}.`, 'success');
    _setIsLoading(false);
  }, [addNotification]);

  const logout = useCallback(() => {
    _setIsLoading(true);
    // Simulate API call for logout if necessary
    setTimeout(() => {
      setCurrentUser(null);
      setUserRole(null);
      _setActiveRide(null);
      // Optionally reset wallet balance or keep it for persistence across sessions if desired
      // setWalletBalance(0); 
      addNotification('You have been logged out.', 'info');
      _setIsLoading(false);
      // ProtectedRoute will handle navigation to /auth
    }, MOCK_API_DELAY / 2);
  }, [addNotification]);

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const updateWalletBalance = useCallback((amount: number, type: 'add' | 'subtract') => {
    setWalletBalance(prev => {
      const newBalance = type === 'add' ? prev + amount : prev - amount;
      // Allowing negative balance for now, checks can be done elsewhere if needed
      // For example, a driver might have a negative balance due to fees before payout.
      return newBalance;
    });
  }, []);

  const isAuthenticated = !!currentUser;
  
  // Example criteria for driver wallet sufficiency (e.g. must have $10 to make offers)
  const isDriverWalletSufficient = userRole === UserRole.DRIVER ? walletBalance >= 10 : true;

  const contextValue: AppContextType = {
    currentUser,
    userRole,
    isAuthenticated,
    notifications,
    walletBalance,
    activeRide: activeRideData,
    isDriverWalletSufficient,
    isLoading: isLoadingData,
    login,
    logout,
    addNotification,
    markNotificationAsRead,
    clearNotifications,
    updateWalletBalance,
    setActiveRide: _setActiveRide,
    setLoading: _setIsLoading,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
