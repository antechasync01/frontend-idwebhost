// Design tokens extracted from AURA Smart Operations design reference
export const colors = {
  // Primary
  primary: '#4F46E5',
  primaryLight: '#EEF2FF',
  primaryDark: '#3730A3',

  // Backgrounds
  background: '#F8F9FA',
  cardBg: '#FFFFFF',
  sidebarBg: '#FFFFFF',

  // Text
  textPrimary: '#1A1A2E',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',

  // Status
  success: '#22C55E',
  successBg: '#DCFCE7',
  danger: '#EF4444',
  dangerBg: '#FEE2E2',
  warning: '#F59E0B',
  warningBg: '#FEF3C7',
  info: '#3B82F6',
  infoBg: '#DBEAFE',

  // Borders
  border: '#E5E7EB',
  borderLight: '#F3F4F6',

  // Specific
  sidebarActive: '#4F46E5',
  sidebarActiveBar: '#4F46E5',
  badgeNew: '#22C55E',
  badgeCritical: '#EF4444',
  badgeCount: '#EF4444',

  // Chart
  chartBlue: '#4F46E5',
  chartGray: '#D1D5DB',

  // Alert AI
  alertAiBg: '#FEF3C7',
  alertAiBorder: '#F59E0B',
  alertAiText: '#92400E',
};

export const fonts = {
  regular: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  sizes: {
    xs: 11,
    sm: 12,
    md: 13,
    base: 14,
    lg: 16,
    xl: 18,
    xxl: 22,
    xxxl: 28,
    display: 32,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  pill: 20,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
};

export const layout = {
  sidebarWidth: 240,
  topBarHeight: 64,
};
