// AURA Design Tokens - Warehouse & Inventory Management
export const colors = {
  // Brand & Primary
  primary: '#4F46E5',
  primaryLight: '#EEF2FF',
  primaryDark: '#3730A3',
  primaryHover: '#4338CA',

  // Backgrounds & Surfaces
  background: '#F8FAFC',
  cardBg: '#FFFFFF',
  sidebarBg: '#FFFFFF',
  sidebarActiveBg: '#EEF2FF',
  overlayBg: 'rgba(15, 23, 42, 0.65)',

  // Typography
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textLight: '#F8FAFC',

  // Operational Status Colors (Grounded & WCAG AAA Compliant)
  success: '#15803D',
  successBg: '#DCFCE7',
  successBorder: '#86EFAC',
  
  warning: '#B45309',
  warningBg: '#FEF3C7',
  warningBorder: '#FDE68A',
  
  danger: '#B91C1C',
  dangerBg: '#FEE2E2',
  dangerBorder: '#FCA5A5',
  
  info: '#1D4ED8',
  infoBg: '#DBEAFE',
  infoBorder: '#93C5FD',
  
  neutral: '#475569',
  neutralBg: '#F1F5F9',
  neutralBorder: '#CBD5E1',

  // Borders & Dividers
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  borderDark: '#CBD5E1',

  // Badges
  badgeCritical: '#B91C1C',
  badgeWarning: '#B45309',
  badgeSuccess: '#15803D',
  badgeInfo: '#1D4ED8',

  // Warehouse Movement Badges
  movementMasuk: '#15803D',
  movementMasukBg: '#DCFCE7',
  movementKeluar: '#B91C1C',
  movementKeluarBg: '#FEE2E2',
  movementTransfer: '#4F46E5',
  movementTransferBg: '#EEF2FF',
  movementOpname: '#D97706',
  movementOpnameBg: '#FEF3C7',
};

export const breakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
};

export const fonts = {
  family: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  mono: "'JetBrains Mono', monospace",
  sizes: {
    xs: 11,
    sm: 12,
    md: 13,
    base: 14,
    lg: 16,
    xl: 18,
    xxl: 22,
    xxxl: 26,
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
  xxs: 2,
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
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  pill: 9999,
};

export const shadows = {
  xs: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 1,
    elevation: 1,
  },
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  drawer: {
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
};

export const layout = {
  sidebarWidth: 240,
  sidebarCollapsedWidth: 72,
  topBarHeight: 64,
  mobileTopBarHeight: 56,
  bottomNavHeight: 64,
  staffTopBarHeight: 56,
  staffBottomNavHeight: 64,
};

export const staffColors = {
  // Tasks by Status
  taskPending: '#F59E0B',
  taskPendingBg: '#FEF3C7',
  taskInProgress: '#3B82F6',
  taskInProgressBg: '#DBEAFE',
  taskDone: '#10B981',
  taskDoneBg: '#D1FAE5',

  // Tasks by Category
  taskTransfer: '#4F46E5',
  taskTransferBg: '#EEF2FF',
  taskOpname: '#D97706',
  taskOpnameBg: '#FEF3C7',
  taskReceiving: '#0284C7',
  taskReceivingBg: '#E0F2FE',
  taskCounting: '#7C3AED',
  taskCountingBg: '#EDE9FE',

  // Shifts
  shiftActive: '#10B981',
  shiftActiveBg: '#DCFCE7',
  shiftEnded: '#6B7280',
  shiftEndedBg: '#F3F4F6',
};

