import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
  Switch,
  ScrollView,
  Vibration,
} from 'react-native';

import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const particles = Array.from({ length: 35 });

export default function App() {
  const [count, setCount] = useState(0);

  const [darkMode, setDarkMode] = useState(true);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const rotateAnim = useRef(new Animated.Value(0)).current;

  const glowAnim = useRef(new Animated.Value(0.5)).current;

  /* LOAD SAVED COUNT */
  useEffect(() => {
    loadCounter();
  }, []);

  /* SAVE COUNT */
  useEffect(() => {
    AsyncStorage.setItem('counter', count.toString());
  }, [count]);

  /* GLOW LOOP */
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: false,
        }),

        Animated.timing(glowAnim, {
          toValue: 0.4,
          duration: 1800,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const loadCounter = async () => {
    const saved = await AsyncStorage.getItem('counter');

    if (saved !== null) {
      setCount(parseInt(saved));
    }
  };

  /* COUNTER ANIMATION */
  const animateCounter = () => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.12,
          duration: 120,
          useNativeDriver: true,
        }),

        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]),

      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      rotateAnim.setValue(0);
    });
  };

  const increment = () => {
    Vibration.vibrate(30);

    setCount(prev => prev + 1);

    animateCounter();
  };

  const decrement = () => {
    if (count > 0) {
      Vibration.vibrate(20);

      setCount(prev => prev - 1);

      animateCounter();
    }
  };

  const reset = () => {
    Vibration.vibrate(50);

    setCount(0);

    animateCounter();
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '8deg'],
  });

  /* GRADIENT COLORS */
  const gradientColors = darkMode
    ? (['#020617', '#111827', '#312E81'] as const)
    : (['#7F7FD5', '#86A8E7', '#91EAE4'] as const);

  return (
    <LinearGradient
      colors={gradientColors}
      style={styles.container}
    >
      <StatusBar
        barStyle={darkMode ? 'light-content' : 'dark-content'}
      />

      {/* PARTICLES */}
      {particles.map((_, index) => (
        <Particle key={index} />
      ))}

      {/* OVERLAY */}
      <View
        style={[
          styles.overlay,
          {
            backgroundColor: darkMode
              ? 'rgba(255,255,255,0.03)'
              : 'rgba(255,255,255,0.08)',
          },
        ]}
      />

      {/* SCROLL */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.heading}>
            Counter
          </Text>

          <Text style={styles.subHeading}>
            Developed by Bhargav
          </Text>

          {/* DARK MODE */}
          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>
              {darkMode ? 'Dark Mode 🌙' : 'Light Mode ☀️'}
            </Text>

            <Switch
              value={darkMode}
              onValueChange={() =>
                setDarkMode(!darkMode)
              }
            />
          </View>
        </View>

        {/* MAIN GLASS CARD */}
        <BlurView
          intensity={60}
          tint={darkMode ? 'dark' : 'light'}
          style={styles.mainCard}
        >
          {/* GLOW EFFECT */}
          <Animated.View
            style={[
              styles.glow,
              {
                opacity: glowAnim,
              },
            ]}
          />

          {/* COUNTER CIRCLE */}
          <Animated.View
            style={[
              styles.circle,
              {
                transform: [
                  { scale: scaleAnim },
                  { rotate },
                ],
              },
            ]}
          >
            <Text style={styles.counterText}>
              {count}
            </Text>

            <Text style={styles.counterLabel}>
              TOTAL CLICKS
            </Text>
          </Animated.View>
        </BlurView>

        {/* BUTTONS */}
        <View style={styles.buttonRow}>
          <GlassButton
            title="Increase"
            icon="＋"
            color="#9333EA"
            onPress={increment}
          />

          <GlassButton
            title="Decrease"
            icon="－"
            color="#2563EB"
            onPress={decrement}
          />

          <GlassButton
            title="Restart"
            icon="↺"
            color="#10B981"
            onPress={reset}
          />
        </View>

        {/* FOOTER */}
        <BlurView
          intensity={45}
          tint={darkMode ? 'dark' : 'light'}
          style={styles.footer}
        >
          <Text style={styles.footerTitle}>
            Futuristic Counter App 🚀
          </Text>

          <Text style={styles.footerSub}>
            Smooth • Animated • Glassmorphic
          </Text>
        </BlurView>
      </ScrollView>
    </LinearGradient>
  );
}

/* FLOATING PARTICLES */
function Particle() {
  const translateY = useRef(
    new Animated.Value(height + Math.random() * height)
  ).current;

  const opacity = useRef(
    new Animated.Value(Math.random())
  ).current;

  const size = Math.random() * 10 + 4;

  const left = Math.random() * width;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -100,
          duration: 7000 + Math.random() * 6000,
          useNativeDriver: true,
        }),

        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),

          Animated.timing(opacity, {
            toValue: 0.2,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',

        width: size,
        height: size,

        borderRadius: size / 2,

        backgroundColor:
          'rgba(255,255,255,0.25)',

        left,

        opacity,

        transform: [{ translateY }],
      }}
    />
  );
}

/* GLASS BUTTON */
function GlassButton({
  title,
  icon,
  color,
  onPress,
}: any) {
  const pressAnim = useRef(
    new Animated.Value(1)
  ).current;

  const onPressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 0.92,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={{
        transform: [{ scale: pressAnim }],
        width: '31%',
      }}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={styles.glassButton}
      >
        <BlurView
          intensity={40}
          tint="light"
          style={styles.buttonBlur}
        >
          <LinearGradient
            colors={[
              'rgba(255,255,255,0.18)',
              'rgba(255,255,255,0.05)',
            ]}
            style={styles.gradientBorder}
          >
            <View
              style={[
                styles.iconCircle,
                {
                  backgroundColor: color,
                },
              ]}
            >
              <Text style={styles.icon}>
                {icon}
              </Text>
            </View>

            <Text style={styles.buttonText}>
              {title}
            </Text>
          </LinearGradient>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContainer: {
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 60,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  header: {
    alignItems: 'center',
    marginBottom: 30,
  },

  heading: {
    color: '#fff',
    fontSize: 38,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  subHeading: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 17,
    marginTop: 6,
  },

  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    gap: 10,
  },

  toggleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  mainCard: {
    minHeight: 340,

    borderRadius: 40,

    justifyContent: 'center',
    alignItems: 'center',

    overflow: 'hidden',

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',

    backgroundColor: 'rgba(255,255,255,0.05)',
  },

  glow: {
    position: 'absolute',

    width: 260,
    height: 260,

    borderRadius: 150,

    backgroundColor:
      'rgba(168,85,247,0.28)',
  },

  circle: {
    width: 240,
    height: 240,

    borderRadius: 140,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor:
      'rgba(255,255,255,0.05)',

    borderWidth: 2,
    borderColor:
      'rgba(255,255,255,0.15)',
  },

  counterText: {
    color: '#fff',
    fontSize: 92,
    fontWeight: 'bold',
  },

  counterLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 17,
    letterSpacing: 4,
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginTop: 35,
  },

  glassButton: {
    height: 180,

    borderRadius: 30,

    overflow: 'hidden',
  },

  buttonBlur: {
    flex: 1,
  },

  gradientBorder: {
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 1,
    borderColor:
      'rgba(255,255,255,0.12)',
  },

  iconCircle: {
    width: 74,
    height: 74,

    borderRadius: 50,

    justifyContent: 'center',
    alignItems: 'center',

    marginBottom: 18,
  },

  icon: {
    color: '#fff',
    fontSize: 34,
    fontWeight: 'bold',
  },

  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },

  footer: {
    marginTop: 35,

    height: 110,

    borderRadius: 28,

    justifyContent: 'center',

    paddingHorizontal: 25,

    overflow: 'hidden',

    borderWidth: 1,
    borderColor:
      'rgba(255,255,255,0.12)',
  },

  footerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },

  footerSub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 15,
    marginTop: 5,
  },
});