import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

// Animated version of LinearGradient
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function GradientHeader({ title }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Title fade-in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Looping gradient animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(colorAnim, { toValue: 1, duration: 5000, useNativeDriver: false }),
        Animated.timing(colorAnim, { toValue: 0, duration: 5000, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  // Interpolate between two gradient color sets
  const startColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#6a11cb', '#ff416c'], // purple to pink
  });

  const endColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#2575fc', '#ff4b2b'], // blue to orange-red
  });

  return (
    <AnimatedLinearGradient
      colors={[startColor, endColor]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.header}
    >
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
        {title}
      </Animated.Text>
    </AnimatedLinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});
