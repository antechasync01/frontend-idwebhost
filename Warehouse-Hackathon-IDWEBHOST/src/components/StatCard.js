import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, fonts, spacing, borderRadius, shadows } from '../styles/colors';
import { useResponsive } from '../context/ResponsiveContext';

const StatCard = ({
  title,
  value,
  subtitle,
  badgeText,
  badgeType = 'neutral', // 'success', 'warning', 'danger', 'info', 'neutral'
  icon,
  iconColor = colors.primary,
  iconBg = colors.primaryLight,
  onPress,
}) => {
  const { isMobile } = useResponsive();

  const getBadgeStyle = () => {
    switch (badgeType) {
      case 'success':
        return { bg: colors.successBg, text: colors.success };
      case 'warning':
        return { bg: colors.warningBg, text: colors.warning };
      case 'danger':
        return { bg: colors.dangerBg, text: colors.danger };
      case 'info':
        return { bg: colors.infoBg, text: colors.info };
      default:
        return { bg: colors.neutralBg, text: colors.neutral };
    }
  };

  const badgeStyle = getBadgeStyle();

  return (
    <TouchableOpacity
      style={[styles.card, isMobile && styles.cardMobile]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={styles.topRow}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
          <i className={`fa-solid ${icon}`} style={{ fontSize: 14, color: iconColor }} />
        </View>
      </View>

      <Text style={[styles.value, isMobile && styles.valueMobile]} numberOfLines={1}>
        {value}
      </Text>

      <View style={styles.bottomRow}>
        {badgeText && (
          <View style={[styles.badge, { backgroundColor: badgeStyle.bg }]}>
            <Text style={[styles.badgeText, { color: badgeStyle.text }]}>{badgeText}</Text>
          </View>
        )}
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    flex: 1,
    minWidth: 200,
    boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
  },
  cardMobile: {
    minWidth: '100%',
    padding: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.semibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: fonts.sizes.xxl,
    fontWeight: fonts.weights.extrabold,
    color: colors.textPrimary,
    fontFamily: fonts.family,
    marginVertical: 4,
    letterSpacing: -0.5,
  },
  valueMobile: {
    fontSize: fonts.sizes.xl,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xxs,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: fonts.weights.bold,
  },
  subtitle: {
    fontSize: fonts.sizes.xs,
    color: colors.textMuted,
    flex: 1,
  },
});

export default StatCard;
