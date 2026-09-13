import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors, fonts, spacing, borderRadius } from '../styles/colors';
import { useResponsive } from '../context/ResponsiveContext';
import { useWarehouse } from '../context/WarehouseContext';
import TransferModal from '../components/TransferModal';

const TransferScreen = () => {
  const { isMobile } = useResponsive();
  const {
    products,
    movements,
    setSelectedProduct,
    setIsTransferModalOpen,
  } = useWarehouse();

  const transferLogs = movements.filter((m) => m.type === 'TRANSFER');

  // Low display products that urgently need transfer
  const urgentRestock = products.filter((p) => p.stok_disp < 20 && p.stok_gdg > 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <TransferModal />

      {/* Header */}
      <View style={[styles.headerRow, isMobile && styles.headerRowMobile]}>
        <View>
          <Text style={styles.pageTitle}>Transfer Stok ke Display (Rak Toko)</Text>
          <Text style={styles.pageSubtitle}>
            Pindahkan stok fisik dari Gudang Utama untuk mengisi rak kasir minimarket
          </Text>
        </View>

        <TouchableOpacity
          style={styles.primaryActionBtn}
          onPress={() => {
            setSelectedProduct(products[0]);
            setIsTransferModalOpen(true);
          }}
        >
          <i className="fa-solid fa-plus" style={{ color: '#FFFFFF', marginRight: 6 }} />
          <Text style={styles.primaryActionBtnText}>Buat Mutasi Transfer Baru</Text>
        </TouchableOpacity>
      </View>

      {/* Urgent Transfer Recommendations */}
      {urgentRestock.length > 0 && (
        <View style={styles.alertCard}>
          <View style={styles.alertHeader}>
            <i className="fa-solid fa-bell" style={{ color: colors.warning, fontSize: 16 }} />
            <Text style={styles.alertTitle}>Rekomendasi Restock Cepat Rak Display ({urgentRestock.length} Produk)</Text>
          </View>
          <Text style={styles.alertDesc}>
            Produk berikut memiliki stok display menipis di area kasir sementara stok di gudang masih mencukupi.
          </Text>

          <View style={styles.urgentGrid}>
            {urgentRestock.map((p) => (
              <View key={p.id} style={styles.urgentItemCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.urgentName}>{p.name}</Text>
                  <Text style={styles.urgentStockInfo}>
                    Display: <Text style={{ color: colors.danger, fontWeight: 'bold' }}>{p.stok_disp}</Text> | Gudang: {p.stok_gdg} pcs
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.btnQuickTransfer}
                  onPress={() => {
                    setSelectedProduct(p);
                    setIsTransferModalOpen(true);
                  }}
                >
                  <Text style={styles.btnQuickTransferText}>Transfer</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Transfer History Card */}
      <View style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>Log Mutasi Transfer Display</Text>
            <Text style={styles.cardSub}>Riwayat pemindahan stok dari Gudang Utama ke Rak Display</Text>
          </View>
        </View>

        {transferLogs.length === 0 ? (
          <View style={styles.emptyState}>
            <i className="fa-solid fa-right-left" style={{ fontSize: 28, color: colors.textMuted, marginBottom: 8 }} />
            <Text style={styles.emptyText}>Belum ada aktivitas transfer display hari ini.</Text>
          </View>
        ) : (
          <View style={styles.logsList}>
            {transferLogs.map((log) => (
              <View key={log.id} style={styles.logItem}>
                <View style={styles.logIconBox}>
                  <i className="fa-solid fa-right-left" style={{ color: colors.primary, fontSize: 13 }} />
                </View>

                <View style={{ flex: 1 }}>
                  <View style={styles.logTopRow}>
                    <Text style={styles.logProdName}>{log.productName}</Text>
                    <Text style={styles.logQtyText}>+{log.qty} pcs ke Display</Text>
                  </View>
                  <Text style={styles.logNotesText}>{log.notes}</Text>
                  <View style={styles.logMetaRow}>
                    <Text style={styles.logRefText}>{log.ref}</Text>
                    <Text style={styles.logDateText}>• {log.date}</Text>
                    <Text style={styles.logUserText}>• Petugas: {log.user}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
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
  headerRowMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  pageTitle: {
    fontSize: fonts.sizes.xxl,
    fontWeight: fonts.weights.extrabold,
    color: colors.textPrimary,
  },
  pageSubtitle: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.base,
    paddingVertical: 9,
    borderRadius: borderRadius.md,
  },
  primaryActionBtnText: {
    color: '#FFFFFF',
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
  },
  alertCard: {
    backgroundColor: colors.warningBg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.warningBorder,
    padding: spacing.base,
    marginBottom: spacing.base,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 4,
  },
  alertTitle: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: colors.warning,
  },
  alertDesc: {
    fontSize: fonts.sizes.xs,
    color: '#78350F',
    marginBottom: spacing.sm,
  },
  urgentGrid: {
    gap: spacing.xs,
  },
  urgentItemCard: {
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  urgentName: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
  },
  urgentStockInfo: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  btnQuickTransfer: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
  },
  btnQuickTransferText: {
    color: '#FFFFFF',
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold,
  },
  cardContainer: {
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    marginBottom: spacing.xxxl,
  },
  cardHeader: {
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  cardTitle: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
  },
  cardSub: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  emptyState: {
    padding: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
  },
  logsList: {
    gap: spacing.sm,
  },
  logItem: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    alignItems: 'flex-start',
  },
  logIconBox: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  logTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logProdName: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
  },
  logQtyText: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: colors.primary,
  },
  logNotesText: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    marginVertical: 2,
  },
  logMetaRow: {
    flexDirection: 'row',
    gap: 4,
  },
  logRefText: {
    fontSize: 10,
    fontFamily: fonts.mono,
    color: colors.textMuted,
  },
  logDateText: {
    fontSize: 10,
    color: colors.textMuted,
  },
  logUserText: {
    fontSize: 10,
    color: colors.textMuted,
  },
});

export default TransferScreen;
