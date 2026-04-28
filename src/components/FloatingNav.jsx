import React from 'react';
import { StyleSheet, Pressable, View, useColorScheme } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialIcons';

export function FloatingNav({ active, onNavigate }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <View
        style={[
          styles.nav,
          { backgroundColor: isDark ? "#241f6b" : "#130c4f" },
        ]}
      >
        <Pressable
          style={styles.item}
          onPress={() => onNavigate("Home")}
        >
          <Icon
            name="home"
            size={wp('5%')}
            color={active === "home" ? "#ffffff" : isDark ? "#b0adcc" : "#8f8ca8"}
          />
        </Pressable>
        <Pressable
          style={styles.item}
          onPress={() => onNavigate("Profile")}
        >
          <Icon
            name="person-outline"
            size={wp('5%')}
            color={active === "profile" ? "#ffffff" : isDark ? "#b0adcc" : "#8f8ca8"}
          />
        </Pressable>
        <Pressable
          style={styles.item}
          onPress={() => onNavigate("Explore")}
        >
          <Icon
            name="explore"
            size={wp('5%')}
            color={active === "discover" ? "#ffffff" : isDark ? "#b0adcc" : "#8f8ca8"}
          />
        </Pressable>
        <Pressable
          style={styles.item}
          onPress={() => onNavigate("Saved")}
        >
          <Icon
            name="bookmark-outline"
            size={wp('5%')}
            color={active === "saved" ? "#ffffff" : isDark ? "#b0adcc" : "#8f8ca8"}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: hp('2%'),
    alignItems: "center",
  },
  nav: {
    width: "86%",
    borderRadius: wp('4%'),
    height: hp('7%'),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 8,
  },
  item: {
    width: wp('11%'),
    height: wp('11%'),
    alignItems: "center",
    justifyContent: "center",
  },
});