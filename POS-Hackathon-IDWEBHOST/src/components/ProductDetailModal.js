import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMoneyBillWave, faXmark } from '@fortawesome/free-solid-svg-icons';
import Colors from '../constants/colors';
import StatusBadge from './StatusBadge';

const ProductDetailModal = ({ visible, product, onClose }) => {
  if (!product) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIcon}>
                <FontAwesomeIcon icon={faMoneyBillWave} size={14} color={Colors.primaryBlue} />
              </View>
              <Text style={styles.headerTitle}>Detail Produk</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <FontAwesomeIcon icon={faXmark} size={14} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.sku}>{product.sku}</Text>
            <Text style={styles.productName}>{product.name}</Text>

            <View style={styles.spacer} />

            <View style={styles.bottomInfo}>
              <Text style={styles.price}>Rp {product.price.toLocaleString('id-ID')}</Text>
              <View style={styles.statusRow}>
                <StatusBadge status={product.status} />
                <Text style={styles.stock}>{product.stock} pcs</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    width: 480,
    maxWidth: '90%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  closeBtn: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: Colors.bgPage,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 24,
  },
  sku: {
    fontSize: 14,
    color: Colors.primaryBlue,
    fontWeight: '600',
    marginBottom: 8,
  },
  productName: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  spacer: {
    height: 60,
  },
  bottomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.darkBlue,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stock: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});

export default ProductDetailModal;
