import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { colors, fonts, spacing, borderRadius, shadows } from '../styles/colors';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';

const inventoryData = [
  { name: 'Aqua Air Mineral 600ml', sku: 'SKU-10024', stok: '12', min: '20', status: 'STOK RENDAH' },
  { name: 'Teh Botol Sosro Kotak 250ml', sku: 'SKU-10025', stok: '8', min: '15', status: 'STOK RENDAH' },
  { name: 'SilverQueen Chocolate Almond 62g', sku: 'SKU-10026', stok: '0', min: '10', status: 'HABIS' },
  { name: 'Minyak Goreng Bimoli 2 Liter', sku: 'SKU-10027', stok: '0', min: '12', status: 'HABIS' },
  { name: 'Beras Pandan Wangi Super 5kg', sku: 'SKU-10028', stok: '0', min: '10', status: 'HABIS' },
  { name: 'Lifebuoy Sabun Mandi Merah 110g', sku: 'SKU-10029', stok: '5', min: '10', status: 'STOK RENDAH' },
  { name: 'Pepsodent Pencegah Gigi Berlubang 190g', sku: 'SKU-10030', stok: '9', min: '15', status: 'NORMAL' },
  { name: 'Kopi ABC Susu 25g', sku: 'SKU-10031', stok: '7', min: '12', status: 'STOK RENDAH' },
  { name: 'Gula Pasir 1kg', sku: 'SKU-10032', stok: '0', min: '8', status: 'HABIS' },
  { name: 'Telur Ayam 1 Dus (12 Butir)', sku: 'SKU-10033', stok: '0', min: '6', status: 'HABIS' },
  { name: 'Roti Tawar 400g', sku: 'SKU-10034', stok: '4', min: '8', status: 'STOK RENDAH' },
];

const columns = [
  { label: 'Produk', key: 'name', flex: 3, bold: true, isIcon: true, iconName: 'fa-cube' },
  { label: 'SKU', key: 'sku', flex: 1.2 },
  { label: 'Stok Saat Ini', key: 'stok', flex: 1 },
  { label: 'Stok Minimum', key: 'min', flex: 1 },
  { label: 'Status', key: 'status', flex: 1, isStatus: true },
];

const InventoriScreen = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Search & Filter */}
      <View style={styles.filterRow}>
        <View style={styles.searchBox}>
          <i className="fa-solid fa-magnifying-glass" style={{ fontSize: 14, color: colors.textMuted, marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari nama produk, SKU..."
            placeholderTextColor={colors.textMuted}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <i className="fa-solid fa-sliders" style={{ fontSize: 14, color: colors.textSecondary, marginRight: 8 }} />
          <Text style={styles.filterButtonText}>Filter Status</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.exportButton}>
          <i className="fa-solid fa-arrow-right-from-bracket" style={{ fontSize: 14, color: colors.textPrimary, marginRight: 8 }} />
          <Text style={styles.exportButtonText}>Ekspor CSV</Text>
        </TouchableOpacity>
      </View>

      {/* Stat Cards */}
      <View style={styles.statsRow}>
        <StatCard title="Total Produk" value="1.284" subtitle="Produk aktif di gudang" />
        <StatCard title="Stok Rendah" value="12" subtitle="Di bawah stok minimum" />
        <StatCard title="Stok Habis" value="4" subtitle="Stok saat ini 0" critical={true} />
        <StatCard title="Nilai Inventori" value="Rp 125.500.000" subtitle="Total nilai stok saat ini" />
      </View>

      {/* Table */}
      <DataTable columns={columns} data={inventoryData} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    width: 320,
  },
  searchInput: {
    flex: 1,
    fontSize: fonts.sizes.base,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
    outlineStyle: 'none',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  filterButtonText: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.medium,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  exportButtonText: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.medium,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.base,
    marginBottom: spacing.lg,
  },
});

export default InventoriScreen;
