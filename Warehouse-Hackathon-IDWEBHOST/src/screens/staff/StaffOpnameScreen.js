import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors, fonts, spacing, borderRadius, staffColors } from '../../styles/colors';
import { useWarehouse } from '../../context/WarehouseContext';

const StaffOpnameScreen = () => {
  const { products, handleStockOpname, showToast } = useWarehouse();
  const [step, setStep] = useState(1); // 1: Select, 2: Count, 3: Confirm
  const [selectedProdIdx, setSelectedProdIdx] = useState(0);
  const [physicalDisp, setPhysicalDisp] = useState(0);
  const [physicalGdg, setPhysicalGdg] = useState(0);
  const [reason, setReason] = useState('Rutin Audit Fisik');

  const currentProd = products[selectedProdIdx];

  const handleSelectProduct = (idx) => {
    setSelectedProdIdx(idx);
    setPhysicalDisp(products[idx].stok_disp);
    setPhysicalGdg(products[idx].stok_gdg);
    setStep(2);
  };

  const variance = (physicalDisp + physicalGdg) - (currentProd?.total_stok || 0);

  const handleConfirm = () => {
    handleStockOpname({
      productId: currentProd.id,
      physicalDisp: physicalDisp,
      physicalGdg: physicalGdg,
      reason: reason,
      notes: `Mobile opname oleh staff`,
    });
    setStep(1);
  };

  const handleNextProduct = () => {
    const nextIdx = (selectedProdIdx + 1) % products.length;
    setSelectedProdIdx(nextIdx);
    setPhysicalDisp(products[nextIdx].stok_disp);
    setPhysicalGdg(products[nextIdx].stok_gdg);
    setStep(2);
  };

  const CounterButton = ({ value, onChange, label, systemValue }) => (
    <View style={styles.counterBox}>
      <Text style={styles.counterLabel}>{label}</Text>
      <Text style={styles.counterSystem}>Sistem: {systemValue}</Text>
      <View style={styles.counterRow}>
        <TouchableOpacity
          style={styles.counterBtn}
          onPress={() => onChange(Math.max(0, value - 1))}
          activeOpacity={0.7}
        >
          <i className="fa-solid fa-minus" style={{ fontSize: 16, color: colors.danger }} />
        </TouchableOpacity>
        <View style={styles.counterDisplay}>
          <Text style={styles.counterValue}>{value}</Text>
        </View>
        <TouchableOpacity
          style={styles.counterBtn}
          onPress={() => onChange(value + 1)}
          activeOpacity={0.7}
        >
          <i className="fa-solid fa-plus" style={{ fontSize: 16, color: colors.success }} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Step Indicator */}
      <View style={styles.stepIndicator}>
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <View style={[styles.stepCircle, step >= s && styles.stepCircleActive]}>
              {step > s ? (
                <i className="fa-solid fa-check" style={{ fontSize: 12, color: '#FFFFFF' }} />
              ) : (
                <Text style={[styles.stepNum, step >= s && styles.stepNumActive]}>{s}</Text>
              )}
            </View>
            {s < 3 && <View style={[styles.stepLine, step > s && styles.stepLineActive]} />}
          </React.Fragment>
        ))}
      </View>
      <View style={styles.stepLabels}>
        <Text style={[styles.stepLabel, step >= 1 && styles.stepLabelActive]}>Pilih Produk</Text>
        <Text style={[styles.stepLabel, step >= 2 && styles.stepLabelActive]}>Hitung Fisik</Text>
        <Text style={[styles.stepLabel, step >= 3 && styles.stepLabelActive]}>Konfirmasi</Text>
      </View>

      {/* Step 1: Product Selection */}
      {step === 1 && (
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>Pilih Produk untuk Opname</Text>
          <Text style={styles.stepDesc}>Ketuk produk yang ingin dihitung fisiknya</Text>
          <View style={styles.productList}>
            {products.map((p, idx) => (
              <TouchableOpacity
                key={p.id}
                style={styles.productItem}
                onPress={() => handleSelectProduct(idx)}
                activeOpacity={0.8}
              >
                <View style={styles.productItemLeft}>
                  <View style={[
                    styles.productStatusDot,
                    { backgroundColor: p.status === 'NORMAL' ? colors.success : p.status === 'HABIS' ? colors.danger : colors.warning }
                  ]} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.productItemName} numberOfLines={1}>{p.name}</Text>
                    <Text style={styles.productItemSku}>{p.sku} • {p.lokasi_rak}</Text>
                  </View>
                </View>
                <View style={styles.productItemRight}>
                  <Text style={styles.productItemStock}>{p.total_stok}</Text>
                  <Text style={styles.productItemUnit}>{p.unit}</Text>
                </View>
                <i className="fa-solid fa-chevron-right" style={{ fontSize: 12, color: colors.borderDark }} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Step 2: Physical Counting */}
      {step === 2 && currentProd && (
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>Hitung Fisik Barang</Text>

          {/* Selected Product Info */}
          <View style={styles.selectedProdCard}>
            <Text style={styles.selectedProdSku}>{currentProd.sku} • {currentProd.kategori}</Text>
            <Text style={styles.selectedProdName}>{currentProd.name}</Text>
            <Text style={styles.selectedProdLoc}>
              <i className="fa-solid fa-location-dot" style={{ fontSize: 11, marginRight: 4 }} />
              {currentProd.lokasi_rak}
            </Text>
          </View>

          {/* Counters */}
          <CounterButton
            label="FISIK DISPLAY (RAK TOKO)"
            value={physicalDisp}
            onChange={setPhysicalDisp}
            systemValue={currentProd.stok_disp}
          />
          <CounterButton
            label="FISIK GUDANG (ON-HAND)"
            value={physicalGdg}
            onChange={setPhysicalGdg}
            systemValue={currentProd.stok_gdg}
          />

          {/* Variance */}
          <View style={[
            styles.varianceBox,
            { backgroundColor: variance === 0 ? colors.successBg : variance < 0 ? colors.dangerBg : colors.warningBg,
              borderColor: variance === 0 ? colors.successBorder : variance < 0 ? colors.dangerBorder : colors.warningBorder }
          ]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.varianceLabel}>SELISIH STOK</Text>
              <Text style={[styles.varianceValue, {
                color: variance === 0 ? colors.success : variance < 0 ? colors.danger : colors.warning
              }]}>
                {variance === 0 ? '✓ COCOK (0)' : variance > 0 ? `+${variance} LEBIH` : `${variance} KURANG`}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.varianceSummary}>Fisik: {physicalDisp + physicalGdg}</Text>
              <Text style={styles.varianceSummary}>Sistem: {currentProd.total_stok}</Text>
            </View>
          </View>

          {/* Reason */}
          <View style={styles.reasonSection}>
            <Text style={styles.reasonLabel}>ALASAN</Text>
            <View style={styles.reasonChips}>
              {['Rutin Audit Fisik', 'Kerusakan / Rusak', 'Kadaluarsa', 'Selisih Kasir'].map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.reasonChip, reason === r && styles.reasonChipActive]}
                  onPress={() => setReason(r)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.reasonChipText, reason === r && styles.reasonChipTextActive]}>{r}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.btnBack} onPress={() => setStep(1)} activeOpacity={0.7}>
              <Text style={styles.btnBackText}>Kembali</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnNext}
              onPress={() => setStep(3)}
              activeOpacity={0.8}
            >
              <Text style={styles.btnNextText}>Lanjut Konfirmasi</Text>
              <i className="fa-solid fa-arrow-right" style={{ fontSize: 12, color: '#FFFFFF', marginLeft: 5 }} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && currentProd && (
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>Konfirmasi Hasil Opname</Text>

          <View style={styles.confirmCard}>
            <View style={styles.confirmRow}>
              <Text style={styles.confirmLabel}>Produk</Text>
              <Text style={styles.confirmValue}>{currentProd.name}</Text>
            </View>
            <View style={styles.confirmRow}>
              <Text style={styles.confirmLabel}>SKU</Text>
              <Text style={styles.confirmValueMono}>{currentProd.sku}</Text>
            </View>
            <View style={styles.confirmDivider} />
            <View style={styles.confirmRow}>
              <Text style={styles.confirmLabel}>Fisik Display</Text>
              <Text style={styles.confirmValue}>{physicalDisp} {currentProd.unit}</Text>
            </View>
            <View style={styles.confirmRow}>
              <Text style={styles.confirmLabel}>Fisik Gudang</Text>
              <Text style={styles.confirmValue}>{physicalGdg} {currentProd.unit}</Text>
            </View>
            <View style={styles.confirmRow}>
              <Text style={styles.confirmLabel}>Total Fisik</Text>
              <Text style={[styles.confirmValue, { fontWeight: '800' }]}>{physicalDisp + physicalGdg} {currentProd.unit}</Text>
            </View>
            <View style={styles.confirmDivider} />
            <View style={styles.confirmRow}>
              <Text style={styles.confirmLabel}>Selisih</Text>
              <Text style={[styles.confirmValue, {
                color: variance === 0 ? colors.success : variance < 0 ? colors.danger : colors.warning,
                fontWeight: '800',
              }]}>
                {variance === 0 ? '0 (Cocok)' : variance > 0 ? `+${variance}` : variance}
              </Text>
            </View>
            <View style={styles.confirmRow}>
              <Text style={styles.confirmLabel}>Alasan</Text>
              <Text style={styles.confirmValue}>{reason}</Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.btnBack} onPress={() => setStep(2)} activeOpacity={0.7}>
              <Text style={styles.btnBackText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnConfirm} onPress={handleConfirm} activeOpacity={0.8}>
              <i className="fa-solid fa-floppy-disk" style={{ fontSize: 14, color: '#FFFFFF', marginRight: 6 }} />
              <Text style={styles.btnConfirmText}>Simpan Hasil Opname</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.btnNextProduct} onPress={handleNextProduct} activeOpacity={0.8}>
            <i className="fa-solid fa-forward" style={{ fontSize: 12, color: colors.primary, marginRight: 6 }} />
            <Text style={styles.btnNextProductText}>Simpan & Lanjut Produk Berikutnya</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.base,
    backgroundColor: '#F8FAFC',
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    gap: 0,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.neutralBg,
    borderWidth: 2,
    borderColor: colors.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepNum: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: colors.textMuted,
  },
  stepNumActive: {
    color: '#FFFFFF',
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: colors.borderDark,
  },
  stepLineActive: {
    backgroundColor: colors.primary,
  },
  stepLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.lg,
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: fonts.weights.semibold,
    color: colors.textMuted,
    textAlign: 'center',
    flex: 1,
  },
  stepLabelActive: {
    color: colors.primary,
    fontWeight: fonts.weights.bold,
  },
  stepContent: {
    gap: spacing.md,
  },
  stepTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.extrabold,
    color: colors.textPrimary,
  },
  stepDesc: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    marginTop: -4,
  },
  productList: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    gap: spacing.sm,
  },
  productItemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  productStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  productItemName: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
  },
  productItemSku: {
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: fonts.mono,
  },
  productItemRight: {
    alignItems: 'flex-end',
  },
  productItemStock: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
  },
  productItemUnit: {
    fontSize: 9,
    color: colors.textMuted,
  },
  selectedProdCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  selectedProdSku: {
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: fonts.mono,
  },
  selectedProdName: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
    marginTop: 2,
  },
  selectedProdLoc: {
    fontSize: fonts.sizes.xs,
    color: colors.primary,
    fontWeight: fonts.weights.semibold,
    marginTop: 4,
  },
  counterBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
  },
  counterLabel: {
    fontSize: 10,
    fontWeight: fonts.weights.bold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  counterSystem: {
    fontSize: fonts.sizes.xs,
    color: colors.textMuted,
    marginTop: 2,
    marginBottom: spacing.sm,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  counterBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterDisplay: {
    minWidth: 80,
    alignItems: 'center',
  },
  counterValue: {
    fontSize: 36,
    fontWeight: fonts.weights.extrabold,
    color: colors.textPrimary,
    fontFamily: fonts.mono,
  },
  varianceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  varianceLabel: {
    fontSize: 10,
    fontWeight: fonts.weights.bold,
    color: colors.textSecondary,
  },
  varianceValue: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.extrabold,
    marginTop: 2,
  },
  varianceSummary: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    fontWeight: fonts.weights.semibold,
  },
  reasonSection: {},
  reasonLabel: {
    fontSize: 10,
    fontWeight: fonts.weights.bold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  reasonChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  reasonChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.neutralBg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reasonChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  reasonChipText: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.semibold,
    color: colors.textSecondary,
  },
  reasonChipTextActive: {
    color: colors.primary,
    fontWeight: fonts.weights.bold,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  btnBack: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    backgroundColor: colors.neutralBg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnBackText: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.semibold,
    color: colors.textSecondary,
  },
  btnNext: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
  },
  btnNextText: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: '#FFFFFF',
  },
  btnConfirm: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    backgroundImage: 'linear-gradient(135deg, #10B981, #059669)',
    paddingVertical: 12,
    borderRadius: borderRadius.md,
  },
  btnConfirmText: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: '#FFFFFF',
  },
  btnNextProduct: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  btnNextProductText: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: colors.primary,
  },
  confirmCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confirmLabel: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
  },
  confirmValue: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
    textAlign: 'right',
    flex: 1,
    marginLeft: spacing.md,
  },
  confirmValueMono: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
    fontFamily: fonts.mono,
  },
  confirmDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 4,
  },
});

export default StaffOpnameScreen;
