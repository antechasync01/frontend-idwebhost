import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Modal, Pressable } from 'react-native';
import { colors, fonts, spacing, borderRadius } from '../styles/colors';
import { useWarehouse } from '../context/WarehouseContext';
import { useResponsive } from '../context/ResponsiveContext';

const ReceivingModal = () => {
  const { isMobile } = useResponsive();
  const {
    isReceivingModalOpen,
    setIsReceivingModalOpen,
    selectedShipment,
    handleReceiveStock,
  } = useWarehouse();

  const [verifiedItems, setVerifiedItems] = useState([]);
  const [discrepancyNotes, setDiscrepancyNotes] = useState('');

  useEffect(() => {
    if (selectedShipment) {
      setVerifiedItems(
        selectedShipment.items.map((i) => ({
          ...i,
          receivedQty: i.receivedQty || i.expectedQty,
          verified: true,
        }))
      );
      setDiscrepancyNotes('');
    }
  }, [selectedShipment]);

  if (!isReceivingModalOpen || !selectedShipment) return null;

  const handleQtyChange = (index, val) => {
    const parsed = parseInt(val, 10);
    const newItems = [...verifiedItems];
    newItems[index].receivedQty = isNaN(parsed) ? 0 : parsed;
    setVerifiedItems(newItems);
  };

  const hasDiscrepancy = verifiedItems.some(
    (i) => parseInt(i.receivedQty, 10) !== parseInt(i.expectedQty, 10)
  );

  return (
    <Modal
      visible={isReceivingModalOpen}
      transparent
      animationType="fade"
      onRequestClose={() => setIsReceivingModalOpen(false)}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.backdrop} onPress={() => setIsReceivingModalOpen(false)} />
        <View style={[styles.modalCard, isMobile && styles.modalCardMobile]}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <View style={styles.headerBadgeRow}>
                <Text style={styles.poNumber}>{selectedShipment.poNumber}</Text>
                <View style={styles.statusPill}>
                  <Text style={styles.statusPillText}>{selectedShipment.status}</Text>
                </View>
              </View>
              <Text style={styles.title}>Verifikasi Penerimaan Barang (PO)</Text>
              <Text style={styles.subtitle}>
                {selectedShipment.supplier} • Driver: {selectedShipment.driverName}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setIsReceivingModalOpen(false)}
            >
              <i className="fa-solid fa-xmark" style={{ fontSize: 16, color: colors.textMuted }} />
            </TouchableOpacity>
          </View>

          {/* Body */}
          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionLabel}>DAFTAR BARANG YANG DITERIMA:</Text>

            {verifiedItems.map((item, idx) => {
              const expected = parseInt(item.expectedQty, 10);
              const received = parseInt(item.receivedQty, 10);
              const diff = received - expected;

              return (
                <View key={item.sku} style={styles.itemCard}>
                  <View style={styles.itemHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemSku}>{item.sku}</Text>
                    </View>
                    <View style={styles.expectedBadge}>
                      <Text style={styles.expectedText}>PO: {expected} {item.unit}</Text>
                    </View>
                  </View>

                  <View style={styles.inputRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.inputLabel}>Fisik Diterima ({item.unit})</Text>
                      <TextInput
                        style={[
                          styles.qtyInput,
                          diff !== 0 && styles.qtyInputMismatch,
                        ]}
                        keyboardType="number-pad"
                        value={item.receivedQty.toString()}
                        onChangeText={(val) => handleQtyChange(idx, val)}
                      />
                    </View>

                    <View style={styles.diffBadgeWrap}>
                      <Text style={styles.diffLabel}>Status Selisih</Text>
                      <View
                        style={[
                          styles.diffBadge,
                          {
                            backgroundColor:
                              diff === 0
                                ? colors.successBg
                                : diff < 0
                                ? colors.dangerBg
                                : colors.warningBg,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.diffBadgeText,
                            {
                              color:
                                diff === 0
                                  ? colors.success
                                  : diff < 0
                                  ? colors.danger
                                  : colors.warning,
                            },
                          ]}
                        >
                          {diff === 0 ? '✓ COCOK' : diff < 0 ? `KURANG ${Math.abs(diff)}` : `LEBIH +${diff}`}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}

            {hasDiscrepancy && (
              <View style={styles.discrepancyAlert}>
                <i
                  className="fa-solid fa-triangle-exclamation"
                  style={{ color: colors.warning, fontSize: 16, marginTop: 2 }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.alertTitle}>Peringatan Selisih Fisik vs Surat Jalan</Text>
                  <Text style={styles.alertDesc}>
                    Jumlah fisik barang yang dihitung berbeda dengan Purchase Order. Anda dapat memilih
                    menyetujui dengan penyesuaian atau meminta koreksi surat jalan ke supplier.
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.notesField}>
              <Text style={styles.inputLabel}>CATATAN PEMERIKSAAN / KONDISI KEMASAN</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Contoh: Kemasan luar baik, segel utuh, expiry date > 12 bulan"
                value={discrepancyNotes}
                onChangeText={setDiscrepancyNotes}
              />
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.btnReject}
              onPress={() => handleReceiveStock(selectedShipment.id, verifiedItems, 'REJECTED')}
            >
              <Text style={styles.btnRejectText}>Tolak</Text>
            </TouchableOpacity>

            {hasDiscrepancy && (
              <TouchableOpacity
                style={styles.btnCorrection}
                onPress={() =>
                  handleReceiveStock(selectedShipment.id, verifiedItems, 'CORRECTION_REQUESTED')
                }
              >
                <Text style={styles.btnCorrectionText}>Minta Koreksi</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.btnApprove}
              onPress={() => handleReceiveStock(selectedShipment.id, verifiedItems, 'APPROVED')}
            >
              <i className="fa-solid fa-circle-check" style={{ color: '#FFFFFF', marginRight: 6 }} />
              <Text style={styles.btnApproveText}>Setujui & Masukkan ke Stok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlayBg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.base,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalCard: {
    width: '100%',
    maxWidth: 600,
    maxHeight: '90vh',
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
    zIndex: 999,
    display: 'flex',
    flexDirection: 'column',
  },
  modalCardMobile: {
    maxWidth: '100%',
    maxHeight: '94vh',
    borderRadius: borderRadius.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    backgroundColor: colors.background,
  },
  headerBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 4,
  },
  poNumber: {
    fontSize: fonts.sizes.xs,
    fontFamily: fonts.mono,
    fontWeight: fonts.weights.bold,
    color: colors.primary,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  statusPill: {
    backgroundColor: colors.neutralBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.pill,
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: fonts.weights.bold,
    color: colors.textSecondary,
  },
  title: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    padding: spacing.xs,
  },
  body: {
    padding: spacing.lg,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: fonts.weights.bold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  itemCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  itemName: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
  },
  itemSku: {
    fontSize: fonts.sizes.xs,
    fontFamily: fonts.mono,
    color: colors.textMuted,
  },
  expectedBadge: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.borderDark,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  expectedText: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    fontWeight: fonts.weights.semibold,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: fonts.weights.semibold,
    color: colors.textMuted,
    marginBottom: 4,
  },
  qtyInput: {
    height: 38,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    backgroundColor: colors.cardBg,
    paddingHorizontal: spacing.md,
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
  },
  qtyInputMismatch: {
    borderColor: colors.warning,
    backgroundColor: colors.warningBg,
  },
  diffBadgeWrap: {
    width: 130,
  },
  diffLabel: {
    fontSize: 10,
    color: colors.textMuted,
    marginBottom: 4,
  },
  diffBadge: {
    height: 38,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  diffBadgeText: {
    fontSize: 10,
    fontWeight: fonts.weights.bold,
  },
  discrepancyAlert: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.warningBg,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.warningBorder,
    marginVertical: spacing.sm,
  },
  alertTitle: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold,
    color: colors.warning,
  },
  alertDesc: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  notesField: {
    marginTop: spacing.sm,
  },
  textInput: {
    height: 38,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    fontSize: fonts.sizes.sm,
    color: colors.textPrimary,
    backgroundColor: colors.cardBg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.background,
  },
  btnReject: {
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    backgroundColor: colors.dangerBg,
  },
  btnRejectText: {
    fontSize: fonts.sizes.sm,
    color: colors.danger,
    fontWeight: fonts.weights.semibold,
  },
  btnCorrection: {
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.warningBorder,
    backgroundColor: colors.warningBg,
  },
  btnCorrectionText: {
    fontSize: fonts.sizes.sm,
    color: colors.warning,
    fontWeight: fonts.weights.semibold,
  },
  btnApprove: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
  },
  btnApproveText: {
    color: '#FFFFFF',
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
  },
});

export default ReceivingModal;
