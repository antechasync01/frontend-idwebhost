import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors, fonts, spacing, borderRadius, staffColors } from '../../styles/colors';
import { useWarehouse } from '../../context/WarehouseContext';
import StaffTaskCard from '../../components/staff/StaffTaskCard';

const FILTER_TABS = [
  { key: 'all', label: 'Semua' },
  { key: 'pending', label: 'Menunggu' },
  { key: 'in_progress', label: 'Aktif' },
  { key: 'done', label: 'Selesai' },
];

const StaffTasksScreen = () => {
  const { staffTasks, handleClaimTask, handleCompleteTask } = useWarehouse();
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredTasks = staffTasks.filter((t) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'pending') return t.status === 'PENDING';
    if (activeFilter === 'in_progress') return t.status === 'IN_PROGRESS';
    if (activeFilter === 'done') return t.status === 'DONE';
    return true;
  });

  const pendingCount = staffTasks.filter((t) => t.status === 'PENDING').length;
  const activeCount = staffTasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const doneCount = staffTasks.filter((t) => t.status === 'DONE').length;

  const getCountForTab = (key) => {
    switch (key) {
      case 'all': return staffTasks.length;
      case 'pending': return pendingCount;
      case 'in_progress': return activeCount;
      case 'done': return doneCount;
      default: return 0;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Summary Stats */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { borderLeftColor: staffColors.taskPending }]}>
          <Text style={styles.summaryValue}>{pendingCount}</Text>
          <Text style={styles.summaryLabel}>Menunggu</Text>
        </View>
        <View style={[styles.summaryCard, { borderLeftColor: staffColors.taskInProgress }]}>
          <Text style={styles.summaryValue}>{activeCount}</Text>
          <Text style={styles.summaryLabel}>Dikerjakan</Text>
        </View>
        <View style={[styles.summaryCard, { borderLeftColor: staffColors.taskDone }]}>
          <Text style={styles.summaryValue}>{doneCount}</Text>
          <Text style={styles.summaryLabel}>Selesai</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {FILTER_TABS.map((tab) => {
          const isActive = activeFilter === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.filterTab, isActive && styles.filterTabActive]}
              onPress={() => setActiveFilter(tab.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterTabText, isActive && styles.filterTabTextActive]}>
                {tab.label}
              </Text>
              <View style={[styles.filterBadge, isActive && styles.filterBadgeActive]}>
                <Text style={[styles.filterBadgeText, isActive && styles.filterBadgeTextActive]}>
                  {getCountForTab(tab.key)}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Task List */}
      <View style={styles.tasksList}>
        {filteredTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <i className="fa-solid fa-clipboard-check" style={{ fontSize: 36, color: colors.borderDark, marginBottom: 12 }} />
            <Text style={styles.emptyTitle}>Tidak ada tugas</Text>
            <Text style={styles.emptyDesc}>
              {activeFilter === 'done' ? 'Belum ada tugas yang diselesaikan.' : 'Semua tugas sudah ditangani. Kerja bagus! 🎉'}
            </Text>
          </View>
        ) : (
          filteredTasks.map((task) => (
            <StaffTaskCard
              key={task.id}
              task={task}
              onClaim={handleClaimTask}
              onComplete={handleCompleteTask}
            />
          ))
        )}
      </View>

      {/* Bottom spacer */}
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
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.base,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 3,
  },
  summaryValue: {
    fontSize: fonts.sizes.xxl,
    fontWeight: fonts.weights.extrabold,
    color: colors.textPrimary,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: fonts.weights.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  filterRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: 4,
    marginBottom: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  filterTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    gap: 4,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
  },
  filterTabText: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.semibold,
    color: colors.textSecondary,
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  filterBadge: {
    backgroundColor: colors.neutralBg,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: borderRadius.pill,
  },
  filterBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  filterBadgeText: {
    fontSize: 9,
    fontWeight: fonts.weights.bold,
    color: colors.textMuted,
  },
  filterBadgeTextActive: {
    color: '#FFFFFF',
  },
  tasksList: {
    gap: spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyTitle: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.bold,
    color: colors.textSecondary,
  },
  emptyDesc: {
    fontSize: fonts.sizes.xs,
    color: colors.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default StaffTasksScreen;
