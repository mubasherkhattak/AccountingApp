import React, { useEffect } from 'react';
import { View, Image, StyleSheet, StatusBar, Text, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../constants/colors';


const LoadingScreen = ({ navigation }) => {
  // Navigation is handled by App.js auth listener
  // This screen shows until onAuthStateChanged is called

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" transparent backgroundColor="transparent" />

      <View style={styles.logoWrapper}>
        <View style={styles.logoCircle}>
          <Image
            source={require('../assets/images/broadway_mall_logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.brandTitle}>Broadway Mall</Text>
        <Text style={styles.brandSubtitle}>Premium Accounting Suite</Text>
      </View>

      <View style={styles.footer}>
        <ActivityIndicator size="large" color={colors.white} style={styles.loader} />
        <Text style={styles.loadingText}>Initializing Dashboard...</Text>
      </View>
    </LinearGradient>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  logo: {
    width: 90,
    height: 90,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginTop: 25,
    letterSpacing: 1,
  },
  brandSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 5,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  loader: {
    marginBottom: 15,
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
});
