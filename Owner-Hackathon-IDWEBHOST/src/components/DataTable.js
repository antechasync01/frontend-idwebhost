import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing, borderRadius } from '../styles/colors';

const statusStyles = {
  AKTIF: { bg: colors.successBg, color: colors.success },
  NONAKTIF: { bg: colors.dangerBg, color: colors.danger },
  SUKSES: { bg: colors.successBg, color: colors.success },
  PENDING: { bg: colors.warningBg, color: colors.warning },
  NORMAL: { bg: colors.successBg, color: colors.success },
  'STOK RENDAH': { bg: colors.warningBg, color: colors.warning },
  HABIS: { bg: colors.dangerBg, color: colors.danger },
  QRIS: { bg: '#EDE9FE', color: '#7C3AED' },
  CASH: { bg: colors.successBg, color: colors.success },
  DEBIT: { bg: colors.infoBg, color: colors.info },
};

const StatusBadge = ({ status }) => {
  const style = statusStyles[status] || { bg: colors.borderLight, color: colors.textSecondary };
  return (
    <View style={[styles.statusBadge, { backgroundColor: style.bg }]}>
      <Text style={[styles.statusText, { color: style.color }]}>{status}</Text>
    </View>
  );
};

const DataTable = ({ columns, data, renderRow }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        {columns.map((col, idx) => (
          <View key={idx} style={[styles.headerCell, { flex: col.flex || 1, minWidth: col.minWidth }]}>
            <Text style={styles.headerText}>{col.label}</Text>
          </View>
        ))}
      </View>

      {/* Rows */}
      {data.map((row, rowIdx) => (
        <View key={rowIdx} style={[styles.dataRow, rowIdx % 2 === 0 && styles.dataRowEven]}>
          {renderRow ? (
            renderRow(row, rowIdx)
          ) : (
            columns.map((col, colIdx) => (
              <View key={colIdx} style={[styles.dataCell, { flex: col.flex || 1, minWidth: col.minWidth }]}>
                {col.isStatus ? (
                  <StatusBadge status={row[col.key]} />
                ) : col.isIcon ? (
                  <View style={styles.iconCell}>
                    <i className={`fa-solid ${col.iconName || 'fa-box'}`} style={{ fontSize: 14, color: colors.textMuted }} />
                    <Text style={styles.cellText}>{row[col.key]}</Text>
                  </View>
                ) : (
                  <Text style={[styles.cellText, col.bold && styles.cellTextBold]}>{row[col.key]}</Text>
                )}
              </View>
            ))
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  headerCell: {
    justifyContent: 'center',
  },
  headerText: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.semibold,
    color: colors.textMuted,
    fontFamily: fonts.regular,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dataRow: {
    flexDirection: 'row',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    alignItems: 'center',
  },
  dataRowEven: {
    backgroundColor: '#FAFBFC',
  },
  dataCell: {
    justifyContent: 'center',
  },
  cellText: {
    fontSize: fonts.sizes.base,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
  },
  cellTextBold: {
    fontWeight: fonts.weights.semibold,
  },
  iconCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold,
    fontFamily: fonts.regular,
    letterSpacing: 0.3,
  },
});

export { StatusBadge };
export default DataTable;
