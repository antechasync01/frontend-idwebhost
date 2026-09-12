import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing, borderRadius, shadows } from '../styles/colors';

const StatCard = ({
  title,
  value,
  subtitle,
  percentChange,
  percentUp = true,
  critical = false,
  percentBadge = false,
}) => {
  return (
    <View
      style={[
        styles.container,
        critical && styles.containerCritical,
        !critical && shadows.sm,
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {critical && (
          <View style={styles.criticalBadge}>
            <Text style={styles.criticalBadgeText}>CRITICAL</Text>
          </View>
        )}
        {percentBadge && percentChange && (
          <View style={[styles.percentBadge, { backgroundColor: percentUp ? colors.successBg : colors.dangerBg }]}>
            <Text style={[styles.percentBadgeText, { color: percentUp ? colors.success : colors.danger }]}>
              {percentUp ? '+' : ''}{percentChange}
            </Text>
          </View>
        )}
      </View>
      <Text style={[styles.value, critical && styles.valueCritical]}>{value}</Text>
      {subtitle && (
        <Text style={styles.subtitle}>{subtitle}</Text>
      )}
      {percentChange && !percentBadge && (
        <View style={styles.percentRow}>
          <Text style={[styles.percentText, { color: percentUp ? colors.success : colors.danger }]}>
            {percentUp ? '▲' : '▼'} {percentChange}
          </Text>
          <Text style={styles.percentLabel}> vs kemarin</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    flex: 1,
    minWidth: 200,
  },
  containerCritical: {
    borderColor: colors.danger,
    borderWidth: 1.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.medium,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },
  criticalBadge: {
    backgroundColor: colors.danger,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  criticalBadgeText: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold,
    color: '#FFFFFF',
    fontFamily: fonts.regular,
    letterSpacing: 0.5,
  },
  percentBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: borderRadius.pill,
  },
  percentBadgeText: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.semibold,
    fontFamily: fonts.regular,
  },
  value: {
    fontSize: fonts.sizes.xxxl,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
    marginBottom: spacing.xs,
  },
  valueCritical: {
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
    fontFamily: fonts.regular,
  },
  percentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  percentText: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.semibold,
    fontFamily: fonts.regular,
  },
  percentLabel: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
    fontFamily: fonts.regular,
  },
});

export default StatCard;
