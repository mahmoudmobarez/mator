import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity,
  Switch,
  useColorScheme
} from 'react-native';
import { 
  User, 
  CreditCard, 
  Shield, 
  Bell, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Star,
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Card from '@/components/ui/Card';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  const profileImageUrl = "https://images.pexels.com/photos/1722198/pexels-photo-1722198.jpeg?auto=compress&cs=tinysrgb&w=500";
  
  const menuSections = [
    {
      title: 'Account',
      items: [
        {
          icon: <User size={24} color={colors.text} />,
          title: 'Personal Information',
          onPress: () => console.log('Personal Information pressed'),
        },
        {
          icon: <CreditCard size={24} color={colors.text} />,
          title: 'Payment Methods',
          onPress: () => console.log('Payment Methods pressed'),
        },
        {
          icon: <Shield size={24} color={colors.text} />,
          title: 'Safety Center',
          onPress: () => console.log('Safety Center pressed'),
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: <Bell size={24} color={colors.text} />,
          title: 'Notifications',
          onPress: () => console.log('Notifications pressed'),
          toggle: true,
          toggleValue: notificationsEnabled,
          onToggle: setNotificationsEnabled,
        },
        {
          icon: <Shield size={24} color={colors.text} />,
          title: 'Location Services',
          onPress: () => console.log('Location Services pressed'),
          toggle: true,
          toggleValue: locationEnabled,
          onToggle: setLocationEnabled,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: <HelpCircle size={24} color={colors.text} />,
          title: 'Help Center',
          onPress: () => console.log('Help Center pressed'),
        },
        {
          icon: <LogOut size={24} color={colors.error} />,
          title: 'Log Out',
          onPress: () => console.log('Log Out pressed'),
          textColor: colors.error,
        },
      ],
    },
  ];

  const renderMenuItem = (item: any, index: number, isLast: boolean) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.menuItem,
        !isLast && [styles.menuItemBorder, { borderBottomColor: colors.border }],
      ]}
      onPress={item.onPress}
    >
      <View style={styles.menuItemLeft}>
        {item.icon}
        <Text
          style={[
            styles.menuItemText,
            { color: item.textColor || colors.text },
          ]}
        >
          {item.title}
        </Text>
      </View>
      
      {item.toggle ? (
        <Switch
          value={item.toggleValue}
          onValueChange={item.onToggle}
          trackColor={{ false: '#767577', true: `${colors.primary}80` }}
          thumbColor={item.toggleValue ? colors.primary : '#f4f3f4'}
        />
      ) : (
        <ChevronRight size={20} color={colors.muted} />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
      </View>
      
      <Card style={styles.profileCard}>
        <View style={styles.profileInfo}>
          <Image
            source={{ uri: profileImageUrl }}
            style={styles.profileImage}
          />
          <View style={styles.profileDetails}>
            <Text style={[styles.profileName, { color: colors.text }]}>
              John Doe
            </Text>
            <Text style={[styles.profileEmail, { color: colors.muted }]}>
              john.doe@example.com
            </Text>
            <View style={styles.ratingContainer}>
              <Star size={16} color={colors.primary} fill={colors.primary} />
              <Text style={[styles.ratingText, { color: colors.text }]}>
                4.8
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity 
          style={[styles.editButton, { borderColor: colors.border }]}
          onPress={() => console.log('Edit Profile pressed')}
        >
          <Text style={[styles.editButtonText, { color: colors.primary }]}>
            Edit Profile
          </Text>
        </TouchableOpacity>
      </Card>
      
      {menuSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {section.title}
          </Text>
          <Card style={styles.menuCard}>
            {section.items.map((item, itemIndex) => 
              renderMenuItem(item, itemIndex, itemIndex === section.items.length - 1)
            )}
          </Card>
        </View>
      ))}
      
      <View style={styles.footer}>
        <Text style={[styles.versionText, { color: colors.muted }]}>
          Mator v1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 32,
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
  profileCard: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileDetails: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontFamily: 'Rubik-Bold',
    fontSize: 20,
    marginBottom: 4,
  },
  profileEmail: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
    marginBottom: 8,
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
  editButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  editButtonText: {
    fontFamily: 'Rubik-Medium',
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontFamily: 'Rubik-Medium',
    fontSize: 18,
    marginBottom: 12,
  },
  menuCard: {
    padding: 0,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontFamily: 'Rubik-Regular',
    fontSize: 16,
    marginLeft: 16,
  },
  footer: {
    alignItems: 'center',
    marginTop: 16,
  },
  versionText: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
  },
});