// screens/HomeScreen.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../constants/colors';

export default function HomeScreen({ navigation }) {
  const [user, setUser] = React.useState({ name: 'Admin' });

  React.useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    loadUser();
  }, []);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      navigation.replace('Login'); // Ensure you navigate back
    } catch (error) {
      Alert.alert('Logout Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Hero Header Section */}
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.heroHeader}>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.heroContent}>
          <View>
            <Text style={styles.greeting}>Welcome Back,</Text>
            <Text style={styles.appTitle}>{user.name}</Text>
          </View>
          <View style={styles.dateBadge}>
            <Text style={styles.dateText}>{currentDate}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>Dashboard</Text>

        {/* Row 1: Payroll & Suppliers */}
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Payroll')}
          >
            <LinearGradient colors={['#e3f2fd', '#bbdefb']} style={styles.iconCircle}>
              <Ionicons name="briefcase" size={30} color="#1976d2" />
            </LinearGradient>
            <Text style={styles.cardLabel}>Payroll</Text>
            <Text style={styles.cardSubText}>Staff Salaries</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Suppliers')}
          >
            <LinearGradient colors={['#f3e5f5', '#e1bee7']} style={styles.iconCircle}>
              <Ionicons name="people" size={30} color="#7b1fa2" />
            </LinearGradient>
            <Text style={styles.cardLabel}>Suppliers</Text>
            <Text style={styles.cardSubText}>Stock & Bills</Text>
          </TouchableOpacity>
        </View>

        {/* Row 2: Front Side & Back Side */}
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('FrontSide')}
          >
            <LinearGradient colors={['#e8f5e9', '#c8e6c9']} style={styles.iconCircle}>
              <Ionicons name="business" size={30} color="#388e3c" />
            </LinearGradient>
            <Text style={styles.cardLabel}>Front Side</Text>
            <Text style={styles.cardSubText}>Shop Payments</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('BackSide')}
          >
            <LinearGradient colors={['#fff3e0', '#ffe0b2']} style={styles.iconCircle}>
              <Ionicons name="cube" size={30} color="#f57c00" />
            </LinearGradient>
            <Text style={styles.cardLabel}>Back Side</Text>
            <Text style={styles.cardSubText}>Warehouse</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  hero: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  heroHeader: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: -10, marginTop: -10 },
  logoutButton: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 12 },
  heroContent: { flexDirection: 'column' },
  greeting: { fontSize: 16, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
  appTitle: { fontSize: 24, color: colors.white, fontWeight: 'bold', marginTop: 4 },
  dateBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, alignSelf: 'flex-start', marginTop: 15 },
  dateText: { color: colors.white, fontSize: 13, fontWeight: '600' },
  content: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 20, marginTop: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  card: {
    width: '47%',
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  iconCircle: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  cardLabel: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  cardSubText: { fontSize: 12, color: colors.textLight, marginTop: 4, fontWeight: '500' },
  footerSpacing: { height: 40 },
});
