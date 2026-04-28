// src/screens/HomeScreen.jsx
import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  View,
  useColorScheme,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  CATEGORIES,
  CITY_FILTERS,
  PLACES,
  LIGHT_THEME,
  DARK_THEME,
} from '../constants/travel-data';

export default function HomeScreen({ navigation }) {
  const isDark = useColorScheme() === 'dark';
  const colors = isDark ? DARK_THEME : LIGHT_THEME;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.screenBg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Removed the header section - now in React Navigation header */}

        <View
          style={[styles.searchBox, { backgroundColor: colors.softSurface }]}
        >
          <Icon name="search" size={wp('4.5%')} color={colors.icon} />
          <TextInput
            placeholder="Discover city"
            placeholderTextColor={colors.mutedText}
            style={[styles.searchInput, { color: colors.primaryText }]}
          />
          <Icon name="tune" size={wp('4.5%')} color={colors.icon} />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>
          Popular Destinations
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {CITY_FILTERS.map((filter, index) => (
            <Text
              key={filter}
              style={[
                styles.filterText,
                { color: colors.mutedText },
                index === 0 && styles.filterTextActive,
                index === 0 && { color: colors.primaryText },
              ]}
            >
              {filter}
            </Text>
          ))}
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsRow}
        >
          {PLACES.map(place => (
            <Pressable
              key={place.id}
              style={[
                styles.cityCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
              onPress={() => navigation.navigate('Detail', { id: place.id })}
            >
              <Image source={{ uri: place.image }} style={styles.cityImage} />
              <View style={styles.cityInfo}>
                <Text style={[styles.cityName, { color: colors.primaryText }]}>
                  {place.name}
                </Text>
                <Text
                  style={[styles.cityCountry, { color: colors.secondaryText }]}
                >
                  {place.city}
                </Text>
              </View>
              <View style={styles.smallFav}>
                <Icon
                  name="favorite-border"
                  size={wp('2.5%')}
                  color="#ffffff"
                />
              </View>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>
          Travel Categories
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
        >
          {CATEGORIES.map(category => (
            <Pressable key={category.id} style={styles.categoryItem}>
              <View
                style={[
                  styles.categoryIconWrap,
                  { backgroundColor: colors.softSurface },
                ]}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
              </View>
              <Text
                style={[styles.categoryLabel, { color: colors.secondaryText }]}
              >
                {category.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Featured Banner */}
        <View style={[styles.banner, { backgroundColor: colors.accent }]}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Special Offer</Text>
            <Text style={styles.bannerSubtitle}>
              Get 20% off your next booking
            </Text>
            <Pressable style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>Explore Deals</Text>
            </Pressable>
          </View>
          <Icon
            name="local-offer"
            size={wp('20%')}
            color="rgba(255,255,255,0.15)"
          />
        </View>
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
    paddingTop: hp('2%'), // Reduced padding since header is now in navigation bar
    paddingBottom: hp('12%'),
  },
  searchBox: {
    height: hp('6%'),
    borderRadius: wp('3.5%'),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('3.5%'),
    gap: wp('2%'),
    marginBottom: hp('3%'),
  },
  searchInput: {
    flex: 1,
    fontSize: RFPercentage(1.8),
  },
  sectionTitle: {
    fontSize: RFPercentage(3),
    fontWeight: '700',
    marginBottom: hp('1.5%'),
    marginTop: hp('1%'),
  },
  filterRow: {
    gap: wp('4%'),
    marginBottom: hp('2.5%'),
  },
  filterText: {
    fontSize: RFPercentage(1.5),
    fontWeight: '500',
  },
  filterTextActive: {
    fontWeight: '700',
  },
  cardsRow: {
    gap: wp('2.5%'),
    paddingBottom: hp('2%'),
  },
  cityCard: {
    width: wp('35%'),
    borderRadius: wp('3.5%'),
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cityImage: {
    width: '100%',
    height: hp('11%'),
  },
  cityInfo: {
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('1.2%'),
    gap: 2,
  },
  cityName: {
    fontSize: RFPercentage(1.6),
    fontWeight: '700',
  },
  cityCountry: {
    fontSize: RFPercentage(1.3),
  },
  smallFav: {
    width: wp('5%'),
    height: wp('5%'),
    borderRadius: wp('2.5%'),
    backgroundColor: 'rgba(0,0,0,0.35)',
    position: 'absolute',
    top: wp('2%'),
    right: wp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriesRow: {
    gap: wp('4.5%'),
    paddingBottom: hp('2.5%'),
  },
  categoryItem: {
    alignItems: 'center',
    gap: wp('1.5%'),
  },
  categoryIconWrap: {
    width: wp('14%'),
    height: wp('14%'),
    borderRadius: wp('7%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIcon: {
    fontSize: RFPercentage(3),
  },
  categoryLabel: {
    fontSize: RFPercentage(1.3),
    fontWeight: '500',
    textAlign: 'center',
  },
  banner: {
    borderRadius: wp('4%'),
    padding: wp('5%'),
    marginTop: hp('2%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: RFPercentage(2.5),
    fontWeight: '800',
    color: '#fff',
    marginBottom: hp('0.5%'),
  },
  bannerSubtitle: {
    fontSize: RFPercentage(1.5),
    color: 'rgba(255,255,255,0.9)',
    marginBottom: hp('1%'),
  },
  bannerButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingVertical: hp('0.8%'),
    paddingHorizontal: wp('4%'),
    borderRadius: wp('2.5%'),
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: '#fff',
    fontSize: RFPercentage(1.4),
    fontWeight: '700',
  },
});
