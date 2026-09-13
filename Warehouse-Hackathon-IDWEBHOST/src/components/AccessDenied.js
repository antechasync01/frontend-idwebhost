import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, fonts, spacing, borderRadius } from '../styles/colors';
import { useWarehouse } from '../context/WarehouseContext';

const AccessDenied = ({ requiredRole = 'WAREHOUSE_ADMIN', onBack }) => {
  const { userRole, setUserRole, showToast } = useWarehouse();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <i className="fa-solid fa-lock" style={{ fontSize: 32, color: colors.danger }} />
        </View>
        <Text style={styles.errorCode}>403 FORBIDDEN</Text>
        <Text style={styles.title}>Akses Terbatas (RBAC Restricted)</Text>
        <Text style={styles.description}>
          Halaman atau fitur ini memerlukan hak akses tingkat <Text style={{ fontWeight: 'bold' }}>{requiredRole}</Text>.
          Role aktif Anda saat ini adalah <Text style={{ fontWeight: 'bold' }}>{userRole}</Text>.
        </Text>

        <View style={styles.buttonRow}>
          {onBack && (
            <TouchableOpacity style={styles.btnBack} onPress={onBack}>
              <Text style={styles.btnBackText}>Kembali ke Dashboard</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.btnSwitch}
            onPress={() => {
              setUserRole(requiredRole);
              showToast(`Berhasil beralih ke role ${requiredRole}`, 'success');
            }}
          >
            <i className="fa-solid fa-key" style={{ color: '#FFFFFF', marginRight: 6 }} />
            <Text style={styles.btnSwitchText}>Beralih ke {requiredRole}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.xl,
    padding: spacing.xxl,
    alignItems: 'center',
    maxWidth: 480,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.dangerBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.base,
  },
  errorCode: {
    fontSize: fonts.sizes.xs,
    fontFamily: fonts.mono,
    fontWeight: fonts.weights.bold,
    color: colors.danger,
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  description: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    width: '100%',
  },
  btnBack: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnBackText: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    fontWeight: fonts.weights.semibold,
  },
  btnSwitch: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
  },
  btnSwitchText: {
    fontSize: fonts.sizes.sm,
    color: '#FFFFFF',
    fontWeight: fonts.weights.bold,
  },
});

export default AccessDenied;
