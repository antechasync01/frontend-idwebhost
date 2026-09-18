import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { colors, fonts, spacing, borderRadius, staffColors } from '../../styles/colors';
import { useWarehouse } from '../../context/WarehouseContext';

const StaffScanScreen = ({ onNavigate }) => {
  const { products, scanHistory, handleAddScanHistory, setSelectedProduct, setIsTransferModalOpen, showToast } = useWarehouse();
  const [manualBarcode, setManualBarcode] = useState('');
  const [scannedProduct, setScannedProduct] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = (barcode) => {
    const prod = products.find((p) => p.ean13 === barcode || p.sku === barcode);
    if (prod) {
      setScannedProduct(prod);
      handleAddScanHistory(prod);
      showToast(`Produk ditemukan: ${prod.name}`, 'success');
    } else {
      showToast('Produk tidak ditemukan. Periksa barcode.', 'danger');
      setScannedProduct(null);
    }
  };

  const handleManualSubmit = () => {
    if (!manualBarcode.trim()) return;
    handleScan(manualBarcode.trim());
    setManualBarcode('');
  };

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const randomProd = products[Math.floor(Math.random() * products.length)];
      handleScan(randomProd.ean13);
      setIsScanning(false);
    }, 1500);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'NORMAL': return { bg: colors.successBg, color: colors.success };
      case 'STOK MENIPIS': return { bg: colors.warningBg, color: colors.warning };
      case 'HABIS': return { bg: colors.dangerBg, color: colors.danger };
      default: return { bg: colors.neutralBg, color: colors.neutral };
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Scanner Area */}
      <View style={styles.scannerArea}>
        <View style={styles.scannerDecor1} />
        <View style={styles.scannerDecor2} />

        {isScanning ? (
          <View style={styles.scanningIndicator}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 36, color: '#FFFFFF' }} />
            <Text style={styles.scanningText}>Memindai barcode...</Text>
          </View>
        ) : (
          <View style={styles.scannerContent}>
            <View style={styles.scanFrame}>
              <View style={[styles.scanCorner, styles.scanCornerTL]} />
              <View style={[styles.scanCorner, styles.scanCornerTR]} />
              <View style={[styles.scanCorner, styles.scanCornerBL]} />
              <View style={[styles.scanCorner, styles.scanCornerBR]} />
              <i className="fa-solid fa-barcode" style={{ fontSize: 48, color: 'rgba(255,255,255,0.4)' }} />
            </View>
            <Text style={styles.scanHint}>Arahkan kamera ke barcode produk</Text>
          </View>
        )}

        <TouchableOpacity style={styles.btnSimulate} onPress={handleSimulateScan} activeOpacity={0.8}>
          <i className="fa-solid fa-camera" style={{ fontSize: 14, color: '#FFFFFF', marginRight: 6 }} />
          <Text style={styles.btnSimulateText}>Simulasi Scan Barcode</Text>
        </TouchableOpacity>
      </View>

      {/* Manual Input */}
      <View style={styles.manualSection}>
        <Text style={styles.manualLabel}>ATAU INPUT MANUAL</Text>
        <View style={styles.manualRow}>
          <View style={styles.manualInputWrap}>
            <i className="fa-solid fa-keyboard" style={{ fontSize: 14, color: colors.textMuted, marginRight: 8 }} />
            <TextInput
              style={styles.manualInput}
              placeholder="Ketik SKU atau Barcode EAN..."
              placeholderTextColor={colors.textMuted}
              value={manualBarcode}
              onChangeText={setManualBarcode}
              onSubmitEditing={handleManualSubmit}
            />
          </View>
          <TouchableOpacity style={styles.btnSearch} onPress={handleManualSubmit} activeOpacity={0.8}>
            <i className="fa-solid fa-magnifying-glass" style={{ fontSize: 15, color: '#FFFFFF' }} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scanned Product Result */}
      {scannedProduct && (
        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <i className="fa-solid fa-circle-check" style={{ fontSize: 16, color: colors.success, marginRight: 8 }} />
            <Text style={styles.resultHeaderText}>Produk Ditemukan</Text>
          </View>

          <View style={styles.resultBody}>
            <View style={styles.resultProductInfo}>
              <Text style={styles.resultSku}>{scannedProduct.sku} • {scannedProduct.ean13}</Text>
              <Text style={styles.resultName}>{scannedProduct.name}</Text>
              <Text style={styles.resultCategory}>{scannedProduct.kategori}</Text>
              <Text style={styles.resultLocation}>
                <i className="fa-solid fa-location-dot" style={{ fontSize: 11, marginRight: 4 }} />
                {scannedProduct.lokasi_rak}
              </Text>
            </View>

            {/* Stock Info */}
            <View style={styles.stockGrid}>
              <View style={styles.stockBox}>
                <Text style={styles.stockBoxLabel}>Display</Text>
                <Text style={styles.stockBoxValue}>{scannedProduct.stok_disp}</Text>
                <Text style={styles.stockBoxUnit}>{scannedProduct.unit}</Text>
              </View>
              <View style={[styles.stockBox, styles.stockBoxHighlight]}>
                <Text style={styles.stockBoxLabel}>Gudang</Text>
                <Text style={[styles.stockBoxValue, { color: colors.primary }]}>{scannedProduct.stok_gdg}</Text>
                <Text style={styles.stockBoxUnit}>{scannedProduct.unit}</Text>
              </View>
              <View style={styles.stockBox}>
                <Text style={styles.stockBoxLabel}>Total</Text>
                <Text style={styles.stockBoxValue}>{scannedProduct.total_stok}</Text>
                <Text style={styles.stockBoxUnit}>{scannedProduct.unit}</Text>
              </View>
            </View>

            {/* Status Badge */}
            <View style={[styles.statusBadge, { backgroundColor: getStatusStyle(scannedProduct.status).bg }]}>
              <Text style={[styles.statusBadgeText, { color: getStatusStyle(scannedProduct.status).color }]}>
                {scannedProduct.status}
              </Text>
              <Text style={styles.statusMinStok}>Min. stok: {scannedProduct.min_stok} {scannedProduct.unit}</Text>
            </View>

            {/* Quick Actions */}
            <View style={styles.resultActions}>
              <TouchableOpacity
                style={styles.btnResultAction}
                onPress={() => {
                  setSelectedProduct(scannedProduct);
                  setIsTransferModalOpen(true);
                }}
                activeOpacity={0.8}
              >
                <i className="fa-solid fa-right-left" style={{ fontSize: 12, color: '#FFFFFF', marginRight: 5 }} />
                <Text style={styles.btnResultActionText}>Transfer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnResultAction, styles.btnResultActionSecondary]}
                onPress={() => onNavigate('staff-opname')}
                activeOpacity={0.8}
              >
                <i className="fa-solid fa-clipboard-check" style={{ fontSize: 12, color: colors.primary, marginRight: 5 }} />
                <Text style={[styles.btnResultActionText, { color: colors.primary }]}>Opname</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Scan History */}
      <View style={styles.historySection}>
        <Text style={styles.historyTitle}>Riwayat Scan Terakhir</Text>
        {scanHistory.length === 0 ? (
          <View style={styles.historyEmpty}>
            <i className="fa-solid fa-qrcode" style={{ fontSize: 24, color: colors.borderDark, marginBottom: 8 }} />
            <Text style={styles.historyEmptyText}>Belum ada scan hari ini</Text>
          </View>
        ) : (
          <View style={styles.historyList}>
            {scanHistory.slice(0, 5).map((item) => (
              <View key={item.scanId} style={styles.historyItem}>
                <View style={styles.historyItemIcon}>
                  <i className="fa-solid fa-barcode" style={{ fontSize: 12, color: colors.primary }} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.historyItemName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.historyItemSku}>{item.sku} • {item.scannedAt}</Text>
                </View>
                <Text style={styles.historyItemStock}>{item.total_stok} pcs</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scannerArea: {
    backgroundColor: '#1E1B4B',
    backgroundImage: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.base,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  scannerDecor1: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  scannerDecor2: {
    position: 'absolute',
    bottom: -20,
    left: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  scannerContent: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  scanFrame: {
    width: 180,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    position: 'relative',
  },
  scanCorner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#FFFFFF',
  },
  scanCornerTL: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 8 },
  scanCornerTR: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 8 },
  scanCornerBL: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 8 },
  scanCornerBR: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 8 },
  scanHint: {
    fontSize: fonts.sizes.xs,
    color: 'rgba(255,255,255,0.6)',
  },
  scanningIndicator: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.md,
  },
  scanningText: {
    fontSize: fonts.sizes.sm,
    color: '#FFFFFF',
    fontWeight: fonts.weights.semibold,
  },
  btnSimulate: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  btnSimulateText: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: '#FFFFFF',
  },
  manualSection: {
    padding: spacing.base,
  },
  manualLabel: {
    fontSize: 10,
    fontWeight: fonts.weights.bold,
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: 6,
  },
  manualRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  manualInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    height: 46,
  },
  manualInput: {
    flex: 1,
    fontSize: fonts.sizes.sm,
    color: colors.textPrimary,
    outlineStyle: 'none',
    fontFamily: fonts.mono,
  },
  btnSearch: {
    width: 46,
    height: 46,
    borderRadius: borderRadius.lg,
    backgroundColor: '#4F46E5',
    backgroundImage: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultCard: {
    marginHorizontal: spacing.base,
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.successBorder,
    overflow: 'hidden',
    marginBottom: spacing.base,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successBg,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  resultHeaderText: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: colors.success,
  },
  resultBody: {
    padding: spacing.base,
    gap: spacing.md,
  },
  resultProductInfo: {
    gap: 2,
  },
  resultSku: {
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: fonts.mono,
  },
  resultName: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
  },
  resultCategory: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
  },
  resultLocation: {
    fontSize: fonts.sizes.xs,
    color: colors.primary,
    fontWeight: fonts.weights.semibold,
    marginTop: 4,
  },
  stockGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  stockBox: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  stockBoxHighlight: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  stockBoxLabel: {
    fontSize: 9,
    fontWeight: fonts.weights.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  stockBoxValue: {
    fontSize: fonts.sizes.xxl,
    fontWeight: fonts.weights.extrabold,
    color: colors.textPrimary,
  },
  stockBoxUnit: {
    fontSize: 9,
    color: colors.textMuted,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  statusBadgeText: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
  },
  statusMinStok: {
    fontSize: fonts.sizes.xs,
    color: colors.textMuted,
  },
  resultActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  btnResultAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
  },
  btnResultActionSecondary: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  btnResultActionText: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: '#FFFFFF',
  },
  historySection: {
    paddingHorizontal: spacing.base,
  },
  historyTitle: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  historyEmpty: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  historyEmptyText: {
    fontSize: fonts.sizes.xs,
    color: colors.textMuted,
  },
  historyList: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  historyItemIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyItemName: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
  },
  historyItemSku: {
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: fonts.mono,
  },
  historyItemStock: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold,
    color: colors.textSecondary,
  },
});

export default StaffScanScreen;
