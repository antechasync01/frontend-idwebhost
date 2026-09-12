import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors, fonts, spacing, borderRadius, layout } from '../styles/colors';

const menuItems = [
  { key: 'dashboard', label: 'Dashboard', icon: 'fa-chart-simple' },
  { key: 'produk', label: 'Produk', icon: 'fa-box' },
  { key: 'inventori', label: 'Inventori', icon: 'fa-warehouse', badge: '12' },
  { key: 'transaksi', label: 'Transaksi', icon: 'fa-receipt' },
  { key: 'supplier', label: 'Supplier', icon: 'fa-truck-field', badge: '8' },
  { key: 'hermes', label: 'Hermes AI', icon: 'fa-wand-magic-sparkles', badgeNew: true },
  { key: 'laporan', label: 'Laporan', icon: 'fa-clipboard-list' },
  { key: 'pengaturan', label: 'Pengaturan', icon: 'fa-gear' },
];

const Sidebar = ({ activeScreen, onNavigate }) => {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoSection}>
        <View style={styles.logoIcon}>
          <Text style={styles.logoLetter}>A</Text>
        </View>
        <View style={styles.logoTextWrap}>
          <Text style={styles.logoTitle}>AURA</Text>
          <Text style={styles.logoSubtitle}>SMART OPERATIONS</Text>
        </View>
      </View>

      {/* Role Info - only show on certain pages */}
      <View style={styles.roleSection}>
        <Text style={styles.roleLabel}>ROLE AKTIF</Text>
        <Text style={styles.roleName}>OWNER TOKO</Text>
        <Text style={styles.roleStore}>Aura Market #1</Text>
      </View>

      {/* Navigation */}
      <ScrollView style={styles.navSection} showsVerticalScrollIndicator={false}>
        {menuItems.map((item) => {
          const isActive = activeScreen === item.key;
          return (
            <TouchableOpacity
              key={item.key}
              style={[styles.menuItem, isActive && styles.menuItemActive]}
              onPress={() => onNavigate(item.key)}
              activeOpacity={0.7}
            >
              {isActive && <View style={styles.activeBar} />}
              <View style={styles.menuIconWrap}>
                <i
                  className={`fa-solid ${item.icon}`}
                  style={{
                    fontSize: 16,
                    color: isActive ? colors.primary : colors.textSecondary,
                    width: 20,
                    textAlign: 'center',
                  }}
                />
              </View>
              <Text style={[styles.menuLabel, isActive && styles.menuLabelActive]}>
                {item.label}
              </Text>
              {item.badge && (
                <View style={styles.badgeCount}>
                  <Text style={styles.badgeCountText}>{item.badge}</Text>
                </View>
              )}
              {item.badgeNew && (
                <View style={styles.badgeNew}>
                  <Text style={styles.badgeNewText}>NEW</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* User Profile */}
      <View style={styles.userSection}>
        <View style={styles.userAvatar}>
          <Text style={styles.userAvatarText}>JD</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Jimmy Dane</Text>
          <Text style={styles.userRole}>Owner Account</Text>
        </View>
        <i
          className="fa-solid fa-chevron-right"
          style={{ fontSize: 12, color: colors.textMuted }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: layout.sidebarWidth,
    backgroundColor: colors.sidebarBg,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.base,
    gap: spacing.sm,
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLetter: {
    color: '#FFFFFF',
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold,
    fontFamily: fonts.regular,
  },
  logoTextWrap: {
    flexDirection: 'column',
  },
  logoTitle: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
    letterSpacing: 0.5,
  },
  logoSubtitle: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.medium,
    color: colors.primary,
    fontFamily: fonts.regular,
    letterSpacing: 1,
  },
  roleSection: {
    marginHorizontal: spacing.base,
    marginBottom: spacing.base,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
  },
  roleLabel: {
    fontSize: fonts.sizes.xs,
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontWeight: fonts.weights.medium,
    letterSpacing: 0.5,
  },
  roleName: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
    marginTop: 2,
  },
  roleStore: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },
  navSection: {
    flex: 1,
    paddingHorizontal: spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: 2,
    position: 'relative',
  },
  menuItemActive: {
    backgroundColor: colors.primaryLight,
  },
  activeBar: {
    position: 'absolute',
    right: 0,
    top: 8,
    bottom: 8,
    width: 3,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  menuIconWrap: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  menuLabel: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.medium,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    flex: 1,
  },
  menuLabelActive: {
    color: colors.primary,
    fontWeight: fonts.weights.semibold,
  },
  badgeCount: {
    backgroundColor: colors.dangerBg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeCountText: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.semibold,
    color: colors.danger,
    fontFamily: fonts.regular,
  },
  badgeNew: {
    backgroundColor: colors.badgeNew,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  badgeNewText: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold,
    color: '#FFFFFF',
    fontFamily: fonts.regular,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.base,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.semibold,
    color: colors.primary,
    fontFamily: fonts.regular,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
  },
  userRole: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },
});

export default Sidebar;
