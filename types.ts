import React from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

// Define LatLngLiteral if not already globally available or imported
export interface LatLngLiteral {
  lat: number;
  lng: number;
}

export enum UserRole {
  RIDER = 'RIDER',
  DRIVER = 'DRIVER',
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profilePictureUrl?: string;
  // Add other relevant user fields
}

export interface RideRequest {
  id: string;
  riderId: string;
  riderName: string;
  riderRating: number;
  pickupLocation: string;
  destinationLocation: string;
  offeredPrice: number;
  status: 'pending' | 'searching' | 'matched' | 'ongoing' | 'completed' | 'cancelled';
  // Add coordinates if available from rider selection
  pickupCoords?: LatLngLiteral;
  destinationCoords?: LatLngLiteral;
}

export interface Offer {
  id:string;
  driverId: string;
  driverName: string;
  driverRating: number;
  price: number;
  timestamp: Date;
}

export interface Ride {
  id: string;
  rider: User;
  driver?: User;
  pickupLocation: string;
  destinationLocation: string;
  price: number;
  status: 'pending_offers' | 'driver_assigned' | 'ongoing' | 'completed' | 'cancelled';
  startTime?: Date;
  endTime?: Date;
  driverOffers?: Offer[]; // For rider to see
  riderCounterOfferPrice?: number; // If rider makes a counter
  // Add coordinates if available from rider selection
  pickupCoords?: LatLngLiteral;
  destinationCoords?: LatLngLiteral;
}

export interface Transaction {
  id: string;
  type: 'topup' | 'payment' | 'payout' | 'fee';
  amount: number;
  date: Date;
  description: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'applepay' | 'googlepay';
  last4?: string;
  name: string; // e.g. "Visa **** 1234" or "PayPal Account"
}

export interface NotificationItem {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'offer';
  timestamp: Date;
  read: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface ActiveRideDetails {
  rideId: string;
  driverName: string;
  driverRating: number;
  vehicleDetails: string; // e.g., "Honda CBR150 - Red"
  plateNumber: string;
  eta: string; // e.g. "5 mins"
  pickupLocation: string;
  destinationLocation: string;
  // Add coordinates for map display
  pickupCoords?: LatLngLiteral;
  destinationCoords?: LatLngLiteral;
  currentDriverLocation?: LatLngLiteral; // For map updates (driver's current position)
}

