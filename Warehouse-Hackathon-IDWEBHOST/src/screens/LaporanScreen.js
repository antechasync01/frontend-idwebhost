import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors, fonts, spacing, borderRadius } from '../styles/colors';
import { useResponsive } from '../context/ResponsiveContext';
import { useWarehouse } from '../context/WarehouseContext';

const LaporanScreen = () => {
  const { isMobile } = useResponsive();
  const { movements, showToast } = useWarehouse();
  const [typeFilter, setTypeFilter] = useState('ALL');

  const filtered = movements.filter((m) => {
    if (typeFilter === 'ALL') return true;
    return m.type === typeFilter;
  });

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
      {/* Header */}
      <View style={[styles.headerRow, isMobile && styles.headerRowMobile]}>
        <View>
          <Text style={styles.pageTitle}>Audit Trail & Log Pergerakan Stok</Text>
          <Text style={styles.pageSubtitle}>
            Catatan kronologis immutable seluruh pergerakan barang, transfer display, dan stock opname
          </Text>
        </View>

        <TouchableOpacity
          style={styles.exportBtn}
          onPress={() => showToast('Log audit mutasi berhasil diekspor ke format CSV', 'success')}
        >
          <i className="fa-solid fa-file-csv" style={{ marginRight: 6, color: colors.textPrimary }} />
          <Text style={styles.exportBtnText}>Ekspor Audit CSV</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterRow}>
        {['ALL', 'MASUK', 'TRANSFER', 'KELUAR', 'ADJUSTMENT'].map((tf) => (
          <TouchableOpacity
            key={tf}
            style={[styles.filterChip, typeFilter === tf && styles.filterChipActive]}
            onPress={() => setTypeFilter(tf)}
          >
            <Text style={[styles.filterChipText, typeFilter === tf && styles.filterChipTextActive]}>
              {tf === 'ALL' ? 'Semua Tipe' : tf}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Log List Card */}
      <View style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardHeaderTitle}>
            Daftar Entri Audit ({filtered.length} Mutasi Tercatat)
          </Text>
        </View>

        <View style={styles.logsList}>
          {filtered.map((mov) => {
            const mBadge = getMovementBadge(mov.type);
            return (
              <View key={mov.id} style={styles.logCard}>
                <View style={[styles.badgeIcon, { backgroundColor: mBadge.bg }]}>
                  <i className={`fa-solid ${mBadge.icon}`} style={{ color: mBadge.text, fontSize: 13 }} />
                </View>

                <View style={{ flex: 1 }}>
                  <View style={styles.logCardTop}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.logProdName}>{mov.productName}</Text>
                      <Text style={styles.logTypeTag}>{mov.type}</Text>
                    </View>
                    <Text
                      style={[
                        styles.logQtyNumber,
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

                  <Text style={styles.logNotes}>{mov.notes}</Text>

                  <View style={styles.logMeta}>
                    <Text style={styles.logRef}>No Ref: {mov.ref}</Text>
                    <Text style={styles.logDate}>• {mov.date}</Text>
                    <Text style={styles.logUser}>• Petugas: {mov.user}</Text>
                  </View>
                </View>
              </View>
            );
          })}
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
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 9,
    borderRadius: borderRadius.md,
  },
  exportBtnText: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: spacing.base,
    flexWrap: 'wrap',
  },
  filterChip: {
    backgroundColor: colors.cardBg,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    fontWeight: fonts.weights.medium,
  },
  filterChipTextActive: {
    color: colors.primary,
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
  cardHeaderTitle: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
  },
  logsList: {
    gap: spacing.sm,
  },
  logCard: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  badgeIcon: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  logCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  logProdName: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
  },
  logTypeTag: {
    fontSize: 9,
    fontFamily: fonts.mono,
    color: colors.textMuted,
    fontWeight: fonts.weights.semibold,
    marginTop: 1,
  },
  logQtyNumber: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.extrabold,
  },
  logNotes: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    marginVertical: 4,
  },
  logMeta: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
  },
  logRef: {
    fontSize: 10,
    fontFamily: fonts.mono,
    color: colors.textMuted,
  },
  logDate: {
    fontSize: 10,
    color: colors.textMuted,
  },
  logUser: {
    fontSize: 10,
    color: colors.textMuted,
  },
});

export default LaporanScreen;
