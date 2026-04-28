// src/screens/BookingScreen.jsx
import React, { useState, useMemo } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  View,
  useColorScheme,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LIGHT_THEME, DARK_THEME, PLACES } from '../constants/travel-data';

const PLACE_SUGGESTIONS = {
  '1': {
    city: 'Rome',
    activities: ['Historical Tours', 'Museum Visits', 'Local Cuisine', 'Photography'],
    hotels: ['Hotel Artemide', 'Colonna Palace', 'Artemide Hotel', 'Golden House'],
    attractions: ['Roman Forum', 'Vatican City', 'Pantheon', 'Trevi Fountain'],
    packages: ['3-Day Rome Explorer', '5-Day History Tour', 'Romantic Rome Getaway'],
    bestTime: 'April - May, September - October',
    avgDuration: '3-4 hours',
    difficulty: 'Easy',
  },
  '2': {
    city: 'East Java',
    activities: ['Hiking', 'Sunrise Trekking', 'Photography', 'Nature Walks'],
    hotels: ['Bromo View Hotel', 'Cemoro Lawang Resort', 'Mount Bromo Hotel', 'Sunrise Point Lodge'],
    attractions: ['Crater Rim Trek', 'Sunrise Point', 'Sand Sea', 'Tengger Villages'],
    packages: ['2-Day Bromo Adventure', '3-Day Mountain Tour', 'Sunrise Hiking Package'],
    bestTime: 'April - October',
    avgDuration: '2-3 days',
    difficulty: 'Moderate',
  },
  '3': {
    city: 'Cyclades',
    activities: ['Sunset Viewing', 'Beach Relaxation', 'Wine Tasting', 'Island Hopping'],
    hotels: ['Astra Suites', 'Chromata', 'Santozeum', 'Mystique Luxury Collection'],
    attractions: ['Caldera View', 'Blue Dome Churches', 'Volcanic Beaches', 'Local Vineyards'],
    packages: ['5-Day Romantic Escape', 'Greek Island Hopper', '7-Day Santorini Dream'],
    bestTime: 'May - September',
    avgDuration: '3-5 days',
    difficulty: 'Easy',
  },
};

// Test credentials for payment
const TEST_CREDENTIALS = {
  card: {
    number: '4242 4242 4242 4242',
    expiry: '12/26',
    cvv: '123',
    name: 'TEST USER'
  },
  upi: 'test@okhdfcbank',
  netbanking: {
    bank: 'SBI',
    username: 'testuser',
    password: 'test123'
  },
  paypal: 'test@paypal.com'
};

export default function BookingScreen({ navigation, route }) {
  const isDark = useColorScheme() === 'dark';
  const colors = isDark ? DARK_THEME : LIGHT_THEME;
  const { placeId, placeName, price } = route.params;

  const suggestions = useMemo(() => {
    return PLACE_SUGGESTIONS[placeId] || PLACE_SUGGESTIONS['1'];
  }, [placeId]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    checkInDate: '',
    checkOutDate: '',
    guests: '1',
    selectedHotel: null,
    selectedActivities: [], // Changed to array for multi-select
    selectedAttractions: [], // Changed to array for multi-select
    selectedPackage: null,
    specialRequests: '',
  });

  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardName: '',
    upiId: '',
    netbankingBank: 'SBI',
    netbankingUsername: '',
    netbankingPassword: '',
    paypalEmail: '',
  });
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle multi-select for activities
  const toggleActivity = (activity) => {
    setFormData(prev => {
      const current = prev.selectedActivities;
      if (current.includes(activity)) {
        return { ...prev, selectedActivities: current.filter(a => a !== activity) };
      } else {
        return { ...prev, selectedActivities: [...current, activity] };
      }
    });
  };

  // Handle multi-select for attractions
  const toggleAttraction = (attraction) => {
    setFormData(prev => {
      const current = prev.selectedAttractions;
      if (current.includes(attraction)) {
        return { ...prev, selectedAttractions: current.filter(a => a !== attraction) };
      } else {
        return { ...prev, selectedAttractions: [...current, attraction] };
      }
    });
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      Alert.alert('Validation Error', 'Please enter your first name');
      return false;
    }
    if (!formData.lastName.trim()) {
      Alert.alert('Validation Error', 'Please enter your last name');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return false;
    }
    if (!formData.phone.trim()) {
      Alert.alert('Validation Error', 'Please enter your phone number');
      return false;
    }
    if (!formData.checkInDate.trim()) {
      Alert.alert('Validation Error', 'Please enter check-in date (DD/MM/YYYY)');
      return false;
    }
    if (!formData.checkOutDate.trim()) {
      Alert.alert('Validation Error', 'Please enter check-out date (DD/MM/YYYY)');
      return false;
    }
    return true;
  };

  const validatePayment = () => {
    if (paymentMethod === 'card') {
      if (!paymentDetails.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
        Alert.alert('Validation Error', 'Please enter valid 16-digit card number');
        return false;
      }
      if (!paymentDetails.cardExpiry.match(/^\d{2}\/\d{2}$/)) {
        Alert.alert('Validation Error', 'Please enter valid expiry date (MM/YY)');
        return false;
      }
      if (!paymentDetails.cardCvv.match(/^\d{3,4}$/)) {
        Alert.alert('Validation Error', 'Please enter valid CVV');
        return false;
      }
      if (!paymentDetails.cardName.trim()) {
        Alert.alert('Validation Error', 'Please enter cardholder name');
        return false;
      }
    } else if (paymentMethod === 'upi') {
      if (!paymentDetails.upiId.includes('@')) {
        Alert.alert('Validation Error', 'Please enter valid UPI ID');
        return false;
      }
    } else if (paymentMethod === 'netbanking') {
      if (!paymentDetails.netbankingUsername.trim() || !paymentDetails.netbankingPassword.trim()) {
        Alert.alert('Validation Error', 'Please enter netbanking credentials');
        return false;
      }
    } else if (paymentMethod === 'paypal') {
      if (!paymentDetails.paypalEmail.includes('@')) {
        Alert.alert('Validation Error', 'Please enter valid PayPal email');
        return false;
      }
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validatePayment()) return;

    setPaymentProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPaymentProcessing(false);
      setShowPaymentModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      Alert.alert('Payment Failed', 'Please try again');
      setPaymentProcessing(false);
    }
  };

  const handleBooking = () => {
    if (!validateForm()) return;
    setShowPaymentModal(true);
  };

  const handleSuccessAction = (action) => {
    setShowSuccessModal(false);
    if (action === 'home') {
      navigation.popToTop();
      navigation.navigate('MainTabs', { screen: 'Home' });
    } else if (action === 'download') {
      // Simulate download
      Alert.alert('Download Started', 'Your booking confirmation is being downloaded');
    } else if (action === 'view') {
      Alert.alert('Booking Details', `Booking confirmed for ${placeName}\nGuests: ${formData.guests}\nDates: ${formData.checkInDate} - ${formData.checkOutDate}`);
    }
  };

  const guestOptions = ['1', '2', '3', '4'];
  const totalPrice = parseInt(price.replace('$', ''));
  const guestCount = parseInt(formData.guests);
  const estimatedTotal = totalPrice * guestCount;
  const selectedActivitiesCount = formData.selectedActivities.length;
  const selectedAttractionsCount = formData.selectedAttractions.length;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.screenBg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Card */}
          <View style={[styles.headerCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.placeName, { color: colors.primaryText }]}>{placeName}</Text>
            <View style={styles.locationRow}>
              <Icon name="location-on" size={wp('4%')} color={colors.accent} />
              <Text style={[styles.locationText, { color: colors.secondaryText }]}>{suggestions.city}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: colors.secondaryText }]}>Per Person:</Text>
              <Text style={[styles.basePrice, { color: colors.accent }]}>{price}</Text>
            </View>
          </View>

          {/* Quick Info */}
          <View style={[styles.quickInfo, { backgroundColor: colors.softSurface }]}>
            <View style={styles.infoItem}>
              <Icon name="schedule" size={wp('4%')} color={colors.accent} />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: colors.secondaryText }]}>Duration</Text>
                <Text style={[styles.infoValue, { color: colors.primaryText }]}>{suggestions.avgDuration}</Text>
              </View>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoItem}>
              <Icon name="trending-up" size={wp('4%')} color={colors.accent} />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: colors.secondaryText }]}>Difficulty</Text>
                <Text style={[styles.infoValue, { color: colors.primaryText }]}>{suggestions.difficulty}</Text>
              </View>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoItem}>
              <Icon name="event-note" size={wp('4%')} color={colors.accent} />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: colors.secondaryText }]}>Best Time</Text>
                <Text style={[styles.infoValue, { color: colors.primaryText }]}>{suggestions.bestTime.split(',')[0]}</Text>
              </View>
            </View>
          </View>

          {/* Hotels */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>Recommended Hotels</Text>
            <View style={styles.suggestionGrid}>
              {suggestions.hotels.map((hotel, index) => (
                <Pressable
                  key={index}
                  style={[
                    styles.suggestionChip,
                    {
                      backgroundColor: formData.selectedHotel === hotel ? colors.accent : colors.softSurface,
                      borderColor: formData.selectedHotel === hotel ? colors.accent : colors.border,
                    },
                  ]}
                  onPress={() => handleInputChange('selectedHotel', formData.selectedHotel === hotel ? null : hotel)}
                >
                  <Icon 
                    name="home" 
                    size={wp('4%')} 
                    color={formData.selectedHotel === hotel ? '#fff' : colors.accent} 
                  />
                  <Text
                    style={[
                      styles.suggestionText,
                      {
                        color: formData.selectedHotel === hotel ? '#fff' : colors.primaryText,
                        fontWeight: formData.selectedHotel === hotel ? '700' : '600',
                      },
                    ]}
                  >
                    {hotel}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Activities - Multi-select */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>
              Suggested Activities
              {selectedActivitiesCount > 0 && (
                <Text style={[styles.selectionCount, { color: colors.accent }]}> ({selectedActivitiesCount} selected)</Text>
              )}
            </Text>
            <View style={styles.suggestionGrid}>
              {suggestions.activities.map((activity, index) => (
                <Pressable
                  key={index}
                  style={[
                    styles.suggestionChip,
                    {
                      backgroundColor: formData.selectedActivities.includes(activity) ? colors.accent : colors.softSurface,
                      borderColor: formData.selectedActivities.includes(activity) ? colors.accent : colors.border,
                    },
                  ]}
                  onPress={() => toggleActivity(activity)}
                >
                  <Icon 
                    name={formData.selectedActivities.includes(activity) ? "check-circle" : "add-circle-outline"} 
                    size={wp('4%')} 
                    color={formData.selectedActivities.includes(activity) ? '#fff' : colors.accent} 
                  />
                  <Text
                    style={[
                      styles.suggestionText,
                      {
                        color: formData.selectedActivities.includes(activity) ? '#fff' : colors.primaryText,
                        fontWeight: formData.selectedActivities.includes(activity) ? '700' : '600',
                      },
                    ]}
                  >
                    {activity}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Attractions - Multi-select */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>
              Top Attractions
              {selectedAttractionsCount > 0 && (
                <Text style={[styles.selectionCount, { color: colors.accent }]}> ({selectedAttractionsCount} selected)</Text>
              )}
            </Text>
            <View style={styles.suggestionGrid}>
              {suggestions.attractions.map((attraction, index) => (
                <Pressable
                  key={index}
                  style={[
                    styles.suggestionChip,
                    {
                      backgroundColor: formData.selectedAttractions.includes(attraction) ? colors.accent : colors.softSurface,
                      borderColor: formData.selectedAttractions.includes(attraction) ? colors.accent : colors.border,
                    },
                  ]}
                  onPress={() => toggleAttraction(attraction)}
                >
                  <Icon 
                    name={formData.selectedAttractions.includes(attraction) ? "check-circle" : "add-circle-outline"} 
                    size={wp('4%')} 
                    color={formData.selectedAttractions.includes(attraction) ? '#fff' : colors.accent} 
                  />
                  <Text
                    style={[
                      styles.suggestionText,
                      {
                        color: formData.selectedAttractions.includes(attraction) ? '#fff' : colors.primaryText,
                        fontWeight: formData.selectedAttractions.includes(attraction) ? '700' : '600',
                      },
                    ]}
                  >
                    {attraction}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Packages */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>Tour Packages</Text>
            <View style={styles.packageList}>
              {suggestions.packages.map((pkg, index) => (
                <Pressable
                  key={index}
                  style={[
                    styles.packageItem,
                    {
                      backgroundColor: formData.selectedPackage === pkg ? colors.accent : colors.softSurface,
                      borderColor: formData.selectedPackage === pkg ? colors.accent : colors.border,
                    },
                  ]}
                  onPress={() => handleInputChange('selectedPackage', formData.selectedPackage === pkg ? null : pkg)}
                >
                  <Icon 
                    name={formData.selectedPackage === pkg ? "check-circle" : "radio-button-unchecked"} 
                    size={wp('5%')} 
                    color={formData.selectedPackage === pkg ? '#fff' : colors.accent} 
                  />
                  <Text
                    style={[
                      styles.packageText,
                      {
                        color: formData.selectedPackage === pkg ? '#fff' : colors.primaryText,
                        fontWeight: formData.selectedPackage === pkg ? '700' : '600',
                      },
                    ]}
                  >
                    {pkg}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Guest Selection - Small and inline */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>Number of Guests</Text>
            <View style={styles.guestGrid}>
              {guestOptions.map(option => (
                <Pressable
                  key={option}
                  style={[
                    styles.guestButton,
                    {
                      backgroundColor: formData.guests === option ? colors.accent : colors.softSurface,
                      borderColor: formData.guests === option ? colors.accent : colors.border,
                    },
                  ]}
                  onPress={() => handleInputChange('guests', option)}
                >
                  <Text
                    style={[
                      styles.guestButtonText,
                      {
                        color: formData.guests === option ? '#fff' : colors.primaryText,
                        fontWeight: formData.guests === option ? '700' : '600',
                      },
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Date Selection */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>Travel Dates</Text>
            <View style={styles.dateRow}>
              <View style={styles.dateInputWrapper}>
                <Text style={[styles.inputLabel, { color: colors.secondaryText }]}>Check-in</Text>
                <TextInput
                  style={[
                    styles.dateInput,
                    {
                      backgroundColor: colors.softSurface,
                      borderColor: colors.border,
                      color: colors.primaryText,
                    },
                  ]}
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor={colors.mutedText}
                  value={formData.checkInDate}
                  onChangeText={value => handleInputChange('checkInDate', value)}
                />
              </View>
              <View style={styles.dateInputWrapper}>
                <Text style={[styles.inputLabel, { color: colors.secondaryText }]}>Check-out</Text>
                <TextInput
                  style={[
                    styles.dateInput,
                    {
                      backgroundColor: colors.softSurface,
                      borderColor: colors.border,
                      color: colors.primaryText,
                    },
                  ]}
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor={colors.mutedText}
                  value={formData.checkOutDate}
                  onChangeText={value => handleInputChange('checkOutDate', value)}
                />
              </View>
            </View>
          </View>

          {/* Personal Information */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>Your Information</Text>
            <View style={styles.nameRow}>
              <View style={styles.nameInputWrapper}>
                <Text style={[styles.inputLabel, { color: colors.secondaryText }]}>First Name</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.softSurface,
                      borderColor: colors.border,
                      color: colors.primaryText,
                    },
                  ]}
                  placeholder="John"
                  placeholderTextColor={colors.mutedText}
                  value={formData.firstName}
                  onChangeText={value => handleInputChange('firstName', value)}
                />
              </View>
              <View style={styles.nameInputWrapper}>
                <Text style={[styles.inputLabel, { color: colors.secondaryText }]}>Last Name</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.softSurface,
                      borderColor: colors.border,
                      color: colors.primaryText,
                    },
                  ]}
                  placeholder="Doe"
                  placeholderTextColor={colors.mutedText}
                  value={formData.lastName}
                  onChangeText={value => handleInputChange('lastName', value)}
                />
              </View>
            </View>

            <Text style={[styles.inputLabel, { color: colors.secondaryText }]}>Email Address</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.softSurface,
                  borderColor: colors.border,
                  color: colors.primaryText,
                },
              ]}
              placeholder="john@example.com"
              placeholderTextColor={colors.mutedText}
              keyboardType="email-address"
              value={formData.email}
              onChangeText={value => handleInputChange('email', value)}
            />

            <Text style={[styles.inputLabel, { color: colors.secondaryText, marginTop: hp('1.5%') }]}>
              Phone Number
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.softSurface,
                  borderColor: colors.border,
                  color: colors.primaryText,
                },
              ]}
              placeholder="+1 (555) 123-4567"
              placeholderTextColor={colors.mutedText}
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={value => handleInputChange('phone', value)}
            />
          </View>

          {/* Special Requests */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>Special Requests (Optional)</Text>
            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: colors.softSurface,
                  borderColor: colors.border,
                  color: colors.primaryText,
                },
              ]}
              placeholder="Let us know if you have any special requirements..."
              placeholderTextColor={colors.mutedText}
              multiline
              numberOfLines={3}
              value={formData.specialRequests}
              onChangeText={value => handleInputChange('specialRequests', value)}
              textAlignVertical="top"
            />
          </View>

          {/* Price Breakdown */}
          <View style={[styles.priceBreakdown, { backgroundColor: colors.softSurface, borderColor: colors.border }]}>
            <Text style={[styles.breakdownTitle, { color: colors.primaryText }]}>Price Breakdown</Text>

            <View style={styles.breakdownRow}>
              <Text style={[styles.breakdownLabel, { color: colors.secondaryText }]}>
                {price} × {formData.guests} {formData.guests === '1' ? 'guest' : 'guests'}
              </Text>
              <Text style={[styles.breakdownValue, { color: colors.primaryText }]}>
                ${estimatedTotal}
              </Text>
            </View>

            {selectedActivitiesCount > 0 && (
              <View style={styles.breakdownRow}>
                <Text style={[styles.breakdownLabel, { color: colors.secondaryText }]}>
                  Activities ({selectedActivitiesCount})
                </Text>
                <Text style={[styles.breakdownValue, { color: colors.primaryText }]}>
                  ${selectedActivitiesCount * 15}
                </Text>
              </View>
            )}

            {selectedAttractionsCount > 0 && (
              <View style={styles.breakdownRow}>
                <Text style={[styles.breakdownLabel, { color: colors.secondaryText }]}>
                  Attractions ({selectedAttractionsCount})
                </Text>
                <Text style={[styles.breakdownValue, { color: colors.primaryText }]}>
                  ${selectedAttractionsCount * 10}
                </Text>
              </View>
            )}

            <View style={[styles.breakdownRow, { borderTopColor: colors.border, borderTopWidth: 1, paddingTop: hp('1%'), marginTop: hp('1%') }]}>
              <Text style={[styles.totalLabel, { color: colors.primaryText }]}>Total Price</Text>
              <Text style={[styles.totalPrice, { color: colors.accent }]}>
                ${estimatedTotal + (selectedActivitiesCount * 15) + (selectedAttractionsCount * 10)}
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Booking Button */}
      <View style={[styles.bookingFooter, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <Pressable
          style={[styles.bookButton, { backgroundColor: colors.accent }]}
          onPress={handleBooking}
        >
          <Icon name="check-circle" size={wp('5%')} color="#fff" />
          <Text style={styles.bookButtonText}>Confirm Booking</Text>
        </Pressable>
      </View>

      {/* Payment Modal */}
      <Modal
        visible={showPaymentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.primaryText }]}>Payment Details</Text>
              <Pressable onPress={() => setShowPaymentModal(false)}>
                <Icon name="close" size={wp('6%')} color={colors.secondaryText} />
              </Pressable>
            </View>

            <Text style={[styles.modalSubtitle, { color: colors.secondaryText }]}>
              Total Amount: ${estimatedTotal + (selectedActivitiesCount * 15) + (selectedAttractionsCount * 10)}
            </Text>

            {/* Payment Method Selection */}
            <View style={styles.paymentMethods}>
              {[
                { id: 'card', name: 'Card', icon: 'credit-card' },
                { id: 'upi', name: 'UPI', icon: 'qr-code' },
                { id: 'netbanking', name: 'Net Banking', icon: 'account-balance' },
                { id: 'paypal', name: 'PayPal', icon: 'payment' },
              ].map(method => (
                <Pressable
                  key={method.id}
                  style={[
                    styles.paymentMethodBtn,
                    { backgroundColor: paymentMethod === method.id ? colors.accent : colors.softSurface },
                  ]}
                  onPress={() => setPaymentMethod(method.id)}
                >
                  <Icon name={method.icon} size={wp('5%')} color={paymentMethod === method.id ? '#fff' : colors.primaryText} />
                  <Text style={[styles.paymentMethodText, { color: paymentMethod === method.id ? '#fff' : colors.primaryText }]}>
                    {method.name}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Test Credentials Info */}
            <View style={[styles.testCredentials, { backgroundColor: colors.softSurface }]}>
              <Icon name="info" size={wp('4%')} color={colors.accent} />
              <Text style={[styles.testCredentialsText, { color: colors.secondaryText }]}>
                Test Credentials:
              </Text>
            </View>
            <Text style={[styles.testCredsDetails, { color: colors.mutedText }]}>
              Card: 4242 4242 4242 4242 | Exp: 12/26 | CVV: 123
              {'\n'}UPI: test@okhdfcbank
              {'\n'}NetBanking: testuser / test123
              {'\n'}PayPal: test@paypal.com
            </Text>

            {/* Payment Forms */}
            <ScrollView style={styles.paymentForm} showsVerticalScrollIndicator={false}>
              {paymentMethod === 'card' && (
                <View>
                  <TextInput
                    style={[styles.paymentInput, { backgroundColor: colors.softSurface, borderColor: colors.border, color: colors.primaryText }]}
                    placeholder="Card Number"
                    placeholderTextColor={colors.mutedText}
                    keyboardType="numeric"
                    value={paymentDetails.cardNumber}
                    onChangeText={(text) => {
                      let cleaned = text.replace(/\s/g, '');
                      let formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
                      setPaymentDetails({ ...paymentDetails, cardNumber: formatted });
                    }}
                    maxLength={19}
                  />
                  <View style={styles.rowInputs}>
                    <TextInput
                      style={[styles.halfInput, { backgroundColor: colors.softSurface, borderColor: colors.border, color: colors.primaryText }]}
                      placeholder="MM/YY"
                      placeholderTextColor={colors.mutedText}
                      value={paymentDetails.cardExpiry}
                      onChangeText={(text) => setPaymentDetails({ ...paymentDetails, cardExpiry: text })}
                      maxLength={5}
                    />
                    <TextInput
                      style={[styles.halfInput, { backgroundColor: colors.softSurface, borderColor: colors.border, color: colors.primaryText }]}
                      placeholder="CVV"
                      placeholderTextColor={colors.mutedText}
                      keyboardType="numeric"
                      value={paymentDetails.cardCvv}
                      onChangeText={(text) => setPaymentDetails({ ...paymentDetails, cardCvv: text })}
                      maxLength={4}
                    />
                  </View>
                  <TextInput
                    style={[styles.paymentInput, { backgroundColor: colors.softSurface, borderColor: colors.border, color: colors.primaryText }]}
                    placeholder="Cardholder Name"
                    placeholderTextColor={colors.mutedText}
                    value={paymentDetails.cardName}
                    onChangeText={(text) => setPaymentDetails({ ...paymentDetails, cardName: text })}
                  />
                </View>
              )}

              {paymentMethod === 'upi' && (
                <TextInput
                  style={[styles.paymentInput, { backgroundColor: colors.softSurface, borderColor: colors.border, color: colors.primaryText }]}
                  placeholder="UPI ID (e.g., name@bank)"
                  placeholderTextColor={colors.mutedText}
                  value={paymentDetails.upiId}
                  onChangeText={(text) => setPaymentDetails({ ...paymentDetails, upiId: text })}
                />
              )}

              {paymentMethod === 'netbanking' && (
                <View>
                  <View style={[styles.bankSelector, { backgroundColor: colors.softSurface, borderColor: colors.border }]}>
                    {['SBI', 'HDFC', 'ICICI', 'Axis'].map(bank => (
                      <Pressable
                        key={bank}
                        style={[
                          styles.bankOption,
                          { backgroundColor: paymentDetails.netbankingBank === bank ? colors.accent : 'transparent' },
                        ]}
                        onPress={() => setPaymentDetails({ ...paymentDetails, netbankingBank: bank })}
                      >
                        <Text style={[styles.bankOptionText, { color: paymentDetails.netbankingBank === bank ? '#fff' : colors.primaryText }]}>
                          {bank}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                  <TextInput
                    style={[styles.paymentInput, { backgroundColor: colors.softSurface, borderColor: colors.border, color: colors.primaryText }]}
                    placeholder="Username"
                    placeholderTextColor={colors.mutedText}
                    value={paymentDetails.netbankingUsername}
                    onChangeText={(text) => setPaymentDetails({ ...paymentDetails, netbankingUsername: text })}
                  />
                  <TextInput
                    style={[styles.paymentInput, { backgroundColor: colors.softSurface, borderColor: colors.border, color: colors.primaryText }]}
                    placeholder="Password"
                    placeholderTextColor={colors.mutedText}
                    secureTextEntry
                    value={paymentDetails.netbankingPassword}
                    onChangeText={(text) => setPaymentDetails({ ...paymentDetails, netbankingPassword: text })}
                  />
                </View>
              )}

              {paymentMethod === 'paypal' && (
                <TextInput
                  style={[styles.paymentInput, { backgroundColor: colors.softSurface, borderColor: colors.border, color: colors.primaryText }]}
                  placeholder="PayPal Email"
                  placeholderTextColor={colors.mutedText}
                  keyboardType="email-address"
                  value={paymentDetails.paypalEmail}
                  onChangeText={(text) => setPaymentDetails({ ...paymentDetails, paypalEmail: text })}
                />
              )}
            </ScrollView>

            {/* Pay Now Button */}
            <Pressable
              style={[styles.payButton, { backgroundColor: colors.success }]}
              onPress={handlePayment}
              disabled={paymentProcessing}
            >
              {paymentProcessing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Icon name="lock" size={wp('4%')} color="#fff" />
                  <Text style={styles.payButtonText}>Pay Now</Text>
                </>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.successModal, { backgroundColor: colors.surface }]}>
            <View style={styles.successIcon}>
              <Icon name="check-circle" size={wp('15%')} color={colors.success} />
            </View>
            <Text style={[styles.successTitle, { color: colors.primaryText }]}>Payment Successful!</Text>
            <Text style={[styles.successMessage, { color: colors.secondaryText }]}>
              Your booking for {placeName} has been confirmed.
            </Text>
            <Text style={[styles.bookingRef, { color: colors.accent }]}>
              Booking Ref: #{Math.random().toString(36).substr(2, 8).toUpperCase()}
            </Text>
            
            <View style={styles.successActions}>
              <Pressable
                style={[styles.successBtn, { backgroundColor: colors.accent }]}
                onPress={() => handleSuccessAction('home')}
              >
                <Icon name="home" size={wp('4%')} color="#fff" />
                <Text style={styles.successBtnText}>Go to Home</Text>
              </Pressable>
              
              <Pressable
                style={[styles.successBtn, { backgroundColor: colors.success, borderColor: colors.border, borderWidth: 1 }]}
                onPress={() => handleSuccessAction('download')}
              >
                <Icon name="download" size={wp('4%')} color="#fff" />
                <Text style={styles.successBtnText}>Download Booking</Text>
              </Pressable>
              
              <Pressable
                style={[styles.successBtn, { backgroundColor: colors.softSurface }]}
                onPress={() => handleSuccessAction('view')}
              >
                <Icon name="receipt" size={wp('4%')} color={colors.primaryText} />
                <Text style={[styles.successBtnText, { color: colors.primaryText }]}>View Details</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: wp('4.5%'),
    paddingTop: hp('2%'),
    paddingBottom: hp('10%'),
  },
  headerCard: {
    borderRadius: wp('3.5%'),
    padding: wp('4%'),
    marginBottom: hp('2%'),
    borderWidth: 1,
  },
  placeName: {
    fontSize: RFPercentage(3),
    fontWeight: '800',
    marginBottom: hp('1%'),
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1.5%'),
    marginBottom: hp('1%'),
  },
  locationText: {
    fontSize: RFPercentage(1.5),
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: RFPercentage(1.5),
  },
  basePrice: {
    fontSize: RFPercentage(2.5),
    fontWeight: '700',
  },
  quickInfo: {
    borderRadius: wp('3%'),
    padding: wp('3%'),
    marginBottom: hp('2.5%'),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  infoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1.5%'),
    justifyContent: 'center',
  },
  infoTextContainer: {
    flex: 1,
  },
  infoDivider: {
    width: 1,
    height: hp('7%'),
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginHorizontal: wp('1%'),
  },
  infoLabel: {
    fontSize: RFPercentage(1),
    fontWeight: '600',
    marginBottom: hp('0.3%'),
  },
  infoValue: {
    fontSize: RFPercentage(1.3),
    fontWeight: '700',
  },
  section: {
    marginBottom: hp('2.5%'),
  },
  sectionTitle: {
    fontSize: RFPercentage(2.2),
    fontWeight: '700',
    marginBottom: hp('1.2%'),
  },
  selectionCount: {
    fontSize: RFPercentage(1.6),
    fontWeight: '500',
  },
  suggestionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp('2%'),
  },
  suggestionChip: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2%'),
    paddingVertical: hp('1.2%'),
    paddingHorizontal: wp('2.5%'),
    borderRadius: wp('2.5%'),
    borderWidth: 1.5,
  },
  suggestionText: {
    fontSize: RFPercentage(1.3),
    flex: 1,
  },
  packageList: {
    gap: wp('2%'),
  },
  packageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2.5%'),
    paddingVertical: hp('1.2%'),
    paddingHorizontal: wp('3%'),
    borderRadius: wp('2.5%'),
    borderWidth: 1.5,
  },
  packageText: {
    fontSize: RFPercentage(1.6),
    flex: 1,
  },
  guestGrid: {
    flexDirection: 'row',
    gap: wp('2%'),
  },
  guestButton: {
    flex: 1,
    paddingVertical: hp('1%'),
    borderRadius: wp('2.5%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  guestButtonText: {
    fontSize: RFPercentage(1.6),
  },
  dateRow: {
    flexDirection: 'row',
    gap: wp('2%'),
  },
  dateInputWrapper: {
    flex: 1,
  },
  dateInput: {
    height: hp('5%'),
    borderRadius: wp('2.5%'),
    paddingHorizontal: wp('3%'),
    fontSize: RFPercentage(1.4),
    borderWidth: 1,
  },
  nameRow: {
    flexDirection: 'row',
    gap: wp('2%'),
    marginBottom: hp('1.5%'),
  },
  nameInputWrapper: {
    flex: 1,
  },
  inputLabel: {
    fontSize: RFPercentage(1.4),
    fontWeight: '600',
    marginBottom: hp('0.7%'),
  },
  input: {
    height: hp('5.5%'),
    borderRadius: wp('2.5%'),
    paddingHorizontal: wp('3.5%'),
    fontSize: RFPercentage(1.6),
    borderWidth: 1,
  },
  textArea: {
    borderRadius: wp('2.5%'),
    paddingHorizontal: wp('3.5%'),
    paddingVertical: hp('1%'),
    fontSize: RFPercentage(1.5),
    borderWidth: 1,
    minHeight: hp('8%'),
  },
  priceBreakdown: {
    borderRadius: wp('3%'),
    padding: wp('4%'),
    marginBottom: hp('2%'),
    borderWidth: 1,
  },
  breakdownTitle: {
    fontSize: RFPercentage(1.8),
    fontWeight: '700',
    marginBottom: hp('1.2%'),
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('0.8%'),
  },
  breakdownLabel: {
    fontSize: RFPercentage(1.4),
  },
  breakdownValue: {
    fontSize: RFPercentage(1.5),
    fontWeight: '600',
  },
  totalLabel: {
    fontSize: RFPercentage(1.6),
    fontWeight: '700',
  },
  totalPrice: {
    fontSize: RFPercentage(2.2),
    fontWeight: '800',
  },
  bookingFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: wp('4.5%'),
    paddingVertical: hp('1.5%'),
    borderTopWidth: 1,
  },
  bookButton: {
    height: hp('6.5%'),
    borderRadius: wp('3%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp('2%'),
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: RFPercentage(2),
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: wp('5%'),
    borderTopRightRadius: wp('5%'),
    paddingHorizontal: wp('5%'),
    paddingTop: hp('2%'),
    paddingBottom: hp('3%'),
    maxHeight: hp('90%'),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
  },
  modalTitle: {
    fontSize: RFPercentage(2.5),
    fontWeight: '800',
  },
  modalSubtitle: {
    fontSize: RFPercentage(1.8),
    fontWeight: '600',
    marginBottom: hp('2%'),
  },
  paymentMethods: {
    flexDirection: 'row',
    gap: wp('2%'),
    marginBottom: hp('2%'),
  },
  paymentMethodBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: hp('1%'),
    borderRadius: wp('2.5%'),
    gap: wp('1%'),
  },
  paymentMethodText: {
    fontSize: RFPercentage(1.2),
    fontWeight: '600',
  },
  testCredentials: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1%'),
    padding: wp('2%'),
    borderRadius: wp('2%'),
    marginBottom: hp('1%'),
  },
  testCredentialsText: {
    fontSize: RFPercentage(1.2),
    fontWeight: '700',
  },
  testCredsDetails: {
    fontSize: RFPercentage(1.1),
    marginBottom: hp('2%'),
  },
  paymentForm: {
    maxHeight: hp('30%'),
  },
  paymentInput: {
    height: hp('5.5%'),
    borderRadius: wp('2.5%'),
    paddingHorizontal: wp('3%'),
    fontSize: RFPercentage(1.6),
    borderWidth: 1,
    marginBottom: hp('1%'),
  },
  rowInputs: {
    flexDirection: 'row',
    gap: wp('2%'),
    marginBottom: hp('1%'),
  },
  halfInput: {
    flex: 1,
    height: hp('5.5%'),
    borderRadius: wp('2.5%'),
    paddingHorizontal: wp('3%'),
    fontSize: RFPercentage(1.6),
    borderWidth: 1,
  },
  bankSelector: {
    flexDirection: 'row',
    gap: wp('2%'),
    padding: wp('1%'),
    borderRadius: wp('2.5%'),
    borderWidth: 1,
    marginBottom: hp('1.5%'),
  },
  bankOption: {
    flex: 1,
    paddingVertical: hp('0.8%'),
    alignItems: 'center',
    borderRadius: wp('2%'),
  },
  bankOptionText: {
    fontSize: RFPercentage(1.4),
    fontWeight: '600',
  },
  payButton: {
    height: hp('6%'),
    borderRadius: wp('3%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp('2%'),
    marginTop: hp('2%'),
  },
  payButtonText: {
    color: '#fff',
    fontSize: RFPercentage(1.8),
    fontWeight: '700',
  },
  successModal: {
    marginHorizontal: wp('8%'),
    borderRadius: wp('5%'),
    padding: wp('6%'),
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: hp('2%'),
  },
  successTitle: {
    fontSize: RFPercentage(2.8),
    fontWeight: '800',
    marginBottom: hp('1%'),
  },
  successMessage: {
    fontSize: RFPercentage(1.6),
    textAlign: 'center',
    marginBottom: hp('1%'),
  },
  bookingRef: {
    fontSize: RFPercentage(1.4),
    fontWeight: '600',
    marginBottom: hp('2%'),
  },
  successActions: {
    width: '100%',
    gap: hp('1%'),
  },
  successBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp('2%'),
    paddingVertical: hp('1.2%'),
    borderRadius: wp('3%'),
  },
  successBtnText: {
    fontSize: RFPercentage(1.6),
    fontWeight: '600',
    color: '#fff',
  },
});