import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { colors, fonts, spacing, borderRadius } from '../styles/colors';
import { useResponsive } from '../context/ResponsiveContext';
import { useWarehouse } from '../context/WarehouseContext';
import AccessDenied from '../components/AccessDenied';

const ProdukScreen = () => {
  const { isDesktop } = useResponsive();
  const {
    products,
    userRole,
    handleUpdateProduct,
    showToast,
  } = useWarehouse();

  const [selectedProd, setSelectedProd] = useState(products[0]);
  const [newSellPrice, setNewSellPrice] = useState(products[0]?.harga_jual.toString() || '0');
  const [priceReason, setPriceReason] = useState('Penyesuaian promo suplier regional');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // RBAC Guard
  if (userRole === 'WAREHOUSE_STAFF') {
    return <AccessDenied requiredRole="WAREHOUSE_ADMIN" />;
  }

  const handleSelectProd = (prod) => {
    setSelectedProd(prod);
    setNewSellPrice(prod.harga_jual.toString());
  };

  const handleSavePriceChange = () => {
    if (!selectedProd) return;
    handleUpdateProduct(selectedProd.id, {
      harga_jual: parseInt(newSellPrice, 10),
      reason: priceReason,
    });
  };

  const handleToggleStatus = (newStatus) => {
    if (!selectedProd) return;
    handleUpdateProduct(selectedProd.id, {
      status: newStatus,
      reason: `Perubahan status ke ${newStatus}`,
    });
    setSelectedProd((prev) => ({ ...prev, status: newStatus }));
  };

  const filtered = products.filter((p) => {
    if (statusFilter === 'ALL') return true;
    return p.status === statusFilter;
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={[styles.headerRow, !isDesktop && styles.headerRowCompact]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.pageTitle}>Master Produk & Lifecycle Katalog</Text>
          <Text style={styles.pageSubtitle}>
            Kelola data induk SKU, margin keuntungan, penyesuaian harga jual, dan status katalog aktif
          </Text>
        </View>

        <TouchableOpacity
          style={styles.btnAddProd}
          onPress={() => showToast('Form Tambah Produk Baru dibuka', 'info')}
        >
          <i className="fa-solid fa-plus" style={{ color: '#FFFFFF', marginRight: 6 }} />
          <Text style={styles.btnAddProdText}>Tambah Produk Baru</Text>
        </TouchableOpacity>
      </View>

      {/* Main Responsive Two Column Layout */}
      <View style={[styles.mainLayout, !isDesktop && styles.mainLayoutStacked]}>
        {/* Left Column: Product Table */}
        <View style={styles.tableCard}>
          <View style={styles.tableCardHeader}>
            <Text style={styles.tableCardTitle}>Katalog Master Produk ({products.length} SKU)</Text>
            <View style={styles.statusFilterRow}>
              {['ALL', 'NORMAL', 'STOK MENIPIS', 'HABIS'].map((st) => (
                <TouchableOpacity
                  key={st}
                  style={[styles.statusChip, statusFilter === st && styles.statusChipActive]}
                  onPress={() => setStatusFilter(st)}
                >
                  <Text style={[styles.statusChipText, statusFilter === st && styles.statusChipTextActive]}>
                    {st === 'ALL' ? 'Semua' : st}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.tableWrap}>
            <View style={styles.tableHeader}>
              <Text style={[styles.th, { flex: 2 }]}>PRODUK</Text>
              <Text style={[styles.th, { flex: 1 }]}>SKU</Text>
              <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>HARGA BELI</Text>
              <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>HARGA JUAL</Text>
              <Text style={[styles.th, { flex: 0.8, textAlign: 'right' }]}>MARGIN</Text>
            </View>

            {filtered.map((p) => {
              const isSelected = p.id === selectedProd?.id;
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.tableRow, isSelected && styles.tableRowSelected]}
                  onPress={() => handleSelectProd(p)}
                >
                  <View style={{ flex: 2 }}>
                    <Text style={[styles.tdName, isSelected && styles.tdNameSelected]}>{p.name}</Text>
                    <Text style={styles.tdCat}>{p.kategori}</Text>
                  </View>
                  <Text style={[styles.tdSku, { flex: 1 }]}>{p.sku}</Text>
                  <Text style={[styles.tdNum, { flex: 1 }]}>Rp {p.harga_beli.toLocaleString('id-ID')}</Text>
                  <Text style={[styles.tdNumBold, { flex: 1 }]}>Rp {p.harga_jual.toLocaleString('id-ID')}</Text>
                  <Text style={[styles.tdMargin, { flex: 0.8 }]}>{p.margin}%</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Right Column / Stacked: Master Lifecycle Panel */}
        {selectedProd && (
          <View style={styles.lifecycleCard}>
            <View style={styles.lifecycleHeader}>
              <Text style={styles.lifecycleTitle}>Master Lifecycle Produk</Text>
              <View style={styles.activeStatusPill}>
                <Text style={styles.activeStatusText}>{selectedProd.status}</Text>
              </View>
            </View>

            <Text style={styles.selectedProdName}>{selectedProd.name}</Text>
            <Text style={styles.selectedProdSku}>{selectedProd.sku} • EAN: {selectedProd.ean13}</Text>

            {/* Profitability Box */}
            <View style={styles.profitBox}>
              <Text style={styles.profitLabel}>PROFITABILITAS & PENJUALAN</Text>
              <View style={styles.profitGrid}>
                <View style={styles.profitCol}>
                  <Text style={styles.profitKey}>Gross Margin</Text>
                  <Text style={styles.profitVal}>{selectedProd.margin}%</Text>
                </View>
                <View style={styles.profitCol}>
                  <Text style={styles.profitKey}>Rata-rata Penjualan/Hari</Text>
                  <Text style={styles.profitVal}>{selectedProd.avgSalesDaily} pcs</Text>
                </View>
              </View>
            </View>

            {/* Change Sell Price Form */}
            <View style={styles.formSection}>
              <Text style={styles.formSectionTitle}>Ubah Harga Jual Kasir (IDR)</Text>
              <View style={styles.priceInputRow}>
                <Text style={styles.rpPrefix}>Rp</Text>
                <TextInput
                  style={styles.priceInput}
                  keyboardType="number-pad"
                  value={newSellPrice}
                  onChangeText={setNewSellPrice}
                />
              </View>

              <Text style={styles.inputLabel}>Alasan Perubahan Harga</Text>
              <TextInput
                style={styles.reasonInput}
                value={priceReason}
                onChangeText={setPriceReason}
                placeholder="Misal: Penyesuaian promo supplier"
              />

              <TouchableOpacity style={styles.btnSavePrice} onPress={handleSavePriceChange}>
                <i className="fa-solid fa-check" style={{ color: '#FFFFFF', marginRight: 6 }} />
                <Text style={styles.btnSavePriceText}>Simpan Perubahan Harga</Text>
              </TouchableOpacity>
            </View>

            {/* Lifecycle Status Management */}
            <View style={styles.lifecycleStatusSection}>
              <Text style={styles.formSectionTitle}>Manajemen Status Katalog</Text>
              <View style={styles.lifecycleButtons}>
                <TouchableOpacity
                  style={[styles.btnStatusAction, styles.btnDeactivate]}
                  onPress={() => handleToggleStatus('STOK MENIPIS')}
                >
                  <Text style={styles.btnDeactivateText}>Nonaktifkan Sementara</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.btnStatusAction, styles.btnArchive]}
                  onPress={() => handleToggleStatus('HABIS')}
                >
                  <Text style={styles.btnArchiveText}>Arsipkan Katalog</Text>
                </TouchableOpacity>
              </View>
            </View>
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
  btnAddProd: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.base,
    paddingVertical: 9,
    borderRadius: borderRadius.md,
  },
  btnAddProdText: {
    color: '#FFFFFF',
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
  },
  mainLayout: {
    flexDirection: 'row',
    gap: spacing.base,
    marginBottom: spacing.xxxl,
  },
  mainLayoutStacked: {
    flexDirection: 'column',
  },
  tableCard: {
    flex: 1.6,
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
  },
  tableCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.base,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  tableCardTitle: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
  },
  statusFilterRow: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
  },
  statusChip: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  statusChipText: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: fonts.weights.medium,
  },
  statusChipTextActive: {
    color: colors.primary,
    fontWeight: fonts.weights.bold,
  },
  tableWrap: {
    width: '100%',
    overflow: 'auto',
    minWidth: 500,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    paddingVertical: 8,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  th: {
    fontSize: 10,
    fontWeight: fonts.weights.bold,
    color: colors.textSecondary,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  tableRowSelected: {
    backgroundColor: colors.primaryLight,
  },
  tdName: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
  },
  tdNameSelected: {
    color: colors.primary,
    fontWeight: fonts.weights.bold,
  },
  tdCat: {
    fontSize: 10,
    color: colors.textMuted,
  },
  tdSku: {
    fontSize: 10,
    fontFamily: fonts.mono,
    color: colors.textSecondary,
  },
  tdNum: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  tdNumBold: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
    textAlign: 'right',
  },
  tdMargin: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold,
    color: colors.success,
    textAlign: 'right',
  },
  lifecycleCard: {
    flex: 1,
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    gap: spacing.base,
  },
  lifecycleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lifecycleTitle: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
  },
  activeStatusPill: {
    backgroundColor: colors.successBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.pill,
  },
  activeStatusText: {
    fontSize: 10,
    fontWeight: fonts.weights.bold,
    color: colors.success,
  },
  selectedProdName: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
  },
  selectedProdSku: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    fontFamily: fonts.mono,
  },
  profitBox: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  profitLabel: {
    fontSize: 10,
    fontWeight: fonts.weights.bold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  profitGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profitCol: {
    flex: 1,
  },
  profitKey: {
    fontSize: 10,
    color: colors.textMuted,
  },
  profitVal: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.extrabold,
    color: colors.textPrimary,
    marginTop: 2,
  },
  formSection: {
    gap: spacing.xs,
  },
  formSectionTitle: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
  },
  priceInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    height: 40,
  },
  rpPrefix: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: colors.textSecondary,
    marginRight: 6,
  },
  priceInput: {
    flex: 1,
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
  },
  inputLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 4,
  },
  reasonInput: {
    height: 38,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    fontSize: fonts.sizes.xs,
    color: colors.textPrimary,
  },
  btnSavePrice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    marginTop: 4,
    minHeight: 40,
  },
  btnSavePriceText: {
    color: '#FFFFFF',
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold,
  },
  lifecycleStatusSection: {
    gap: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: spacing.base,
  },
  lifecycleButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: 4,
  },
  btnStatusAction: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
  },
  btnDeactivate: {
    backgroundColor: colors.neutralBg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnDeactivateText: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: fonts.weights.semibold,
  },
  btnArchive: {
    backgroundColor: colors.dangerBg,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
  },
  btnArchiveText: {
    fontSize: 10,
    color: colors.danger,
    fontWeight: fonts.weights.semibold,
  },
});

export default ProdukScreen;
