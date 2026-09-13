import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, fonts, spacing, borderRadius, layout } from '../styles/colors';
import { useResponsive } from '../context/ResponsiveContext';

const BottomNav = ({ activeScreen, onNavigate }) => {
  const { isMobile } = useResponsive();

  if (!isMobile) return null;

  const tabs = [
    { key: 'dashboard', label: 'Dashboard', icon: 'fa-chart-pie' },
    { key: 'inventori', label: 'Stok Rak', icon: 'fa-boxes-stacked' },
    { key: 'stock-check', label: 'Scan / Opname', icon: 'fa-barcode', isCenter: true },
    { key: 'receiving', label: 'Penerimaan', icon: 'fa-truck-ramp-box' },
    { key: 'transfer', label: 'Transfer', icon: 'fa-right-left' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeScreen === tab.key;

        if (tab.isCenter) {
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.centerButtonWrap}
              onPress={() => onNavigate(tab.key)}
              activeOpacity={0.85}
            >
              <View style={[styles.centerButton, isActive && styles.centerButtonActive]}>
                <i className={`fa-solid ${tab.icon}`} style={{ fontSize: 18, color: '#FFFFFF' }} />
              </View>
              <Text style={[styles.tabLabel, styles.centerLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabItem}
            onPress={() => onNavigate(tab.key)}
            activeOpacity={0.7}
          >
            <i
              className={`fa-solid ${tab.icon}`}
              style={{
                fontSize: 16,
                color: isActive ? colors.primary : colors.textMuted,
                marginBottom: 3,
              }}
            />
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: layout.bottomNavHeight,
    backgroundColor: colors.cardBg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.xs,
    paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    zIndex: 999,
    boxShadow: '0 -4px 16px rgba(0,0,0,0.08)',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    minHeight: 48,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: fonts.weights.medium,
    color: colors.textMuted,
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: fonts.weights.bold,
  },
  centerButtonWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -18,
  },
  centerButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 14px rgba(79, 70, 229, 0.45)',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  centerButtonActive: {
    backgroundColor: colors.primaryDark,
    transform: [{ scale: 1.05 }],
  },
  centerLabel: {
    marginTop: 2,
    fontSize: 9,
    fontWeight: fonts.weights.bold,
  },
});

export default BottomNav;
