import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, CreditCard, Wallet, DollarSign, Clock, Shield } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const paymentMethods = [
  { id: 'cash', name: 'Cash', icon: DollarSign },
  { id: 'card', name: 'Credit Card', icon: CreditCard },
  { id: 'wallet', name: 'Wallet', icon: Wallet },
];

const mockRideTypes = [
  { 
    id: 'regular', 
    name: 'Regular', 
    price: 5.50, 
    duration: '15 min',
    description: 'Standard motorbike ride'
  },
  { 
    id: 'premium', 
    name: 'Premium', 
    price: 8.25, 
    duration: '15 min',
    description: 'Luxury motorbike with extra comfort'
  },
  { 
    id: 'express', 
    name: 'Express', 
    price: 10.00, 
    duration: '12 min',
    description: 'Fastest route with priority'
  },
];

export default function BookRideScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [selectedRideType, setSelectedRideType] = useState('regular');
  const [selectedPayment, setSelectedPayment] = useState('cash');
  const [isBooking, setIsBooking] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const pickup = '123 Main Street';
  const dropoff = 'Central Mall, Downtown';
  
  const selectedRide = mockRideTypes.find(ride => ride.id === selectedRideType);
  
  const handleBookRide = () => {
    setIsBooking(true);
    // Simulate API call
    setTimeout(() => {
      setIsBooking(false);
      setShowConfirmation(true);
    }, 1500);
  };
  
  const handleConfirmRide = () => {
    router.replace('/(tabs)');
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {!showConfirmation ? (
          <>
            <View style={styles.locationContainer}>
              <Card style={styles.locationCard}>
                <View style={styles.locationHeader}>
                  <Text style={[styles.locationTitle, { color: colors.text }]}>
                    Pickup & Dropoff
                  </Text>
                </View>
                <View style={styles.locationPoints}>
                  <View style={styles.locationPoint}>
                    <View style={[styles.originDot, { backgroundColor: colors.secondary }]} />
                    <View style={styles.locationDetails}>
                      <Text style={[styles.locationLabel, { color: colors.muted }]}>
                        Pickup
                      </Text>
                      <Text style={[styles.locationText, { color: colors.text }]}>
                        {pickup}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.routeLine, { backgroundColor: colors.border }]} />
                  <View style={styles.locationPoint}>
                    <View style={[styles.destinationDot, { backgroundColor: colors.primary }]} />
                    <View style={styles.locationDetails}>
                      <Text style={[styles.locationLabel, { color: colors.muted }]}>
                        Dropoff
                      </Text>
                      <Text style={[styles.locationText, { color: colors.text }]}>
                        {dropoff}
                      </Text>
                    </View>
                  </View>
                </View>
              </Card>
            </View>
            
            <View style={styles.rideTypesContainer}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Select Ride Type
              </Text>
              {mockRideTypes.map((rideType) => (
                <TouchableOpacity
                  key={rideType.id}
                  style={[
                    styles.rideTypeCard,
                    { 
                      backgroundColor: selectedRideType === rideType.id 
                        ? `${colors.primary}20` 
                        : colors.card,
                      borderColor: selectedRideType === rideType.id 
                        ? colors.primary 
                        : colors.border,
                    }
                  ]}
                  onPress={() => setSelectedRideType(rideType.id)}
                >
                  <View style={styles.rideTypeContent}>
                    <View style={styles.rideTypeInfo}>
                      <Text style={[styles.rideTypeName, { color: colors.text }]}>
                        {rideType.name}
                      </Text>
                      <Text style={[styles.rideTypeDescription, { color: colors.muted }]}>
                        {rideType.description}
                      </Text>
                    </View>
                    <View style={styles.rideTypeDetails}>
                      <View style={styles.rideTypeDetail}>
                        <DollarSign size={16} color={colors.text} />
                        <Text style={[styles.rideTypePrice, { color: colors.text }]}>
                          ${rideType.price.toFixed(2)}
                        </Text>
                      </View>
                      <View style={styles.rideTypeDetail}>
                        <Clock size={16} color={colors.text} />
                        <Text style={[styles.rideTypeDuration, { color: colors.text }]}>
                          {rideType.duration}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.paymentContainer}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Payment Method
              </Text>
              <View style={styles.paymentOptions}>
                {paymentMethods.map((method) => (
                  <TouchableOpacity
                    key={method.id}
                    style={[
                      styles.paymentOption,
                      { 
                        backgroundColor: selectedPayment === method.id 
                          ? `${colors.primary}20` 
                          : colors.card,
                        borderColor: selectedPayment === method.id 
                          ? colors.primary 
                          : colors.border,
                      }
                    ]}
                    onPress={() => setSelectedPayment(method.id)}
                  >
                    <method.icon 
                      size={24} 
                      color={selectedPayment === method.id ? colors.primary : colors.text} 
                    />
                    <Text 
                      style={[
                        styles.paymentName,
                        { 
                          color: selectedPayment === method.id 
                            ? colors.primary 
                            : colors.text 
                        }
                      ]}
                    >
                      {method.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.promoContainer}>
              <Card style={styles.promoCard}>
                <View style={styles.promoContent}>
                  <View style={styles.promoIcon}>
                    <Shield size={24} color={colors.primary} />
                  </View>
                  <View style={styles.promoInfo}>
                    <Text style={[styles.promoTitle, { color: colors.text }]}>
                      Safety Helmet Included
                    </Text>
                    <Text style={[styles.promoDescription, { color: colors.muted }]}>
                      All our drivers provide a clean helmet for your safety
                    </Text>
                  </View>
                </View>
              </Card>
            </View>
          </>
        ) : (
          <View style={styles.confirmationContainer}>
            <View style={styles.confirmationHeader}>
              <View style={[styles.confirmationIcon, { backgroundColor: colors.success }]}>
                <Text style={styles.checkmark}>✓</Text>
              </View>
              <Text style={[styles.confirmationTitle, { color: colors.text }]}>
                Ride Confirmed!
              </Text>
              <Text style={[styles.confirmationSubtitle, { color: colors.muted }]}>
                Your driver is on the way
              </Text>
            </View>
            
            <Card style={styles.driverCard}>
              <View style={styles.driverInfo}>
                <View style={[styles.driverAvatar, { backgroundColor: colors.primary }]}>
                  <Text style={styles.driverInitials}>JD</Text>
                </View>
                <View style={styles.driverDetails}>
                  <Text style={[styles.driverName, { color: colors.text }]}>
                    James Doe
                  </Text>
                  <View style={styles.driverRating}>
                    <Text style={[styles.ratingText, { color: colors.text }]}>
                      ★ 4.9
                    </Text>
                    <Text style={[styles.driverTrips, { color: colors.muted }]}>
                      • 342 trips
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.bikeInfo}>
                <Text style={[styles.bikeMake, { color: colors.text }]}>
                  Honda CBR
                </Text>
                <Text style={[styles.bikePlate, { color: colors.primary }]}>
                  MT-1234
                </Text>
              </View>
            </Card>
            
            <Card style={styles.rideDetailsCard}>
              <View style={styles.rideDetailsRow}>
                <Text style={[styles.rideDetailsLabel, { color: colors.muted }]}>
                  Estimated arrival
                </Text>
                <Text style={[styles.rideDetailsValue, { color: colors.text }]}>
                  3 min (0.8 km away)
                </Text>
              </View>
              <View style={styles.rideDetailsRow}>
                <Text style={[styles.rideDetailsLabel, { color: colors.muted }]}>
                  Ride type
                </Text>
                <Text style={[styles.rideDetailsValue, { color: colors.text }]}>
                  {selectedRide?.name}
                </Text>
              </View>
              <View style={styles.rideDetailsRow}>
                <Text style={[styles.rideDetailsLabel, { color: colors.muted }]}>
                  Payment method
                </Text>
                <Text style={[styles.rideDetailsValue, { color: colors.text }]}>
                  {paymentMethods.find(m => m.id === selectedPayment)?.name}
                </Text>
              </View>
              <View style={styles.rideDetailsRow}>
                <Text style={[styles.rideDetailsLabel, { color: colors.muted }]}>
                  Estimated fare
                </Text>
                <Text style={[styles.fareValue, { color: colors.primary }]}>
                  ${selectedRide?.price.toFixed(2)}
                </Text>
              </View>
            </Card>
          </View>
        )}
      </ScrollView>
      
      <View style={[styles.footer, { backgroundColor: colors.background }]}>
        {!showConfirmation ? (
          <View style={styles.bookingFooter}>
            <View style={styles.fareContainer}>
              <Text style={[styles.fareLabel, { color: colors.muted }]}>
                Estimated Fare
              </Text>
              <Text style={[styles.fareAmount, { color: colors.text }]}>
                ${selectedRide?.price.toFixed(2)}
              </Text>
            </View>
            <Button 
              title="Book Ride" 
              onPress={handleBookRide} 
              loading={isBooking}
              style={styles.bookButton}
            />
          </View>
        ) : (
          <Button 
            title="Return to Home" 
            onPress={handleConfirmRide} 
            fullWidth
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  locationContainer: {
    marginBottom: 24,
  },
  locationCard: {
    padding: 16,
  },
  locationHeader: {
    marginBottom: 16,
  },
  locationTitle: {
    fontFamily: 'Rubik-Medium',
    fontSize: 18,
  },
  locationPoints: {
    marginLeft: 8,
  },
  locationPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  originDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  destinationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  routeLine: {
    width: 2,
    height: 30,
    marginLeft: 4,
  },
  locationDetails: {
    marginLeft: 16,
  },
  locationLabel: {
    fontFamily: 'Rubik-Regular',
    fontSize: 12,
    marginBottom: 4,
  },
  locationText: {
    fontFamily: 'Rubik-Medium',
    fontSize: 16,
  },
  sectionTitle: {
    fontFamily: 'Rubik-Medium',
    fontSize: 18,
    marginBottom: 16,
  },
  rideTypesContainer: {
    marginBottom: 24,
  },
  rideTypeCard: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
  },
  rideTypeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rideTypeInfo: {
    flex: 1,
    marginRight: 16,
  },
  rideTypeName: {
    fontFamily: 'Rubik-Bold',
    fontSize: 18,
    marginBottom: 4,
  },
  rideTypeDescription: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
  },
  rideTypeDetails: {
    alignItems: 'flex-end',
  },
  rideTypeDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rideTypePrice: {
    fontFamily: 'Rubik-Medium',
    fontSize: 16,
    marginLeft: 4,
  },
  rideTypeDuration: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
    marginLeft: 4,
  },
  paymentContainer: {
    marginBottom: 24,
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 16,
    marginHorizontal: 4,
  },
  paymentName: {
    fontFamily: 'Rubik-Medium',
    fontSize: 14,
    marginTop: 8,
  },
  promoContainer: {
    marginBottom: 24,
  },
  promoCard: {},
  promoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoIcon: {
    marginRight: 16,
  },
  promoInfo: {
    flex: 1,
  },
  promoTitle: {
    fontFamily: 'Rubik-Medium',
    fontSize: 16,
    marginBottom: 4,
  },
  promoDescription: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    paddingBottom: Platform.OS === 'ios' ? 36 : 16,
  },
  bookingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fareContainer: {
    flex: 1,
    marginRight: 16,
  },
  fareLabel: {
    fontFamily: 'Rubik-Regular',
    fontSize: 12,
  },
  fareAmount: {
    fontFamily: 'Rubik-Bold',
    fontSize: 24,
  },
  bookButton: {
    flex: 1,
  },
  confirmationContainer: {
    padding: 16,
  },
  confirmationHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  confirmationIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  checkmark: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  confirmationTitle: {
    fontFamily: 'Rubik-Bold',
    fontSize: 24,
    marginBottom: 8,
  },
  confirmationSubtitle: {
    fontFamily: 'Rubik-Regular',
    fontSize: 16,
  },
  driverCard: {
    marginBottom: 16,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  driverAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  driverInitials: {
    fontFamily: 'Rubik-Bold',
    fontSize: 18,
    color: '#000000',
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontFamily: 'Rubik-Bold',
    fontSize: 18,
    marginBottom: 4,
  },
  driverRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontFamily: 'Rubik-Medium',
    fontSize: 14,
  },
  driverTrips: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
    marginLeft: 4,
  },
  bikeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
  },
  bikeMake: {
    fontFamily: 'Rubik-Medium',
    fontSize: 14,
  },
  bikePlate: {
    fontFamily: 'Rubik-Bold',
    fontSize: 14,
  },
  rideDetailsCard: {
    marginBottom: 16,
  },
  rideDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  rideDetailsLabel: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
  },
  rideDetailsValue: {
    fontFamily: 'Rubik-Medium',
    fontSize: 14,
  },
  fareValue: {
    fontFamily: 'Rubik-Bold',
    fontSize: 16,
  },
});