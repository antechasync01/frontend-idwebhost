import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { colors, fonts, spacing, borderRadius, layout } from '../styles/colors';
import { useResponsive } from '../context/ResponsiveContext';
import { useWarehouse } from '../context/WarehouseContext';

const TopBar = ({ activeScreen, onSearch }) => {
  const { isMobile, isSmallMobile, isTablet, isDesktop, toggleMobileMenu, toggleSidebar, sidebarCollapsed } = useResponsive();
  const { userRole, setUserRole, setIsScannerModalOpen, showToast } = useWarehouse();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    if (onSearch) onSearch(text);
  };

  const notifications = [
    {
      id: 1,
      title: 'Risiko Stok Habis (4 SKU)',
      desc: 'Bimoli 2L & Teh Botol Sosro diprediksi habis dalam 36 jam.',
      time: '10 mnt lalu',
      type: 'warning',
    },
    {
      id: 2,
      title: 'Pengiriman PO Masuk',
      desc: 'PO-2026-092 dari Indofood CBP tiba di loading dock.',
      time: '25 mnt lalu',
      type: 'info',
    },
    {
      id: 3,
      title: 'Selisih Opname Terdeteksi',
      desc: 'Beras Pandan Wangi 5kg selisih -2 karung pada audit kemarin.',
      time: '1 jam lalu',
      type: 'danger',
    },
  ];

  return (
    <View style={[styles.container, (isMobile || isTablet) && styles.containerCompact]}>
      {/* Left Section */}
      <View style={styles.leftSection}>
        {/* Hamburger Menu on Mobile and Tablet (<1024px) */}
        {!isDesktop ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={toggleMobileMenu}
            activeOpacity={0.7}
            title="Buka Menu"
          >
            <i className="fa-solid fa-bars" style={{ fontSize: 17, color: colors.textPrimary }} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={toggleSidebar}
            activeOpacity={0.7}
            title={sidebarCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
          >
            <i
              className={`fa-solid ${sidebarCollapsed ? 'fa-indent' : 'fa-outdent'}`}
              style={{ fontSize: 16, color: colors.textSecondary }}
            />
          </TouchableOpacity>
        )}

        {/* Store Title Badge */}
        <View style={[styles.storeBadge, isSmallMobile && styles.storeBadgeSmall]}>
          <View style={styles.storeDot} />
          <Text style={styles.storeText} numberOfLines={1}>
            {isSmallMobile ? 'G-01' : 'Gudang Utama (G-01)'}
          </Text>
          {isDesktop && <Text style={styles.storeStatusText}>• AURA Minimarket</Text>}
        </View>
      </View>

      {/* Middle Search Bar (Desktop) */}
      {isDesktop && (
        <View style={styles.searchSection}>
          <i
            className="fa-solid fa-magnifying-glass"
            style={{ fontSize: 13, color: colors.textMuted, marginRight: 8 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari SKU, Barcode EAN, atau Nama Produk..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => handleSearchChange('')}>
              <i
                className="fa-solid fa-circle-xmark"
                style={{ fontSize: 13, color: colors.textMuted }}
              />
            </TouchableOpacity>
          ) : (
            <View style={styles.searchShortcut}>
              <Text style={styles.searchShortcutText}>⌘K</Text>
            </View>
          )}
        </View>
      )}

      {/* Right Section Actions */}
      <View style={styles.rightSection}>
        {/* Search button trigger for Mobile & Tablet */}
        {!isDesktop && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setShowMobileSearch(!showMobileSearch)}
            activeOpacity={0.7}
          >
            <i className="fa-solid fa-magnifying-glass" style={{ fontSize: 15, color: colors.textSecondary }} />
          </TouchableOpacity>
        )}

        {/* Quick Barcode Scanner Trigger Button */}
        <TouchableOpacity
          style={[styles.actionButton, styles.scanButton, isMobile && styles.scanButtonMobile]}
          onPress={() => setIsScannerModalOpen(true)}
          activeOpacity={0.8}
        >
          <i
            className="fa-solid fa-barcode"
            style={{ fontSize: 15, color: '#FFFFFF', marginRight: isMobile ? 0 : 6 }}
          />
          {!isMobile && <Text style={styles.scanButtonText}>Scan Barcode</Text>}
        </TouchableOpacity>

        {/* Notifications Button */}
        <View style={{ position: 'relative' }}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              setShowNotifications(!showNotifications);
              setShowRoleDropdown(false);
            }}
            activeOpacity={0.7}
          >
            <i className="fa-regular fa-bell" style={{ fontSize: 16, color: colors.textSecondary }} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <View style={[styles.dropdownMenu, isMobile && styles.dropdownMenuMobile]}>
              <View style={styles.dropdownHeader}>
                <Text style={styles.dropdownTitle}>Notifikasi Operasional</Text>
                <TouchableOpacity onPress={() => setShowNotifications(false)}>
                  <i className="fa-solid fa-xmark" style={{ fontSize: 14, color: colors.textMuted }} />
                </TouchableOpacity>
              </View>
              {notifications.map((n) => (
                <View key={n.id} style={styles.notificationItem}>
                  <View
                    style={[
                      styles.notifDot,
                      {
                        backgroundColor:
                          n.type === 'danger'
                            ? colors.danger
                            : n.type === 'warning'
                            ? colors.warning
                            : colors.info,
                      },
                    ]}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.notifTitle}>{n.title}</Text>
                    <Text style={styles.notifDesc}>{n.desc}</Text>
                    <Text style={styles.notifTime}>{n.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Role Switcher Pill */}
        <View style={{ position: 'relative' }}>
          <TouchableOpacity
            style={[
              styles.roleSwitcherPill,
              userRole === 'WAREHOUSE_ADMIN' ? styles.roleAdmin : styles.roleStaff,
              isSmallMobile && styles.rolePillSmall,
            ]}
            onPress={() => {
              setShowRoleDropdown(!showRoleDropdown);
              setShowNotifications(false);
            }}
            activeOpacity={0.8}
          >
            <i
              className={`fa-solid ${
                userRole === 'WAREHOUSE_ADMIN' ? 'fa-shield-halved' : 'fa-user-gear'
              }`}
              style={{
                fontSize: 12,
                color: userRole === 'WAREHOUSE_ADMIN' ? colors.primaryDark : '#1E293B',
                marginRight: isSmallMobile ? 0 : 5,
              }}
            />
            {!isSmallMobile && (
              <Text
                style={[
                  styles.rolePillText,
                  userRole === 'WAREHOUSE_ADMIN'
                    ? styles.roleAdminText
                    : styles.roleStaffText,
                ]}
              >
                {userRole === 'WAREHOUSE_ADMIN' ? 'ADMIN' : 'STAFF'}
              </Text>
            )}
            <i
              className="fa-solid fa-chevron-down"
              style={{
                fontSize: 9,
                color: colors.textSecondary,
                marginLeft: isSmallMobile ? 0 : 3,
              }}
            />
          </TouchableOpacity>

          {/* Role Switcher Menu */}
          {showRoleDropdown && (
            <View style={[styles.roleDropdown, isMobile && styles.roleDropdownMobile]}>
              <Text style={styles.roleDropdownHeader}>Ganti Role (Demo RBAC)</Text>
              <TouchableOpacity
                style={[
                  styles.roleOption,
                  userRole === 'WAREHOUSE_ADMIN' && styles.roleOptionActive,
                ]}
                onPress={() => {
                  setUserRole('WAREHOUSE_ADMIN');
                  setShowRoleDropdown(false);
                  showToast('Beralih ke role WAREHOUSE_ADMIN (Full Akses Gudang)', 'info');
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.roleOptionTitle}>Warehouse Admin (Lead)</Text>
                  <Text style={styles.roleOptionSub}>Katalog, PO, Verifikasi, Transfer, Lifecycle</Text>
                </View>
                {userRole === 'WAREHOUSE_ADMIN' && (
                  <i className="fa-solid fa-check" style={{ color: colors.primary, fontSize: 12, marginLeft: 8 }} />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleOption,
                  userRole === 'WAREHOUSE_STAFF' && styles.roleOptionActive,
                ]}
                onPress={() => {
                  setUserRole('WAREHOUSE_STAFF');
                  setShowRoleDropdown(false);
                  showToast('Beralih ke role WAREHOUSE_STAFF (Operasional Lapangan)', 'info');
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.roleOptionTitle}>Warehouse Staff (Operasional)</Text>
                  <Text style={styles.roleOptionSub}>Stock Opname, Scan Fisik, Transfer Rak</Text>
                </View>
                {userRole === 'WAREHOUSE_STAFF' && (
                  <i className="fa-solid fa-check" style={{ color: colors.primary, fontSize: 12, marginLeft: 8 }} />
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Mobile/Tablet Expandable Search Bar overlay */}
      {showMobileSearch && !isDesktop && (
        <View style={styles.mobileSearchOverlay}>
          <i
            className="fa-solid fa-magnifying-glass"
            style={{ fontSize: 13, color: colors.textMuted, marginRight: 8 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari SKU, Barcode EAN, Produk..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={handleSearchChange}
            autoFocus
          />
          <TouchableOpacity onPress={() => setShowMobileSearch(false)} style={{ padding: 4 }}>
            <i className="fa-solid fa-xmark" style={{ fontSize: 14, color: colors.textMuted }} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: layout.topBarHeight,
    backgroundColor: colors.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    zIndex: 100,
    position: 'relative',
  },
  containerCompact: {
    height: layout.mobileTopBarHeight,
    paddingHorizontal: spacing.sm,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexShrink: 1,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.md,
    backgroundColor: colors.neutralBg,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  storeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.neutralBg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
    maxWidth: 200,
  },
  storeBadgeSmall: {
    maxWidth: 90,
    paddingHorizontal: 6,
  },
  storeDot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.success,
    flexShrink: 0,
  },
  storeText: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
  },
  storeStatusText: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
  },
  searchSection: {
    flex: 1,
    maxWidth: 400,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 38,
    marginHorizontal: spacing.base,
  },
  mobileSearchOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -46,
    height: 46,
    backgroundColor: colors.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    zIndex: 99,
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
  },
  searchInput: {
    flex: 1,
    fontSize: fonts.sizes.sm,
    color: colors.textPrimary,
    outlineStyle: 'none',
  },
  searchShortcut: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.borderDark,
    borderRadius: borderRadius.xs,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  searchShortcutText: {
    fontSize: fonts.sizes.xs,
    color: colors.textMuted,
    fontFamily: fonts.mono,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  scanButton: {
    backgroundColor: colors.primary,
    height: 38,
  },
  scanButtonMobile: {
    width: 38,
    paddingHorizontal: 0,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.semibold,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.danger,
    borderRadius: borderRadius.pill,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: fonts.weights.bold,
  },
  roleSwitcherPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
  },
  rolePillSmall: {
    paddingHorizontal: 7,
    paddingVertical: 6,
  },
  roleAdmin: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  roleStaff: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
  },
  rolePillText: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold,
    letterSpacing: 0.3,
  },
  roleAdminText: {
    color: colors.primary,
  },
  roleStaffText: {
    color: colors.textPrimary,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 48,
    right: 0,
    width: 320,
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    zIndex: 999,
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
  },
  dropdownMenuMobile: {
    width: 'calc(100vw - 24px)',
    right: -40,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    marginBottom: spacing.sm,
  },
  dropdownTitle: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  notifDot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.pill,
    marginTop: 5,
  },
  notifTitle: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
  },
  notifDesc: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  notifTime: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 3,
  },
  roleDropdown: {
    position: 'absolute',
    top: 48,
    right: 0,
    width: 280,
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    zIndex: 999,
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
  },
  roleDropdownMobile: {
    width: 'calc(100vw - 24px)',
    right: 0,
  },
  roleDropdownHeader: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold,
    color: colors.textMuted,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  roleOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginTop: 4,
  },
  roleOptionActive: {
    backgroundColor: colors.primaryLight,
  },
  roleOptionTitle: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
  },
  roleOptionSub: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

export default TopBar;
