import React, { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { ResponsiveProvider, useResponsive } from './context/ResponsiveContext';
import { WarehouseProvider, useWarehouse } from './context/WarehouseContext';
import { colors, layout, fonts, spacing, borderRadius } from './styles/colors';

// Admin Components
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import BottomNav from './components/BottomNav';
import DetailDrawer from './components/DetailDrawer';
import ToastNotification from './components/ToastNotification';

// Admin Screens
import DashboardScreen from './screens/DashboardScreen';
import InventoriScreen from './screens/InventoriScreen';
import PenerimaanScreen from './screens/PenerimaanScreen';
import TransferScreen from './screens/TransferScreen';
import StockCheckScreen from './screens/StockCheckScreen';
import ProdukScreen from './screens/ProdukScreen';
import PurchasingScreen from './screens/PurchasingScreen';
import HermesAIScreen from './screens/HermesAIScreen';
import LaporanScreen from './screens/LaporanScreen';

// Auth Screen
import LoginScreen from './screens/auth/LoginScreen';

// Staff Components
import StaffBottomNav from './components/staff/StaffBottomNav';
import StaffTopBar from './components/staff/StaffTopBar';

// Staff Screens
import StaffHomeScreen from './screens/staff/StaffHomeScreen';
import StaffTasksScreen from './screens/staff/StaffTasksScreen';
import StaffScanScreen from './screens/staff/StaffScanScreen';
import StaffOpnameScreen from './screens/staff/StaffOpnameScreen';
import StaffProfileScreen from './screens/staff/StaffProfileScreen';

const ADMIN_SCREENS = {
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

const STAFF_SCREENS = {
  'staff-home': StaffHomeScreen,
  'staff-tasks': StaffTasksScreen,
  'staff-scan': StaffScanScreen,
  'staff-opname': StaffOpnameScreen,
  'staff-profile': StaffProfileScreen,
};

// ─────────────── Admin Desktop/Tablet/Mobile Layout ───────────────
const AdminLayout = () => {
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

  const ScreenComponent = ADMIN_SCREENS[displayedScreen] || DashboardScreen;

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

// ─────────────── Staff Mobile Layout ───────────────
const StaffMobileLayout = () => {
  const { staffTasks, userRole, setUserRole, handleLogout } = useWarehouse();
  const { isMobile } = useResponsive();
  const [activeScreen, setActiveScreen] = useState('staff-home');
  const [displayedScreen, setDisplayedScreen] = useState('staff-home');
  const [useDeviceFrame, setUseDeviceFrame] = useState(true);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const pendingTaskCount = staffTasks.filter((t) => t.status === 'PENDING').length;

  const handleNavigate = useCallback(
    (screen) => {
      if (screen === activeScreen) return;

      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: -6, duration: 100, useNativeDriver: true }),
      ]).start(() => {
        setActiveScreen(screen);
        setDisplayedScreen(screen);
        slideAnim.setValue(10);

        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
          Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 9, useNativeDriver: true }),
        ]).start();
      });
    },
    [activeScreen, fadeAnim, slideAnim]
  );

  const ScreenComponent = STAFF_SCREENS[displayedScreen] || StaffHomeScreen;

  const mobileAppCore = (
    <View style={styles.staffContainer}>
      <StaffTopBar activeScreen={activeScreen} />

      <View style={styles.staffContentArea}>
        <Animated.View
          style={[
            styles.animatedContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <ScreenComponent onNavigate={handleNavigate} />
        </Animated.View>
      </View>

      <StaffBottomNav
        activeScreen={activeScreen}
        onNavigate={handleNavigate}
        pendingTaskCount={pendingTaskCount}
      />

      <ToastNotification />
    </View>
  );

  // Native Mobile Screen or User selected Full Width
  if (isMobile || !useDeviceFrame) {
    return (
      <View style={styles.fullScreenWrapper}>
        {!isMobile && (
          <View style={styles.simulatorTopBar}>
            <View style={styles.simLeft}>
              <i className="fa-solid fa-mobile-screen-button" style={{ color: '#818CF8', marginRight: 8, fontSize: 14 }} />
              <Text style={styles.simTitle}>AURA Staff Mobile (Layar Penuh)</Text>
            </View>
            <View style={styles.simRight}>
              <TouchableOpacity
                style={styles.simBtnOutline}
                onPress={() => setUseDeviceFrame(true)}
                activeOpacity={0.8}
              >
                <i className="fa-solid fa-mobile" style={{ marginRight: 6, fontSize: 12, color: '#E2E8F0' }} />
                <Text style={styles.simBtnText}>Format HP</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.simBtnAdmin}
                onPress={() => setUserRole('WAREHOUSE_ADMIN')}
                activeOpacity={0.8}
              >
                <i className="fa-solid fa-shield-halved" style={{ marginRight: 6, fontSize: 12, color: '#A5B4FC' }} />
                <Text style={styles.simBtnAdminText}>Portal Admin</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.simBtnLogout}
                onPress={handleLogout}
                activeOpacity={0.8}
                title="Keluar"
              >
                <i className="fa-solid fa-arrow-right-from-bracket" style={{ fontSize: 12, color: '#FDA4AF' }} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        <View style={styles.fullScreenInner}>{mobileAppCore}</View>
      </View>
    );
  }

  // Desktop Simulator View with Phone Frame
  return (
    <View style={styles.simulatorBg}>
      {/* Top Simulator Control Bar */}
      <View style={styles.simulatorTopBar}>
        <View style={styles.simLeft}>
          <i className="fa-solid fa-mobile-screen-button" style={{ color: '#818CF8', marginRight: 8, fontSize: 16 }} />
          <Text style={styles.simTitle}>AURA Staff Mobile</Text>
          <View style={styles.simBadge}>
            <Text style={styles.simBadgeText}>Simulasi HP (412 × 860)</Text>
          </View>
        </View>

        <View style={styles.simRight}>
          <TouchableOpacity
            style={styles.simBtnOutline}
            onPress={() => setUseDeviceFrame(false)}
            activeOpacity={0.8}
          >
            <i className="fa-solid fa-expand" style={{ marginRight: 6, fontSize: 12, color: '#E2E8F0' }} />
            <Text style={styles.simBtnText}>Layar Penuh</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.simBtnAdmin}
            onPress={() => setUserRole('WAREHOUSE_ADMIN')}
            activeOpacity={0.8}
          >
            <i className="fa-solid fa-shield-halved" style={{ marginRight: 6, fontSize: 12, color: '#A5B4FC' }} />
            <Text style={styles.simBtnAdminText}>Portal Admin</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.simBtnLogout}
            onPress={handleLogout}
            activeOpacity={0.8}
            title="Keluar"
          >
            <i className="fa-solid fa-arrow-right-from-bracket" style={{ fontSize: 12, color: '#FDA4AF' }} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Phone Frame Device */}
      <View style={styles.phoneContainer}>
        <View style={styles.phoneShell}>
          {/* Dynamic Island / Status Bar */}
          <View style={styles.phoneHeader}>
            <Text style={styles.phoneTime}>09:41</Text>
            <View style={styles.islandPill}>
              <View style={styles.cameraLens} />
            </View>
            <View style={styles.phoneStatusIcons}>
              <i className="fa-solid fa-signal" style={{ fontSize: 10, color: '#0F172A', marginRight: 4 }} />
              <i className="fa-solid fa-wifi" style={{ fontSize: 10, color: '#0F172A', marginRight: 4 }} />
              <i className="fa-solid fa-battery-full" style={{ fontSize: 12, color: '#0F172A' }} />
            </View>
          </View>

          {/* App viewport inside phone */}
          <View style={styles.phoneViewport}>
            {mobileAppCore}
          </View>

          {/* Bottom Home Indicator Bar */}
          <View style={styles.phoneFooter}>
            <View style={styles.homeIndicator} />
          </View>
        </View>
      </View>
    </View>
  );
};

// ─────────────── Main App Router ───────────────
const AppRouter = () => {
  const { isAuthenticated, userRole } = useWarehouse();

  // Not logged in → show Login
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // Staff role → Staff Mobile App
  if (userRole === 'WAREHOUSE_STAFF') {
    return <StaffMobileLayout />;
  }

  // Admin role → Admin Layout
  return <AdminLayout />;
};

const App = () => {
  return (
    <ResponsiveProvider>
      <WarehouseProvider>
        <AppRouter />
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
  // Staff Mobile styles
  staffContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: '#F8FAFC',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  staffContentArea: {
    flex: 1,
    overflow: 'auto',
  },
  // Full-width wrapper
  fullScreenWrapper: {
    flex: 1,
    height: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#F8FAFC',
  },
  fullScreenInner: {
    flex: 1,
    overflow: 'hidden',
  },
  // Simulator styles
  simulatorBg: {
    flex: 1,
    height: '100vh',
    width: '100vw',
    backgroundColor: '#0F172A',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  simulatorTopBar: {
    height: 48,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    zIndex: 10,
  },
  simLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  simTitle: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: '#F8FAFC',
  },
  simBadge: {
    marginLeft: spacing.sm,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.4)',
  },
  simBadgeText: {
    fontSize: 10,
    fontWeight: fonts.weights.semibold,
    color: '#A5B4FC',
  },
  simRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  simBtnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
  },
  simBtnText: {
    fontSize: 11,
    fontWeight: fonts.weights.semibold,
    color: '#E2E8F0',
  },
  simBtnAdmin: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
  },
  simBtnAdminText: {
    fontSize: 11,
    fontWeight: fonts.weights.bold,
    color: '#C7D2FE',
  },
  simBtnLogout: {
    width: 30,
    height: 30,
    borderRadius: borderRadius.sm,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  phoneShell: {
    width: 412,
    maxWidth: '96vw',
    height: 'calc(100vh - 72px)',
    maxHeight: 860,
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    borderWidth: 8,
    borderColor: '#334155',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.1)',
  },
  phoneHeader: {
    height: 32,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  phoneTime: {
    fontSize: 11,
    fontWeight: fonts.weights.bold,
    color: '#0F172A',
  },
  islandPill: {
    width: 70,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraLens: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1E293B',
  },
  phoneStatusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneViewport: {
    flex: 1,
    overflow: 'hidden',
  },
  phoneFooter: {
    height: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeIndicator: {
    width: 120,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#94A3B8',
  },
});

export default App;
