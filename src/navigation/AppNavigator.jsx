// src/navigation/AppNavigator.jsx
import React from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useColorScheme, View, StyleSheet, Image, Text } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LIGHT_THEME, DARK_THEME } from '../constants/travel-data';
import { ToastProvider } from 'react-native-toast-notifications';

// Screens
import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import SavedScreen from '../screens/SavedScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DetailScreen from '../screens/DetailScreen';
import MapScreen from '../screens/MapScreen';
import BookingScreen from '../screens/BookingScreen';
import ModalScreen from '../screens/ModalScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Custom Header Component for Home Screen
function HomeHeader({ colors, isDark }) {
  return (
    <View
      style={[
        styles.headerContainer,
        { backgroundColor: colors.surface, borderBottomColor: colors.border },
      ]}
    >
      <View style={styles.headerContent}>
        <View style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
          <Text
            style={[styles.headerGreeting, { color: colors.secondaryText }]}
          >
            Welcome back
          </Text>
          {/* <Text style={[styles.headerTitle, { color: colors.primaryText }]}>
            Where do{"\n"}
            <Text style={styles.headerTitleStrong}>you want to go?</Text>
          </Text> */}
        </View>
        <Image
          source={{ uri: 'https://i.pravatar.cc/100?img=12' }}
          style={styles.headerAvatar}
        />
      </View>
    </View>
  );
}

function TabNavigator() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? DARK_THEME : LIGHT_THEME;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: hp('8%'),
          paddingBottom: hp('1%'),
          paddingTop: hp('0.5%'),
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.mutedText,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: wp('2.5%'),
          fontWeight: '600',
          marginTop: hp('0.3%'),
        },
        tabBarIcon: ({ color, focused, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home';
          } else if (route.name === 'Explore') {
            iconName = focused ? 'explore' : 'explore';
          } else if (route.name === 'Saved') {
            iconName = focused ? 'bookmark' : 'bookmark-border';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Icon name={iconName} size={size || wp('6%')} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          // Add custom header for Home screen
          headerShown: true,
          header: ({ navigation, route, options }) => (
            <HomeHeader colors={colors} isDark={isDark} />
          ),
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarLabel: 'Explore',
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.primaryText,
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: wp('5%'),
          },
          headerTitle: 'Explore',
        }}
      />
      <Tab.Screen
        name="Saved"
        component={SavedScreen}
        options={{
          tabBarLabel: 'Saved',
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.primaryText,
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: wp('5%'),
          },
          headerTitle: 'Saved Places',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.primaryText,
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: wp('5%'),
          },
          headerTitle: 'My Profile',
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? DARK_THEME : LIGHT_THEME;

  const headerOptions = {
    headerStyle: {
      backgroundColor: colors.surface,
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
    },
    headerTintColor: colors.primaryText,
    headerTitleStyle: {
      fontWeight: '700',
      fontSize: wp('5%'),
      color: colors.primaryText,
    },
    headerBackTitleVisible: false,
  };

  return (
    <ToastProvider
      placement="top"
      duration={3000}
      animationType="slide-in"
      animationDuration={250}
      successColor="green"
      dangerColor="red"
      warningColor="orange"
      normalColor="gray"
      textStyle={{ fontSize: 14 }}
      offsetTop={50}
      offsetBottom={40}
      swipeEnabled={true}
    >
      <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
        <Stack.Navigator>
          <Stack.Screen
            name="MainTabs"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Detail"
            component={DetailScreen}
            options={{
              ...headerOptions,
              title: 'Place Details',
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="Map"
            component={MapScreen}
            options={{
              ...headerOptions,
              title: 'Map',
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="Booking"
            component={BookingScreen}
            options={{
              ...headerOptions,
              title: 'Book Your Trip',
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen
            name="Modal"
            component={ModalScreen}
            options={{ presentation: 'modal', title: 'Modal' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ToastProvider>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: hp('2%'),
    paddingBottom: hp('1.5%'),
    paddingHorizontal: wp('5%'),
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerGreeting: {
    fontSize: RFPercentage(3),
    fontWeight: '500',
    marginBottom: hp('0.3%'),
  },
  headerTitle: {
    fontSize: RFPercentage(4.5),
    lineHeight: RFPercentage(5.5),
    fontWeight: '500',
    letterSpacing: -0.6,
  },
  headerTitleStrong: {
    fontWeight: '800',
  },
  headerAvatar: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('6%'),
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.1)',
  },
});
