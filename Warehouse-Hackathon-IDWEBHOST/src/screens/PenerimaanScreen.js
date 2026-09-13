import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors, fonts, spacing, borderRadius } from '../styles/colors';
import { useResponsive } from '../context/ResponsiveContext';
import { useWarehouse } from '../context/WarehouseContext';
import ReceivingModal from '../components/ReceivingModal';

const PenerimaanScreen = () => {
  const { isMobile } = useResponsive();
  const {
    shipments,
    setSelectedShipment,
    setIsReceivingModalOpen,
  } = useWarehouse();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return { bg: colors.successBg, text: colors.success, label: '✓ DISETUJUI' };
      case 'PENDING':
        return { bg: colors.warningBg, text: colors.warning, label: '⏳ MENUNGGU VERIFIKASI' };
      case 'CORRECTION_REQUESTED':
        return { bg: '#FEF3C7', text: '#B45309', label: '⚠️ PERLU KOREKSI' };
      case 'REJECTED':
        return { bg: colors.dangerBg, text: colors.danger, label: '✕ DITOLAK' };
      default:
        return { bg: colors.neutralBg, text: colors.neutral, label: status };
    }
  };

  const handleOpenShipment = (s) => {
    setSelectedShipment(s);
    setIsReceivingModalOpen(true);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ReceivingModal />

      {/* Header */}
      <View style={[styles.headerRow, isMobile && styles.headerRowMobile]}>
        <View>
          <Text style={styles.pageTitle}>Penerimaan Barang (Stock Receiving)</Text>
          <Text style={styles.pageSubtitle}>
            Verifikasi fisik pengiriman supplier, pencocokan surat jalan, dan approval stok masuk
          </Text>
        </View>
      </View>

      {/* Workflow Guidance Banner */}
      <View style={styles.workflowCard}>
        <Text style={styles.wfTitle}>Alur Verifikasi Standar Operasional Gudang:</Text>
        <View style={[styles.wfStepsRow, isMobile && styles.wfStepsRowMobile]}>
          <View style={styles.wfStep}>
            <View style={styles.stepNum}><Text style={styles.stepNumText}>1</Text></View>
            <Text style={styles.stepText}>Cek Surat Jalan & PO</Text>
          </View>
          <i className="fa-solid fa-arrow-right" style={{ color: colors.borderDark, fontSize: 12 }} />
          <View style={styles.wfStep}>
            <View style={styles.stepNum}><Text style={styles.stepNumText}>2</Text></View>
            <Text style={styles.stepText}>Hitung Fisik Barang</Text>
          </View>
          <i className="fa-solid fa-arrow-right" style={{ color: colors.borderDark, fontSize: 12 }} />
          <View style={styles.wfStep}>
            <View style={styles.stepNum}><Text style={styles.stepNumText}>3</Text></View>
            <Text style={styles.stepText}>Approval & Masuk Stok</Text>
          </View>
        </View>
      </View>

      {/* Shipments List */}
      <View style={styles.listCard}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Daftar Pengiriman Barang Masuk</Text>
          <Text style={styles.listSub}>Klik baris untuk membuka formulir verifikasi fisik</Text>
        </View>

        <View style={styles.shipmentsContainer}>
          {shipments.map((s) => {
            const sBadge = getStatusBadge(s.status);
            const totalItems = s.items.reduce((acc, i) => acc + i.expectedQty, 0);

            return (
              <TouchableOpacity
                key={s.id}
                style={styles.shipmentCard}
                onPress={() => handleOpenShipment(s)}
                activeOpacity={0.8}
              >
                <View style={[styles.shipmentTop, isMobile && styles.shipmentTopMobile]}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.poRow}>
                      <Text style={styles.poNum}>{s.poNumber}</Text>
                      <Text style={styles.poDate}>{s.date} • {s.estimatedArrival}</Text>
                    </View>
                    <Text style={styles.supplierName}>{s.supplier}</Text>
                    <Text style={styles.driverInfo}>
                      <i className="fa-solid fa-truck" style={{ marginRight: 4, color: colors.textMuted }} />
                      Kurir / Driver: {s.driverName}
                    </Text>
                  </View>

                  <View style={styles.shipmentMetaRight}>
                    <View style={[styles.statusBadge, { backgroundColor: sBadge.bg }]}>
                      <Text style={[styles.statusBadgeText, { color: sBadge.text }]}>
                        {sBadge.label}
                      </Text>
                    </View>
                    <Text style={styles.itemsCountText}>
                      {s.items.length} SKU ({totalItems} pcs total)
                    </Text>
                  </View>
                </View>

                {/* Items preview snippet */}
                <View style={styles.itemsSnippetBox}>
                  <Text style={styles.snippetTitle}>Daftar Item PO:</Text>
                  <View style={styles.snippetList}>
                    {s.items.map((it) => (
                      <View key={it.sku} style={styles.snippetItem}>
                        <Text style={styles.snippetItemName}>{it.name}</Text>
                        <Text style={styles.snippetItemQty}>{it.expectedQty} {it.unit}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Action button */}
                <View style={styles.cardFooterAction}>
                  <TouchableOpacity
                    style={[
                      styles.btnVerifyAction,
                      s.status === 'APPROVED' && styles.btnVerifyDone,
                    ]}
                    onPress={() => handleOpenShipment(s)}
                  >
                    <i
                      className={`fa-solid ${
                        s.status === 'APPROVED' ? 'fa-eye' : 'fa-clipboard-check'
                      }`}
                      style={{
                        color: s.status === 'APPROVED' ? colors.textPrimary : '#FFFFFF',
                        marginRight: 6,
                      }}
                    />
                    <Text
                      style={[
                        styles.btnVerifyActionText,
                        s.status === 'APPROVED' && styles.btnVerifyDoneText,
                      ]}
                    >
                      {s.status === 'APPROVED' ? 'Lihat Rincian Penerimaan' : 'Mulai Verifikasi Fisik'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
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
  workflowCard: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginBottom: spacing.base,
  },
  wfTitle: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold,
    color: colors.primaryDark,
    marginBottom: spacing.sm,
  },
  wfStepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    gap: spacing.sm,
  },
  wfStepsRowMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  wfStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  stepNum: {
    width: 22,
    height: 22,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: fonts.weights.bold,
  },
  stepText: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
  },
  listCard: {
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    marginBottom: spacing.xxxl,
  },
  listHeader: {
    marginBottom: spacing.base,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  listTitle: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
  },
  listSub: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  shipmentsContainer: {
    gap: spacing.base,
  },
  shipmentCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
  },
  shipmentTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  shipmentTopMobile: {
    flexDirection: 'column',
    gap: spacing.sm,
  },
  poRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 4,
  },
  poNum: {
    fontSize: fonts.sizes.sm,
    fontFamily: fonts.mono,
    fontWeight: fonts.weights.bold,
    color: colors.primary,
  },
  poDate: {
    fontSize: fonts.sizes.xs,
    color: colors.textMuted,
  },
  supplierName: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
  },
  driverInfo: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    marginTop: 3,
  },
  shipmentMetaRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.pill,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: fonts.weights.bold,
  },
  itemsCountText: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
  },
  itemsSnippetBox: {
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: spacing.sm,
    marginVertical: spacing.xs,
  },
  snippetTitle: {
    fontSize: 10,
    fontWeight: fonts.weights.bold,
    color: colors.textMuted,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  snippetList: {
    gap: 2,
  },
  snippetItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  snippetItemName: {
    fontSize: fonts.sizes.xs,
    color: colors.textPrimary,
    fontWeight: fonts.weights.medium,
  },
  snippetItemQty: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    fontFamily: fonts.mono,
  },
  cardFooterAction: {
    marginTop: spacing.sm,
  },
  btnVerifyAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 9,
    borderRadius: borderRadius.md,
  },
  btnVerifyActionText: {
    color: '#FFFFFF',
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold,
  },
  btnVerifyDone: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnVerifyDoneText: {
    color: colors.textPrimary,
  },
});

export default PenerimaanScreen;
