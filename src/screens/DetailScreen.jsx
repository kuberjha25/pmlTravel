import React, { useMemo, useState, useRef } from 'react';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Pressable,
  View,
  useColorScheme,
  FlatList,
  Dimensions,
  Modal,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MAP_BG_IMAGE, PLACES, LIGHT_THEME, DARK_THEME } from '../constants/travel-data';

const { width, height } = Dimensions.get('window');

export default function DetailScreen({ navigation, route }) {
  const isDark = useColorScheme() === 'dark';
  const colors = isDark ? DARK_THEME : LIGHT_THEME;
  const { id } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const flatListRef = useRef(null);
  const thumbnailFlatListRef = useRef(null);

  const place = useMemo(
    () => PLACES.find((item) => item.id === id) || PLACES[0],
    [id],
  );

  const gallery = place.gallery.length > 0 ? place.gallery : [place.image];

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentImageIndex(viewableItems[0].index);
      // Auto-scroll thumbnail to center the active one
      thumbnailFlatListRef.current?.scrollToIndex({
        index: viewableItems[0].index,
        animated: true,
        viewPosition: 0.5,
      });
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderImageItem = ({ item, index }) => (
    <Pressable onPress={() => setIsFullscreen(true)}>
      <ImageBackground 
        source={{ uri: item }} 
        style={styles.hero}
        resizeMode="cover"
      >
        <View style={styles.heroHeader}>
          <View style={styles.heroActions}>
            <Pressable style={[styles.roundIcon, { backgroundColor: 'rgba(255,255,255,0.92)' }]}>
              <Icon name="share" size={wp('4.5%')} color="#111" />
            </Pressable>
            <Pressable
              style={[styles.roundIcon, { backgroundColor: 'rgba(255,255,255,0.92)' }]}
              onPress={() => setIsFavorite((value) => !value)}
            >
              <Icon
                name={isFavorite ? 'favorite' : 'favorite-border'}
                size={wp('4.5%')}
                color={isFavorite ? '#e63946' : '#111'}
              />
            </Pressable>
          </View>
        </View>
      </ImageBackground>
    </Pressable>
  );

  const renderThumbnailItem = ({ item, index }) => (
    <Pressable 
      onPress={() => {
        flatListRef.current?.scrollToIndex({ index, animated: true });
        setCurrentImageIndex(index);
      }}
      style={styles.thumbnailPressable}
    >
      <Image 
        source={{ uri: item }} 
        style={[
          styles.thumb,
          currentImageIndex === index && styles.activeThumb
        ]} 
      />
    </Pressable>
  );

  const FullscreenModal = () => (
    <Modal
      visible={isFullscreen}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setIsFullscreen(false)}
    >
      <View style={styles.fullscreenContainer}>
        <Pressable 
          style={styles.closeFullscreenBtn}
          onPress={() => setIsFullscreen(false)}
        >
          <Icon name="close" size={wp('6%')} color="#fff" />
        </Pressable>
        
        <FlatList
          data={gallery}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `fullscreen-${index}`}
          initialScrollIndex={currentImageIndex}
          getItemLayout={(data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          onScroll={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentImageIndex(index);
          }}
          renderItem={({ item }) => (
            <View style={styles.fullscreenSlide}>
              <Image 
                source={{ uri: item }} 
                style={styles.fullscreenImage}
                resizeMode="contain"
              />
            </View>
          )}
        />
        
        <View style={styles.fullscreenCounter}>
          <Text style={styles.fullscreenCounterText}>
            {currentImageIndex + 1} / {gallery.length}
          </Text>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.screenBg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroWrap}>
          {/* Main Image FlatList Gallery */}
          <View style={styles.flatlistContainer}>
            <FlatList
              ref={flatListRef}
              data={gallery}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => `image-${index}`}
              renderItem={renderImageItem}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={viewabilityConfig}
              getItemLayout={(data, index) => ({
                length: width,
                offset: width * index,
                index,
              })}
              initialScrollIndex={0}
            />
            
            {/* Image Counter */}
            <View style={styles.imageCounter}>
              <Text style={styles.imageCounterText}>
                {currentImageIndex + 1} / {gallery.length}
              </Text>
            </View>
          </View>

          {/* Thumbnail FlatList Navigation */}
          <FlatList
            ref={thumbnailFlatListRef}
            data={gallery}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `thumb-${index}`}
            renderItem={renderThumbnailItem}
            contentContainerStyle={styles.thumbRailContent}
            style={styles.thumbRailScroll}
          />
        </View>

        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.placeName, { color: colors.primaryText }]}>{place.name}</Text>
            <Text style={[styles.placeCity, { color: colors.secondaryText }]}>{place.city}, {place.country}</Text>
          </View>
          <Text style={[styles.price, { color: colors.accent }]}>{place.price}</Text>
        </View>

        <View style={styles.ratingSection}>
          <View style={styles.ratingBadge}>
            <Icon name="star" size={wp('4%')} color="#f5ad18" />
            <Text style={[styles.ratingText, { color: colors.primaryText }]}>{place.rating}</Text>
          </View>
          <Text style={[styles.ratingLabel, { color: colors.secondaryText }]}>Based on 328 reviews</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoBadge}>
          <Icon name="location-on" size={wp('4%')} color={colors.accent} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.infoLabel, { color: colors.secondaryText }]}>ADDRESS</Text>
            <Text style={[styles.infoValue, { color: colors.primaryText }]}>{place.address}</Text>
          </View>
        </View>

        <View style={styles.infoBadge}>
          <Icon name="access-time" size={wp('4%')} color={colors.accent} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.infoLabel, { color: colors.secondaryText }]}>OPERATING HOURS</Text>
            <Text style={[styles.infoValue, { color: colors.primaryText }]}>09:00 AM - 06:00 PM</Text>
          </View>
        </View>

        <View style={styles.infoBadge}>
          <Icon name="info-outline" size={wp('4%')} color={colors.accent} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.infoLabel, { color: colors.secondaryText }]}>DURATION</Text>
            <Text style={[styles.infoValue, { color: colors.primaryText }]}>Approximately 3-4 hours</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>About this place</Text>
        <Text style={[styles.description, { color: colors.secondaryText }]}>
          Experience the grandeur of history at its finest. This magnificent destination offers breathtaking views and unforgettable memories. Perfect for photography, history enthusiasts, and adventurous travelers.
        </Text>

        <Pressable
          style={styles.mapButton}
          onPress={() => navigation.navigate('Map', { id: place.id })}
        >
          <Image source={{ uri: MAP_BG_IMAGE }} style={styles.mapImage} />
          <View style={[styles.mapOverlay, { backgroundColor: 'rgba(0,0,0,0.3)' }]}>
            <Icon name="location-on" size={wp('6%')} color="#fff" />
            <Text style={styles.mapText}>View on Map</Text>
          </View>
        </Pressable>
      </ScrollView>

      <View style={[styles.bookingFooter, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <Pressable 
          style={[styles.bookButton, { backgroundColor: colors.accent }]}
          onPress={() => navigation.navigate('Booking', { placeId: place.id, placeName: place.name, price: place.price })}
        >
          <Text style={styles.bookText}>Book Now</Text>
          <Icon name="arrow-forward" size={wp('5%')} color="#fff" />
        </Pressable>
      </View>

      <FullscreenModal />
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
    paddingTop: hp('1.5%'),
    paddingBottom: hp('10%'),
  },
  heroWrap: {
    borderRadius: wp('4.5%'),
    overflow: 'hidden',
    marginBottom: hp('2.5%'),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  flatlistContainer: {
    position: 'relative',
  },
  hero: {
    width: width - wp('9%'), // Full width minus padding
    height: hp('40%'),
    justifyContent: 'space-between',
    padding: wp('3%'),
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  heroActions: {
    flexDirection: 'row',
    gap: wp('2%'),
  },
  roundIcon: {
    width: wp('9%'),
    height: wp('9%'),
    borderRadius: wp('4.5%'),
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageCounter: {
    position: 'absolute',
    bottom: hp('1.5%'),
    right: wp('3%'),
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.5%'),
    borderRadius: wp('4%'),
  },
  imageCounterText: {
    color: '#fff',
    fontSize: RFPercentage(1.5),
    fontWeight: '600',
  },
  thumbRailScroll: {
    marginTop: hp('1%'),
    marginBottom: hp('1%'),
  },
  thumbRailContent: {
    paddingHorizontal: wp('2%'),
    gap: wp('1.5%'),
    paddingVertical: hp('1%'),
  },
  thumbnailPressable: {
    borderRadius: wp('1.5%'),
    overflow: 'hidden',
  },
  thumb: {
    width: wp('12%'),
    height: hp('4%'),
    borderRadius: wp('1.5%'),
  },
  activeThumb: {
    borderWidth: 2,
    borderColor: '#fff',
    transform: [{ scale: 1.05 }],
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: hp('1.5%'),
  },
  placeName: {
    fontSize: RFPercentage(4.5),
    lineHeight: RFPercentage(5),
    fontWeight: '800',
  },
  placeCity: {
    fontSize: RFPercentage(2.5),
    fontWeight: '400',
    marginTop: hp('0.5%'),
  },
  price: {
    fontSize: RFPercentage(4.5),
    fontWeight: '800',
    marginTop: hp('0.5%'),
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2%'),
    marginBottom: hp('2%'),
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1%'),
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.6%'),
    backgroundColor: 'rgba(245, 173, 24, 0.1)',
    borderRadius: wp('2%'),
  },
  ratingText: {
    fontSize: RFPercentage(2),
    fontWeight: '700',
  },
  ratingLabel: {
    fontSize: RFPercentage(1.3),
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginVertical: hp('2%'),
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3%'),
    marginBottom: hp('2%'),
  },
  infoLabel: {
    fontSize: RFPercentage(1.2),
    fontWeight: '700',
    letterSpacing: 0.3,
    marginBottom: hp('0.3%'),
  },
  infoValue: {
    fontSize: RFPercentage(1.6),
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: RFPercentage(3),
    fontWeight: '800',
    marginBottom: hp('1%'),
  },
  description: {
    fontSize: RFPercentage(1.6),
    lineHeight: RFPercentage(2.3),
    marginBottom: hp('2.5%'),
  },
  mapButton: {
    height: hp('15%'),
    borderRadius: wp('4%'),
    overflow: 'hidden',
    marginBottom: hp('2%'),
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    gap: hp('1%'),
  },
  mapText: {
    color: '#fff',
    fontSize: RFPercentage(2),
    fontWeight: '700',
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
  bookText: {
    color: '#ffffff',
    fontSize: RFPercentage(2.2),
    fontWeight: '700',
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeFullscreenBtn: {
    position: 'absolute',
    top: hp('5%'),
    right: wp('5%'),
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: wp('5%'),
    padding: wp('2%'),
  },
  fullscreenSlide: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: width,
    height: height,
  },
  fullscreenCounter: {
    position: 'absolute',
    bottom: hp('5%'),
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1%'),
    borderRadius: wp('5%'),
  },
  fullscreenCounterText: {
    color: '#fff',
    fontSize: RFPercentage(2),
    fontWeight: '600',
  },
});