import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { colors, fonts, spacing, borderRadius } from '../styles/colors';

const pageTitles = {
  dashboard: 'Executive Intelligence',
  produk: 'Manajemen Produk',
  inventori: 'Manajemen Inventori',
  transaksi: 'Riwayat Transaksi',
  supplier: 'Manajemen Supplier (Owner Privilege)',
  hermes: 'Hermes AI Engine & Investigation',
  laporan: 'Laporan & Analisis',
  pengaturan: 'Pengaturan Sistem',
};

const TopBar = ({ activeScreen }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Text style={styles.pageTitle}>{pageTitles[activeScreen] || 'Dashboard'}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleBadgeText}>OWNER ROLE</Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <i
            className="fa-solid fa-magnifying-glass"
            style={{ fontSize: 14, color: colors.textMuted, marginRight: 8 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search commands or data..."
            placeholderTextColor={colors.textMuted}
          />
        </View>

        {/* Notification Bell */}
        <View style={styles.notifWrap}>
          <i
            className="fa-solid fa-bell"
            style={{ fontSize: 18, color: colors.textSecondary }}
          />
          <View style={styles.notifBadge}>
            <Text style={styles.notifBadgeText}>3</Text>
          </View>
        </View>

        {/* Store Selector */}
        <View style={styles.storeSelector}>
          <Text style={styles.storeName}>AURA Minimarket #01</Text>
          <i
            className="fa-solid fa-chevron-down"
            style={{ fontSize: 11, color: colors.textSecondary, marginLeft: 6 }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 64,
    backgroundColor: colors.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  pageTitle: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
  },
  roleBadge: {
    borderWidth: 1.5,
    borderColor: colors.textPrimary,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 3,
  },
  roleBadgeText: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
    letterSpacing: 0.5,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    width: 240,
  },
  searchInput: {
    flex: 1,
    fontSize: fonts.sizes.base,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
    outlineStyle: 'none',
  },
  notifWrap: {
    position: 'relative',
    padding: spacing.sm,
  },
  notifBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: colors.danger,
    borderRadius: borderRadius.full,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.cardBg,
  },
  notifBadgeText: {
    fontSize: 9,
    fontWeight: fonts.weights.bold,
    color: '#FFFFFF',
    fontFamily: fonts.regular,
  },
  storeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  storeName: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
  },
});

export default TopBar;
