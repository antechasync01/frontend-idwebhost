import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../constants/colors';
import OrderItem from './OrderItem';
import { useCart } from '../context/CartContext';

const ActiveOrder = ({ onPayPress }) => {
  const { items, orderId, totalItems, subtotal, ppn, discount, total, removeItem, updateQuantity } = useCart();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Active Order</Text>
        <Text style={styles.orderId}>Order ID: {orderId}</Text>
      </View>

      {/* Items List */}
      <ScrollView style={styles.itemsList} showsVerticalScrollIndicator={false}>
        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Belum ada item</Text>
            <Text style={styles.emptySubtext}>Klik produk untuk menambahkan</Text>
          </View>
        ) : (
          items.map((item) => (
            <OrderItem
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))
        )}
      </ScrollView>

      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal ({totalItems} Items)</Text>
          <Text style={styles.summaryValue}>Rp {subtotal.toLocaleString('id-ID')}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>PPN (11%)</Text>
          <Text style={styles.summaryValue}>Rp {ppn.toLocaleString('id-ID')}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Diskon Promo</Text>
          <Text style={styles.discountValue}>-Rp {discount.toLocaleString('id-ID')}</Text>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Akhir</Text>
          <Text style={styles.totalValue}>Rp {total.toLocaleString('id-ID')}</Text>
        </View>

        <TouchableOpacity
          style={[styles.payBtn, items.length === 0 && styles.payBtnDisabled]}
          onPress={onPayPress}
          disabled={items.length === 0}
        >
          <Text style={styles.payBtnText}>BAYAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    flex: 1,
    overflow: 'hidden',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  orderId: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  itemsList: {
    flex: 1,
    maxHeight: 300,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMuted,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  summary: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  discountValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.red,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  totalValue: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.primaryBlue,
  },
  payBtn: {
    backgroundColor: Colors.primaryBlue,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  payBtnDisabled: {
    opacity: 0.5,
  },
  payBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
});

export default ActiveOrder;
