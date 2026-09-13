import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Pressable } from 'react-native';
import { colors, fonts, spacing, borderRadius, layout } from '../styles/colors';
import { useResponsive } from '../context/ResponsiveContext';
import { useWarehouse } from '../context/WarehouseContext';

const menuItems = [
  { key: 'dashboard', label: 'Dashboard', icon: 'fa-chart-pie', roles: ['ALL'] },
  { key: 'inventori', label: 'Inventori Stok', icon: 'fa-boxes-stacked', badge: '10', roles: ['ALL'] },
  { key: 'receiving', label: 'Penerimaan PO', icon: 'fa-truck-ramp-box', badge: '1', badgeType: 'info', roles: ['ALL'] },
  { key: 'transfer', label: 'Transfer Display', icon: 'fa-right-left', roles: ['ALL'] },
  { key: 'stock-check', label: 'Stock Opname', icon: 'fa-clipboard-check', roles: ['ALL'] },
  { key: 'produk', label: 'Master Produk', icon: 'fa-tags', roles: ['WAREHOUSE_ADMIN'] },
  { key: 'purchasing', label: 'Purchasing & PO', icon: 'fa-file-invoice-dollar', roles: ['WAREHOUSE_ADMIN'] },
  { key: 'hermes', label: 'Hermes AI', icon: 'fa-wand-magic-sparkles', badgeNew: true, roles: ['ALL'] },
  { key: 'laporan', label: 'Audit & Laporan', icon: 'fa-clock-rotate-left', roles: ['WAREHOUSE_ADMIN'] },
];

const SidebarContent = ({ activeScreen, onNavigate, onClose }) => {
  const { userRole } = useWarehouse();
  const { sidebarCollapsed, isDesktop } = useResponsive();

  const isDrawer = !isDesktop || Boolean(onClose);

  return (
    <View style={styles.sidebarInner}>
      {/* Brand & Logo Header */}
      <View style={styles.logoHeader}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>A</Text>
        </View>
        {(!sidebarCollapsed || isDrawer) && (
          <View style={styles.logoTitles}>
            <Text style={styles.brandTitle}>AURA</Text>
            <Text style={styles.brandSubtitle}>SMART WAREHOUSE</Text>
          </View>
        )}
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeDrawerButton} activeOpacity={0.7}>
            <i className="fa-solid fa-xmark" style={{ fontSize: 18, color: colors.textMuted }} />
          </TouchableOpacity>
        )}
      </View>

      {/* Role Banner */}
      {(!sidebarCollapsed || isDrawer) && (
        <View style={styles.roleCard}>
          <Text style={styles.roleCardLabel}>ROLE AKTIF</Text>
          <Text style={styles.roleCardName}>
            {userRole === 'WAREHOUSE_ADMIN' ? 'WAREHOUSE ADMIN' : 'WAREHOUSE STAFF'}
          </Text>
          <Text style={styles.roleCardLocation}>Gudang Utama (G-01)</Text>
        </View>
      )}

      {/* Navigation List */}
      <ScrollView style={styles.navSection} showsVerticalScrollIndicator={false}>
        {menuItems.map((item) => {
          const isActive = activeScreen === item.key;
          const isAllowed = item.roles.includes('ALL') || item.roles.includes(userRole);

          if (!isAllowed) {
            return (
              <TouchableOpacity
                key={item.key}
                style={[styles.menuItem, styles.menuItemDisabled]}
                onPress={() => onNavigate(item.key)}
                activeOpacity={0.6}
              >
                <View style={styles.iconContainer}>
                  <i
                    className={`fa-solid ${item.icon}`}
                    style={{ fontSize: 15, color: colors.textMuted, width: 20, textAlign: 'center' }}
                  />
                </View>
                {(!sidebarCollapsed || isDrawer) && (
                  <>
                    <Text style={[styles.menuLabel, styles.menuLabelDisabled]}>
                      {item.label}
                    </Text>
                    <i className="fa-solid fa-lock" style={{ fontSize: 11, color: colors.textMuted }} />
                  </>
                )}
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={item.key}
              style={[styles.menuItem, isActive && styles.menuItemActive]}
              onPress={() => {
                onNavigate(item.key);
                if (onClose) onClose();
              }}
              activeOpacity={0.7}
            >
              {isActive && <View style={styles.activeBar} />}
              <View style={styles.iconContainer}>
                <i
                  className={`fa-solid ${item.icon}`}
                  style={{
                    fontSize: 15,
                    color: isActive ? colors.primary : colors.textSecondary,
                    width: 20,
                    textAlign: 'center',
                  }}
                />
              </View>

              {(!sidebarCollapsed || isDrawer) && (
                <>
                  <Text style={[styles.menuLabel, isActive && styles.menuLabelActive]}>
                    {item.label}
                  </Text>
                  {item.badge && (
                    <View
                      style={[
                        styles.badgeCount,
                        item.badgeType === 'info' && { backgroundColor: colors.infoBg },
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeCountText,
                          item.badgeType === 'info' && { color: colors.info },
                        ]}
                      >
                        {item.badge}
                      </Text>
                    </View>
                  )}
                  {item.badgeNew && (
                    <View style={styles.badgeNew}>
                      <Text style={styles.badgeNewText}>AI</Text>
                    </View>
                  )}
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* User Profile Footer */}
      <View style={styles.userFooter}>
        <View style={styles.userAvatar}>
          <Text style={styles.userAvatarText}>
            {userRole === 'WAREHOUSE_ADMIN' ? 'BS' : 'AW'}
          </Text>
        </View>
        {(!sidebarCollapsed || isDrawer) && (
          <View style={styles.userInfoWrap}>
            <Text style={styles.userName}>
              {userRole === 'WAREHOUSE_ADMIN' ? 'Budi Santoso' : 'Ani Wijaya'}
            </Text>
            <Text style={styles.userRoleText}>
              {userRole === 'WAREHOUSE_ADMIN' ? 'Kepala Gudang' : 'Staff Operasional'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const Sidebar = ({ activeScreen, onNavigate }) => {
  const { isDesktop, mobileMenuOpen, setMobileMenuOpen, sidebarCollapsed } = useResponsive();

  // Mobile & Tablet Drawer (< 1024px)
  if (!isDesktop) {
    return (
      <Modal
        visible={mobileMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMobileMenuOpen(false)}
      >
        <View style={styles.mobileOverlay}>
          <Pressable style={styles.backdrop} onPress={() => setMobileMenuOpen(false)} />
          <View style={styles.mobileDrawerContainer}>
            <SidebarContent
              activeScreen={activeScreen}
              onNavigate={onNavigate}
              onClose={() => setMobileMenuOpen(false)}
            />
          </View>
        </View>
      </Modal>
    );
  }

  // Desktop Persistent Sidebar (>= 1024px)
  return (
    <View style={[styles.container, sidebarCollapsed && styles.containerCollapsed]}>
      <SidebarContent activeScreen={activeScreen} onNavigate={onNavigate} />
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
    transition: 'width 0.2s ease',
  },
  containerCollapsed: {
    width: layout.sidebarCollapsedWidth,
  },
  sidebarInner: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  logoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.base,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  logoBadge: {
    width: 34,
    height: 34,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold,
  },
  logoTitles: {
    flex: 1,
  },
  brandTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 9,
    fontWeight: fonts.weights.bold,
    color: colors.primary,
    letterSpacing: 1,
  },
  closeDrawerButton: {
    padding: spacing.xs,
  },
  roleCard: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  roleCardLabel: {
    fontSize: 10,
    fontWeight: fonts.weights.bold,
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  roleCardName: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
    marginTop: 2,
  },
  roleCardLocation: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    marginTop: 1,
  },
  navSection: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: 2,
    position: 'relative',
    minHeight: 44,
  },
  menuItemActive: {
    backgroundColor: colors.sidebarActiveBg,
  },
  menuItemDisabled: {
    opacity: 0.6,
  },
  activeBar: {
    position: 'absolute',
    left: 0,
    top: 6,
    bottom: 6,
    width: 3,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.pill,
  },
  iconContainer: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  menuLabel: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.medium,
    color: colors.textSecondary,
    flex: 1,
  },
  menuLabelActive: {
    color: colors.primary,
    fontWeight: fonts.weights.semibold,
  },
  menuLabelDisabled: {
    color: colors.textMuted,
  },
  badgeCount: {
    backgroundColor: colors.neutralBg,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: borderRadius.pill,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeCountText: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold,
    color: colors.textSecondary,
  },
  badgeNew: {
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  badgeNewText: {
    fontSize: 9,
    fontWeight: fonts.weights.bold,
    color: '#FFFFFF',
  },
  userFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: spacing.sm,
  },
  userAvatar: {
    width: 34,
    height: 34,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold,
    color: colors.primary,
  },
  userInfoWrap: {
    flex: 1,
  },
  userName: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
  },
  userRoleText: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
  },
  mobileOverlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.overlayBg,
    zIndex: 9999,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mobileDrawerContainer: {
    width: '82%',
    maxWidth: 320,
    height: '100%',
    backgroundColor: colors.sidebarBg,
    boxShadow: '4px 0 24px rgba(0,0,0,0.3)',
    zIndex: 10000,
  },
});

export default Sidebar;
