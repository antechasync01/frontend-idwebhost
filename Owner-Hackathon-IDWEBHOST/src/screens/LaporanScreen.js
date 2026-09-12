import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, fonts, spacing, borderRadius, shadows } from '../styles/colors';
import StatCard from '../components/StatCard';
import BarChart from '../components/BarChart';

const chartData = [
  { label: 'Min', value1: 65, value2: 60 },
  { label: 'Sep', value1: 72, value2: 65 },
  { label: 'Jun', value1: 58, value2: 55 },
  { label: 'Kel', value1: 80, value2: 70 },
  { label: 'Rab', value1: 75, value2: 68 },
  { label: 'Sel', value1: 85, value2: 72 },
  { label: 'Sen', value1: 90, value2: 78 },
];

const topProducts = [
  { rank: 1, name: 'Mie Instan Goreng', units: '128 unit', revenue: 'Rp 1.280.000', change: '+18%' },
  { rank: 2, name: 'Minyak Goreng 2L', units: '86 unit', revenue: 'Rp 1.032.000', change: '+12%' },
  { rank: 3, name: 'Air Mineral 600ml', units: '74 unit', revenue: 'Rp 444.000', change: '+9%' },
  { rank: 4, name: 'Roti Tawar', units: '62 unit', revenue: 'Rp 310.000', change: '+5%' },
  { rank: 5, name: 'Kopi Sachet', units: '56 unit', revenue: 'Rp 280.000', change: '+3%' },
];

const rankColors = ['#4F46E5', '#6366F1', '#818CF8', '#A5B4FC', '#C7D2FE'];

const LaporanScreen = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Period Filters */}
      <View style={styles.filterRow}>
        <View style={styles.leftFilters}>
          <TouchableOpacity style={styles.dateSelector}>
            <i className="fa-regular fa-calendar" style={{ fontSize: 14, color: colors.primary, marginRight: 8 }} />
            <Text style={styles.dateSelectorText}>12-18 Mar 2026</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.refreshButton}>
            <i className="fa-solid fa-rotate" style={{ fontSize: 14, color: colors.textSecondary, marginRight: 6 }} />
            <Text style={styles.refreshText}>Perbarui</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.periodTabs}>
          <TouchableOpacity style={styles.periodTab}>
            <Text style={styles.periodTabText}>7 Hari</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.periodTab}>
            <Text style={styles.periodTabText}>30 Hari</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.periodTab, styles.periodTabActive]}>
            <Text style={[styles.periodTabText, styles.periodTabTextActive]}>Bulan ini</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <StatCard
          title="Penjualan Hari Ini"
          value="Rp 4.250.000"
          subtitle="vs kemarin"
          percentChange="+12.4%"
          percentBadge={true}
          percentUp={true}
        />
        <StatCard
          title="Penjualan Minggu Ini"
          value="Rp 18.920.000"
          subtitle="total penjualan"
          percentChange="+4.8%"
          percentBadge={true}
          percentUp={true}
        />
        <StatCard
          title="Penjualan Bulan Ini"
          value="Rp 68.450.000"
          subtitle="target: Rp 70.000.000"
          percentChange="+6.1%"
          percentBadge={true}
          percentUp={true}
        />
        <StatCard
          title="Rata-rata per Transaksi"
          value="Rp 48.900"
          subtitle="rata-rata per transaksi"
          percentChange="+1.2%"
          percentBadge={true}
          percentUp={true}
        />
      </View>

      {/* Chart + Top Products */}
      <View style={styles.contentRow}>
        {/* Chart */}
        <View style={[styles.chartCard, shadows.sm]}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Grafik Penjualan</Text>
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.chartBlue }]} />
                <Text style={styles.legendText}>Penjualan</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.chartGray }]} />
                <Text style={styles.legendText}>Target</Text>
              </View>
            </View>
          </View>
          <BarChart data={chartData} height={250} />
        </View>

        {/* Top Products */}
        <View style={[styles.topCard, shadows.sm]}>
          <View style={styles.topHeader}>
            <Text style={styles.topTitle}>Produk Terlaris</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          {topProducts.map((p, idx) => (
            <View key={idx} style={[styles.topItem, idx < topProducts.length - 1 && styles.topItemBorder]}>
              <View style={[styles.rankBadge, { backgroundColor: rankColors[idx] || colors.chartGray }]}>
                <Text style={styles.rankText}>{p.rank}</Text>
              </View>
              <View style={styles.topInfo}>
                <Text style={styles.topName}>{p.name}</Text>
                <Text style={styles.topUnits}>{p.units} • {p.revenue}</Text>
              </View>
              <View style={styles.changeBadge}>
                <Text style={styles.changeText}>{p.change}</Text>
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
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  leftFilters: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  dateSelectorText: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: colors.primary,
    fontFamily: fonts.regular,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  refreshText: {
    fontSize: fonts.sizes.base,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },
  periodTabs: {
    flexDirection: 'row',
    gap: spacing.xs,
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 3,
  },
  periodTab: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  periodTabActive: {
    backgroundColor: colors.background,
  },
  periodTabText: {
    fontSize: fonts.sizes.base,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontWeight: fonts.weights.medium,
  },
  periodTabTextActive: {
    color: colors.textPrimary,
    fontWeight: fonts.weights.semibold,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.base,
    marginBottom: spacing.lg,
  },
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
  topCard: {
    flex: 1,
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  topTitle: {
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
  topItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  topItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: '#FFFFFF',
    fontFamily: fonts.regular,
  },
  topInfo: {
    flex: 1,
  },
  topName: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
  },
  topUnits: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
    fontFamily: fonts.regular,
    marginTop: 2,
  },
  changeBadge: {
    backgroundColor: colors.successBg,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: borderRadius.pill,
  },
  changeText: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: colors.success,
    fontFamily: fonts.regular,
  },
});

export default LaporanScreen;
