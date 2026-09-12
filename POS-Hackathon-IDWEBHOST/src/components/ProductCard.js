import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../constants/colors';
import StatusBadge from './StatusBadge';

const ProductCard = ({ product, onPress, onLongPress }) => {
  const isOutOfStock = product.status === 'OUT OF STOCK';

  return (
    <TouchableOpacity
      style={[styles.card, isOutOfStock && styles.cardDisabled]}
      onPress={() => !isOutOfStock && onPress && onPress(product)}
      onLongPress={() => onLongPress && onLongPress(product)}
      activeOpacity={isOutOfStock ? 1 : 0.7}
    >
      <Text style={styles.sku}>{product.sku}</Text>
      <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
      <View style={styles.bottomRow}>
        <Text style={styles.price}>Rp {product.price.toLocaleString('id-ID')}</Text>
        <View style={styles.statusRow}>
          <StatusBadge status={product.status} />
          <Text style={styles.stock}>{product.stock} pcs</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    minHeight: 100,
    justifyContent: 'space-between',
  },
  cardDisabled: {
    opacity: 0.6,
  },
  sku: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
    marginBottom: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.darkBlue,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stock: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});

export default ProductCard;
