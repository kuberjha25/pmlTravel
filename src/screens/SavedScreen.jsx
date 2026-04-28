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
  Alert,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { PLACES, LIGHT_THEME, DARK_THEME } from '../constants/travel-data';

export default function SavedScreen({ navigation }) {
  const isDark = useColorScheme() === "dark";
  const colors = isDark ? DARK_THEME : LIGHT_THEME;
  const [savedDestinations, setSavedDestinations] = useState(PLACES);
  const [favorites, setFavorites] = useState(PLACES.map(p => p.id));

  const toggleFavorite = (placeId, placeName) => {
    if (favorites.includes(placeId)) {
      setFavorites(favorites.filter(id => id !== placeId));
      setSavedDestinations(savedDestinations.filter(p => p.id !== placeId));
      Alert.alert('Removed', `${placeName} removed from saved`);
    } else {
      setFavorites([...favorites, placeId]);
      Alert.alert('Saved', `${placeName} added to saved`);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.screenBg }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* <Text style={[styles.title, { color: colors.primaryText }]}>Saved Places</Text> */}
        <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
          {savedDestinations.length} destinations saved
        </Text>

        {savedDestinations.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.softSurface }]}>
              <Icon name="bookmark-outline" size={wp('15%')} color={colors.mutedText} />
            </View>
            <Text style={[styles.emptyText, { color: colors.primaryText }]}>No saved places yet</Text>
            <Text style={[styles.emptySubtext, { color: colors.secondaryText }]}>
              Explore destinations and bookmark your favorites
            </Text>
            <Pressable 
              style={[styles.exploreBtn, { backgroundColor: colors.accent }]}
              onPress={() => navigation.navigate('Explore')}
            >
              <Icon name="explore" size={wp('4%')} color="#fff" />
              <Text style={styles.exploreBtnText}>Explore Places</Text>
            </Pressable>
          </View>
        ) : (
          savedDestinations.map((place) => (
            <Pressable
              key={place.id}
              style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() =>
                navigation.navigate("Detail", { id: place.id })
              }
            >
              <Image source={{ uri: place.image }} style={styles.image} />
              <View style={styles.info}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.name, { color: colors.primaryText }]}>{place.name}</Text>
                  <Text style={[styles.location, { color: colors.secondaryText }]}>
                    {place.city}, {place.country}
                  </Text>
                  <View style={styles.ratingRow}>
                    <Icon name="star" size={wp('3.5%')} color="#f5ad18" />
                    <Text style={[styles.rating, { color: colors.primaryText }]}>
                      {place.rating}
                    </Text>
                  </View>
                </View>
                <View style={styles.rightContent}>
                  <Text style={[styles.price, { color: colors.accent }]}>{place.price}</Text>
                  <Pressable 
                    style={styles.favButton}
                    onPress={() => toggleFavorite(place.id, place.name)}
                  >
                    <Icon 
                      name={favorites.includes(place.id) ? "favorite" : "favorite-border"} 
                      size={wp('5.5%')} 
                      color={favorites.includes(place.id) ? colors.danger : colors.secondaryText} 
                    />
                  </Pressable>
                </View>
              </View>
            </Pressable>
          ))
        )}
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
    fontWeight: "800",
    marginBottom: hp('0.5%'),
  },
  subtitle: {
    fontSize: RFPercentage(1.6),
    marginBottom: hp('2.5%'),
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: wp('3%'),
    padding: wp('3%'),
    borderRadius: wp('3.5%'),
    marginBottom: hp('1.8%'),
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  image: {
    width: wp('22%'),
    height: wp('22%'),
    borderRadius: wp('2.5%'),
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    gap: wp('2%'),
  },
  name: {
    fontSize: RFPercentage(2),
    fontWeight: "700",
    marginBottom: hp('0.3%'),
  },
  location: {
    fontSize: RFPercentage(1.5),
    marginBottom: hp('0.6%'),
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('0.8%'),
  },
  rating: {
    fontSize: RFPercentage(1.3),
    fontWeight: '600',
  },
  rightContent: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: RFPercentage(1.8),
    fontWeight: "700",
    marginBottom: hp('1%'),
  },
  favButton: {
    padding: wp('1%'),
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('15%'),
  },
  emptyIcon: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('10%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('2%'),
  },
  emptyText: {
    fontSize: RFPercentage(2.2),
    fontWeight: '700',
    marginBottom: hp('0.8%'),
  },
  emptySubtext: {
    fontSize: RFPercentage(1.5),
    marginBottom: hp('2.5%'),
    textAlign: 'center',
  },
  exploreBtn: {
    flexDirection: 'row',
    paddingHorizontal: wp('6%'),
    paddingVertical: hp('1.3%'),
    borderRadius: wp('3%'),
    alignItems: 'center',
    gap: wp('1.5%'),
  },
  exploreBtnText: {
    color: '#fff',
    fontSize: RFPercentage(1.7),
    fontWeight: '700',
  },
});