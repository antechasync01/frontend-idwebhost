import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Colors from '../constants/colors';

const OrderItem = ({ item, onUpdateQuantity, onRemove }) => {
  const itemTotal = item.price * item.quantity;

  return (
    <View style={styles.container}>
      <View style={styles.infoSection}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.price}>Rp {item.price.toLocaleString('id-ID')}</Text>
      </View>
      <View style={styles.actionsSection}>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <Text style={styles.total}>Rp {itemTotal.toLocaleString('id-ID')}</Text>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => onRemove(item.id)}
        >
          <FontAwesomeIcon icon={faTrash} size={13} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  infoSection: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  price: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  actionsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  quantity: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    minWidth: 20,
    textAlign: 'center',
  },
  total: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    minWidth: 80,
    textAlign: 'right',
  },
  deleteBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: Colors.bgPage,
  },
});

export default OrderItem;
