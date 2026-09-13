import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors, fonts, spacing, borderRadius } from '../styles/colors';
import { useResponsive } from '../context/ResponsiveContext';
import { useWarehouse } from '../context/WarehouseContext';
import StatCard from '../components/StatCard';

const DashboardScreen = ({ onNavigate }) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const {
    products,
    movements,
    shipments,
    setIsScannerModalOpen,
    setIsTransferModalOpen,
    setSelectedProduct,
    setIsDetailDrawerOpen,
  } = useWarehouse();

  // Metrics
  const lowStockCount = products.filter((p) => p.status === 'STOK MENIPIS' || p.status === 'HABIS').length;
  const pendingShipments = shipments.filter((s) => s.status === 'PENDING').length;
  const totalGudangItems = products.reduce((acc, p) => acc + p.stok_gdg, 0);
  const totalInventoryValue = products.reduce((acc, p) => acc + p.stok_gdg * p.harga_beli, 0);

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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Page Header */}
      <View style={[styles.headerRow, !isDesktop && styles.headerRowCompact]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.pageTitle}>Warehouse Operations Dashboard</Text>
          <Text style={styles.pageSubtitle}>
            Pusat kendali operasional logistik, mutasi stok, penerimaan PO, dan audit fisik
          </Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.quickScanBtn}
            onPress={() => setIsScannerModalOpen(true)}
            activeOpacity={0.8}
          >
            <i className="fa-solid fa-barcode" style={{ color: '#FFFFFF', marginRight: 6 }} />
            <Text style={styles.quickScanBtnText}>Scan Produk</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* AI Attention Operational Alert Banner */}
      <View style={styles.aiAlertCard}>
        <View style={styles.aiIconBadge}>
          <i className="fa-solid fa-wand-magic-sparkles" style={{ color: colors.warning, fontSize: 16 }} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.aiAlertHeader}>
            <Text style={styles.aiAlertTitle}>AI Attention Required: Peringatan Risiko Stok Menipis</Text>
            <View style={styles.aiConfidenceBadge}>
              <Text style={styles.aiConfidenceText}>HERMES ENGINE • 96% CONFIDENCE</Text>
            </View>
          </View>
          <Text style={styles.aiAlertDesc}>
            Hermes AI mendeteksi 2 SKU bahan pokok (Minyak Goreng Bimoli 2L & Teh Botol Sosro) akan habis dalam 36-48 jam ke depan akibat kenaikan tren belanja kasir.
          </Text>
          <View style={styles.aiActionRow}>
            <TouchableOpacity
              style={styles.aiBtnPrimary}
              onPress={() => onNavigate('hermes')}
              activeOpacity={0.8}
            >
              <Text style={styles.aiBtnPrimaryText}>Buka Investigasi Hermes</Text>
              <i className="fa-solid fa-arrow-right" style={{ color: '#FFFFFF', fontSize: 11, marginLeft: 4 }} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.aiBtnSecondary}
              onPress={() => onNavigate('purchasing')}
              activeOpacity={0.8}
            >
              <Text style={styles.aiBtnSecondaryText}>Buat Purchase Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* KPI Stats Grid (Adaptive 4x1 on Desktop, 2x2 on Tablet/iPad, 1-col on Mobile) */}
      <View style={[styles.statsGrid, isTablet && styles.statsGridTablet, isMobile && styles.statsGridMobile]}>
        <View style={isTablet ? styles.statCardWrapperTablet : styles.statCardWrapper}>
          <StatCard
            title="Penerimaan PO Masuk"
            value={`${pendingShipments} PO`}
            subtitle="Tiba di loading dock hari ini"
            badgeText="PENDING"
            badgeType="warning"
            icon="fa-truck-ramp-box"
            iconColor={colors.warning}
            iconBg={colors.warningBg}
            onPress={() => onNavigate('receiving')}
          />
        </View>

        <View style={isTablet ? styles.statCardWrapperTablet : styles.statCardWrapper}>
          <StatCard
            title="Stok On-Hand Gudang"
            value={`${totalGudangItems.toLocaleString('id-ID')} pcs`}
            subtitle="Total fisik di Gudang Utama"
            badgeText="NORMAL"
            badgeType="success"
            icon="fa-boxes-stacked"
            iconColor={colors.primary}
            iconBg={colors.primaryLight}
            onPress={() => onNavigate('inventori')}
          />
        </View>

        <View style={isTablet ? styles.statCardWrapperTablet : styles.statCardWrapper}>
          <StatCard
            title="Nilai Inventori Gudang"
            value={`Rp ${(totalInventoryValue / 1000000).toFixed(1)} Jt`}
            subtitle="Estimasi aset modal stok"
            badgeText="COGS"
            badgeType="info"
            icon="fa-vault"
            iconColor={colors.info}
            iconBg={colors.infoBg}
            onPress={() => onNavigate('inventori')}
          />
        </View>

        <View style={isTablet ? styles.statCardWrapperTablet : styles.statCardWrapper}>
          <StatCard
            title="Stok Kritis / Menipis"
            value={`${lowStockCount} SKU`}
            subtitle="Di bawah ambang minimum"
            badgeText="CRITICAL"
            badgeType="danger"
            icon="fa-triangle-exclamation"
            iconColor={colors.danger}
            iconBg={colors.dangerBg}
            onPress={() => onNavigate('inventori')}
          />
        </View>
      </View>

      {/* Quick Action Buttons Row */}
      <View style={styles.quickActionsSection}>
        <Text style={styles.sectionHeading}>Alur Cepat Operasional Gudang</Text>
        <View style={styles.quickActionGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => setIsTransferModalOpen(true)}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.movementTransferBg }]}>
              <i className="fa-solid fa-right-left" style={{ color: colors.movementTransfer, fontSize: 16 }} />
            </View>
            <Text style={styles.actionCardTitle}>Transfer ke Display</Text>
            <Text style={styles.actionCardDesc}>Pindahkan stok gudang ke rak penjualan kasir</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => onNavigate('receiving')}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.movementMasukBg }]}>
              <i className="fa-solid fa-truck-ramp-box" style={{ color: colors.movementMasuk, fontSize: 16 }} />
            </View>
            <Text style={styles.actionCardTitle}>Verifikasi PO Masuk</Text>
            <Text style={styles.actionCardDesc}>Periksa surat jalan & fisik pengiriman supplier</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => onNavigate('stock-check')}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.movementOpnameBg }]}>
              <i className="fa-solid fa-clipboard-check" style={{ color: colors.movementOpname, fontSize: 16 }} />
            </View>
            <Text style={styles.actionCardTitle}>Mulai Stock Opname</Text>
            <Text style={styles.actionCardDesc}>Hitung fisik barang & deteksi selisih stok</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Two Column Layout: Critical Stock Attention & Recent Movements */}
      <View style={[styles.twoColLayout, !isDesktop && styles.twoColLayoutStacked]}>
        {/* Left Col: Stock Alert List */}
        <View style={styles.cardContainer}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardHeaderTitle}>Monitoring Produk Perlu Perhatian</Text>
              <Text style={styles.cardHeaderSub}>Status stok display vs gudang mendekati batas aman</Text>
            </View>
            <TouchableOpacity onPress={() => onNavigate('inventori')}>
              <Text style={styles.viewAllText}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.productListWrap}>
            {products.slice(0, 5).map((p) => (
              <TouchableOpacity
                key={p.id}
                style={styles.productRowItem}
                onPress={() => {
                  setSelectedProduct(p);
                  setIsDetailDrawerOpen(true);
                }}
                activeOpacity={0.7}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.prodRowName}>{p.name}</Text>
                  <Text style={styles.prodRowSku}>{p.sku} • {p.kategori}</Text>
                </View>
                <View style={styles.prodStockSplit}>
                  <Text style={styles.prodStockText}>Disp: <Text style={{ fontWeight: 'bold' }}>{p.stok_disp}</Text></Text>
                  <Text style={styles.prodStockText}>Gdg: <Text style={{ fontWeight: 'bold' }}>{p.stok_gdg}</Text></Text>
                </View>
                <View
                  style={[
                    styles.prodStatusBadge,
                    {
                      backgroundColor:
                        p.status === 'NORMAL'
                          ? colors.successBg
                          : p.status === 'HABIS'
                          ? colors.dangerBg
                          : colors.warningBg,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.prodStatusText,
                      {
                        color:
                          p.status === 'NORMAL'
                            ? colors.success
                            : p.status === 'HABIS'
                            ? colors.danger
                            : colors.warning,
                      },
                    ]}
                  >
                    {p.status}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Right Col: Recent Movements */}
        <View style={styles.cardContainer}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardHeaderTitle}>Riwayat Mutasi Terkini</Text>
              <Text style={styles.cardHeaderSub}>Log pergerakan barang real-time</Text>
            </View>
            <TouchableOpacity onPress={() => onNavigate('laporan')}>
              <Text style={styles.viewAllText}>Audit Log</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.movementsListWrap}>
            {movements.slice(0, 5).map((mov) => {
              const mBadge = getMovementBadge(mov.type);
              return (
                <View key={mov.id} style={styles.movRowItem}>
                  <View style={[styles.movBadgeIcon, { backgroundColor: mBadge.bg }]}>
                    <i className={`fa-solid ${mBadge.icon}`} style={{ color: mBadge.text, fontSize: 11 }} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.movTopLine}>
                      <Text style={styles.movProdName} numberOfLines={1}>{mov.productName}</Text>
                      <Text
                        style={[
                          styles.movQtyText,
                          {
                            color:
                              mov.qty > 0
                                ? colors.success
                                : mov.qty < 0
                                ? colors.danger
                                : colors.textPrimary,
                          },
                        ]}
                      >
                        {mov.qty > 0 ? `+${mov.qty}` : mov.qty} pcs
                      </Text>
                    </View>
                    <Text style={styles.movNotesText} numberOfLines={1}>{mov.notes}</Text>
                    <View style={styles.movMetaLine}>
                      <Text style={styles.movRefText}>{mov.ref}</Text>
                      <Text style={styles.movDateText}>• {mov.date}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  headerRowCompact: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  pageTitle: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.extrabold,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  quickScanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.base,
    paddingVertical: 9,
    borderRadius: borderRadius.md,
  },
  quickScanBtnText: {
    color: '#FFFFFF',
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
  },
  aiAlertCard: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginBottom: spacing.base,
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  aiIconBadge: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FDE68A',
    flexShrink: 0,
  },
  aiAlertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: 4,
  },
  aiAlertTitle: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: '#92400E',
  },
  aiConfidenceBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  aiConfidenceText: {
    fontSize: 9,
    fontWeight: fonts.weights.bold,
    color: '#B45309',
  },
  aiAlertDesc: {
    fontSize: fonts.sizes.xs,
    color: '#78350F',
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  aiActionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  aiBtnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B45309',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
  },
  aiBtnPrimaryText: {
    color: '#FFFFFF',
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold,
  },
  aiBtnSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D97706',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
  },
  aiBtnSecondaryText: {
    color: '#92400E',
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.semibold,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.base,
    marginBottom: spacing.base,
  },
  statsGridTablet: {
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  statsGridMobile: {
    flexDirection: 'column',
    gap: spacing.sm,
  },
  statCardWrapper: {
    flex: 1,
  },
  statCardWrapperTablet: {
    width: 'calc(50% - 8px)',
  },
  quickActionsSection: {
    marginBottom: spacing.base,
  },
  sectionHeading: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  quickActionGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  actionCard: {
    flex: 1,
    minWidth: 160,
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  actionCardTitle: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
  },
  actionCardDesc: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  twoColLayout: {
    flexDirection: 'row',
    gap: spacing.base,
    marginBottom: spacing.xxl,
  },
  twoColLayoutStacked: {
    flexDirection: 'column',
  },
  cardContainer: {
    flex: 1,
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  cardHeaderTitle: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
  },
  cardHeaderSub: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    marginTop: 1,
  },
  viewAllText: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.semibold,
    color: colors.primary,
  },
  productListWrap: {
    gap: spacing.xs,
  },
  productRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    gap: spacing.sm,
  },
  prodRowName: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
  },
  prodRowSku: {
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: fonts.mono,
  },
  prodStockSplit: {
    alignItems: 'flex-end',
    marginRight: spacing.xs,
  },
  prodStockText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  prodStatusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  prodStatusText: {
    fontSize: 9,
    fontWeight: fonts.weights.bold,
  },
  movementsListWrap: {
    gap: spacing.xs,
  },
  movRowItem: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  movBadgeIcon: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.xs,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  movTopLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  movProdName: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
    flex: 1,
  },
  movQtyText: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold,
  },
  movNotesText: {
    fontSize: 10,
    color: colors.textSecondary,
    marginVertical: 1,
  },
  movMetaLine: {
    flexDirection: 'row',
    gap: 4,
  },
  movRefText: {
    fontSize: 9,
    color: colors.textMuted,
    fontFamily: fonts.mono,
  },
  movDateText: {
    fontSize: 9,
    color: colors.textMuted,
  },
});

export default DashboardScreen;
