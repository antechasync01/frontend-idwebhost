import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import DashboardScreen from './screens/DashboardScreen';
import ProdukScreen from './screens/ProdukScreen';
import InventoriScreen from './screens/InventoriScreen';
import TransaksiScreen from './screens/TransaksiScreen';
import SupplierScreen from './screens/SupplierScreen';
import HermesAIScreen from './screens/HermesAIScreen';
import LaporanScreen from './screens/LaporanScreen';
import PengaturanScreen from './screens/PengaturanScreen';
import { colors } from './styles/colors';

const SCREENS = {
  dashboard: DashboardScreen,
  produk: ProdukScreen,
  inventori: InventoriScreen,
  transaksi: TransaksiScreen,
  supplier: SupplierScreen,
  hermes: HermesAIScreen,
  laporan: LaporanScreen,
  pengaturan: PengaturanScreen,
};

const App = () => {
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [displayedScreen, setDisplayedScreen] = useState('dashboard');

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleNavigate = useCallback((screen) => {
    if (screen === activeScreen) return;

    // Phase 1: Fade out + slide down + slight scale down
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -12,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.985,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Switch screen at midpoint
      setActiveScreen(screen);
      setDisplayedScreen(screen);

      // Reset to start position for entrance
      slideAnim.setValue(18);
      scaleAnim.setValue(0.985);

      // Phase 2: Fade in + slide up + scale up
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 9,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [activeScreen, fadeAnim, slideAnim, scaleAnim]);

  const ScreenComponent = SCREENS[displayedScreen] || DashboardScreen;

  return (
    <View style={styles.container}>
      <Sidebar activeScreen={activeScreen} onNavigate={handleNavigate} />
      <View style={styles.mainArea}>
        <TopBar activeScreen={activeScreen} />
        <View style={styles.content}>
          <Animated.View
            style={[
              styles.animatedContent,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim },
                ],
              },
            ]}
          >
            <ScreenComponent />
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    height: '100vh',
    backgroundColor: colors.background,
  },
  mainArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    overflow: 'auto',
  },
  animatedContent: {
    flex: 1,
  },
});

export default App;
