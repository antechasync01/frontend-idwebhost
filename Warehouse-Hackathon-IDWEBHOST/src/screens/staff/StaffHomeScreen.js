import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors, fonts, spacing, borderRadius, staffColors } from '../../styles/colors';
import { useWarehouse } from '../../context/WarehouseContext';
import StaffTaskCard from '../../components/staff/StaffTaskCard';

const StaffHomeScreen = ({ onNavigate }) => {
  const {
    currentUser,
    shiftInfo,
    staffTasks,
    staffActivityLog,
    products,
    handleClockIn,
    handleClockOut,
    handleClaimTask,
    handleCompleteTask,
  } = useWarehouse();

  const pendingTasks = staffTasks.filter((t) => t.status === 'PENDING');
  const inProgressTasks = staffTasks.filter((t) => t.status === 'IN_PROGRESS');
  const doneTasks = staffTasks.filter((t) => t.status === 'DONE');
  const lowStockProducts = products.filter((p) => p.status === 'STOK MENIPIS' || p.status === 'HABIS');
  const totalScanned = staffActivityLog.filter((a) => a.type !== 'CLOCK').length;

  const getTimeElapsed = () => {
    if (!shiftInfo.isClockedIn || !shiftInfo.clockInTime) return '0j 0m';
    const now = new Date();
    const clockIn = new Date(shiftInfo.clockInTime);
    const diff = (now - clockIn) / 1000 / 60;
    const hours = Math.floor(diff / 60);
    const mins = Math.floor(diff % 60);
    return `${hours}j ${mins}m`;
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'TRANSFER': return { icon: 'fa-right-left', color: staffColors.taskTransfer, bg: staffColors.taskTransferBg };
      case 'OPNAME': return { icon: 'fa-clipboard-check', color: staffColors.taskOpname, bg: staffColors.taskOpnameBg };
      case 'RECEIVING': return { icon: 'fa-truck-ramp-box', color: staffColors.taskReceiving, bg: staffColors.taskReceivingBg };
      case 'COUNTING': return { icon: 'fa-calculator', color: staffColors.taskCounting, bg: staffColors.taskCountingBg };
      case 'CLOCK': return { icon: 'fa-clock', color: '#6B7280', bg: '#F3F4F6' };
      default: return { icon: 'fa-circle', color: colors.textMuted, bg: colors.neutralBg };
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Greeting Banner with Gradient */}
      <View style={styles.greetingCard}>
        <View style={styles.greetingCircle1} />
        <View style={styles.greetingCircle2} />
        <View style={styles.greetingContent}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greetingTime}>
              {new Date().getHours() < 12 ? 'Selamat Pagi' : new Date().getHours() < 17 ? 'Selamat Siang' : 'Selamat Sore'} 👋
            </Text>
            <Text style={styles.greetingName}>{currentUser?.name || 'Staff'}</Text>
            <Text style={styles.greetingArea}>{currentUser?.area || 'Gudang Utama'}</Text>
          </View>
          <View style={styles.greetingRight}>
            <View style={styles.avatarLg}>
              <Text style={styles.avatarLgText}>{currentUser?.avatar || 'AW'}</Text>
            </View>
          </View>
        </View>

        {/* Shift Clock Button */}
        <View style={styles.shiftRow}>
          {shiftInfo.isClockedIn ? (
            <>
              <View style={styles.shiftActiveIndicator}>
                <View style={styles.shiftPulse} />
                <Text style={styles.shiftActiveText}>On Shift • {getTimeElapsed()}</Text>
              </View>
              <TouchableOpacity style={styles.btnClockOut} onPress={handleClockOut} activeOpacity={0.8}>
                <i className="fa-solid fa-right-from-bracket" style={{ fontSize: 12, color: '#FFFFFF', marginRight: 5 }} />
                <Text style={styles.btnClockOutText}>Clock Out</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.btnClockIn} onPress={handleClockIn} activeOpacity={0.8}>
              <i className="fa-solid fa-play" style={{ fontSize: 12, color: '#FFFFFF', marginRight: 6 }} />
              <Text style={styles.btnClockInText}>Clock In — Mulai Shift</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Quick Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <View style={[styles.statIconBox, { backgroundColor: staffColors.taskDoneBg }]}>
            <i className="fa-solid fa-check-double" style={{ fontSize: 14, color: staffColors.taskDone }} />
          </View>
          <Text style={styles.statValue}>{doneTasks.length}</Text>
          <Text style={styles.statLabel}>Selesai</Text>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statIconBox, { backgroundColor: staffColors.taskInProgressBg }]}>
            <i className="fa-solid fa-spinner" style={{ fontSize: 14, color: staffColors.taskInProgress }} />
          </View>
          <Text style={styles.statValue}>{inProgressTasks.length}</Text>
          <Text style={styles.statLabel}>Aktif</Text>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statIconBox, { backgroundColor: staffColors.taskPendingBg }]}>
            <i className="fa-solid fa-hourglass-half" style={{ fontSize: 14, color: staffColors.taskPending }} />
          </View>
          <Text style={styles.statValue}>{pendingTasks.length}</Text>
          <Text style={styles.statLabel}>Menunggu</Text>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statIconBox, { backgroundColor: colors.dangerBg }]}>
            <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: 14, color: colors.danger }} />
          </View>
          <Text style={styles.statValue}>{lowStockProducts.length}</Text>
          <Text style={styles.statLabel}>Kritis</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Aksi Cepat</Text>
      <View style={styles.quickActionGrid}>
        <TouchableOpacity style={styles.quickActionCard} onPress={() => onNavigate('staff-scan')} activeOpacity={0.8}>
          <View style={[styles.qaIcon, { backgroundColor: '#4F46E5', backgroundImage: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }]}>
            <i className="fa-solid fa-qrcode" style={{ fontSize: 20, color: '#FFFFFF' }} />
          </View>
          <Text style={styles.qaTitle}>Scan Barcode</Text>
          <Text style={styles.qaDesc}>Cek produk cepat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickActionCard} onPress={() => onNavigate('staff-opname')} activeOpacity={0.8}>
          <View style={[styles.qaIcon, { backgroundColor: '#D97706', backgroundImage: 'linear-gradient(135deg, #D97706, #F59E0B)' }]}>
            <i className="fa-solid fa-clipboard-check" style={{ fontSize: 20, color: '#FFFFFF' }} />
          </View>
          <Text style={styles.qaTitle}>Opname</Text>
          <Text style={styles.qaDesc}>Hitung fisik stok</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickActionCard} onPress={() => onNavigate('staff-tasks')} activeOpacity={0.8}>
          <View style={[styles.qaIcon, { backgroundColor: '#059669', backgroundImage: 'linear-gradient(135deg, #059669, #10B981)' }]}>
            <i className="fa-solid fa-clipboard-list" style={{ fontSize: 20, color: '#FFFFFF' }} />
          </View>
          <Text style={styles.qaTitle}>Tugas</Text>
          <Text style={styles.qaDesc}>{pendingTasks.length} menunggu</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickActionCard} onPress={() => onNavigate('staff-profile')} activeOpacity={0.8}>
          <View style={[styles.qaIcon, { backgroundColor: '#6366F1', backgroundImage: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }]}>
            <i className="fa-solid fa-user-clock" style={{ fontSize: 20, color: '#FFFFFF' }} />
          </View>
          <Text style={styles.qaTitle}>Shift Saya</Text>
          <Text style={styles.qaDesc}>{shiftInfo.isClockedIn ? 'Aktif' : 'Offline'}</Text>
        </TouchableOpacity>
      </View>

      {/* Priority Tasks */}
      {pendingTasks.filter((t) => t.priority === 'HIGH').length > 0 && (
        <>
          <Text style={styles.sectionTitle}>
            <i className="fa-solid fa-fire" style={{ color: colors.danger, marginRight: 6 }} />
            Tugas Prioritas Tinggi
          </Text>
          <View style={styles.tasksList}>
            {pendingTasks
              .filter((t) => t.priority === 'HIGH')
              .map((task) => (
                <StaffTaskCard
                  key={task.id}
                  task={task}
                  onClaim={handleClaimTask}
                  onComplete={handleCompleteTask}
                />
              ))}
          </View>
        </>
      )}

      {/* Recent Activity Timeline */}
      <Text style={styles.sectionTitle}>Aktivitas Terbaru</Text>
      <View style={styles.activityCard}>
        {staffActivityLog.slice(0, 5).map((act) => {
          const actIcon = getActivityIcon(act.type);
          return (
            <View key={act.id} style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: actIcon.bg }]}>
                <i className={`fa-solid ${actIcon.icon}`} style={{ fontSize: 10, color: actIcon.color }} />
              </View>
              <View style={styles.activityLine} />
              <View style={{ flex: 1 }}>
                <Text style={styles.activityText}>{act.action}</Text>
                <Text style={styles.activityTime}>{act.time}</Text>
              </View>
            </View>
          );
        })}
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
  greetingCard: {
    backgroundColor: '#4F46E5',
    backgroundImage: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 40%, #8B5CF6 100%)',
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.base,
    overflow: 'hidden',
    position: 'relative',
  },
  greetingCircle1: {
    position: 'absolute',
    top: -30,
    right: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  greetingCircle2: {
    position: 'absolute',
    bottom: -20,
    left: -10,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  greetingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  greetingTime: {
    fontSize: fonts.sizes.sm,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: fonts.weights.medium,
  },
  greetingName: {
    fontSize: fonts.sizes.xxl,
    fontWeight: fonts.weights.extrabold,
    color: '#FFFFFF',
    marginTop: 2,
  },
  greetingArea: {
    fontSize: fonts.sizes.xs,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  greetingRight: {
    flexShrink: 0,
  },
  avatarLg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarLgText: {
    fontSize: 18,
    fontWeight: fonts.weights.bold,
    color: '#FFFFFF',
  },
  shiftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    zIndex: 2,
  },
  shiftActiveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  shiftPulse: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#34D399',
    boxShadow: '0 0 8px rgba(52, 211, 153, 0.8)',
  },
  shiftActiveText: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold,
    color: '#FFFFFF',
  },
  btnClockOut: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  btnClockOutText: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold,
    color: '#FFFFFF',
  },
  btnClockIn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  btnClockInText: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: '#FFFFFF',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  statIconBox: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.extrabold,
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: fonts.weights.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  quickActionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  quickActionCard: {
    width: 'calc(50% - 4px)',
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
  },
  qaIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  qaTitle: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
  },
  qaDesc: {
    fontSize: fonts.sizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  tasksList: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.base,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    position: 'relative',
  },
  activityDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    zIndex: 2,
  },
  activityLine: {
    position: 'absolute',
    left: 12,
    top: 30,
    bottom: -8,
    width: 2,
    backgroundColor: colors.borderLight,
    zIndex: 1,
  },
  activityText: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.medium,
    color: colors.textPrimary,
  },
  activityTime: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 1,
  },
});

export default StaffHomeScreen;
