
// Fix: Add UserRole to the imports
import { UserRole, Ride, Offer, RideRequest, FAQItem } from './types';

export const BRAND_COLORS = {
  dark: '#111827', // slate-900
  primaryYellow: '#facc15', // yellow-400
  primaryYellowHover: '#eab308', // yellow-500
  accentRed: '#ef4444', // red-500
  accentRedHover: '#dc2626', // red-600
  textLight: '#f3f4f6', // gray-100
  textDark: '#1f2937', // gray-800
  borderLight: '#4b5563', // gray-600
  subtleBg: '#1f2937', // gray-800
  green: '#22c55e', // green-500
};

export const MIN_RIDE_PRICE = 5; // Minimum price a rider can offer
export const SPLASH_DURATION = 2000; // 2 seconds
export const MOCK_API_DELAY = 1000; // 1 second for simulated API calls

export const MOCK_DRIVER_OFFERS: Offer[] = [
  { id: 'offer1', driverId: 'driver123', driverName: 'John D.', driverRating: 4.8, price: 12, timestamp: new Date() },
  { id: 'offer2', driverId: 'driver456', driverName: 'Mike R.', driverRating: 4.5, price: 11, timestamp: new Date() },
  { id: 'offer3', driverId: 'driver789', driverName: 'Sarah B.', driverRating: 4.9, price: 13, timestamp: new Date() },
];

export const MOCK_RIDE_REQUESTS_FOR_DRIVER: RideRequest[] = [
  { id: 'req1', riderId: 'riderABC', riderName: 'Alice', riderRating: 4.7, pickupLocation: 'Central Park', destinationLocation: 'Times Square', offeredPrice: 15, status: 'searching' },
  { id: 'req2', riderId: 'riderDEF', riderName: 'Bob', riderRating: 4.2, pickupLocation: 'Brooklyn Bridge', destinationLocation: 'Empire State Building', offeredPrice: 18, status: 'searching'},
  { id: 'req3', riderId: 'riderGHI', riderName: 'Clara', riderRating: 4.9, pickupLocation: 'Grand Central', destinationLocation: 'Wall Street', offeredPrice: 12, status: 'searching' },
];

export const MOCK_HISTORY_RIDES: Ride[] = [
    // Fix: Changed import('./types').UserRole.RIDER to UserRole.RIDER and import('./types').UserRole.DRIVER to UserRole.DRIVER
    { id: 'hist1', rider: { id: 'rider1', email: 'rider1@example.com', name: 'Rider One', role: UserRole.RIDER }, driver: { id: 'driver1', email: 'driver1@example.com', name: 'Driver One', role: UserRole.DRIVER }, pickupLocation: 'Old Town Road', destinationLocation: 'New City Avenue', price: 15.50, status: 'completed', startTime: new Date(Date.now() - 86400000 * 2), endTime: new Date(Date.now() - 86400000 * 2 + 1800000) },
    // Fix: Changed import('./types').UserRole.RIDER to UserRole.RIDER and import('./types').UserRole.DRIVER to UserRole.DRIVER
    { id: 'hist2', rider: { id: 'rider1', email: 'rider1@example.com', name: 'Rider One', role: UserRole.RIDER }, driver: { id: 'driver2', email: 'driver2@example.com', name: 'Driver Two', role: UserRole.DRIVER }, pickupLocation: 'Main Street', destinationLocation: 'Second Street', price: 8.00, status: 'completed', startTime: new Date(Date.now() - 86400000 * 5), endTime: new Date(Date.now() - 86400000 * 5 + 1200000) },
];

export const MOCK_FAQS: FAQItem[] = [
    { id: 'faq1', question: 'How do I reset my password?', answer: 'You can reset your password from the login screen by clicking "Forgot Password".' },
    { id: 'faq2', question: 'What payment methods are accepted?', answer: 'We accept major credit/debit cards, PayPal, Apple Pay, and Google Pay. You can also top up your Mator Wallet.' },
    { id: 'faq3', question: 'How is the ride price determined?', answer: 'Riders propose an initial price. Drivers can then make offers, and riders can accept or counter-offer.' },
    { id: 'faq4', question: 'How do I become a Mator driver?', answer: 'You can sign up as a driver through the app. You will need to provide necessary documents and pass a verification process.' },
];