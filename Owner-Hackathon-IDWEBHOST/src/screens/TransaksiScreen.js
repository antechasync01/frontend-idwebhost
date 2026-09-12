import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { colors, fonts, spacing, borderRadius } from '../styles/colors';
import DataTable from '../components/DataTable';

const transactions = [
  { no: 'TX-10492', tanggal: '31 Jan 2026 • 14:32', kasir: 'Rina', items: '5', total: 'Rp 182.000', metode: 'QRIS', status: 'SUKSES' },
  { no: 'TX-10491', tanggal: '31 Jan 2026 • 14:28', kasir: 'Budi', items: '2', total: 'Rp 45.500', metode: 'CASH', status: 'SUKSES' },
  { no: 'TX-10490', tanggal: '31 Jan 2026 • 14:15', kasir: 'Rina', items: '12', total: 'Rp 612.000', metode: 'DEBIT', status: 'SUKSES' },
  { no: 'TX-10489', tanggal: '31 Jan 2026 • 13:58', kasir: 'Hendra', items: '1', total: 'Rp 12.000', metode: 'CASH', status: 'PENDING' },
  { no: 'TX-10488', tanggal: '31 Jan 2026 • 13:42', kasir: 'Budi', items: '8', total: 'Rp 235.000', metode: 'QRIS', status: 'SUKSES' },
  { no: 'TX-10487', tanggal: '31 Jan 2026 • 13:10', kasir: 'Rina', items: '3', total: 'Rp 78.000', metode: 'CASH', status: 'SUKSES' },
  { no: 'TX-10486', tanggal: '31 Jan 2026 • 12:55', kasir: 'Hendra', items: '6', total: 'Rp 156.000', metode: 'DEBIT', status: 'SUKSES' },
];

const columns = [
  { label: 'No. Transaksi', key: 'no', flex: 1.2, bold: true },
  { label: 'Tanggal', key: 'tanggal', flex: 1.8 },
  { label: 'Kasir', key: 'kasir', flex: 0.8 },
  { label: 'Total Item', key: 'items', flex: 0.8 },
  { label: 'Total Harga', key: 'total', flex: 1, bold: true },
  { label: 'Metode', key: 'metode', flex: 0.8, isStatus: true },
  { label: 'Status', key: 'status', flex: 0.8, isStatus: true },
];

const TransaksiScreen = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.pageTitle}>Riwayat Transaksi</Text>
          <Text style={styles.pageSubtitle}>Filter dan tampilan transaksi kasir untuk owner minimarket</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.dateSelector}>
            <i className="fa-regular fa-calendar" style={{ fontSize: 14, color: colors.primary, marginRight: 8 }} />
            <Text style={styles.dateSelectorText}>01-31 Jan 2026</Text>
            <i className="fa-solid fa-chevron-down" style={{ fontSize: 11, color: colors.textSecondary, marginLeft: 8 }} />
          </TouchableOpacity>
          <View style={styles.searchBox}>
            <i className="fa-solid fa-magnifying-glass" style={{ fontSize: 14, color: colors.textMuted, marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari transaksi..."
              placeholderTextColor={colors.textMuted}
            />
          </View>
        </View>
      </View>

      {/* Table */}
      <DataTable columns={columns} data={transactions} />
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
  headerRight: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  dateSelectorText: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.medium,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
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
    width: 200,
  },
  searchInput: {
    flex: 1,
    fontSize: fonts.sizes.base,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
    outlineStyle: 'none',
  },
});

export default TransaksiScreen;
