import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import {
  TrendingUp,
  Clock,
  DollarSign,
  ChevronRight,
  Star,
  AlertTriangle,
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { mockDriverStats, mockUpcomingRides } from '@/utils/mockData';

export default function DriverScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isOnline, setIsOnline] = useState(false);
  const [isDriverRegistered, setIsDriverRegistered] = useState(true);

  const handleToggleOnline = () => {
    setIsOnline(!isOnline);
  };

  const renderDriverRegistration = () => (
    <View style={styles.registrationContainer}>
      <Card style={styles.registrationCard}>
        <Text style={[styles.registrationTitle, { color: colors.text }]}>
          Become a Driver
        </Text>
        <Text style={[styles.registrationDescription, { color: colors.muted }]}>
          Join our fleet of motorbike drivers and start earning today. It's easy to get started.
        </Text>
        <View style={styles.registrationRequirements}>
          <Text style={[styles.requirementsTitle, { color: colors.text }]}>
            Requirements:
          </Text>
          <View style={styles.requirementItem}>
            <View style={[styles.bulletPoint, { backgroundColor: colors.primary }]} />
            <Text style={[styles.requirementText, { color: colors.text }]}>
              Valid driver's license
            </Text>
          </View>
          <View style={styles.requirementItem}>
            <View style={[styles.bulletPoint, { backgroundColor: colors.primary }]} />
            <Text style={[styles.requirementText, { color: colors.text }]}>
              Motorcycle registration documents
            </Text>
          </View>
          <View style={styles.requirementItem}>
            <View style={[styles.bulletPoint, { backgroundColor: colors.primary }]} />
            <Text style={[styles.requirementText, { color: colors.text }]}>
              Proof of insurance
            </Text>
          </View>
          <View style={styles.requirementItem}>
            <View style={[styles.bulletPoint, { backgroundColor: colors.primary }]} />
            <Text style={[styles.requirementText, { color: colors.text }]}>
              Personal identification
            </Text>
          </View>
        </View>
        <Button 
          title="Register as Driver" 
          onPress={() => setIsDriverRegistered(true)} 
          fullWidth
        />
      </Card>
    </View>
  );

  const renderDriverDashboard = () => (
    <ScrollView style={styles.driverDashboard}>
      <View style={styles.onlineStatusContainer}>
        <View style={styles.onlineStatusContent}>
          <Text style={[styles.onlineStatusLabel, { color: colors.text }]}>
            {isOnline ? 'Online' : 'Offline'}
          </Text>
          <Text style={[styles.onlineStatusDescription, { color: colors.muted }]}>
            {isOnline 
              ? 'You are visible to passengers nearby' 
              : 'Go online to receive ride requests'}
          </Text>
        </View>
        <Switch
          value={isOnline}
          onValueChange={handleToggleOnline}
          trackColor={{ false: '#767577', true: `${colors.success}80` }}
          thumbColor={isOnline ? colors.success : '#f4f3f4'}
          style={styles.onlineToggle}
        />
      </View>

      {isOnline && (
        <View style={styles.alertCard}>
          <Card style={[styles.alertContent, { borderLeftColor: colors.primary, borderLeftWidth: 4 }]}>
            <View style={styles.alertHeader}>
              <AlertTriangle size={20} color={colors.primary} />
              <Text style={[styles.alertTitle, { color: colors.text }]}>
                Looking for passengers
              </Text>
            </View>
            <Text style={[styles.alertDescription, { color: colors.muted }]}>
              Stay in this area to increase your chances of getting ride requests.
            </Text>
          </Card>
        </View>
      )}

      <View style={styles.statsSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Today's Summary
        </Text>
        <View style={styles.statsCardContainer}>
          <Card style={[styles.statsCard, { backgroundColor: colors.primary }]}>
            <View style={styles.statsIconContainer}>
              <View style={[styles.statsIconBackground, { backgroundColor: 'rgba(0, 0, 0, 0.1)' }]}>
                <TrendingUp size={20} color="#000" />
              </View>
            </View>
            <Text style={styles.statsValue}>
              {mockDriverStats.ridesCompleted}
            </Text>
            <Text style={styles.statsLabel}>
              Rides
            </Text>
          </Card>
          
          <Card style={[styles.statsCard, { backgroundColor: colors.secondary }]}>
            <View style={styles.statsIconContainer}>
              <View style={[styles.statsIconBackground, { backgroundColor: 'rgba(0, 0, 0, 0.1)' }]}>
                <Clock size={20} color="#000" />
              </View>
            </View>
            <Text style={styles.statsValue}>
              {mockDriverStats.hoursOnline}h
            </Text>
            <Text style={styles.statsLabel}>
              Online
            </Text>
          </Card>
          
          <Card style={[styles.statsCard, { backgroundColor: colors.success }]}>
            <View style={styles.statsIconContainer}>
              <View style={[styles.statsIconBackground, { backgroundColor: 'rgba(0, 0, 0, 0.1)' }]}>
                <DollarSign size={20} color="#000" />
              </View>
            </View>
            <Text style={styles.statsValue}>
              ${mockDriverStats.earnings}
            </Text>
            <Text style={styles.statsLabel}>
              Earnings
            </Text>
          </Card>
        </View>
      </View>

      <View style={styles.upcomingRidesSection}>
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Upcoming Rides
          </Text>
          <TouchableOpacity>
            <Text style={[styles.viewAllText, { color: colors.primary }]}>
              View All
            </Text>
          </TouchableOpacity>
        </View>
        
        {mockUpcomingRides.map((ride, index) => (
          <Card key={index} style={styles.rideCard}>
            <View style={styles.rideHeader}>
              <Text style={[styles.rideTime, { color: colors.text }]}>
                {new Date(ride.pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
              <View style={styles.ratingContainer}>
                <Star size={14} color={colors.primary} fill={colors.primary} />
                <Text style={[styles.ratingText, { color: colors.text }]}>
                  {ride.passengerRating}
                </Text>
              </View>
            </View>
            
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
                  {ride.pickup}
                </Text>
                <Text 
                  style={[styles.address, { color: colors.text }]} 
                  numberOfLines={1}
                >
                  {ride.dropoff}
                </Text>
              </View>
            </View>
            
            <View style={styles.rideFooter}>
              <Text style={[styles.fareText, { color: colors.text }]}>
                Est. fare: ${ride.estimatedFare}
              </Text>
              <View style={styles.rideActionButtons}>
                <Button
                  title="Reject"
                  variant="outline"
                  size="small"
                  onPress={() => console.log('Reject ride')}
                  style={styles.rejectButton}
                />
                <Button
                  title="Accept"
                  size="small"
                  onPress={() => console.log('Accept ride')}
                  style={styles.acceptButton}
                />
              </View>
            </View>
          </Card>
        ))}
      </View>

      <View style={styles.earningsSection}>
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Earnings
          </Text>
          <TouchableOpacity>
            <Text style={[styles.viewAllText, { color: colors.primary }]}>
              See Details
            </Text>
          </TouchableOpacity>
        </View>
        
        <Card style={styles.earningsCard}>
          <View style={styles.earningsPeriodSelector}>
            <TouchableOpacity style={[styles.periodTab, styles.activePeriodTab]}>
              <Text style={[styles.periodText, { color: '#000' }]}>Today</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.periodTab}>
              <Text style={[styles.periodText, { color: colors.text }]}>This Week</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.periodTab}>
              <Text style={[styles.periodText, { color: colors.text }]}>This Month</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.earningsDetails}>
            <View style={styles.earningsRow}>
              <Text style={[styles.earningsLabel, { color: colors.muted }]}>Total Earnings</Text>
              <Text style={[styles.earningsValue, { color: colors.text }]}>${mockDriverStats.earnings}</Text>
            </View>
            <View style={styles.earningsRow}>
              <Text style={[styles.earningsLabel, { color: colors.muted }]}>Total Rides</Text>
              <Text style={[styles.earningsValue, { color: colors.text }]}>{mockDriverStats.ridesCompleted}</Text>
            </View>
            <View style={styles.earningsRow}>
              <Text style={[styles.earningsLabel, { color: colors.muted }]}>Online Hours</Text>
              <Text style={[styles.earningsValue, { color: colors.text }]}>{mockDriverStats.hoursOnline} hours</Text>
            </View>
          </View>
          
          <TouchableOpacity style={[styles.cashoutButton, { backgroundColor: colors.success }]}>
            <DollarSign size={18} color="#FFF" style={styles.cashoutIcon} />
            <Text style={styles.cashoutText}>Cash Out</Text>
          </TouchableOpacity>
        </Card>
      </View>
    </ScrollView>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Driver</Text>
      </View>
      
      {isDriverRegistered ? renderDriverDashboard() : renderDriverRegistration()}
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
  registrationContainer: {
    padding: 16,
  },
  registrationCard: {
    padding: 20,
  },
  registrationTitle: {
    fontFamily: 'Rubik-Bold',
    fontSize: 24,
    marginBottom: 12,
  },
  registrationDescription: {
    fontFamily: 'Rubik-Regular',
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 24,
  },
  registrationRequirements: {
    marginBottom: 24,
  },
  requirementsTitle: {
    fontFamily: 'Rubik-Medium',
    fontSize: 18,
    marginBottom: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  requirementText: {
    fontFamily: 'Rubik-Regular',
    fontSize: 16,
  },
  driverDashboard: {
    flex: 1,
  },
  onlineStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
  },
  onlineStatusContent: {
    flex: 1,
  },
  onlineStatusLabel: {
    fontFamily: 'Rubik-Bold',
    fontSize: 20,
    marginBottom: 4,
  },
  onlineStatusDescription: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
  },
  onlineToggle: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  alertCard: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  alertContent: {
    padding: 16,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTitle: {
    fontFamily: 'Rubik-Medium',
    fontSize: 16,
    marginLeft: 8,
  },
  alertDescription: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
  },
  statsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Rubik-Bold',
    fontSize: 20,
    marginBottom: 16,
  },
  statsCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsCard: {
    width: '31%',
    padding: 12,
    alignItems: 'center',
  },
  statsIconContainer: {
    marginBottom: 8,
  },
  statsIconBackground: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsValue: {
    fontFamily: 'Rubik-Bold',
    fontSize: 20,
    color: '#000',
    marginBottom: 4,
  },
  statsLabel: {
    fontFamily: 'Rubik-Medium',
    fontSize: 14,
    color: '#000',
  },
  upcomingRidesSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontFamily: 'Rubik-Medium',
    fontSize: 14,
  },
  rideCard: {
    marginBottom: 16,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rideTime: {
    fontFamily: 'Rubik-Medium',
    fontSize: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontFamily: 'Rubik-Medium',
    fontSize: 14,
    marginLeft: 4,
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
  rideFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fareText: {
    fontFamily: 'Rubik-Medium',
    fontSize: 16,
  },
  rideActionButtons: {
    flexDirection: 'row',
  },
  rejectButton: {
    marginRight: 8,
  },
  acceptButton: {},
  earningsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  earningsCard: {
    padding: 0,
    overflow: 'hidden',
  },
  earningsPeriodSelector: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  periodTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activePeriodTab: {
    backgroundColor: '#FFD02C',
  },
  periodText: {
    fontFamily: 'Rubik-Medium',
    fontSize: 14,
  },
  earningsDetails: {
    padding: 16,
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  earningsLabel: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
  },
  earningsValue: {
    fontFamily: 'Rubik-Medium',
    fontSize: 16,
  },
  cashoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  cashoutIcon: {
    marginRight: 8,
  },
  cashoutText: {
    fontFamily: 'Rubik-Bold',
    fontSize: 16,
    color: '#FFF',
  },
});