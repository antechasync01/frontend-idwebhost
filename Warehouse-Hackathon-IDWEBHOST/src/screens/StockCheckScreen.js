import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { colors, fonts, spacing, borderRadius } from '../styles/colors';
import { useResponsive } from '../context/ResponsiveContext';
import { useWarehouse } from '../context/WarehouseContext';
import BarcodeScannerModal from '../components/BarcodeScannerModal';

const StockCheckScreen = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const {
    products,
    movements,
    setIsScannerModalOpen,
    handleStockOpname,
    showToast,
  } = useWarehouse();

  const [selectedProdId, setSelectedProdId] = useState(products[0]?.id || '');
  const [physicalDisp, setPhysicalDisp] = useState(products[0]?.stok_disp.toString() || '0');
  const [physicalGdg, setPhysicalGdg] = useState(products[0]?.stok_gdg.toString() || '0');
  const [reason, setReason] = useState('Rutin Audit Fisik');
  const [notes, setNotes] = useState('');

  const currentProd = products.find((p) => p.id === selectedProdId) || products[0];

  const handleSelectProduct = (prod) => {
    setSelectedProdId(prod.id);
    setPhysicalDisp(prod.stok_disp.toString());
    setPhysicalGdg(prod.stok_gdg.toString());
  };

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
    setNotes('');
  };

  const opnameMovements = movements.filter((m) => m.type === 'ADJUSTMENT');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <BarcodeScannerModal />

      {/* Header */}
      <View style={[styles.headerRow, !isDesktop && styles.headerRowCompact]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.pageTitle}>Stock Checking & Opname Fisik</Text>
          <Text style={styles.pageSubtitle}>
            Audit pencocokan stok fisik rak & gudang vs sistem untuk deteksi *shrinkage* / selisih
          </Text>
        </View>

        <TouchableOpacity
          style={styles.scanBtn}
          onPress={() => setIsScannerModalOpen(true)}
          activeOpacity={0.8}
        >
          <i className="fa-solid fa-barcode" style={{ color: '#FFFFFF', marginRight: 6 }} />
          <Text style={styles.scanBtnText}>Buka Kamera Scanner</Text>
        </TouchableOpacity>
      </View>

      {/* Main Audit Workspace */}
      <View style={[styles.auditLayout, !isDesktop && styles.auditLayoutStacked]}>
        {/* Left Column: Product Selection & Live Audit Form */}
        <View style={styles.auditCard}>
          <Text style={styles.cardSectionTitle}>Formulir Audit Produk Terpilih</Text>

          {/* Product Picker */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>PILIH / GANTI PRODUK</Text>
            <select
              style={styles.selectInput}
              value={selectedProdId}
              onChange={(e) => {
                const prod = products.find((p) => p.id === e.target.value);
                if (prod) handleSelectProduct(prod);
              }}
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku}) — EAN: {p.ean13}
                </option>
              ))}
            </select>
          </View>

          {/* Active Product Specs */}
          {currentProd && (
            <View style={styles.activeProdBanner}>
              <View style={{ flex: 1 }}>
                <Text style={styles.activeProdSku}>{currentProd.sku} • {currentProd.kategori}</Text>
                <Text style={styles.activeProdName}>{currentProd.name}</Text>
                <Text style={styles.activeProdLocation}>Lokasi: {currentProd.lokasi_rak}</Text>
              </View>
              <View style={styles.systemTotalBadge}>
                <Text style={styles.systemTotalLabel}>SISTEM TOTAL</Text>
                <Text style={styles.systemTotalNum}>{currentProd.total_stok}</Text>
                <Text style={styles.systemTotalUnit}>{currentProd.unit}</Text>
              </View>
            </View>
          )}

          {/* Physical Counting Inputs */}
          <View style={styles.countingGrid}>
            <View style={styles.countBox}>
              <Text style={styles.countBoxTitle}>FISIK DISPLAY (RAK TOKO)</Text>
              <Text style={styles.countBoxSystem}>Sistem: {currentProd?.stok_disp} pcs</Text>
              <TextInput
                style={styles.countInput}
                keyboardType="number-pad"
                value={physicalDisp}
                onChangeText={setPhysicalDisp}
              />
            </View>

            <View style={styles.countBox}>
              <Text style={styles.countBoxTitle}>FISIK GUDANG (ON-HAND)</Text>
              <Text style={styles.countBoxSystem}>Sistem: {currentProd?.stok_gdg} pcs</Text>
              <TextInput
                style={styles.countInput}
                keyboardType="number-pad"
                value={physicalGdg}
                onChangeText={setPhysicalGdg}
              />
            </View>
          </View>

          {/* Variance Status Indicator */}
          <View
            style={[
              styles.varianceResultBox,
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
            <View style={{ flex: 1 }}>
              <Text style={styles.varianceHeading}>STATUS REKONSILIASI FISIK</Text>
              <Text
                style={[
                  styles.varianceText,
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
                  ? '✓ FISIK & SISTEM COCOK (0 SELISIH)'
                  : variance < 0
                  ? `⚠️ SELISIH KURANG ${Math.abs(variance)} PCS`
                  : `⚠️ SELISIH LEBIH +${variance} PCS`}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end', flexShrink: 0 }}>
              <Text style={styles.varianceSummary}>Total Fisik: {totalPhysical} pcs</Text>
              <Text style={styles.varianceSummarySub}>Sistem: {expectedTotal} pcs</Text>
            </View>
          </View>

          {/* Reason selector */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>ALASAN SELISIH / KETERANGAN PENYESUAIAN</Text>
            <select
              style={styles.selectInput}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <option value="Rutin Audit Fisik">Rutin Audit Fisik Bulanan</option>
              <option value="Kerusakan Kemasan / Rusak">Kerusakan Kemasan / Rusak</option>
              <option value="Barang Kadaluarsa / Expired">Barang Kadaluarsa / Expired</option>
              <option value="Selisih Transaksi Kasir">Selisih Transaksi Kasir</option>
              <option value="Penyesuaian Sistem">Penyesuaian Sistem</option>
            </select>
          </View>

          {/* Notes */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>CATATAN TAMBAHAN (OPSIONAL)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Keterangan kondisi fisik barang..."
              value={notes}
              onChangeText={setNotes}
            />
          </View>

          {/* Submit Action */}
          <TouchableOpacity style={styles.btnSubmitAudit} onPress={handleSubmit}>
            <i className="fa-solid fa-floppy-disk" style={{ color: '#FFFFFF', marginRight: 6 }} />
            <Text style={styles.btnSubmitAuditText}>Simpan Hasil Rekonsiliasi Opname</Text>
          </TouchableOpacity>
        </View>

        {/* Right Column / Stacked Row: Quick Product List & Audit History */}
        <View style={styles.sideCol}>
          {/* Quick Select Item List */}
          <View style={styles.sideCard}>
            <Text style={styles.cardSectionTitle}>Pilih Cepat Produk Minimarket</Text>
            <View style={styles.quickProdList}>
              {products.map((p) => {
                const isSelected = p.id === currentProd?.id;
                return (
                  <TouchableOpacity
                    key={p.id}
                    style={[styles.quickProdItem, isSelected && styles.quickProdItemActive]}
                    onPress={() => handleSelectProduct(p)}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.qpName, isSelected && styles.qpNameActive]}>{p.name}</Text>
                      <Text style={styles.qpSku}>{p.sku} • {p.lokasi_rak}</Text>
                    </View>
                    <Text style={[styles.qpStock, isSelected && styles.qpStockActive]}>
                      {p.total_stok} pcs
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Opname Log History */}
          <View style={styles.sideCard}>
            <Text style={styles.cardSectionTitle}>Riwayat Audit Opname Terakhir</Text>
            {opnameMovements.length === 0 ? (
              <Text style={styles.emptyLogText}>Belum ada penyesuaian opname hari ini.</Text>
            ) : (
              <View style={styles.opnameLogList}>
                {opnameMovements.map((mov) => (
                  <View key={mov.id} style={styles.opnameLogItem}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.opnameProdName}>{mov.productName}</Text>
                      <Text style={styles.opnameNotes}>{mov.notes}</Text>
                      <Text style={styles.opnameMeta}>{mov.ref} • {mov.date} • {mov.user}</Text>
                    </View>
                    <Text
                      style={[
                        styles.opnameQty,
                        { color: mov.qty >= 0 ? colors.warning : colors.danger },
                      ]}
                    >
                      {mov.qty > 0 ? `+${mov.qty}` : mov.qty} pcs
                    </Text>
                  </View>
                ))}
              </View>
            )}
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
  },
  pageSubtitle: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  scanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.base,
    paddingVertical: 9,
    borderRadius: borderRadius.md,
  },
  scanBtnText: {
    color: '#FFFFFF',
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
  },
  auditLayout: {
    flexDirection: 'row',
    gap: spacing.base,
    marginBottom: spacing.xxxl,
  },
  auditLayoutStacked: {
    flexDirection: 'column',
  },
  auditCard: {
    flex: 1.4,
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.base,
  },
  sideCol: {
    flex: 1,
    gap: spacing.base,
  },
  sideCard: {
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
  },
  cardSectionTitle: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
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
    outlineStyle: 'none',
    fontFamily: fonts.family,
  },
  activeProdBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  activeProdSku: {
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: fonts.mono,
  },
  activeProdName: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
    marginVertical: 2,
  },
  activeProdLocation: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
  },
  systemTotalBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  systemTotalLabel: {
    fontSize: 9,
    fontWeight: fonts.weights.bold,
    color: colors.primary,
  },
  systemTotalNum: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.extrabold,
    color: colors.primary,
  },
  systemTotalUnit: {
    fontSize: 9,
    color: colors.textMuted,
  },
  countingGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  countBox: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  countBoxTitle: {
    fontSize: 10,
    fontWeight: fonts.weights.bold,
    color: colors.textSecondary,
  },
  countBoxSystem: {
    fontSize: fonts.sizes.xs,
    color: colors.textMuted,
    marginVertical: 4,
  },
  countInput: {
    height: 42,
    borderWidth: 1,
    borderColor: colors.borderDark,
    borderRadius: borderRadius.md,
    backgroundColor: colors.cardBg,
    paddingHorizontal: spacing.md,
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
  },
  varianceResultBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  varianceHeading: {
    fontSize: 10,
    fontWeight: fonts.weights.bold,
    color: colors.textSecondary,
  },
  varianceText: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    marginTop: 2,
  },
  varianceSummary: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
  },
  varianceSummarySub: {
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
  btnSubmitAudit: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    marginTop: spacing.xs,
    minHeight: 44,
  },
  btnSubmitAuditText: {
    color: '#FFFFFF',
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
  },
  quickProdList: {
    maxHeight: 280,
    overflow: 'auto',
    gap: 4,
  },
  quickProdItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  quickProdItemActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  qpName: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.medium,
    color: colors.textPrimary,
  },
  qpNameActive: {
    fontWeight: fonts.weights.bold,
    color: colors.primary,
  },
  qpSku: {
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: fonts.mono,
  },
  qpStock: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold,
    color: colors.textSecondary,
  },
  qpStockActive: {
    color: colors.primary,
  },
  opnameLogList: {
    gap: spacing.sm,
  },
  opnameLogItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  opnameProdName: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
  },
  opnameNotes: {
    fontSize: 10,
    color: colors.textSecondary,
    marginVertical: 1,
  },
  opnameMeta: {
    fontSize: 9,
    color: colors.textMuted,
    fontFamily: fonts.mono,
  },
  opnameQty: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold,
  },
  emptyLogText: {
    fontSize: fonts.sizes.xs,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
});

export default StockCheckScreen;
