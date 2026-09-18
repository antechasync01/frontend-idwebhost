import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, fonts, spacing, borderRadius, staffColors } from '../../styles/colors';

const TASK_ICONS = {
  OPNAME: { icon: 'fa-clipboard-check', color: staffColors.taskOpname, bg: staffColors.taskOpnameBg },
  TRANSFER: { icon: 'fa-right-left', color: staffColors.taskTransfer, bg: staffColors.taskTransferBg },
  RECEIVING: { icon: 'fa-truck-ramp-box', color: staffColors.taskReceiving, bg: staffColors.taskReceivingBg },
  COUNTING: { icon: 'fa-calculator', color: staffColors.taskCounting, bg: staffColors.taskCountingBg },
};

const PRIORITY_COLORS = {
  HIGH: { color: colors.danger, bg: colors.dangerBg, label: 'Prioritas Tinggi' },
  MEDIUM: { color: colors.warning, bg: colors.warningBg, label: 'Prioritas Sedang' },
  LOW: { color: colors.textMuted, bg: colors.neutralBg, label: 'Prioritas Rendah' },
};

const STATUS_LABELS = {
  PENDING: { label: 'Menunggu', color: staffColors.taskPending, bg: staffColors.taskPendingBg },
  IN_PROGRESS: { label: 'Dikerjakan', color: staffColors.taskInProgress, bg: staffColors.taskInProgressBg },
  DONE: { label: 'Selesai', color: staffColors.taskDone, bg: staffColors.taskDoneBg },
};

const StaffTaskCard = ({ task, onClaim, onComplete, onPress }) => {
  const taskIcon = TASK_ICONS[task.type] || TASK_ICONS.OPNAME;
  const priority = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.MEDIUM;
  const status = STATUS_LABELS[task.status] || STATUS_LABELS.PENDING;
  const progress = task.items > 0 ? (task.completedItems / task.items) * 100 : 0;

  return (
    <TouchableOpacity
      style={[styles.card, task.status === 'DONE' && styles.cardDone]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Top Row: Icon + Info + Status Badge */}
      <View style={styles.topRow}>
        <View style={[styles.iconBox, { backgroundColor: taskIcon.bg }]}>
          <i className={`fa-solid ${taskIcon.icon}`} style={{ fontSize: 16, color: taskIcon.color }} />
        </View>

        <View style={styles.infoCol}>
          <Text style={[styles.title, task.status === 'DONE' && styles.titleDone]} numberOfLines={1}>
            {task.title}
          </Text>
          <View style={styles.metaRow}>
            <i className="fa-solid fa-location-dot" style={{ fontSize: 10, color: colors.textMuted, marginRight: 3 }} />
            <Text style={styles.metaText}>{task.location}</Text>
            <Text style={styles.metaSep}>•</Text>
            <i className="fa-regular fa-clock" style={{ fontSize: 10, color: colors.textMuted, marginRight: 3 }} />
            <Text style={styles.metaText}>{task.deadline}</Text>
          </View>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
          <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
        </View>
      </View>

      {/* Description */}
      <Text style={styles.description} numberOfLines={2}>{task.description}</Text>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progress}%`,
                backgroundColor: task.status === 'DONE' ? staffColors.taskDone : colors.primary,
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>{task.completedItems}/{task.items} item</Text>
      </View>

      {/* Bottom Row: Priority + Action */}
      <View style={styles.bottomRow}>
        <View style={[styles.priorityBadge, { backgroundColor: priority.bg }]}>
          <View style={[styles.priorityDot, { backgroundColor: priority.color }]} />
          <Text style={[styles.priorityText, { color: priority.color }]}>{priority.label}</Text>
        </View>

        {task.status === 'PENDING' && onClaim && (
          <TouchableOpacity style={styles.btnClaim} onPress={() => onClaim(task.id)} activeOpacity={0.8}>
            <i className="fa-solid fa-hand" style={{ fontSize: 11, color: '#FFFFFF', marginRight: 4 }} />
            <Text style={styles.btnClaimText}>Ambil Tugas</Text>
          </TouchableOpacity>
        )}
        {task.status === 'IN_PROGRESS' && onComplete && (
          <TouchableOpacity style={styles.btnComplete} onPress={() => onComplete(task.id)} activeOpacity={0.8}>
            <i className="fa-solid fa-check" style={{ fontSize: 11, color: '#FFFFFF', marginRight: 4 }} />
            <Text style={styles.btnCompleteText}>Selesai</Text>
          </TouchableOpacity>
        )}
        {task.status === 'DONE' && (
          <View style={styles.doneLabel}>
            <i className="fa-solid fa-circle-check" style={{ fontSize: 13, color: staffColors.taskDone, marginRight: 4 }} />
            <Text style={styles.doneLabelText}>Selesai</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  },
  cardDone: {
    opacity: 0.7,
    borderColor: staffColors.taskDoneBg,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  infoCol: {
    flex: 1,
  },
  title: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  metaText: {
    fontSize: 10,
    color: colors.textMuted,
  },
  metaSep: {
    fontSize: 10,
    color: colors.borderDark,
    marginHorizontal: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.pill,
    flexShrink: 0,
  },
  statusText: {
    fontSize: 9,
    fontWeight: fonts.weights.bold,
  },
  description: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.neutralBg,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: 10,
    fontWeight: fonts.weights.bold,
    color: colors.textMuted,
    flexShrink: 0,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.pill,
    gap: 4,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  priorityText: {
    fontSize: 9,
    fontWeight: fonts.weights.bold,
  },
  btnClaim: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: borderRadius.md,
  },
  btnClaimText: {
    color: '#FFFFFF',
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold,
  },
  btnComplete: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    backgroundImage: 'linear-gradient(135deg, #10B981, #059669)',
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: borderRadius.md,
  },
  btnCompleteText: {
    color: '#FFFFFF',
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold,
  },
  doneLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doneLabelText: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold,
    color: staffColors.taskDone,
  },
});

export default StaffTaskCard;
