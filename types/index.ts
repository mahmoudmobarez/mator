// User types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  rating?: number;
  isDriver?: boolean;
  createdAt: Date;
}

export interface Driver extends User {
  isDriver: true;
  vehicleInfo: VehicleInfo;
  licenseInfo: LicenseInfo;
  isOnline?: boolean;
  currentLocation?: Location;
  totalEarnings?: number;
  totalRides?: number;
}

export interface VehicleInfo {
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  images?: string[];
}

export interface LicenseInfo {
  number: string;
  expiryDate: Date;
  isVerified: boolean;
}

// Location types
export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

// Ride types
export type RideStatus = 
  | 'searching'  // Looking for a driver
  | 'accepted'   // Driver accepted ride
  | 'arriving'   // Driver is on the way to pickup
  | 'arrived'    // Driver arrived at pickup
  | 'inProgress' // Ride in progress
  | 'completed'  // Ride completed
  | 'cancelled'; // Ride cancelled

export interface Ride {
  id: string;
  userId: string;
  driverId?: string;
  pickup: Location;
  dropoff: Location;
  distance: number; // in km
  duration: number; // in minutes
  fare: number;
  status: RideStatus;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  createdAt: Date;
  updatedAt: Date;
  rating?: number;
  review?: string;
}

// Payment types
export type PaymentMethod = 'cash' | 'card' | 'wallet';

export interface Payment {
  id: string;
  rideId: string;
  amount: number;
  method: PaymentMethod;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
}