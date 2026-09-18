import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, fonts, spacing, borderRadius, layout } from '../../styles/colors';
import { useWarehouse } from '../../context/WarehouseContext';

const StaffTopBar = ({ activeScreen }) => {
  const { currentUser, shiftInfo } = useWarehouse();

  const getScreenTitle = () => {
    switch (activeScreen) {
      case 'staff-home': return 'Home';
      case 'staff-tasks': return 'Tugas Saya';
      case 'staff-scan': return 'Scan Produk';
      case 'staff-opname': return 'Stock Opname';
      case 'staff-profile': return 'Profil';
      default: return 'AURA Staff';
    }
  };

  return (
    <View style={styles.container}>
      {/* Left: Brand + Screen title */}
      <View style={styles.leftSection}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>A</Text>
        </View>
        <View>
          <Text style={styles.screenTitle}>{getScreenTitle()}</Text>
          <View style={styles.staffModeBadge}>
            <View style={[styles.statusDot, shiftInfo.isClockedIn && styles.statusDotActive]} />
            <Text style={styles.staffModeText}>
              {shiftInfo.isClockedIn ? 'On Shift' : 'Staff Mode'}
            </Text>
          </View>
        </View>
      </View>

      {/* Right: Avatar */}
      <View style={styles.rightSection}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>
            {currentUser?.avatar || 'AW'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: layout.staffTopBarHeight,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    zIndex: 100,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoBadge: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#4F46E5',
    backgroundImage: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: fonts.weights.bold,
  },
  screenTitle: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
  },
  staffModeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.textMuted,
  },
  statusDotActive: {
    backgroundColor: '#10B981',
  },
  staffModeText: {
    fontSize: 10,
    fontWeight: fonts.weights.semibold,
    color: colors.textMuted,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    backgroundImage: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  avatarText: {
    fontSize: 11,
    fontWeight: fonts.weights.bold,
    color: colors.primary,
  },
});

export default StaffTopBar;
