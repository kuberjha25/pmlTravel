import React, { useMemo, useState } from 'react';
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  Pressable,
  View,
  useColorScheme,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { WebView } from 'react-native-webview';
import { PLACES, LIGHT_THEME, DARK_THEME } from '../constants/travel-data';
import { FloatingNav } from '../components/FloatingNav';

const { width, height } = Dimensions.get('window');

// Coordinates for our places
const PLACE_COORDINATES = {
  '1': { lat: 41.8902, lon: 12.4922 },  // Colosseum, Rome
  '2': { lat: -7.9425, lon: 112.9530 }, // Mount Bromo, Indonesia
  '3': { lat: 36.3932, lon: 25.4615 },  // Santorini, Greece
};

const generateMapHTML = (places, primaryId, isDark) => {
  const markers = places.map(place => ({
    ...place,
    ...PLACE_COORDINATES[place.id] || { lat: 30, lon: 20 },
    isPrimary: place.id === primaryId,
  }));

  const tileLayer = isDark 
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { margin: 0; padding: 0; background: ${isDark ? '#1a1f29' : '#f3f3f3'}; }
    #map { width: 100vw; height: 100vh; }
    .leaflet-popup-content-wrapper { 
      border-radius: 15px; 
      padding: 0; 
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      background: ${isDark ? '#1a1f29' : '#ffffff'};
    }
    .leaflet-popup-content { margin: 0; width: 220px !important; }
    .leaflet-popup-close-button { 
      color: ${isDark ? '#fff' : '#333'} !important; 
      font-size: 20px !important; 
      padding: 5px 8px !important;
    }
    .popup-card { 
      background: ${isDark ? '#1a1f29' : '#ffffff'}; 
      border-radius: 12px; 
      overflow: hidden;
    }
    .popup-card img { 
      width: 100%; 
      height: 100px; 
      object-fit: cover; 
    }
    .popup-body { padding: 12px; }
    .popup-body h3 { 
      margin: 0 0 4px 0; 
      color: ${isDark ? '#f5f7ff' : '#1f1f1f'}; 
      font-size: 16px; 
      font-weight: 700;
    }
    .popup-body p { 
      margin: 3px 0; 
      color: ${isDark ? '#b8c0d3' : '#939393'}; 
      font-size: 12px; 
    }
    .popup-row { 
      display: flex; 
      align-items: center; 
      justify-content: space-between; 
      margin-top: 8px; 
    }
    .popup-rating { 
      font-size: 13px; 
      font-weight: 600; 
      color: ${isDark ? '#f5f7ff' : '#343434'}; 
    }
    .popup-price { 
      font-size: 18px; 
      font-weight: 800; 
      color: ${isDark ? '#8ea0ff' : '#130c4f'}; 
    }
    .popup-btn { 
      display: block;
      margin-top: 10px; 
      width: 100%; 
      padding: 10px; 
      background: ${isDark ? '#2d3f77' : '#130c4f'}; 
      color: white; 
      border: none; 
      border-radius: 8px; 
      font-size: 14px; 
      font-weight: 600; 
      cursor: pointer;
      text-align: center;
    }
    .popup-btn:active { opacity: 0.8; }
    .primary-marker { 
      background: #FF6B6B; 
      border: 3px solid white; 
      border-radius: 50%; 
      width: 24px; 
      height: 24px; 
      box-shadow: 0 0 10px rgba(255,107,107,0.6);
      animation: pulse 2s infinite;
    }
    .secondary-marker { 
      background: #4ECDC4; 
      border: 2px solid white; 
      border-radius: 50%; 
      width: 18px; 
      height: 18px; 
      box-shadow: 0 0 6px rgba(0,0,0,0.3);
    }
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(255,107,107,0.6); }
      70% { box-shadow: 0 0 0 10px rgba(255,107,107,0); }
      100% { box-shadow: 0 0 0 0 rgba(255,107,107,0); }
    }
    .leaflet-control-zoom { 
      border: none !important; 
      box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
    }
    .leaflet-control-zoom a { 
      background: ${isDark ? '#1a1f29' : '#ffffff'} !important; 
      color: ${isDark ? '#f5f7ff' : '#333'} !important;
      border: none !important;
      border-bottom: 1px solid ${isDark ? '#2b3342' : '#eee'} !important;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    // Initialize map
    const map = L.map('map', { 
      zoomControl: true,
      zoomControl: false 
    }).setView([30, 20], 2);
    
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Add tile layer (FREE - no API key needed!)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    // Add markers
    const markers = [];
    const placesData = ${JSON.stringify(markers)};
    
    placesData.forEach((place, index) => {
      const markerIcon = L.divIcon({ 
        className: place.isPrimary ? 'primary-marker' : 'secondary-marker', 
        iconSize: place.isPrimary ? [24, 24] : [18, 18],
        iconAnchor: place.isPrimary ? [12, 12] : [9, 9]
      });
      
      const marker = L.marker([place.lat, place.lon], { icon: markerIcon }).addTo(map);
      
      marker.bindPopup(\`
        <div class="popup-card">
          <img src="\${place.image}" alt="\${place.name}" />
          <div class="popup-body">
            <h3>\${place.name}</h3>
            <p>📍 \${place.city}, \${place.country}</p>
            <div class="popup-row">
              <span class="popup-rating">⭐ \${place.rating} / 5</span>
              <span class="popup-price">\${place.price}</span>
            </div>
            <button class="popup-btn" onclick="window.ReactNativeWebView.postMessage('navigate:\${place.id}')">
              View Details
            </button>
          </div>
        </div>
      \`);
      
      markers.push(marker);
    });

    // Fit all markers in view
    if (markers.length > 0) {
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.15), { maxZoom: 12 });
    }

    // Listen for orientation changes
    window.addEventListener('resize', () => {
      map.invalidateSize();
    });
  </script>
</body>
</html>
  `;
};

export default function MapScreen({ navigation, route }) {
  const isDark = useColorScheme() === 'dark';
  const colors = isDark ? DARK_THEME : LIGHT_THEME;
  const { id } = route.params;
  const [isLoading, setIsLoading] = useState(true);

  const primary = useMemo(
    () => PLACES.find((place) => place.id === id) || PLACES[0],
    [id],
  );

  const handleMessage = (event) => {
    const data = event.nativeEvent.data;
    if (data.startsWith('navigate:')) {
      const placeId = data.split(':')[1];
      navigation.navigate('Detail', { id: placeId });
    }
  };

  const nearbyPlaces = useMemo(() => {
    return PLACES.filter(p => p.id !== primary.id).slice(0, 3);
  }, [primary.id]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.screenBg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Map WebView - NO API KEY! */}
      <WebView
        source={{ html: generateMapHTML(PLACES, primary.id, isDark) }}
        style={styles.map}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={[styles.loadingContainer, { backgroundColor: colors.screenBg }]}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={[styles.loadingText, { color: colors.primaryText }]}>Loading Map...</Text>
            <Text style={[styles.loadingSubtext, { color: colors.secondaryText }]}>
              OpenStreetMap (Free)
            </Text>
          </View>
        )}
        onLoad={() => setIsLoading(false)}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        scrollEnabled={false}
      />

      {/* Header */}
     

     
      {/* Nearby Places */}
      <View style={styles.nearbyContainer}>
        <Text style={[styles.nearbyTitle, { color: colors.primaryText }]}>Nearby Places</Text>
        <View style={styles.nearbyRow}>
          {nearbyPlaces.map((place) => (
            <Pressable
              key={place.id}
              style={[styles.nearbyCard, { backgroundColor: colors.surface }]}
              onPress={() => navigation.navigate('Detail', { id: place.id })}
            >
              <Image source={{ uri: place.image }} style={styles.nearbyImage} />
              <Text style={[styles.nearbyName, { color: colors.primaryText }]} numberOfLines={1}>
                {place.name}
              </Text>
              <Text style={[styles.nearbyCity, { color: colors.secondaryText }]} numberOfLines={1}>
                {place.city}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* <FloatingNav active="home" onNavigate={(screen) => {
        if (screen === 'Home') {
          navigation.navigate('MainTabs', { screen: 'Home' });
        } else {
          navigation.navigate('MainTabs', { screen });
        }
      }} /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: RFPercentage(2),
    fontWeight: '600',
    marginTop: hp('2%'),
  },
  loadingSubtext: {
    fontSize: RFPercentage(1.3),
    marginTop: hp('0.5%'),
  },
  headerWrap: {
    position: 'absolute',
    top: hp('6%'),
    left: wp('4%'),
    right: wp('4%'),
    borderRadius: wp('3.5%'),
    paddingVertical: hp('1.2%'),
    paddingHorizontal: wp('3%'),
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2.5%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  backBtn: {
    width: wp('9%'),
    height: wp('9%'),
    borderRadius: wp('4.5%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  iconBtn: {
    width: wp('9%'),
    height: wp('9%'),
    borderRadius: wp('4.5%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: RFPercentage(2.2),
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: RFPercentage(1.5),
    marginTop: 2,
  },
  freeBadge: {
    position: 'absolute',
    top: hp('6%'),
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1.5%'),
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.6%'),
    borderRadius: wp('5%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  freeBadgeText: {
    color: '#fff',
    fontSize: RFPercentage(1.3),
    fontWeight: '700',
  },
  nearbyContainer: {
    position: 'absolute',
    bottom: hp('5%'),
    left: wp('4%'),
    right: wp('4%'),
  },
  nearbyTitle: {
    fontSize: RFPercentage(1.8),
    fontWeight: '700',
    marginBottom: hp('1%'),
  },
  nearbyRow: {
    flexDirection: 'row',
    gap: wp('2.5%'),
  },
  nearbyCard: {
    flex: 1,
    borderRadius: wp('3%'),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  nearbyImage: {
    width: '100%',
    height: hp('8%'),
  },
  nearbyName: {
    fontSize: RFPercentage(1.4),
    fontWeight: '700',
    paddingHorizontal: wp('2%'),
    paddingTop: hp('0.8%'),
  },
  nearbyCity: {
    fontSize: RFPercentage(1.1),
    paddingHorizontal: wp('2%'),
    paddingBottom: hp('0.8%'),
  },
});