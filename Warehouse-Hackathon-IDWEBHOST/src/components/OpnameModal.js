import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Pressable } from 'react-native';
import { colors, fonts, spacing, borderRadius } from '../styles/colors';
import { useWarehouse } from '../context/WarehouseContext';
import { useResponsive } from '../context/ResponsiveContext';

const OpnameModal = () => {
  const { isMobile } = useResponsive();
  const {
    products,
    selectedProduct,
    isOpnameModalOpen,
    setIsOpnameModalOpen,
    handleStockOpname,
  } = useWarehouse();

  const [selectedProdId, setSelectedProdId] = useState('');
  const [physicalDisp, setPhysicalDisp] = useState('0');
  const [physicalGdg, setPhysicalGdg] = useState('0');
  const [reason, setReason] = useState('Rutin Audit Fisik');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (selectedProduct) {
      setSelectedProdId(selectedProduct.id);
      setPhysicalDisp(selectedProduct.stok_disp.toString());
      setPhysicalGdg(selectedProduct.stok_gdg.toString());
    } else if (products.length > 0 && !selectedProdId) {
      setSelectedProdId(products[0].id);
      setPhysicalDisp(products[0].stok_disp.toString());
      setPhysicalGdg(products[0].stok_gdg.toString());
    }
  }, [selectedProduct, products]);

  const currentProd = products.find((p) => p.id === selectedProdId) || products[0];

  const handleProductChange = (prodId) => {
    setSelectedProdId(prodId);
    const prod = products.find((p) => p.id === prodId);
    if (prod) {
      setPhysicalDisp(prod.stok_disp.toString());
      setPhysicalGdg(prod.stok_gdg.toString());
    }
  };

  if (!isOpnameModalOpen) return null;

  const pDisp = parseInt(physicalDisp, 10) || 0;
  const pGdg = parseInt(physicalGdg, 10) || 0;
  const totalPhysical = pDisp + pGdg;
  const expectedTotal = currentProd ? currentProd.total_stok : 0;
  const variance = totalPhysical - expectedTotal;

  const handleSubmit = () => {
    if (!currentProd) return;
    handleStockOpname({
      productId: currentProd.id,
      physicalDisp: pDisp,
      physicalGdg: pGdg,
      reason,
      notes,
    });
  };

  return (
    <Modal
      visible={isOpnameModalOpen}
      transparent
      animationType="fade"
      onRequestClose={() => setIsOpnameModalOpen(false)}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.backdrop} onPress={() => setIsOpnameModalOpen(false)} />
        <View style={[styles.modalCard, isMobile && styles.modalCardMobile]}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Audit Stok Fisik (Stock Opname)</Text>
              <Text style={styles.subtitle}>
                Rekonsiliasi penghitungan fisik nyata rak & gudang terhadap sistem
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setIsOpnameModalOpen(false)}
            >
              <i className="fa-solid fa-xmark" style={{ fontSize: 16, color: colors.textMuted }} />
            </TouchableOpacity>
          </View>

          {/* Body */}
          <View style={styles.body}>
            {/* Product Selector */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>PRODUK YANG DIAUDIT</Text>
              <select
                style={styles.selectInput}
                value={selectedProdId}
                onChange={(e) => handleProductChange(e.target.value)}
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.sku}) — Sistem Total: {p.total_stok} {p.unit}
                  </option>
                ))}
              </select>
            </View>

            {/* Expected vs Actual Grid */}
            <View style={styles.auditGrid}>
              {/* Display Count */}
              <View style={styles.auditCol}>
                <Text style={styles.auditColTitle}>STOK DISPLAY (RAK)</Text>
                <Text style={styles.expectedText}>
                  Sistem: <Text style={{ fontWeight: 'bold' }}>{currentProd?.stok_disp}</Text> pcs
                </Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    style={styles.auditInput}
                    keyboardType="number-pad"
                    value={physicalDisp}
                    onChangeText={setPhysicalDisp}
                  />
                  <Text style={styles.unitText}>pcs</Text>
                </View>
              </View>

              {/* Gudang Count */}
              <View style={styles.auditCol}>
                <Text style={styles.auditColTitle}>STOK GUDANG (ON-HAND)</Text>
                <Text style={styles.expectedText}>
                  Sistem: <Text style={{ fontWeight: 'bold' }}>{currentProd?.stok_gdg}</Text> pcs
                </Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    style={styles.auditInput}
                    keyboardType="number-pad"
                    value={physicalGdg}
                    onChangeText={setPhysicalGdg}
                  />
                  <Text style={styles.unitText}>pcs</Text>
                </View>
              </View>
            </View>

            {/* Variance Status Box */}
            <View
              style={[
                styles.varianceBox,
                {
                  backgroundColor:
                    variance === 0
                      ? colors.successBg
                      : variance < 0
                      ? colors.dangerBg
                      : colors.warningBg,
                  borderColor:
                    variance === 0
                      ? colors.successBorder
                      : variance < 0
                      ? colors.dangerBorder
                      : colors.warningBorder,
                },
              ]}
            >
              <View>
                <Text style={styles.varianceLabel}>HASIL REKONSILIASI FISIK:</Text>
                <Text
                  style={[
                    styles.varianceStatusText,
                    {
                      color:
                        variance === 0
                          ? colors.success
                          : variance < 0
                          ? colors.danger
                          : colors.warning,
                    },
                  ]}
                >
                  {variance === 0
                    ? '✓ DATA STOK COCOK (0 SELISIH)'
                    : variance < 0
                    ? `⚠️ SELISIH KURANG ${Math.abs(variance)} PCS`
                    : `⚠️ SELISIH LEBIH +${variance} PCS`}
                </Text>
              </View>
              <View style={styles.varianceNumbers}>
                <Text style={styles.varianceTotalText}>Fisik: {totalPhysical} pcs</Text>
                <Text style={styles.varianceExpectedText}>Sistem: {expectedTotal} pcs</Text>
              </View>
            </View>

            {/* Reason selector */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>ALASAN / KATEGORI SELISIH</Text>
              <select
                style={styles.selectInput}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                <option value="Rutin Audit Fisik">Rutin Audit Fisik Bulanan</option>
                <option value="Kerusakan Barang / Rusak">Kerusakan Kemasan / Pecah</option>
                <option value="Barang Kadaluarsa / Expired">Barang Kadaluarsa / Expired</option>
                <option value="Selisih Transaksi Kasir">Selisih Transaksi Kasir</option>
                <option value="Penyesuaian Sistem">Penyesuaian Data Sistem</option>
              </select>
            </View>

            {/* Notes */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>CATATAN TAMBAHAN AUDIT</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Tuliskan keterangan detail hasil opname..."
                value={notes}
                onChangeText={setNotes}
              />
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.btnCancel}
              onPress={() => setIsOpnameModalOpen(false)}
            >
              <Text style={styles.btnCancelText}>Batal</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnSubmit} onPress={handleSubmit}>
              <i className="fa-solid fa-floppy-disk" style={{ color: '#FFFFFF', marginRight: 6 }} />
              <Text style={styles.btnSubmitText}>Simpan Hasil Opname</Text>
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
    maxWidth: 540,
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
    zIndex: 999,
  },
  modalCardMobile: {
    maxWidth: '100%',
    borderRadius: borderRadius.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    backgroundColor: colors.background,
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
    gap: spacing.base,
  },
  fieldGroup: {
    gap: 4,
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
  auditGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  auditCol: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  auditColTitle: {
    fontSize: 10,
    fontWeight: fonts.weights.bold,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  expectedText: {
    fontSize: fonts.sizes.xs,
    color: colors.textMuted,
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  auditInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: colors.borderDark,
    borderRadius: borderRadius.md,
    backgroundColor: colors.cardBg,
    paddingHorizontal: spacing.md,
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
  },
  unitText: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
  },
  varianceBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  varianceLabel: {
    fontSize: 10,
    fontWeight: fonts.weights.bold,
    color: colors.textSecondary,
  },
  varianceStatusText: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    marginTop: 2,
  },
  varianceNumbers: {
    alignItems: 'flex-end',
  },
  varianceTotalText: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
  },
  varianceExpectedText: {
    fontSize: 10,
    color: colors.textMuted,
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
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.background,
  },
  btnCancel: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
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
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
  },
  btnSubmitText: {
    color: '#FFFFFF',
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
  },
});

export default OpnameModal;
