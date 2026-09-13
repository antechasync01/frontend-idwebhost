import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Modal, Pressable } from 'react-native';
import { colors, fonts, spacing, borderRadius } from '../styles/colors';
import { useWarehouse } from '../context/WarehouseContext';
import { useResponsive } from '../context/ResponsiveContext';

const TransferModal = () => {
  const { isMobile } = useResponsive();
  const {
    products,
    selectedProduct,
    isTransferModalOpen,
    setIsTransferModalOpen,
    handleTransferStock,
  } = useWarehouse();

  const [selectedProdId, setSelectedProdId] = useState('');
  const [transferQty, setTransferQty] = useState('12');
  const [transferNotes, setTransferNotes] = useState('Restock rak display toko');

  useEffect(() => {
    if (selectedProduct) {
      setSelectedProdId(selectedProduct.id);
    } else if (products.length > 0 && !selectedProdId) {
      setSelectedProdId(products[0].id);
    }
  }, [selectedProduct, products]);

  if (!isTransferModalOpen) return null;

  const currentProd = products.find((p) => p.id === selectedProdId) || products[0];
  const parsedQty = parseInt(transferQty, 10) || 0;
  const isOverStock = currentProd && parsedQty > currentProd.stok_gdg;
  const newGdgStock = currentProd ? Math.max(0, currentProd.stok_gdg - parsedQty) : 0;
  const newDispStock = currentProd ? currentProd.stok_disp + parsedQty : 0;

  const handleSubmit = () => {
    if (isOverStock || parsedQty <= 0) return;
    handleTransferStock({
      productId: currentProd.id,
      qty: parsedQty,
      notes: transferNotes,
    });
  };

  return (
    <Modal
      visible={isTransferModalOpen}
      transparent
      animationType="fade"
      onRequestClose={() => setIsTransferModalOpen(false)}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.backdrop} onPress={() => setIsTransferModalOpen(false)} />
        <View style={[styles.modalCard, isMobile && styles.modalCardMobile]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Transfer Stok ke Display</Text>
              <Text style={styles.subtitle}>
                Pindahkan stok fisik dari Gudang Utama ke Rak Display Toko
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setIsTransferModalOpen(false)}
              activeOpacity={0.7}
            >
              <i className="fa-solid fa-xmark" style={{ fontSize: 16, color: colors.textMuted }} />
            </TouchableOpacity>
          </View>

          {/* Form Content */}
          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Product Selector */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>PILIH PRODUK</Text>
              <select
                style={styles.selectInput}
                value={selectedProdId}
                onChange={(e) => setSelectedProdId(e.target.value)}
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.sku}) — Gudang: {p.stok_gdg} {p.unit}
                  </option>
                ))}
              </select>
            </View>

            {/* Current Stock Preview Grid */}
            <View style={styles.stockPreviewGrid}>
              <View style={styles.previewBox}>
                <Text style={styles.previewLabel}>Stok Gudang</Text>
                <Text style={styles.previewVal}>{currentProd?.stok_gdg} pcs</Text>
                <Text style={styles.previewSub}>Tersedia</Text>
              </View>
              <View style={styles.arrowBox}>
                <i className="fa-solid fa-arrow-right" style={{ color: colors.primary, fontSize: 16 }} />
              </View>
              <View style={styles.previewBox}>
                <Text style={styles.previewLabel}>Stok Display</Text>
                <Text style={styles.previewVal}>{currentProd?.stok_disp} pcs</Text>
                <Text style={styles.previewSub}>Di Rak Kasir</Text>
              </View>
            </View>

            {/* Transfer Quantity Field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>JUMLAH STOK YANG DIPINDAH</Text>
              <View style={styles.qtyInputRow}>
                <TextInput
                  style={[styles.qtyInput, isOverStock && styles.inputError]}
                  keyboardType="number-pad"
                  value={transferQty}
                  onChangeText={setTransferQty}
                />
                <Text style={styles.unitText}>{currentProd?.unit || 'pcs'}</Text>
              </View>

              {/* Quick Stepper Pills */}
              <View style={styles.stepperRow}>
                {[6, 12, 24, 48].map((q) => (
                  <TouchableOpacity
                    key={q}
                    style={styles.stepperPill}
                    onPress={() => setTransferQty(q.toString())}
                  >
                    <Text style={styles.stepperText}>+{q}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.stepperPillMax}
                  onPress={() => setTransferQty(currentProd ? currentProd.stok_gdg.toString() : '0')}
                >
                  <Text style={styles.stepperTextMax}>Semua</Text>
                </TouchableOpacity>
              </View>

              {isOverStock && (
                <Text style={styles.errorText}>
                  ⚠️ Jumlah transfer melebihi stok gudang ({currentProd.stok_gdg} pcs).
                </Text>
              )}
            </View>

            {/* Calculation After Transfer */}
            <View style={styles.calculationCard}>
              <Text style={styles.calcTitle}>Kalkulasi Setelah Transfer:</Text>
              <View style={styles.calcRow}>
                <Text style={styles.calcKey}>Sisa Stok Gudang:</Text>
                <Text style={styles.calcVal}>{newGdgStock} pcs</Text>
              </View>
              <View style={styles.calcRow}>
                <Text style={styles.calcKey}>Total Stok Display Baru:</Text>
                <Text style={[styles.calcVal, { color: colors.success, fontWeight: fonts.weights.bold }]}>
                  {newDispStock} pcs
                </Text>
              </View>
            </View>

            {/* Notes */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>CATATAN / KETERANGAN</Text>
              <TextInput
                style={styles.textInput}
                value={transferNotes}
                onChangeText={setTransferNotes}
                placeholder="Contoh: Pengisian rak lorong A2"
              />
            </View>
          </ScrollView>

          {/* Footer Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.btnCancel}
              onPress={() => setIsTransferModalOpen(false)}
            >
              <Text style={styles.btnCancelText}>Batal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.btnSubmit,
                (isOverStock || parsedQty <= 0) && styles.btnSubmitDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isOverStock || parsedQty <= 0}
            >
              <i className="fa-solid fa-check" style={{ color: '#FFFFFF', marginRight: 6 }} />
              <Text style={styles.btnSubmitText}>Konfirmasi Transfer</Text>
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
    zIndex: 9999,
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
    maxWidth: 520,
    maxHeight: '88vh',
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
    zIndex: 10000,
    display: 'flex',
    flexDirection: 'column',
  },
  modalCardMobile: {
    maxWidth: '100%',
    maxHeight: '92vh',
    borderRadius: borderRadius.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: fonts.sizes.base,
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
    flex: 1,
    padding: spacing.base,
  },
  fieldGroup: {
    gap: 4,
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: 10,
    fontWeight: fonts.weights.bold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  selectInput: {
    width: '100%',
    height: 40,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBg,
    fontSize: fonts.sizes.sm,
    color: colors.textPrimary,
    outline: 'none',
    fontFamily: fonts.family,
  },
  stockPreviewGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  previewBox: {
    flex: 1,
    alignItems: 'center',
  },
  previewLabel: {
    fontSize: 9,
    color: colors.textMuted,
  },
  previewVal: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
    marginVertical: 1,
  },
  previewSub: {
    fontSize: 9,
    color: colors.textSecondary,
  },
  arrowBox: {
    paddingHorizontal: 4,
  },
  qtyInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  qtyInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
    backgroundColor: colors.cardBg,
  },
  inputError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerBg,
  },
  unitText: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    fontWeight: fonts.weights.medium,
  },
  stepperRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  stepperPill: {
    backgroundColor: colors.neutralBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepperText: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
  },
  stepperPillMax: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  stepperTextMax: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold,
    color: colors.primary,
  },
  errorText: {
    fontSize: fonts.sizes.xs,
    color: colors.danger,
    marginTop: 4,
  },
  calculationCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary,
    marginBottom: spacing.sm,
  },
  calcTitle: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold,
    color: colors.primary,
    marginBottom: 4,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  calcKey: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
  },
  calcVal: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
  },
  textInput: {
    height: 38,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    fontSize: fonts.sizes.sm,
    color: colors.textPrimary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    padding: spacing.base,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.background,
  },
  btnCancel: {
    paddingHorizontal: spacing.base,
    paddingVertical: 9,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnCancelText: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    fontWeight: fonts.weights.semibold,
  },
  btnSubmit: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.base,
    paddingVertical: 9,
    borderRadius: borderRadius.md,
  },
  btnSubmitDisabled: {
    opacity: 0.5,
  },
  btnSubmitText: {
    color: '#FFFFFF',
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
  },
});

export default TransferModal;
