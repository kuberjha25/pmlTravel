import React, { useMemo, useState } from 'react';
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
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CITY_FILTERS, PLACES, LIGHT_THEME, DARK_THEME } from '../constants/travel-data';

export default function ExploreScreen({ navigation }) {
  const isDark = useColorScheme() === "dark";
  const colors = isDark ? DARK_THEME : LIGHT_THEME;
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered = useMemo(() => {
    if (selectedCategory === "All") {
      return PLACES;
    }
    return PLACES;
  }, [selectedCategory]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.screenBg }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* <Text style={[styles.title, { color: colors.primaryText }]}>Explore Cities</Text> */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {CITY_FILTERS.map((category) => (
            <Pressable
              key={category}
              style={[
                styles.filterChip,
                { backgroundColor: colors.softSurface },
                selectedCategory === category && styles.filterChipActive,
                selectedCategory === category && {
                  backgroundColor: colors.accent,
                },
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: colors.mutedText },
                  selectedCategory === category && styles.filterTextActive,
                ]}
              >
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.grid}>
          {filtered.map((place) => (
            <Pressable
              key={place.id}
              style={[
                styles.card,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
              onPress={() =>
                navigation.navigate("Detail", { id: place.id })
              }
            >
              <Image source={{ uri: place.image }} style={styles.image} />
              <View style={styles.cardBody}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.name, { color: colors.primaryText }]}>{place.name}</Text>
                  <Text style={[styles.location, { color: colors.secondaryText }]}>
                    {place.city}, {place.country}
                  </Text>
                </View>
                <View style={styles.ratingRow}>
                  <Icon name="star" size={wp('3.5%')} color="#f5ad18" />
                  <Text style={[styles.ratingText, { color: colors.primaryText }]}>
                    {place.rating}
                  </Text>
                </View>
              </View>
              <View style={styles.priceTag}>
                <Text style={styles.priceTagText}>{place.price}</Text>
              </View>
            </Pressable>
          ))}
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
    paddingTop: hp('2%'),
    paddingBottom: hp('12%'),
  },
  title: {
    fontSize: RFPercentage(4.5),
    lineHeight: RFPercentage(5),
    fontWeight: "800",
    marginBottom: hp('2%'),
  },
  filterRow: {
    gap: wp('2.5%'),
    paddingBottom: hp('2%'),
  },
  filterChip: {
    borderRadius: wp('4%'),
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('3.5%'),
  },
  filterChipActive: {},
  filterText: {
    fontSize: RFPercentage(1.5),
    fontWeight: "500",
  },
  filterTextActive: {
    color: "#fff",
    fontWeight: "700",
  },
  grid: {
    gap: hp('2%'),
  },
  card: {
    borderRadius: wp('3.5%'),
    padding: wp('3%'),
    gap: wp('3%'),
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: hp('18%'),
    borderRadius: wp('2.5%'),
  },
  cardBody: {
    flexDirection: 'row',
    gap: wp('2%'),
    alignItems: 'flex-start',
  },
  name: {
    fontSize: RFPercentage(2.1),
    fontWeight: "700",
    marginBottom: hp('0.5%'),
  },
  location: {
    fontSize: RFPercentage(1.5),
    marginBottom: hp('0.8%'),
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp('0.8%'),
  },
  ratingText: {
    fontSize: RFPercentage(1.5),
    fontWeight: "600",
  },
  priceTag: {
    position: 'absolute',
    top: wp('3%'),
    right: wp('3%'),
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.5%'),
    borderRadius: wp('1.5%'),
  },
  priceTagText: {
    color: '#fff',
    fontSize: RFPercentage(1.6),
    fontWeight: '700',
  },
});