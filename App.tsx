
import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AppProvider, useAppContext } from './contexts/AppContext';
import SplashScreen from './components/SplashScreen';
import AuthScreen from './components/AuthScreen';
import RiderHome from './components/RiderHome';
import DriverHome from './components/DriverHome';
import HistoryPage from './components/HistoryPage';
import ProfilePage from './components/ProfilePage';
import WalletPage from './components/WalletPage';
import NotificationsPage from './components/NotificationsPage';
import SupportPage from './components/SupportPage';
import Navbar from './components/common/Navbar';
import { UserRole } from './types';
import Modal from './components/common/Modal'; // For global loading
import ErrorBoundary from './components/common/ErrorBoundary'; // Import ErrorBoundary

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, userRole } = useAppContext();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // Specific home based on role
  if (location.pathname === "/home" || location.pathname === "/home/") {
    return userRole === UserRole.RIDER ? <RiderHome /> : <DriverHome />;
  }

  return <Outlet />; // For other protected routes like /profile, /wallet etc.
};


const AppContent: React.FC = () => {
  const { isLoading } = useAppContext();
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(true);
  
  // Determine if Navbar should be shown
  const noNavPaths = ['/', '/auth']; // Paths where Navbar is hidden (splash, auth)
  const showNavbar = !noNavPaths.includes(location.pathname);

  useEffect(() => {
    if (location.pathname !== '/') {
        setShowSplash(false);
    }
  }, [location.pathname]);


  if (showSplash && location.pathname === '/') {
    return <SplashScreen />;
  }

  return (
    <>
      <div className="app-container flex flex-col min-h-screen bg-slate-900">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/auth" element={<AuthScreen />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={null} /> {/* Handled by ProtectedRoute logic */}
              {/* Add other role-specific home routes if needed, e.g. /home/rider, /home/driver */}
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/support" element={<SupportPage />} />
            </Route>
            
            <Route path="*" element={<Navigate to={useAppContext().isAuthenticated ? "/home" : "/auth"} replace />} />
          </Routes>
        </main>
        {showNavbar && <Navbar />}
      </div>
      {/* Global Loading Modal */}
      <Modal isOpen={isLoading} title="">
        <div className="flex flex-col items-center justify-center p-4">
          <svg className="animate-spin h-12 w-12 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-slate-200 mt-3 text-lg">Loading...</p>
        </div>
      </Modal>
    </>
  );
}


const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </HashRouter>
    </AppProvider>
  );
};

export default App;