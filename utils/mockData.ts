import { Ride, Driver } from '@/types';

// Mock driver locations for map display
export const mockDriverLocations = [
  { latitude: 37.789, longitude: -122.401 },
  { latitude: 37.791, longitude: -122.403 },
  { latitude: 37.785, longitude: -122.406 },
  { latitude: 37.788, longitude: -122.408 },
  { latitude: 37.782, longitude: -122.405 },
];

// Mock ride history
export const mockRides: Ride[] = [
  {
    id: '1',
    userId: 'user1',
    driverId: 'driver1',
    pickup: {
      latitude: 37.7875,
      longitude: -122.4009,
      address: '123 Main St, San Francisco',
    },
    dropoff: {
      latitude: 37.7901,
      longitude: -122.4048,
      address: 'Union Square, San Francisco',
    },
    distance: 1.2,
    duration: 8,
    fare: 6.75,
    status: 'completed',
    paymentMethod: 'card',
    isPaid: true,
    createdAt: new Date('2023-06-15T14:30:00'),
    updatedAt: new Date('2023-06-15T14:38:00'),
    rating: 5,
    review: 'Great service, prompt and professional driver',
  },
  {
    id: '2',
    userId: 'user1',
    driverId: 'driver2',
    pickup: {
      latitude: 37.7835,
      longitude: -122.4089,
      address: 'Westfield Mall, San Francisco',
    },
    dropoff: {
      latitude: 37.7751,
      longitude: -122.4193,
      address: '456 Hayes St, San Francisco',
    },
    distance: 2.5,
    duration: 15,
    fare: 12.50,
    status: 'cancelled',
    paymentMethod: 'cash',
    isPaid: false,
    createdAt: new Date('2023-06-12T18:15:00'),
    updatedAt: new Date('2023-06-12T18:17:00'),
  },
  {
    id: '3',
    userId: 'user1',
    driverId: 'driver3',
    pickup: {
      latitude: 37.7694,
      longitude: -122.4862,
      address: 'Golden Gate Park, San Francisco',
    },
    dropoff: {
      latitude: 37.8029,
      longitude: -122.4058,
      address: 'Pier 39, San Francisco',
    },
    distance: 5.7,
    duration: 25,
    fare: 22.25,
    status: 'completed',
    paymentMethod: 'wallet',
    isPaid: true,
    createdAt: new Date('2023-06-10T10:45:00'),
    updatedAt: new Date('2023-06-10T11:10:00'),
    rating: 4,
  },
];

// Mock driver statistics
export const mockDriverStats = {
  ridesCompleted: 5,
  hoursOnline: 4.5,
  earnings: 65.25,
  rating: 4.8,
};

// Mock upcoming rides for driver
export const mockUpcomingRides = [
  {
    id: 'upcoming1',
    pickup: '123 Market St, Downtown',
    dropoff: 'City Beach Cafe',
    pickupTime: new Date(Date.now() + 15 * 60000),
    estimatedFare: 12.50,
    passengerRating: 4.7,
  },
  {
    id: 'upcoming2',
    pickup: 'Central Park Mall',
    dropoff: 'Airport Terminal 1',
    pickupTime: new Date(Date.now() + 45 * 60000),
    estimatedFare: 28.75,
    passengerRating: 4.3,
  },
];