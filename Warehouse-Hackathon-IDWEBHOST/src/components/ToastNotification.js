import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing, borderRadius } from '../styles/colors';
import { useWarehouse } from '../context/WarehouseContext';

const ToastNotification = () => {
  const { toast } = useWarehouse();

  if (!toast.visible) return null;

  const getStyle = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: '#15803D',
          icon: 'fa-circle-check',
        };
      case 'danger':
        return {
          bg: '#B91C1C',
          icon: 'fa-circle-exclamation',
        };
      case 'warning':
        return {
          bg: '#D97706',
          icon: 'fa-triangle-exclamation',
        };
      default:
        return {
          bg: '#4F46E5',
          icon: 'fa-circle-info',
        };
    }
  };

  const styleConfig = getStyle();

  return (
    <View style={[styles.toastContainer, { backgroundColor: styleConfig.bg }]}>
      <i
        className={`fa-solid ${styleConfig.icon}`}
        style={{ color: '#FFFFFF', fontSize: 16, marginRight: 8 }}
      />
      <Text style={styles.toastText}>{toast.message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2), 0 4px 6px -4px rgba(0,0,0,0.1)',
    zIndex: 9999,
    maxWidth: '90%',
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.semibold,
  },
});

export default ToastNotification;
