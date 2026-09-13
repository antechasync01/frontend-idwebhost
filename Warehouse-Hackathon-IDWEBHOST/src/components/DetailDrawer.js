import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Pressable } from 'react-native';
import { colors, fonts, spacing, borderRadius, layout } from '../styles/colors';
import { useResponsive } from '../context/ResponsiveContext';
import { useWarehouse } from '../context/WarehouseContext';

const DetailDrawer = () => {
  const { isMobile, isTablet } = useResponsive();
  const {
    selectedProduct,
    isDetailDrawerOpen,
    setIsDetailDrawerOpen,
    movements,
    setIsTransferModalOpen,
    setIsOpnameModalOpen,
  } = useWarehouse();

  if (!isDetailDrawerOpen || !selectedProduct) return null;

  const productMovements = movements.filter(
    (m) => m.productId === selectedProduct.id || m.productName === selectedProduct.name
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'NORMAL':
        return { bg: colors.successBg, text: colors.success, label: 'NORMAL' };
      case 'STOK MENIPIS':
        return { bg: colors.warningBg, text: colors.warning, label: 'STOK MENIPIS' };
      case 'HABIS':
        return { bg: colors.dangerBg, text: colors.danger, label: 'HABIS' };
      default:
        return { bg: colors.neutralBg, text: colors.neutral, label: status };
    }
  };

  const getMovementBadge = (type) => {
    switch (type) {
      case 'MASUK':
        return { bg: colors.movementMasukBg, text: colors.movementMasuk, icon: 'fa-arrow-down' };
      case 'TRANSFER':
        return { bg: colors.movementTransferBg, text: colors.movementTransfer, icon: 'fa-right-left' };
      case 'KELUAR':
        return { bg: colors.movementKeluarBg, text: colors.movementKeluar, icon: 'fa-arrow-up' };
      case 'ADJUSTMENT':
        return { bg: colors.movementOpnameBg, text: colors.movementOpname, icon: 'fa-sliders' };
      default:
        return { bg: colors.neutralBg, text: colors.neutral, icon: 'fa-circle' };
    }
  };

  const statusBadge = getStatusBadge(selectedProduct.status);

  return (
    <Modal
      visible={isDetailDrawerOpen}
      transparent
      animationType="fade"
      onRequestClose={() => setIsDetailDrawerOpen(false)}
    >
      <View style={[styles.modalOverlay, isMobile && styles.modalOverlayMobile]}>
        <Pressable style={styles.backdrop} onPress={() => setIsDetailDrawerOpen(false)} />
        <View style={[styles.drawerContainer, isMobile && styles.drawerMobile]}>
          {/* Mobile Handle Indicator */}
          {isMobile && <View style={styles.sheetHandle} />}

          {/* Drawer Header */}
          <View style={styles.drawerHeader}>
            <View style={{ flex: 1 }}>
              <View style={styles.badgeRow}>
                <Text style={styles.skuText}>{selectedProduct.sku}</Text>
                <View style={[styles.statusBadge, { backgroundColor: statusBadge.bg }]}>
                  <Text style={[styles.statusBadgeText, { color: statusBadge.text }]}>
                    {statusBadge.label}
                  </Text>
                </View>
              </View>
              <Text style={styles.productName}>{selectedProduct.name}</Text>
              <Text style={styles.categoryText}>
                {selectedProduct.kategori} • EAN: {selectedProduct.ean13}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setIsDetailDrawerOpen(false)}
              activeOpacity={0.7}
            >
              <i className="fa-solid fa-xmark" style={{ fontSize: 16, color: colors.textMuted }} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.drawerBody} showsVerticalScrollIndicator={false}>
            {/* Stock Split Grid Cards */}
            <Text style={styles.sectionTitle}>Pemisahan Lokasi Stok Fisik</Text>
            <View style={styles.stockCardsGrid}>
              <View style={[styles.stockCard, styles.stockCardDisplay]}>
                <Text style={styles.stockCardLabel}>STOK DISPLAY</Text>
                <Text style={styles.stockCardValue}>{selectedProduct.stok_disp}</Text>
                <Text style={styles.stockCardSub}>Rak Kasir</Text>
              </View>

              <View style={[styles.stockCard, styles.stockCardGudang]}>
                <Text style={styles.stockCardLabel}>STOK GUDANG</Text>
                <Text style={styles.stockCardValue}>{selectedProduct.stok_gdg}</Text>
                <Text style={styles.stockCardSub}>On-Hand</Text>
              </View>

              <View style={[styles.stockCard, styles.stockCardTotal]}>
                <Text style={styles.stockCardLabel}>TOTAL AKTUAL</Text>
                <Text style={[styles.stockCardValue, { color: colors.primary }]}>
                  {selectedProduct.total_stok}
                </Text>
                <Text style={styles.stockCardSub}>{selectedProduct.unit}</Text>
              </View>
            </View>

            {/* Product Specs & Info */}
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>Lokasi Rak / Bin</Text>
                <Text style={styles.infoVal}>{selectedProduct.lokasi_rak}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>Supplier Utama</Text>
                <Text style={styles.infoVal}>{selectedProduct.supplier}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>Harga Beli (COGS)</Text>
                <Text style={styles.infoVal}>
                  Rp {selectedProduct.harga_beli?.toLocaleString('id-ID')}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>Harga Jual Kasir</Text>
                <Text style={[styles.infoVal, { fontWeight: fonts.weights.bold }]}>
                  Rp {selectedProduct.harga_jual?.toLocaleString('id-ID')}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>Gross Margin</Text>
                <Text style={[styles.infoVal, { color: colors.success }]}>
                  {selectedProduct.margin}%
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                style={[styles.btn, styles.btnTransfer]}
                onPress={() => {
                  setIsDetailDrawerOpen(false);
                  setIsTransferModalOpen(true);
                }}
                activeOpacity={0.8}
              >
                <i className="fa-solid fa-right-left" style={{ fontSize: 13, color: '#FFFFFF', marginRight: 6 }} />
                <Text style={styles.btnTextWhite}>Transfer ke Display</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, styles.btnOpname]}
                onPress={() => {
                  setIsDetailDrawerOpen(false);
                  setIsOpnameModalOpen(true);
                }}
                activeOpacity={0.8}
              >
                <i className="fa-solid fa-clipboard-check" style={{ fontSize: 13, color: colors.textPrimary, marginRight: 6 }} />
                <Text style={styles.btnTextDark}>Stock Opname</Text>
              </TouchableOpacity>
            </View>

            {/* Chronological Stock Movements */}
            <View style={styles.timelineSection}>
              <Text style={styles.sectionTitle}>Riwayat Pergerakan Stok</Text>
              {productMovements.length === 0 ? (
                <View style={styles.emptyMovements}>
                  <i className="fa-solid fa-box-open" style={{ fontSize: 24, color: colors.textMuted, marginBottom: 8 }} />
                  <Text style={styles.emptyText}>Belum ada pergerakan stok tercatat.</Text>
                </View>
              ) : (
                productMovements.map((mov) => {
                  const mBadge = getMovementBadge(mov.type);
                  return (
                    <View key={mov.id} style={styles.movementItem}>
                      <View style={[styles.movementIconWrap, { backgroundColor: mBadge.bg }]}>
                        <i className={`fa-solid ${mBadge.icon}`} style={{ fontSize: 12, color: mBadge.text }} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={styles.movementTopRow}>
                          <Text style={styles.movementType}>{mov.type}</Text>
                          <Text
                            style={[
                              styles.movementQty,
                              {
                                color:
                                  mov.qty > 0
                                    ? colors.success
                                    : mov.qty < 0
                                    ? colors.danger
                                    : colors.textSecondary,
                              },
                            ]}
                          >
                            {mov.qty > 0 ? `+${mov.qty}` : mov.qty} pcs
                          </Text>
                        </View>
                        <Text style={styles.movementNotes}>{mov.notes}</Text>
                        <View style={styles.movementMetaRow}>
                          <Text style={styles.movementRef}>Ref: {mov.ref}</Text>
                          <Text style={styles.movementDate}>• {mov.date}</Text>
                          <Text style={styles.movementUser}>• {mov.user}</Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: colors.overlayBg,
    zIndex: 9999,
  },
  modalOverlayMobile: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  drawerContainer: {
    width: '100%',
    maxWidth: 480,
    height: '100%',
    backgroundColor: colors.cardBg,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '-4px 0 24px rgba(0,0,0,0.2)',
    zIndex: 10000,
  },
  drawerMobile: {
    maxWidth: '100%',
    height: '88vh',
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingBottom: 24,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginTop: 8,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    backgroundColor: colors.background,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 4,
  },
  skuText: {
    fontSize: 10,
    fontFamily: fonts.mono,
    color: colors.textSecondary,
    backgroundColor: colors.cardBg,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: borderRadius.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: borderRadius.pill,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: fonts.weights.bold,
  },
  productName: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
  },
  categoryText: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    marginTop: 1,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: borderRadius.full,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerBody: {
    flex: 1,
    padding: spacing.base,
  },
  sectionTitle: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  stockCardsGrid: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.base,
  },
  stockCard: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBg,
    alignItems: 'center',
  },
  stockCardDisplay: {
    backgroundColor: '#F8FAFC',
  },
  stockCardGudang: {
    backgroundColor: '#F8FAFC',
  },
  stockCardTotal: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  stockCardLabel: {
    fontSize: 9,
    fontWeight: fonts.weights.bold,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  stockCardValue: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.extrabold,
    color: colors.textPrimary,
    fontFamily: fonts.family,
  },
  stockCardSub: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 1,
  },
  infoCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.base,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  infoKey: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
  },
  infoVal: {
    fontSize: fonts.sizes.xs,
    color: colors.textPrimary,
    fontWeight: fonts.weights.medium,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: borderRadius.md,
  },
  btnTransfer: {
    backgroundColor: colors.primary,
  },
  btnOpname: {
    backgroundColor: colors.neutralBg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnTextWhite: {
    color: '#FFFFFF',
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold,
  },
  btnTextDark: {
    color: colors.textPrimary,
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold,
  },
  timelineSection: {
    marginTop: spacing.xs,
    paddingBottom: spacing.xxl,
  },
  emptyMovements: {
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
  },
  emptyText: {
    fontSize: fonts.sizes.xs,
    color: colors.textMuted,
  },
  movementItem: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    alignItems: 'flex-start',
  },
  movementIconWrap: {
    width: 26,
    height: 26,
    borderRadius: borderRadius.xs,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  movementTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  movementType: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
  },
  movementQty: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold,
  },
  movementNotes: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    marginVertical: 1,
  },
  movementMetaRow: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
  },
  movementRef: {
    fontSize: 9,
    color: colors.textMuted,
    fontFamily: fonts.mono,
  },
  movementDate: {
    fontSize: 9,
    color: colors.textMuted,
  },
  movementUser: {
    fontSize: 9,
    color: colors.textMuted,
  },
});

export default DetailDrawer;
