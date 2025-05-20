import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Card from '@/components/ui/Card';
import { mockRides } from '@/utils/mockData';

export default function RidesScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const renderRideStatus = (status: string) => {
    let statusColor;
    let statusText;

    switch (status) {
      case 'completed':
        statusColor = colors.success;
        statusText = 'Completed';
        break;
      case 'cancelled':
        statusColor = colors.error;
        statusText = 'Cancelled';
        break;
      case 'inProgress':
        statusColor = colors.primary;
        statusText = 'In Progress';
        break;
      default:
        statusColor = colors.muted;
        statusText = status.charAt(0).toUpperCase() + status.slice(1);
    }

    return (
      <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
        <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
      </View>
    );
  };

  const renderItem = ({ item }: { item: typeof mockRides[0] }) => (
    <Pressable
      style={({ pressed }) => [
        styles.rideItem,
        pressed && { opacity: 0.7 }
      ]}
      onPress={() => router.push(`/ride/${item.id}`)}
    >
      <Card style={styles.rideCard}>
        <View style={styles.rideHeader}>
          <View style={styles.dateContainer}>
            <Calendar size={16} color={colors.muted} style={styles.dateIcon} />
            <Text style={[styles.date, { color: colors.muted }]}>
              {formatDate(item.createdAt)}
            </Text>
          </View>
          {renderRideStatus(item.status)}
        </View>
        
        <View style={styles.rideDetails}>
          <View style={styles.locationContainer}>
            <View style={styles.locationMarker}>
              <View style={[styles.originDot, { backgroundColor: colors.secondary }]} />
              <View style={[styles.routeLine, { backgroundColor: colors.border }]} />
              <View style={[styles.destinationDot, { backgroundColor: colors.primary }]} />
            </View>
            
            <View style={styles.addressContainer}>
              <Text 
                style={[styles.address, { color: colors.text }]} 
                numberOfLines={1}
              >
                {item.pickup.address}
              </Text>
              <Text 
                style={[styles.address, { color: colors.text }]} 
                numberOfLines={1}
              >
                {item.dropoff.address}
              </Text>
            </View>
          </View>
          
          <View style={styles.tripInfo}>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.muted }]}>Distance</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{item.distance} km</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.muted }]}>Duration</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{item.duration} min</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.muted }]}>Fare</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>${item.fare.toFixed(2)}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.footer}>
          <View style={styles.paymentMethod}>
            <Text style={[styles.paymentText, { color: colors.text }]}>
              Paid with {item.paymentMethod.charAt(0).toUpperCase() + item.paymentMethod.slice(1)}
            </Text>
          </View>
          <ChevronRight size={20} color={colors.muted} />
        </View>
      </Card>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>My Rides</Text>
      </View>
      
      {mockRides.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.text }]}>
            You haven't taken any rides yet.
          </Text>
        </View>
      ) : (
        <FlatList
          data={mockRides}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    fontFamily: 'Rubik-Bold',
    fontSize: 28,
  },
  listContainer: {
    padding: 16,
  },
  rideItem: {
    marginBottom: 16,
  },
  rideCard: {
    borderRadius: 12,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    marginRight: 6,
  },
  date: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontFamily: 'Rubik-Medium',
    fontSize: 12,
  },
  rideDetails: {
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  locationMarker: {
    width: 20,
    alignItems: 'center',
    marginRight: 12,
  },
  originDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  routeLine: {
    width: 2,
    height: 30,
    marginVertical: 4,
  },
  destinationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  addressContainer: {
    flex: 1,
    justifyContent: 'space-between',
    height: 52,
  },
  address: {
    fontFamily: 'Rubik-Regular',
    fontSize: 16,
  },
  tripInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontFamily: 'Rubik-Regular',
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    fontFamily: 'Rubik-Medium',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentText: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontFamily: 'Rubik-Medium',
    fontSize: 16,
    textAlign: 'center',
  },
});