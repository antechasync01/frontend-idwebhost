import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { colors, fonts, spacing, borderRadius, shadows } from '../styles/colors';
import DataTable, { StatusBadge } from '../components/DataTable';

const products = [
  { name: 'Indomie Goreng (70g)', sku: 'IDM-70G', category: 'Makanan Ringan', hargaJual: 'Rp 3.500', hargaBeli: 'Rp 2.450', status: 'AKTIF' },
  { name: 'Aqua 600ml', sku: 'AQU-600', category: 'Minuman', hargaJual: 'Rp 5.000', hargaBeli: 'Rp 3.200', status: 'AKTIF' },
  { name: 'Minyak Goreng Filma 2L', sku: 'FIL-2L', category: 'Bahan Pokok', hargaJual: 'Rp 42.000', hargaBeli: 'Rp 31.500', status: 'AKTIF' },
  { name: 'Chitato Barbeque 40g', sku: 'CHI-40G', category: 'Snack', hargaJual: 'Rp 4.500', hargaBeli: 'Rp 3.100', status: 'NONAKTIF' },
  { name: 'Kopi ABC Susu 25g', sku: 'ABC-25G', category: 'Minuman', hargaJual: 'Rp 2.500', hargaBeli: 'Rp 1.800', status: 'AKTIF' },
  { name: 'Roti Tawar Sari Roti 400g', sku: 'SRI-400', category: 'Roti', hargaJual: 'Rp 18.000', hargaBeli: 'Rp 12.800', status: 'AKTIF' },
  { name: 'Teh Botol Sosro 350ml', sku: 'SOS-350', category: 'Minuman', hargaJual: 'Rp 6.000', hargaBeli: 'Rp 4.100', status: 'AKTIF' },
  { name: 'Gula Pasir Gulaku 1kg', sku: 'GLK-1KG', category: 'Bahan Pokok', hargaJual: 'Rp 14.500', hargaBeli: 'Rp 10.200', status: 'AKTIF' },
];

const columns = [
  { label: 'Nama Produk', key: 'name', flex: 2.5, bold: true },
  { label: 'SKU', key: 'sku', flex: 1 },
  { label: 'Kategori', key: 'category', flex: 1.2 },
  { label: 'Harga Jual', key: 'hargaJual', flex: 1 },
  { label: 'Harga Beli', key: 'hargaBeli', flex: 1 },
  { label: 'Status', key: 'status', flex: 0.8, isStatus: true },
];

const ProdukScreen = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.pageTitle}>Manajemen Produk</Text>
          <Text style={styles.pageSubtitle}>Kelola daftar produk, harga, dan status penjualan</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <i className="fa-solid fa-plus" style={{ fontSize: 14, color: '#FFFFFF', marginRight: 8 }} />
          <Text style={styles.addButtonText}>+ Tambah Produk</Text>
        </TouchableOpacity>
      </View>

      {/* Search & Filter */}
      <View style={styles.filterRow}>
        <View style={styles.searchBox}>
          <i className="fa-solid fa-magnifying-glass" style={{ fontSize: 14, color: colors.textMuted, marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari nama produk, SKU, kategori..."
            placeholderTextColor={colors.textMuted}
          />
        </View>
        <View style={styles.dropdownGroup}>
          <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>Kategori</Text>
            <i className="fa-solid fa-chevron-down" style={{ fontSize: 11, color: colors.textSecondary, marginLeft: 8 }} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>Status</Text>
            <i className="fa-solid fa-chevron-down" style={{ fontSize: 11, color: colors.textSecondary, marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Table */}
      <DataTable columns={columns} data={products} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  pageTitle: {
    fontSize: fonts.sizes.xxl,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
  },
  pageSubtitle: {
    fontSize: fonts.sizes.base,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    marginTop: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  addButtonText: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: '#FFFFFF',
    fontFamily: fonts.regular,
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.base,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: fonts.sizes.base,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
    outlineStyle: 'none',
  },
  dropdownGroup: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    minWidth: 120,
  },
  dropdownText: {
    fontSize: fonts.sizes.base,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },
});

export default ProdukScreen;
