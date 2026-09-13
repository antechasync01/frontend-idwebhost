import React, { useState, useRef, useCallback } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { ResponsiveProvider, useResponsive } from './context/ResponsiveContext';
import { WarehouseProvider } from './context/WarehouseContext';
import { colors, layout } from './styles/colors';

import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import BottomNav from './components/BottomNav';
import DetailDrawer from './components/DetailDrawer';
import ToastNotification from './components/ToastNotification';

import DashboardScreen from './screens/DashboardScreen';
import InventoriScreen from './screens/InventoriScreen';
import PenerimaanScreen from './screens/PenerimaanScreen';
import TransferScreen from './screens/TransferScreen';
import StockCheckScreen from './screens/StockCheckScreen';
import ProdukScreen from './screens/ProdukScreen';
import PurchasingScreen from './screens/PurchasingScreen';
import HermesAIScreen from './screens/HermesAIScreen';
import LaporanScreen from './screens/LaporanScreen';

const SCREENS = {
  dashboard: DashboardScreen,
  inventori: InventoriScreen,
  receiving: PenerimaanScreen,
  transfer: TransferScreen,
  'stock-check': StockCheckScreen,
  produk: ProdukScreen,
  purchasing: PurchasingScreen,
  hermes: HermesAIScreen,
  laporan: LaporanScreen,
};

const MainLayout = () => {
  const { isMobile } = useResponsive();
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [displayedScreen, setDisplayedScreen] = useState('dashboard');

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleNavigate = useCallback(
    (screen) => {
      if (screen === activeScreen) return;

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -8,
          duration: 120,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setActiveScreen(screen);
        setDisplayedScreen(screen);
        slideAnim.setValue(12);

        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.spring(slideAnim, {
            toValue: 0,
            tension: 70,
            friction: 9,
            useNativeDriver: true,
          }),
        ]).start();
      });
    },
    [activeScreen, fadeAnim, slideAnim]
  );

  const ScreenComponent = SCREENS[displayedScreen] || DashboardScreen;

  return (
    <View style={styles.appContainer}>
      {/* Sidebar (Desktop/Tablet Persistent, Mobile Off-canvas Drawer) */}
      <Sidebar activeScreen={activeScreen} onNavigate={handleNavigate} />

      {/* Main Content Area */}
      <View style={styles.mainArea}>
        <TopBar activeScreen={activeScreen} />

        <View style={[styles.contentArea, isMobile && styles.contentAreaMobile]}>
          <Animated.View
            style={[
              styles.animatedContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
              },
            ]}
          >
            <ScreenComponent onNavigate={handleNavigate} />
          </Animated.View>
        </View>

        {/* Mobile Bottom Navigation */}
        {isMobile && <BottomNav activeScreen={activeScreen} onNavigate={handleNavigate} />}
      </View>

      {/* Global Product Detail Drawer & Toasts */}
      <DetailDrawer />
      <ToastNotification />
    </View>
  );
};

const App = () => {
  return (
    <ResponsiveProvider>
      <WarehouseProvider>
        <MainLayout />
      </WarehouseProvider>
    </ResponsiveProvider>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    flexDirection: 'row',
    height: '100vh',
    width: '100vw',
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  mainArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  },
  contentArea: {
    flex: 1,
    overflow: 'auto',
    backgroundColor: colors.background,
  },
  contentAreaMobile: {
    paddingBottom: layout.bottomNavHeight + 10,
  },
  animatedContent: {
    flex: 1,
  },
});

export default App;
