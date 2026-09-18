import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, fonts, spacing, borderRadius, layout, staffColors } from '../../styles/colors';

const STAFF_TABS = [
  { key: 'staff-home', label: 'Home', icon: 'fa-house' },
  { key: 'staff-tasks', label: 'Tugas', icon: 'fa-clipboard-list', badge: true },
  { key: 'staff-scan', label: 'Scan', icon: 'fa-qrcode', isCenter: true },
  { key: 'staff-opname', label: 'Opname', icon: 'fa-boxes-stacked' },
  { key: 'staff-profile', label: 'Profil', icon: 'fa-user' },
];

const StaffBottomNav = ({ activeScreen, onNavigate, pendingTaskCount }) => {
  return (
    <View style={styles.container}>
      {STAFF_TABS.map((tab) => {
        const isActive = activeScreen === tab.key;

        if (tab.isCenter) {
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.centerWrap}
              onPress={() => onNavigate(tab.key)}
              activeOpacity={0.85}
            >
              <View style={[styles.centerBtn, isActive && styles.centerBtnActive]}>
                <i className={`fa-solid ${tab.icon}`} style={{ fontSize: 20, color: '#FFFFFF' }} />
              </View>
              <Text style={[styles.label, styles.centerLabel, isActive && styles.labelActive]}>
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
            <View style={{ position: 'relative' }}>
              <i
                className={`fa-solid ${tab.icon}`}
                style={{
                  fontSize: 18,
                  color: isActive ? colors.primary : colors.textMuted,
                  marginBottom: 3,
                }}
              />
              {tab.badge && pendingTaskCount > 0 && (
                <View style={styles.badgeCircle}>
                  <Text style={styles.badgeText}>{pendingTaskCount}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
            {isActive && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: layout.staffBottomNavHeight,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.xs,
    paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    zIndex: 999,
    boxShadow: '0 -4px 20px rgba(79, 70, 229, 0.08)',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    minHeight: 52,
    position: 'relative',
  },
  label: {
    fontSize: 10,
    fontWeight: fonts.weights.medium,
    color: colors.textMuted,
    marginTop: 1,
  },
  labelActive: {
    color: colors.primary,
    fontWeight: fonts.weights.bold,
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 24,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -22,
  },
  centerBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#4F46E5',
    backgroundImage: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 20px rgba(79, 70, 229, 0.45)',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  centerBtnActive: {
    transform: [{ scale: 1.08 }],
    boxShadow: '0 8px 24px rgba(79, 70, 229, 0.55)',
  },
  centerLabel: {
    marginTop: 4,
    fontSize: 9,
    fontWeight: fonts.weights.bold,
  },
  badgeCircle: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: colors.danger,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: fonts.weights.bold,
  },
});

export default StaffBottomNav;
