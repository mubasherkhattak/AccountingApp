import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import colors from '../constants/colors';

export default function FrontSide() {
  const navigation = useNavigation();

  const floorButtons = [
    { name: 'Lower Ground', route: 'LowerGroundFloor', icon: 'business' },
    { name: 'Ground Floor', route: 'GroundFloor', icon: 'business' },
    { name: 'First Floor', route: 'FirstFLOORPAYMENT', icon: 'storefront' },
    { name: 'Second Floor', route: 'SecondFLOORPAYMENT', icon: 'storefront' },
    { name: 'Fourth Floor', route: 'FourthFLOORPAYMENT', icon: 'layers' },
    { name: 'Fifth Floor', route: 'FifthFLOORPAYMENT', icon: 'layers' },
    { name: 'Sixth Floor', route: 'SixthFLOORPAYMENT', icon: 'layers' },
    { name: 'Seventh Floor', route: 'SeventhFLOORPAYMENT', icon: 'layers' },
    { name: 'Eight Floor', route: 'EightFLOORPAYMENT', icon: 'layers' },
    { name: 'Ninth Floor', route: 'NinthFLOORPAYMENT', icon: 'layers' },
    { name: 'Tenth Floor', route: 'TenthFLOORPAYMENT', icon: 'layers' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={28} color={colors.white} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Front Side Hub</Text>
            <Text style={styles.headerSubtitle}>Broadway Mall Shop Payments</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>Select a Floor</Text>

        <View style={styles.grid}>
          {floorButtons.map((floor, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => navigation.navigate(floor.route)}
            >
              <LinearGradient
                colors={['#f0f4ff', '#e6edff']}
                style={styles.iconCircle}
              >
                <Ionicons name={floor.icon} size={28} color={colors.primary} />
              </LinearGradient>
              <Text style={styles.cardText}>{floor.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footerSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
    marginTop: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '47%',
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  iconCircle: {
    width: 55,
    height: 55,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '700',
    textAlign: 'center',
  },
  footerSpacing: {
    height: 30,
  },
});
