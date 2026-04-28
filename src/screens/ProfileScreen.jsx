import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Pressable,
  View,
  useColorScheme,
  Switch,
  Alert,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { USER_DATA, LIGHT_THEME, DARK_THEME } from '../constants/travel-data';
import { useToast } from 'react-native-toast-notifications';

export default function ProfileScreen() {
  const isDark = useColorScheme() === 'dark';
  const colors = isDark ? DARK_THEME : LIGHT_THEME;
  const toast = useToast(); // Add this line

  const [user, setUser] = useState(USER_DATA);
  const [isEditing, setIsEditing] = useState(false);
  const [notifications, setNotifications] = useState(user.preferences.notifications);

  const handleEditProfile = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      toast.show('Profile updated successfully!', {
        type: 'success',
        placement: 'top',
      });
    }
  };

  const handleToggleNotifications = (value) => {
    setNotifications(value);
    setUser({
      ...user,
      preferences: {
        ...user.preferences,
        notifications: value,
      },
    });
    toast.show(`Notifications ${value ? 'enabled' : 'disabled'}`, {
      type: value ? 'success' : 'warning',
      placement: 'top',
    });
  };

  const handleMenuItemPress = (label) => {
    toast.show(`You tapped on ${label}`, {
      type: 'info',
      placement: 'top',
    }); 
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            toast.show('Logged out successfully', {
              type: 'success',
              placement: 'top',
            });
          }
        },
      ]
    );
   
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.screenBg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.primaryText }]}>Profile</Text>

        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: user.avatar }}
              style={styles.avatar}
            />
            <Pressable style={[styles.editAvatarBtn, { backgroundColor: colors.accent }]}>
              <Icon name="camera-alt" size={wp('3.5%')} color="#fff" />
            </Pressable>
          </View>
          
          <Text style={[styles.name, { color: colors.primaryText }]}>{user.name}</Text>
          <Text style={[styles.email, { color: colors.secondaryText }]}>
            {user.email}
          </Text>
          
          <Pressable 
            style={[styles.editButton, { backgroundColor: colors.accent }]}
            onPress={handleEditProfile}
          >
            <Icon name={isEditing ? 'save' : 'edit'} size={wp('4%')} color="#fff" />
            <Text style={styles.editButtonText}>
              {isEditing ? 'Save Profile' : 'Edit Profile'}
            </Text>
          </Pressable>
        </View>

        {/* Stats Section */}
        <View style={[styles.statsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.accent }]}>{user.stats.placesVisited}</Text>
            <Text style={[styles.statLabel, { color: colors.secondaryText }]}>Places Visited</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.accent }]}>{user.stats.reviewsWritten}</Text>
            <Text style={[styles.statLabel, { color: colors.secondaryText }]}>Reviews</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.accent }]}>{user.stats.photosShared}</Text>
            <Text style={[styles.statLabel, { color: colors.secondaryText }]}>Photos</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.accent }]}>{user.stats.followers}</Text>
            <Text style={[styles.statLabel, { color: colors.secondaryText }]}>Followers</Text>
          </View>
        </View>

        {/* Notifications Toggle */}
        <View style={[styles.menuCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.menuItem}>
            <View style={[styles.iconBg, { backgroundColor: colors.softSurface }]}>
              <Icon name="notifications" size={wp('5%')} color={colors.accent} />
            </View>
            <Text style={[styles.menuText, { color: colors.primaryText }]}>Notifications</Text>
            <Switch
              value={notifications}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={notifications ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Menu Items */}
        <View style={[styles.menuCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {[
            { id: '1', icon: 'event-note', label: 'My Bookings' },
            { id: '2', icon: 'star-outline', label: 'Reviews' },
            { id: '3', icon: 'settings', label: 'Settings' },
            { id: '4', icon: 'help-outline', label: 'Help Center' },
          ].map((item, index, array) => (
            <Pressable
              key={item.id}
              style={[
                styles.menuItem,
                index !== array.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
              ]}
              onPress={() => handleMenuItemPress(item.label)}
            >
              <View style={[styles.iconBg, { backgroundColor: colors.softSurface }]}>
                <Icon name={item.icon} size={wp('4.5%')} color={colors.accent} />
              </View>
              <Text style={[styles.menuText, { color: colors.primaryText }]}>{item.label}</Text>
              <Icon name="chevron-right" size={wp('5%')} color={colors.secondaryText} />
            </Pressable>
          ))}
        </View>

        {/* Logout Button */}
        <Pressable 
          style={[styles.logoutButton, { backgroundColor: colors.danger }]}
          onPress={handleLogout}
        >
          <Icon name="logout" size={wp('5%')} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: wp('5%'),
    paddingTop: hp('2%'),
    paddingBottom: hp('12%'),
  },
  title: {
    fontSize: RFPercentage(4.5),
    lineHeight: RFPercentage(5),
    fontWeight: '800',
    marginBottom: hp('2.5%'),
  },
  profileCard: {
    borderRadius: wp('4%'),
    alignItems: 'center',
    padding: wp('5%'),
    marginBottom: hp('2.5%'),
    borderWidth: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: hp('1.5%'),
  },
  avatar: {
    width: wp('24%'),
    height: wp('24%'),
    borderRadius: wp('12%'),
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('4%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: {
    fontSize: RFPercentage(2.5),
    fontWeight: '700',
  },
  email: {
    marginTop: hp('0.5%'),
    fontSize: RFPercentage(1.6),
    marginBottom: hp('1.5%'),
  },
  editButton: {
    flexDirection: 'row',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1%'),
    borderRadius: wp('3%'),
    alignItems: 'center',
    gap: wp('1.5%'),
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: RFPercentage(1.6),
    fontWeight: '700',
  },
  statsCard: {
    borderRadius: wp('4%'),
    flexDirection: 'row',
    padding: wp('4%'),
    marginBottom: hp('2.5%'),
    borderWidth: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: RFPercentage(2.4),
    fontWeight: '800',
  },
  statLabel: {
    marginTop: hp('0.4%'),
    fontSize: RFPercentage(1.1),
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: '70%',
    alignSelf: 'center',
  },
  menuCard: {
    borderRadius: wp('4%'),
    overflow: 'hidden',
    marginBottom: hp('2%'),
    borderWidth: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.8%'),
    gap: wp('3%'),
  },
  iconBg: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    flex: 1,
    fontSize: RFPercentage(1.8),
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    borderRadius: wp('3.5%'),
    padding: wp('4%'),
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp('2%'),
    marginTop: hp('2%'),
  },
  logoutText: {
    color: '#ffffff',
    fontSize: RFPercentage(1.9),
    fontWeight: '700',
  },
});