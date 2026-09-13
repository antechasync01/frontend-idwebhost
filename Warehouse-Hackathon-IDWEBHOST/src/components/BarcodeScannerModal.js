import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Pressable } from 'react-native';
import { colors, fonts, spacing, borderRadius } from '../styles/colors';
import { useWarehouse } from '../context/WarehouseContext';
import { useResponsive } from '../context/ResponsiveContext';

const BarcodeScannerModal = () => {
  const { isMobile } = useResponsive();
  const {
    products,
    isScannerModalOpen,
    setIsScannerModalOpen,
    setSelectedProduct,
    setIsDetailDrawerOpen,
    setIsTransferModalOpen,
    setIsOpnameModalOpen,
    showToast,
  } = useWarehouse();

  const [scannedCode, setScannedCode] = useState('');
  const [matchedProduct, setMatchedProduct] = useState(null);

  if (!isScannerModalOpen) return null;

  const handleScanCode = (code) => {
    setScannedCode(code);
    const found = products.find(
      (p) => p.ean13 === code || p.sku.toLowerCase() === code.toLowerCase()
    );
    if (found) {
      setMatchedProduct(found);
      showToast(`Barcode terdeteksi: ${found.name}`, 'success');
    } else {
      setMatchedProduct(null);
      showToast('Produk tidak ditemukan untuk barcode ini', 'danger');
    }
  };

  const handleSelectQuick = (prod) => {
    setScannedCode(prod.ean13);
    setMatchedProduct(prod);
  };

  return (
    <Modal
      visible={isScannerModalOpen}
      transparent
      animationType="fade"
      onRequestClose={() => setIsScannerModalOpen(false)}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.backdrop} onPress={() => setIsScannerModalOpen(false)} />
        <View style={[styles.modalCard, isMobile && styles.modalCardMobile]}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Mobile Barcode Scanner</Text>
              <Text style={styles.subtitle}>
                Scan EAN-13 Barcode produk untuk lookup stok instan & opname
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => {
                setIsScannerModalOpen(false);
                setMatchedProduct(null);
                setScannedCode('');
              }}
            >
              <i className="fa-solid fa-xmark" style={{ fontSize: 16, color: colors.textMuted }} />
            </TouchableOpacity>
          </View>

          {/* Scanner Viewfinder Area */}
          <View style={styles.body}>
            <View style={styles.viewfinder}>
              <View style={styles.laserLine} />
              <View style={styles.cornerTL} />
              <View style={styles.cornerTR} />
              <View style={styles.cornerBL} />
              <View style={styles.cornerBR} />
              <i
                className="fa-solid fa-camera"
                style={{ color: 'rgba(255,255,255,0.4)', fontSize: 32 }}
              />
              <Text style={styles.viewfinderText}>Arahkan kamera ke barcode EAN-13</Text>
            </View>

            {/* Manual input */}
            <View style={styles.inputSection}>
              <Text style={styles.label}>INPUT MANUAL / TEMPEL BARCODE</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Contoh: 8998866200225 atau SKU-10023"
                  value={scannedCode}
                  onChangeText={(val) => handleScanCode(val)}
                />
                <TouchableOpacity
                  style={styles.scanBtn}
                  onPress={() => handleScanCode(scannedCode)}
                >
                  <Text style={styles.scanBtnText}>Cari</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Quick Preset Buttons for Hackathon Demo */}
            <View style={styles.presetSection}>
              <Text style={styles.label}>PRESET SAMPLE BARCODE (KLIK UNTUK SIMULASI SCAN):</Text>
              <View style={styles.presetGrid}>
                {products.slice(0, 4).map((p) => (
                  <TouchableOpacity
                    key={p.id}
                    style={[
                      styles.presetPill,
                      matchedProduct?.id === p.id && styles.presetPillActive,
                    ]}
                    onPress={() => handleSelectQuick(p)}
                  >
                    <Text style={styles.presetName} numberOfLines={1}>
                      {p.name}
                    </Text>
                    <Text style={styles.presetEan}>{p.ean13}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Scanned Result Card */}
            {matchedProduct && (
              <View style={styles.resultCard}>
                <View style={styles.resultTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.resultSku}>{matchedProduct.sku}</Text>
                    <Text style={styles.resultName}>{matchedProduct.name}</Text>
                    <Text style={styles.resultLocation}>Lokasi: {matchedProduct.lokasi_rak}</Text>
                  </View>
                  <View style={styles.resultStockBadge}>
                    <Text style={styles.resultStockNum}>{matchedProduct.total_stok}</Text>
                    <Text style={styles.resultStockUnit}>{matchedProduct.unit}</Text>
                  </View>
                </View>

                <View style={styles.resultGrid}>
                  <View style={styles.resultCol}>
                    <Text style={styles.resultColKey}>Stok Display</Text>
                    <Text style={styles.resultColVal}>{matchedProduct.stok_disp} pcs</Text>
                  </View>
                  <View style={styles.resultCol}>
                    <Text style={styles.resultColKey}>Stok Gudang</Text>
                    <Text style={styles.resultColVal}>{matchedProduct.stok_gdg} pcs</Text>
                  </View>
                  <View style={styles.resultCol}>
                    <Text style={styles.resultColKey}>Harga Jual</Text>
                    <Text style={styles.resultColVal}>
                      Rp {matchedProduct.harga_jual.toLocaleString('id-ID')}
                    </Text>
                  </View>
                </View>

                {/* Direct Action Buttons */}
                <View style={styles.resultActions}>
                  <TouchableOpacity
                    style={[styles.resBtn, styles.resBtnDetail]}
                    onPress={() => {
                      setSelectedProduct(matchedProduct);
                      setIsScannerModalOpen(false);
                      setIsDetailDrawerOpen(true);
                    }}
                  >
                    <i className="fa-solid fa-circle-info" style={{ color: colors.primary, marginRight: 4 }} />
                    <Text style={styles.resBtnDetailText}>Lihat Detail</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.resBtn, styles.resBtnTransfer]}
                    onPress={() => {
                      setSelectedProduct(matchedProduct);
                      setIsScannerModalOpen(false);
                      setIsTransferModalOpen(true);
                    }}
                  >
                    <i className="fa-solid fa-right-left" style={{ color: '#FFFFFF', marginRight: 4 }} />
                    <Text style={styles.resBtnTransferText}>Transfer</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.resBtn, styles.resBtnOpname]}
                    onPress={() => {
                      setSelectedProduct(matchedProduct);
                      setIsScannerModalOpen(false);
                      setIsOpnameModalOpen(true);
                    }}
                  >
                    <i className="fa-solid fa-clipboard-check" style={{ color: '#FFFFFF', marginRight: 4 }} />
                    <Text style={styles.resBtnOpnameText}>Opname</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
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
    maxWidth: 520,
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
    gap: spacing.md,
  },
  viewfinder: {
    height: 140,
    backgroundColor: '#0F172A',
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  laserLine: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: '#EF4444',
    boxShadow: '0 0 10px #EF4444',
  },
  cornerTL: {
    position: 'absolute',
    top: 15,
    left: 15,
    width: 20,
    height: 20,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#4F46E5',
  },
  cornerTR: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 20,
    height: 20,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#4F46E5',
  },
  cornerBL: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    width: 20,
    height: 20,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#4F46E5',
  },
  cornerBR: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    width: 20,
    height: 20,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#4F46E5',
  },
  viewfinderText: {
    color: '#94A3B8',
    fontSize: fonts.sizes.xs,
    marginTop: 8,
  },
  inputSection: {
    gap: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: fonts.weights.bold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    fontSize: fonts.sizes.sm,
    color: colors.textPrimary,
  },
  scanBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanBtnText: {
    color: '#FFFFFF',
    fontWeight: fonts.weights.bold,
    fontSize: fonts.sizes.xs,
  },
  presetSection: {
    gap: 4,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  presetPill: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    width: '48%',
  },
  presetPillActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  presetName: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
  },
  presetEan: {
    fontSize: 9,
    fontFamily: fonts.mono,
    color: colors.textMuted,
  },
  resultCard: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  resultTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  resultSku: {
    fontSize: 10,
    fontFamily: fonts.mono,
    color: colors.primaryDark,
    fontWeight: fonts.weights.bold,
  },
  resultName: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
    marginTop: 2,
  },
  resultLocation: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  resultStockBadge: {
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  resultStockNum: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.extrabold,
    color: colors.primary,
  },
  resultStockUnit: {
    fontSize: 9,
    color: colors.textMuted,
  },
  resultGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.cardBg,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  resultCol: {
    alignItems: 'center',
  },
  resultColKey: {
    fontSize: 9,
    color: colors.textMuted,
  },
  resultColVal: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
    marginTop: 2,
  },
  resultActions: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 2,
  },
  resBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: borderRadius.md,
  },
  resBtnDetail: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resBtnDetailText: {
    fontSize: 10,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
  },
  resBtnTransfer: {
    backgroundColor: colors.primary,
  },
  resBtnTransferText: {
    fontSize: 10,
    fontWeight: fonts.weights.bold,
    color: '#FFFFFF',
  },
  resBtnOpname: {
    backgroundColor: colors.warning,
  },
  resBtnOpnameText: {
    fontSize: 10,
    fontWeight: fonts.weights.bold,
    color: '#FFFFFF',
  },
});

export default BarcodeScannerModal;
