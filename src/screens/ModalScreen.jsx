import React from 'react';
import {
  StyleSheet,
  Text,
  Pressable,
  View,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage } from 'react-native-responsive-fontsize';

export default function ModalScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>This is a modal</Text>
      <Pressable
        style={styles.link}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.linkText}>Go to home screen</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: wp('5%'),
    backgroundColor: '#fff',
  },
  title: {
    fontSize: RFPercentage(4),
    fontWeight: 'bold',
    marginBottom: hp('2.5%'),
  },
  link: {
    marginTop: hp('2%'),
    paddingVertical: hp('2%'),
  },
  linkText: {
    fontSize: RFPercentage(2),
    color: '#0a7ea4',
  },
});