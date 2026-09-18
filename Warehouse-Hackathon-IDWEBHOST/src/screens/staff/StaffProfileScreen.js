import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors, fonts, spacing, borderRadius, staffColors } from '../../styles/colors';
import { useWarehouse } from '../../context/WarehouseContext';

const StaffProfileScreen = () => {
  const {
    currentUser,
    shiftInfo,
    staffActivityLog,
    staffTasks,
    scanHistory,
    handleClockIn,
    handleClockOut,
    handleLogout,
  } = useWarehouse();

  const doneTasks = staffTasks.filter((t) => t.status === 'DONE').length;
  const totalTasks = staffTasks.length;

  const getTimeElapsed = () => {
    if (!shiftInfo.clockInTime) return '-';
    const clockIn = new Date(shiftInfo.clockInTime);
    const end = shiftInfo.clockOutTime ? new Date(shiftInfo.clockOutTime) : new Date();
    const diff = (end - clockIn) / 1000 / 60;
    const hours = Math.floor(diff / 60);
    const mins = Math.floor(diff % 60);
    return `${hours}j ${mins}m`;
  };

  const getClockInTime = () => {
    if (!shiftInfo.clockInTime) return '--:--';
    return new Date(shiftInfo.clockInTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  const getClockOutTime = () => {
    if (!shiftInfo.clockOutTime) return '--:--';
    return new Date(shiftInfo.clockOutTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
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
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.headerDecor1} />
        <View style={styles.headerDecor2} />
        <View style={styles.avatarSection}>
          <View style={styles.avatarBig}>
            <Text style={styles.avatarBigText}>{currentUser?.avatar || 'AW'}</Text>
          </View>
          <Text style={styles.userName}>{currentUser?.name || 'Staff'}</Text>
          <Text style={styles.userId}>{currentUser?.id || 'EMP-000'}</Text>
          <View style={styles.roleBadge}>
            <i className="fa-solid fa-user-gear" style={{ fontSize: 10, color: colors.primary, marginRight: 4 }} />
            <Text style={styles.roleBadgeText}>Staff Operasional</Text>
          </View>
        </View>
      </View>

      {/* Shift Card */}
      <View style={styles.shiftCard}>
        <View style={styles.shiftCardHeader}>
          <i className="fa-solid fa-business-time" style={{ fontSize: 16, color: colors.primary, marginRight: 8 }} />
          <Text style={styles.shiftCardTitle}>Status Shift Hari Ini</Text>
          <View style={[
            styles.shiftStatusPill,
            { backgroundColor: shiftInfo.isClockedIn ? staffColors.shiftActiveBg : staffColors.shiftEndedBg }
          ]}>
            <View style={[
              styles.shiftStatusDot,
              { backgroundColor: shiftInfo.isClockedIn ? staffColors.shiftActive : staffColors.shiftEnded }
            ]} />
            <Text style={[
              styles.shiftStatusText,
              { color: shiftInfo.isClockedIn ? staffColors.shiftActive : staffColors.shiftEnded }
            ]}>
              {shiftInfo.isClockedIn ? 'Aktif' : shiftInfo.clockOutTime ? 'Selesai' : 'Offline'}
            </Text>
          </View>
        </View>

        <View style={styles.shiftInfoGrid}>
          <View style={styles.shiftInfoItem}>
            <i className="fa-solid fa-right-to-bracket" style={{ fontSize: 14, color: colors.success, marginBottom: 4 }} />
            <Text style={styles.shiftInfoLabel}>Clock In</Text>
            <Text style={styles.shiftInfoValue}>{getClockInTime()}</Text>
          </View>
          <View style={styles.shiftInfoDivider} />
          <View style={styles.shiftInfoItem}>
            <i className="fa-solid fa-right-from-bracket" style={{ fontSize: 14, color: colors.danger, marginBottom: 4 }} />
            <Text style={styles.shiftInfoLabel}>Clock Out</Text>
            <Text style={styles.shiftInfoValue}>{getClockOutTime()}</Text>
          </View>
          <View style={styles.shiftInfoDivider} />
          <View style={styles.shiftInfoItem}>
            <i className="fa-solid fa-hourglass-half" style={{ fontSize: 14, color: colors.primary, marginBottom: 4 }} />
            <Text style={styles.shiftInfoLabel}>Durasi</Text>
            <Text style={styles.shiftInfoValue}>{getTimeElapsed()}</Text>
          </View>
        </View>

        {/* Clock Button */}
        {shiftInfo.isClockedIn ? (
          <TouchableOpacity style={styles.btnClockOut} onPress={handleClockOut} activeOpacity={0.8}>
            <i className="fa-solid fa-right-from-bracket" style={{ fontSize: 14, color: '#FFFFFF', marginRight: 6 }} />
            <Text style={styles.btnClockOutText}>Clock Out — Akhiri Shift</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.btnClockIn} onPress={handleClockIn} activeOpacity={0.8}>
            <i className="fa-solid fa-play" style={{ fontSize: 14, color: '#FFFFFF', marginRight: 6 }} />
            <Text style={styles.btnClockInText}>Clock In — Mulai Shift</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Today's Performance Stats */}
      <Text style={styles.sectionTitle}>Performa Hari Ini</Text>
      <View style={styles.perfGrid}>
        <View style={styles.perfCard}>
          <View style={[styles.perfIcon, { backgroundColor: staffColors.taskDoneBg }]}>
            <i className="fa-solid fa-check-double" style={{ fontSize: 16, color: staffColors.taskDone }} />
          </View>
          <Text style={styles.perfValue}>{doneTasks}/{totalTasks}</Text>
          <Text style={styles.perfLabel}>Tugas Selesai</Text>
        </View>
        <View style={styles.perfCard}>
          <View style={[styles.perfIcon, { backgroundColor: colors.primaryLight }]}>
            <i className="fa-solid fa-barcode" style={{ fontSize: 16, color: colors.primary }} />
          </View>
          <Text style={styles.perfValue}>{scanHistory.length}</Text>
          <Text style={styles.perfLabel}>Produk Discan</Text>
        </View>
      </View>

      {/* Info Card */}
      <Text style={styles.sectionTitle}>Informasi Staff</Text>
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <i className="fa-solid fa-building" style={{ fontSize: 13, color: colors.textMuted, width: 20 }} />
          <Text style={styles.infoLabel}>Area Kerja</Text>
          <Text style={styles.infoValue}>{currentUser?.area || 'Gudang Utama (G-01)'}</Text>
        </View>
        <View style={styles.infoRow}>
          <i className="fa-solid fa-shield-halved" style={{ fontSize: 13, color: colors.textMuted, width: 20 }} />
          <Text style={styles.infoLabel}>Role</Text>
          <Text style={styles.infoValue}>Warehouse Staff</Text>
        </View>
        <View style={styles.infoRow}>
          <i className="fa-solid fa-calendar" style={{ fontSize: 13, color: colors.textMuted, width: 20 }} />
          <Text style={styles.infoLabel}>Tanggal</Text>
          <Text style={styles.infoValue}>{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</Text>
        </View>
      </View>

      {/* Activity Log */}
      <Text style={styles.sectionTitle}>Riwayat Aktivitas</Text>
      <View style={styles.activityCard}>
        {staffActivityLog.slice(0, 8).map((act) => {
          const actIcon = getActivityIcon(act.type);
          return (
            <View key={act.id} style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: actIcon.bg }]}>
                <i className={`fa-solid ${actIcon.icon}`} style={{ fontSize: 10, color: actIcon.color }} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.activityText}>{act.action}</Text>
                <Text style={styles.activityTime}>{act.time}</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.btnLogout} onPress={handleLogout} activeOpacity={0.8}>
        <i className="fa-solid fa-arrow-right-from-bracket" style={{ fontSize: 14, color: colors.danger, marginRight: 8 }} />
        <Text style={styles.btnLogoutText}>Keluar dari Sistem</Text>
      </TouchableOpacity>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  profileHeader: {
    backgroundColor: '#4F46E5',
    backgroundImage: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 40%, #8B5CF6 100%)',
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    marginBottom: -spacing.lg,
  },
  headerDecor1: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  headerDecor2: {
    position: 'absolute',
    bottom: -20,
    left: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  avatarSection: {
    alignItems: 'center',
    zIndex: 2,
  },
  avatarBig: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
    marginBottom: spacing.sm,
  },
  avatarBigText: {
    fontSize: 24,
    fontWeight: fonts.weights.bold,
    color: '#FFFFFF',
  },
  userName: {
    fontSize: fonts.sizes.xxl,
    fontWeight: fonts.weights.extrabold,
    color: '#FFFFFF',
  },
  userId: {
    fontSize: fonts.sizes.sm,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: fonts.mono,
    marginTop: 2,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: borderRadius.pill,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  roleBadgeText: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold,
    color: '#FFFFFF',
  },
  shiftCard: {
    marginHorizontal: spacing.base,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
    marginBottom: spacing.lg,
    zIndex: 5,
  },
  shiftCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  shiftCardTitle: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
    flex: 1,
  },
  shiftStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.pill,
    gap: 5,
  },
  shiftStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  shiftStatusText: {
    fontSize: 10,
    fontWeight: fonts.weights.bold,
  },
  shiftInfoGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.base,
  },
  shiftInfoItem: {
    flex: 1,
    alignItems: 'center',
  },
  shiftInfoDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  shiftInfoLabel: {
    fontSize: 9,
    fontWeight: fonts.weights.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  shiftInfoValue: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.extrabold,
    color: colors.textPrimary,
    fontFamily: fonts.mono,
    marginTop: 2,
  },
  btnClockIn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    backgroundImage: 'linear-gradient(135deg, #10B981, #059669)',
    paddingVertical: 14,
    borderRadius: borderRadius.lg,
  },
  btnClockInText: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.bold,
    color: '#FFFFFF',
  },
  btnClockOut: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    backgroundImage: 'linear-gradient(135deg, #EF4444, #DC2626)',
    paddingVertical: 14,
    borderRadius: borderRadius.lg,
  },
  btnClockOutText: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.bold,
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.base,
  },
  perfGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.base,
    marginBottom: spacing.lg,
  },
  perfCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  perfIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  perfValue: {
    fontSize: fonts.sizes.xxl,
    fontWeight: fonts.weights.extrabold,
    color: colors.textPrimary,
  },
  perfLabel: {
    fontSize: 10,
    fontWeight: fonts.weights.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  infoCard: {
    marginHorizontal: spacing.base,
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  infoLabel: {
    fontSize: fonts.sizes.xs,
    color: colors.textMuted,
    width: 80,
  },
  infoValue: {
    flex: 1,
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
  },
  activityCard: {
    marginHorizontal: spacing.base,
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  activityDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
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
  btnLogout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.base,
    paddingVertical: 14,
    backgroundColor: colors.dangerBg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    marginBottom: spacing.base,
  },
  btnLogoutText: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: colors.danger,
  },
});

export default StaffProfileScreen;
