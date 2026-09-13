import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { colors, fonts, spacing, borderRadius } from '../styles/colors';
import { useResponsive } from '../context/ResponsiveContext';
import { useWarehouse } from '../context/WarehouseContext';

const InventoriScreen = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const {
    products,
    setSelectedProduct,
    setIsDetailDrawerOpen,
    setIsTransferModalOpen,
    setIsOpnameModalOpen,
    showToast,
  } = useWarehouse();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  // On tablet, user can switch between 'table' and 'card' view
  const [viewMode, setViewMode] = useState(isMobile ? 'card' : 'table');

  const categories = [
    { key: 'ALL', label: 'Semua Kategori' },
    { key: 'Makanan Instan', label: 'Makanan Instan' },
    { key: 'Minuman Ringan', label: 'Minuman Ringan' },
    { key: 'Bahan Pokok', label: 'Bahan Pokok' },
    { key: 'Camilan & Cokelat', label: 'Camilan' },
    { key: 'Perawatan Pribadi', label: 'Perawatan' },
  ];

  const statuses = [
    { key: 'ALL', label: 'Semua Status' },
    { key: 'NORMAL', label: 'Normal' },
    { key: 'STOK MENIPIS', label: 'Stok Menipis' },
    { key: 'HABIS', label: 'Habis' },
  ];

  const filteredProducts = products.filter((p) => {
    const matchQuery =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.ean13.includes(search);
    const matchCat = selectedCategory === 'ALL' || p.kategori === selectedCategory;
    const matchStat = selectedStatus === 'ALL' || p.status === selectedStatus;
    return matchQuery && matchCat && matchStat;
  });

  const handleExportCsv = () => {
    showToast('Data stok inventori berhasil diekspor ke CSV', 'success');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'NORMAL':
        return { bg: colors.successBg, text: colors.success };
      case 'STOK MENIPIS':
        return { bg: colors.warningBg, text: colors.warning };
      case 'HABIS':
        return { bg: colors.dangerBg, text: colors.danger };
      default:
        return { bg: colors.neutralBg, text: colors.neutral };
    }
  };

  const isCardLayout = isMobile || (!isDesktop && viewMode === 'card');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={[styles.headerRow, !isDesktop && styles.headerRowCompact]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.pageTitle}>Manajemen Inventori & Stok</Text>
          <Text style={styles.pageSubtitle}>
            Pemisahan transparan antara Stok Display (Rak Kasir) dan Stok On-Hand (Gudang)
          </Text>
        </View>

        <View style={styles.headerActions}>
          {/* View mode toggle on Tablet */}
          {isTablet && (
            <View style={styles.viewToggleGroup}>
              <TouchableOpacity
                style={[styles.viewToggleBtn, viewMode === 'table' && styles.viewToggleBtnActive]}
                onPress={() => setViewMode('table')}
              >
                <i className="fa-solid fa-table-list" style={{ fontSize: 13, color: viewMode === 'table' ? colors.primary : colors.textMuted }} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.viewToggleBtn, viewMode === 'card' && styles.viewToggleBtnActive]}
                onPress={() => setViewMode('card')}
              >
                <i className="fa-solid fa-grip" style={{ fontSize: 13, color: viewMode === 'card' ? colors.primary : colors.textMuted }} />
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.exportBtn} onPress={handleExportCsv}>
            <i className="fa-solid fa-file-csv" style={{ marginRight: 6, color: colors.textPrimary }} />
            <Text style={styles.exportBtnText}>Ekspor CSV</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.transferBtn}
            onPress={() => {
              setSelectedProduct(products[0]);
              setIsTransferModalOpen(true);
            }}
          >
            <i className="fa-solid fa-right-left" style={{ color: '#FFFFFF', marginRight: 6 }} />
            <Text style={styles.transferBtnText}>Transfer ke Display</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Bar */}
      <View style={styles.filterCard}>
        {/* Search Field */}
        <View style={styles.searchWrap}>
          <i
            className="fa-solid fa-magnifying-glass"
            style={{ color: colors.textMuted, fontSize: 13, marginRight: 8 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari nama produk, SKU, atau barcode EAN-13..."
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <i className="fa-solid fa-xmark" style={{ color: colors.textMuted, fontSize: 13 }} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Category & Status Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          <View style={styles.chipRow}>
            {categories.map((c) => (
              <TouchableOpacity
                key={c.key}
                style={[styles.chip, selectedCategory === c.key && styles.chipActive]}
                onPress={() => setSelectedCategory(c.key)}
              >
                <Text style={[styles.chipText, selectedCategory === c.key && styles.chipTextActive]}>
                  {c.label}
                </Text>
              </TouchableOpacity>
            ))}
            <View style={styles.chipDivider} />
            {statuses.map((s) => (
              <TouchableOpacity
                key={s.key}
                style={[styles.chip, selectedStatus === s.key && styles.chipActive]}
                onPress={() => setSelectedStatus(s.key)}
              >
                <Text style={[styles.chipText, selectedStatus === s.key && styles.chipTextActive]}>
                  {s.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Table / Card List Content */}
      <View style={styles.tableCard}>
        <View style={styles.tableSummaryRow}>
          <Text style={styles.tableSummaryText}>
            Menampilkan <Text style={{ fontWeight: 'bold' }}>{filteredProducts.length}</Text> dari {products.length} produk
          </Text>
        </View>

        {isCardLayout ? (
          // Card List View for Mobile and Tablet Grid
          <View style={[styles.mobileCardList, isTablet && styles.tabletCardGrid]}>
            {filteredProducts.map((p) => {
              const sBadge = getStatusBadge(p.status);
              return (
                <View key={p.id} style={[styles.mobileItemCard, isTablet && styles.tabletItemCard]}>
                  <View style={styles.mobileCardTop}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.mobileSku}>{p.sku} • {p.kategori}</Text>
                      <Text style={styles.mobileProdName}>{p.name}</Text>
                      <Text style={styles.mobileEan}>EAN: {p.ean13}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: sBadge.bg }]}>
                      <Text style={[styles.statusBadgeText, { color: sBadge.text }]}>{p.status}</Text>
                    </View>
                  </View>

                  <View style={styles.mobileStockGrid}>
                    <View style={styles.mobileStockCol}>
                      <Text style={styles.mobileStockLabel}>STOK DISP</Text>
                      <Text style={styles.mobileStockVal}>{p.stok_disp}</Text>
                      <Text style={styles.mobileStockUnit}>{p.unit}</Text>
                    </View>
                    <View style={styles.mobileStockCol}>
                      <Text style={styles.mobileStockLabel}>STOK GDG</Text>
                      <Text style={styles.mobileStockVal}>{p.stok_gdg}</Text>
                      <Text style={styles.mobileStockUnit}>{p.unit}</Text>
                    </View>
                    <View style={[styles.mobileStockCol, styles.mobileStockTotal]}>
                      <Text style={styles.mobileStockLabel}>TOTAL AKTUAL</Text>
                      <Text style={[styles.mobileStockVal, { color: colors.primary, fontWeight: fonts.weights.extrabold }]}>
                        {p.total_stok}
                      </Text>
                      <Text style={styles.mobileStockUnit}>{p.unit}</Text>
                    </View>
                  </View>

                  <View style={styles.mobileActionRow}>
                    <TouchableOpacity
                      style={styles.mobileBtnDetail}
                      onPress={() => {
                        setSelectedProduct(p);
                        setIsDetailDrawerOpen(true);
                      }}
                    >
                      <i className="fa-solid fa-circle-info" style={{ marginRight: 4, color: colors.textPrimary }} />
                      <Text style={styles.mobileBtnDetailText}>Riwayat Mutasi</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.mobileBtnTransfer}
                      onPress={() => {
                        setSelectedProduct(p);
                        setIsTransferModalOpen(true);
                      }}
                    >
                      <i className="fa-solid fa-right-left" style={{ marginRight: 4, color: '#FFFFFF' }} />
                      <Text style={styles.mobileBtnTransferText}>Transfer</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.mobileBtnOpname}
                      onPress={() => {
                        setSelectedProduct(p);
                        setIsOpnameModalOpen(true);
                      }}
                    >
                      <i className="fa-solid fa-clipboard-check" style={{ marginRight: 4, color: '#FFFFFF' }} />
                      <Text style={styles.mobileBtnOpnameText}>Opname</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          // Desktop & Tablet Responsive Scrollable Table View
          <View style={styles.tableWrap}>
            <View style={styles.tableHeader}>
              <Text style={[styles.th, { flex: 2.2 }]}>PRODUK</Text>
              <Text style={[styles.th, { flex: 1.1 }]}>SKU / EAN-13</Text>
              <Text style={[styles.th, { flex: 0.9, textAlign: 'right' }]}>STOK DISP</Text>
              <Text style={[styles.th, { flex: 0.9, textAlign: 'right' }]}>STOK GDG</Text>
              <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>TOTAL STOK</Text>
              <Text style={[styles.th, { flex: 1.1, textAlign: 'center' }]}>STATUS</Text>
              <Text style={[styles.th, { flex: 1.4, textAlign: 'center' }]}>AKSI</Text>
            </View>

            {filteredProducts.map((p) => {
              const sBadge = getStatusBadge(p.status);
              return (
                <TouchableOpacity
                  key={p.id}
                  style={styles.tableRow}
                  onPress={() => {
                    setSelectedProduct(p);
                    setIsDetailDrawerOpen(true);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={{ flex: 2.2 }}>
                    <Text style={styles.tdProdName}>{p.name}</Text>
                    <Text style={styles.tdCategory}>{p.kategori} • {p.lokasi_rak}</Text>
                  </View>

                  <View style={{ flex: 1.1 }}>
                    <Text style={styles.tdSku}>{p.sku}</Text>
                    <Text style={styles.tdEan}>{p.ean13}</Text>
                  </View>

                  <Text style={[styles.tdNumber, { flex: 0.9 }]}>
                    {p.stok_disp} <Text style={styles.unitSmall}>{p.unit}</Text>
                  </Text>

                  <Text style={[styles.tdNumber, { flex: 0.9 }]}>
                    {p.stok_gdg} <Text style={styles.unitSmall}>{p.unit}</Text>
                  </Text>

                  <Text style={[styles.tdTotalNumber, { flex: 1 }]}>
                    {p.total_stok} <Text style={styles.unitSmall}>{p.unit}</Text>
                  </Text>

                  <View style={{ flex: 1.1, alignItems: 'center' }}>
                    <View style={[styles.statusBadge, { backgroundColor: sBadge.bg }]}>
                      <Text style={[styles.statusBadgeText, { color: sBadge.text }]}>{p.status}</Text>
                    </View>
                  </View>

                  <View style={{ flex: 1.4, flexDirection: 'row', justifyContent: 'center', gap: 6 }}>
                    <TouchableOpacity
                      style={styles.actionPill}
                      onPress={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(p);
                        setIsTransferModalOpen(true);
                      }}
                      title="Transfer ke Display"
                    >
                      <i className="fa-solid fa-right-left" style={{ color: colors.primary, fontSize: 11 }} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionPill}
                      onPress={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(p);
                        setIsOpnameModalOpen(true);
                      }}
                      title="Stock Opname"
                    >
                      <i className="fa-solid fa-clipboard-check" style={{ color: colors.warning, fontSize: 11 }} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionPill}
                      onPress={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(p);
                        setIsDetailDrawerOpen(true);
                      }}
                      title="Detail & Mutasi"
                    >
                      <i className="fa-solid fa-chevron-right" style={{ color: colors.textSecondary, fontSize: 11 }} />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  viewToggleGroup: {
    flexDirection: 'row',
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 2,
  },
  viewToggleBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: borderRadius.xs,
  },
  viewToggleBtnActive: {
    backgroundColor: colors.primaryLight,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
  },
  exportBtnText: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
  },
  transferBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.base,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
  },
  transferBtnText: {
    color: '#FFFFFF',
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold,
  },
  filterCard: {
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.base,
    gap: spacing.sm,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 38,
  },
  searchInput: {
    flex: 1,
    fontSize: fonts.sizes.sm,
    color: colors.textPrimary,
  },
  chipScroll: {
    flexDirection: 'row',
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chip: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    fontWeight: fonts.weights.medium,
  },
  chipTextActive: {
    color: colors.primary,
    fontWeight: fonts.weights.bold,
  },
  chipDivider: {
    width: 1,
    height: 16,
    backgroundColor: colors.borderDark,
    marginHorizontal: 4,
  },
  tableCard: {
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.xxxl,
  },
  tableSummaryRow: {
    marginBottom: spacing.sm,
  },
  tableSummaryText: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
  },
  tableWrap: {
    width: '100%',
    overflow: 'auto',
    minWidth: 680,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDark,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  th: {
    fontSize: 10,
    fontWeight: fonts.weights.bold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  tdProdName: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
  },
  tdCategory: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  tdSku: {
    fontSize: fonts.sizes.xs,
    fontFamily: fonts.mono,
    color: colors.textPrimary,
  },
  tdEan: {
    fontSize: 10,
    fontFamily: fonts.mono,
    color: colors.textMuted,
  },
  tdNumber: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
    textAlign: 'right',
  },
  tdTotalNumber: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.extrabold,
    color: colors.primary,
    textAlign: 'right',
  },
  unitSmall: {
    fontSize: 9,
    color: colors.textMuted,
    fontWeight: 'normal',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.pill,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: fonts.weights.bold,
  },
  actionPill: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.md,
    backgroundColor: colors.neutralBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  mobileCardList: {
    gap: spacing.sm,
  },
  tabletCardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  mobileItemCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  tabletItemCard: {
    width: 'calc(50% - 6px)',
  },
  mobileCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  mobileSku: {
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: fonts.mono,
  },
  mobileProdName: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
    marginVertical: 1,
  },
  mobileEan: {
    fontSize: 10,
    fontFamily: fonts.mono,
    color: colors.textSecondary,
  },
  mobileStockGrid: {
    flexDirection: 'row',
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  mobileStockCol: {
    flex: 1,
    alignItems: 'center',
  },
  mobileStockTotal: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.sm,
  },
  mobileStockLabel: {
    fontSize: 9,
    fontWeight: fonts.weights.bold,
    color: colors.textMuted,
  },
  mobileStockVal: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
    marginVertical: 1,
  },
  mobileStockUnit: {
    fontSize: 9,
    color: colors.textMuted,
  },
  mobileActionRow: {
    flexDirection: 'row',
    gap: 6,
  },
  mobileBtnDetail: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 7,
    borderRadius: borderRadius.md,
  },
  mobileBtnDetailText: {
    fontSize: 10,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
  },
  mobileBtnTransfer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 7,
    borderRadius: borderRadius.md,
  },
  mobileBtnTransferText: {
    fontSize: 10,
    fontWeight: fonts.weights.bold,
    color: '#FFFFFF',
  },
  mobileBtnOpname: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.warning,
    paddingVertical: 7,
    borderRadius: borderRadius.md,
  },
  mobileBtnOpnameText: {
    fontSize: 10,
    fontWeight: fonts.weights.bold,
    color: '#FFFFFF',
  },
});

export default InventoriScreen;
