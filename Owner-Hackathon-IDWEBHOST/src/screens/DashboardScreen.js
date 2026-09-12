import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, fonts, spacing, borderRadius, shadows } from '../styles/colors';
import StatCard from '../components/StatCard';
import BarChart from '../components/BarChart';
import { StatusBadge } from '../components/DataTable';

const chartData = [
  { label: 'Senin', value1: 45, value2: 35 },
  { label: 'Selasa', value1: 52, value2: 48 },
  { label: 'Rabu', value1: 38, value2: 42 },
  { label: 'Kamis', value1: 48, value2: 45 },
  { label: 'Jumat', value1: 78, value2: 55 },
  { label: 'Sabtu', value1: 85, value2: 70 },
  { label: 'Minggu', value1: 92, value2: 65 },
];

const recentTransactions = [
  { id: 'TX-10492', time: '14:32', items: '5 Item', amount: 'Rp 182.000', status: 'SUKSES' },
  { id: 'TX-10491', time: '14:28', items: '2 Item', amount: 'Rp 45.500', status: 'SUKSES' },
  { id: 'TX-10490', time: '14:15', items: '12 Item', amount: 'Rp 612.000', status: 'SUKSES' },
  { id: 'TX-10489', time: '13:58', items: '1 Item', amount: 'Rp 12.000', status: 'PENDING' },
  { id: 'TX-10488', time: '13:42', items: '8 Item', amount: 'Rp 235.000', status: 'SUKSES' },
];

const DashboardScreen = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Stat Cards */}
      <View style={styles.statsRow}>
        <StatCard
          title="Pendapatan Hari Ini"
          value="Rp 4.250.000"
          percentChange="12.4%"
          percentUp={true}
        />
        <StatCard
          title="Jumlah Transaksi"
          value="87"
          percentChange="4.8%"
          percentUp={true}
        />
        <StatCard
          title="Nilai Inventori"
          value="Rp 125.500.000"
          percentChange="0.8%"
          percentUp={false}
        />
        <StatCard
          title="Stok Menipis"
          value="12 Produk"
          critical={true}
        />
      </View>

      {/* AI Alert */}
      <View style={styles.aiAlert}>
        <View style={styles.aiAlertContent}>
          <View style={styles.aiAlertLeft}>
            <i className="fa-solid fa-wand-magic-sparkles" style={{ fontSize: 18, color: '#92400E', marginRight: 12 }} />
            <View style={styles.aiAlertText}>
              <Text style={styles.aiAlertTitle}>AI Attention Required: Peringatan Risiko Stok Habis</Text>
              <Text style={styles.aiAlertDesc}>
                Hermes AI mendeteksi 4 produk utama (termasuk Mie Instan Goreng & Minyak Goreng 2L) akan habis dalam 48 jam ke depan berdasarkan akselerasi tren mingguan. Silakan hubungi supplier segera.
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.aiAlertButton}>
            <Text style={styles.aiAlertButtonText}>Lihat Detail</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Chart + Recent Transactions */}
      <View style={styles.contentRow}>
        {/* Bar Chart */}
        <View style={[styles.chartCard, shadows.sm]}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>7-Hari Perbandingan Penjualan</Text>
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.chartBlue }]} />
                <Text style={styles.legendText}>Minggu Ini</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.chartGray }]} />
                <Text style={styles.legendText}>Minggu Lalu</Text>
              </View>
            </View>
          </View>
          <BarChart data={chartData} height={220} />
        </View>

        {/* Recent Transactions */}
        <View style={[styles.transCard, shadows.sm]}>
          <View style={styles.transHeader}>
            <Text style={styles.transTitle}>Transaksi Terbaru</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          {recentTransactions.map((tx, idx) => (
            <View key={idx} style={[styles.transItem, idx < recentTransactions.length - 1 && styles.transItemBorder]}>
              <View style={styles.transInfo}>
                <Text style={styles.transId}>{tx.id}</Text>
                <Text style={styles.transTime}>{tx.time} • {tx.items}</Text>
              </View>
              <View style={styles.transRight}>
                <Text style={styles.transAmount}>{tx.amount}</Text>
                <StatusBadge status={tx.status} />
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.base,
    marginBottom: spacing.lg,
  },
  // AI Alert
  aiAlert: {
    backgroundColor: colors.alertAiBg,
    borderWidth: 1,
    borderColor: colors.alertAiBorder,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  aiAlertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  aiAlertLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: spacing.base,
  },
  aiAlertText: {
    flex: 1,
  },
  aiAlertTitle: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.bold,
    color: colors.alertAiText,
    fontFamily: fonts.regular,
    marginBottom: 4,
  },
  aiAlertDesc: {
    fontSize: fonts.sizes.md,
    color: colors.alertAiText,
    fontFamily: fonts.regular,
    lineHeight: 18,
  },
  aiAlertButton: {
    borderWidth: 1.5,
    borderColor: colors.alertAiBorder,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.cardBg,
  },
  aiAlertButtonText: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: colors.alertAiText,
    fontFamily: fonts.regular,
  },
  // Chart + Transactions Row
  contentRow: {
    flexDirection: 'row',
    gap: spacing.base,
  },
  chartCard: {
    flex: 1.6,
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  chartTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
  },
  legendRow: {
    flexDirection: 'row',
    gap: spacing.base,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  legendText: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
    fontFamily: fonts.regular,
  },
  transCard: {
    flex: 1,
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  transHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  transTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
  },
  viewAllText: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: colors.primary,
    fontFamily: fonts.regular,
  },
  transItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  transItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  transInfo: {},
  transId: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
  },
  transTime: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
    fontFamily: fonts.regular,
    marginTop: 2,
  },
  transRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  transAmount: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
  },
});

export default DashboardScreen;
