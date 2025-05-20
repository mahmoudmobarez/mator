import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { MapPin, Navigation, Search } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { mockDriverLocations } from '@/utils/mockData';

// Only import MapView and related components when not on web
let MapView: any = () => null;
let Marker: any = () => null;
let PROVIDER_GOOGLE: any = null;
let mapStyle: any[] = [];

if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
  PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
}

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [destination, setDestination] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);
  
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web' && colorScheme === 'dark') {
      mapStyle = [
        {
          "elementType": "geometry",
          "stylers": [{ "color": "#242f3e" }]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [{ "color": "#242f3e" }]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [{ "color": "#746855" }]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [{ "color": "#38414e" }]
        },
        {
          "featureType": "road",
          "elementType": "geometry.stroke",
          "stylers": [{ "color": "#212a37" }]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [{ "color": "#17263c" }]
        }
      ];
    }
  }, [colorScheme]);

  const handleBookRide = () => {
    router.push('/ride/book');
  };

  const renderMap = () => {
    if (Platform.OS === 'web') {
      return (
        <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Map view is not available on web platform
          </Text>
        </View>
      );
    }

    if (!location) {
      return (
        <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.loadingText, { color: colors.text }]}>
            {errorMsg || 'Loading map...'}
          </Text>
        </View>
      );
    }

    if (Platform.OS !== 'web') {
      return (
        <MapView
          provider={Platform.OS === 'ios' ? undefined : PROVIDER_GOOGLE}
          style={styles.map}
          customMapStyle={mapStyle}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Your Location"
            description="You are here"
          >
            <View style={styles.userMarker}>
              <View style={styles.userDot} />
            </View>
          </Marker>

          {mockDriverLocations.map((driver, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: driver.latitude,
                longitude: driver.longitude,
              }}
              title={`Driver ${index + 1}`}
            >
              <View style={styles.driverMarker}>
                <View style={styles.driverIconContainer}>
                  <MapPin size={12} color="#000" />
                </View>
              </View>
            </Marker>
          ))}
        </MapView>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      {renderMap()}
      <SafeAreaView style={styles.overlay}>
        <View style={styles.header}>
          <Text style={[styles.logo, { color: colors.text }]}>Mator</Text>
        </View>

        <View style={styles.footer}>
          <Card style={styles.bookingCard}>
            {!isSearchMode ? (
              <>
                <Text style={[styles.bookingTitle, { color: colors.text }]}>
                  Ready to ride?
                </Text>
                <Text style={[styles.bookingSubtitle, { color: colors.muted }]}>
                  Get a motorbike quickly and affordably
                </Text>
                <View style={styles.searchBar}>
                  <Input
                    value={destination}
                    onChangeText={setDestination}
                    placeholder="Where to?"
                    leftIcon={<Search size={20} color={colors.muted} />}
                    onFocus={() => setIsSearchMode(true)}
                  />
                </View>
                <Button 
                  title="Book a Ride" 
                  onPress={handleBookRide} 
                  fullWidth
                  icon={<Navigation size={18} color="#000" style={styles.buttonIcon} />}
                />
              </>
            ) : (
              <>
                <View style={styles.searchContainer}>
                  <Text style={[styles.searchTitle, { color: colors.text }]}>
                    Enter your destination
                  </Text>
                  <Input
                    value={destination}
                    onChangeText={setDestination}
                    placeholder="Search destination"
                    leftIcon={<Search size={20} color={colors.muted} />}
                    autoFocus
                  />
                  <View style={styles.recentSearches}>
                    <Text style={[styles.recentTitle, { color: colors.text }]}>
                      Recent destinations
                    </Text>
                    <View style={styles.recentItem}>
                      <MapPin size={16} color={colors.muted} />
                      <Text style={[styles.recentText, { color: colors.text }]}>
                        Central Mall
                      </Text>
                    </View>
                    <View style={styles.recentItem}>
                      <MapPin size={16} color={colors.muted} />
                      <Text style={[styles.recentText, { color: colors.text }]}>
                        Downtown Office
                      </Text>
                    </View>
                  </View>
                  <View style={styles.buttonContainer}>
                    <Button 
                      title="Cancel" 
                      variant="outline" 
                      onPress={() => setIsSearchMode(false)} 
                      style={styles.cancelButton}
                    />
                    <Button 
                      title="Confirm" 
                      onPress={handleBookRide} 
                      style={styles.confirmButton}
                    />
                  </View>
                </View>
              </>
            )}
          </Card>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Rubik-Regular',
    fontSize: 16,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 0 : 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontFamily: 'Rubik-Bold',
    fontSize: 28,
    marginBottom: 8,
  },
  footer: {
    padding: 16,
  },
  bookingCard: {
    borderRadius: 16,
  },
  bookingTitle: {
    fontFamily: 'Rubik-Bold',
    fontSize: 24,
    marginBottom: 8,
  },
  bookingSubtitle: {
    fontFamily: 'Rubik-Regular',
    fontSize: 16,
    marginBottom: 16,
  },
  searchBar: {
    marginBottom: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  userMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
    borderWidth: 2,
    borderColor: 'white',
  },
  driverMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 208, 44, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  driverIconContainer: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFD02C',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
  },
  searchContainer: {
    padding: 8,
  },
  searchTitle: {
    fontFamily: 'Rubik-Medium',
    fontSize: 18,
    marginBottom: 16,
  },
  recentSearches: {
    marginTop: 16,
  },
  recentTitle: {
    fontFamily: 'Rubik-Medium',
    fontSize: 16,
    marginBottom: 12,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  recentText: {
    fontFamily: 'Rubik-Regular',
    fontSize: 16,
    marginLeft: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  confirmButton: {
    flex: 1,
    marginLeft: 8,
  },
});