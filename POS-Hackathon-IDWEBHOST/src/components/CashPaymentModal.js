import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faMoneyBillWave,
  faXmark,
  faPrint,
  faCircleCheck,
  faReceipt,
} from '@fortawesome/free-solid-svg-icons';
import Colors from '../constants/colors';
import { salesApi } from '../api/salesApi';

const CashPaymentModal = ({
  visible,
  onClose,
  total = 0,
  totalItems = 0,
  orderId,
  cartItems = [],
  onNewTransaction,
}) => {
  const [receivedAmount, setReceivedAmount] = useState('');
  const [selectedQuick, setSelectedQuick] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSale, setCompletedSale] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Dynamic quick amounts
  const qPas = total;
  const q10k = Math.max(total, Math.ceil(total / 10000) * 10000);
  const q50k = Math.max(total, Math.ceil(total / 50000) * 50000);
  const q100k = Math.max(total, Math.ceil(total / 100000) * 100000);

  const quickAmounts = [
    { label: `Rp ${qPas.toLocaleString('id-ID')}`, sub: 'Uang Pas', value: qPas },
    { label: `Rp ${q10k.toLocaleString('id-ID')}`, sub: 'Bulat 10k', value: q10k },
    { label: `Rp ${q50k.toLocaleString('id-ID')}`, sub: 'Bulat 50k', value: q50k },
    { label: `Rp ${q100k.toLocaleString('id-ID')}`, sub: 'Bulat 100k', value: q100k },
  ];

  useEffect(() => {
    if (visible) {
      setReceivedAmount(String(qPas || ''));
      setSelectedQuick(0);
      setCompletedSale(null);
      setErrorMessage('');
      setIsSubmitting(false);
    }
  }, [visible, total]);

  const numericReceived = parseInt(receivedAmount) || 0;
  const change = numericReceived - total;

  const handleQuickSelect = (index, amount) => {
    setSelectedQuick(index);
    setReceivedAmount(String(amount));
  };

  const handleClearInput = () => {
    setReceivedAmount('');
    setSelectedQuick(null);
  };

  const handleProcessPayment = async () => {
    if (numericReceived < total) {
      setErrorMessage('Nominal uang diterima kurang dari total tagihan.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    // Format items for backend
    const itemsPayload = cartItems
      .filter((it) => it.id && it.quantity > 0)
      .map((it) => ({
        product_id: it.backendId || it.id,
        quantity: it.quantity,
        unit_price: it.price,
      }));

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const canSendToBackend = itemsPayload.length > 0 && itemsPayload.every((it) => uuidRegex.test(it.product_id));

    try {
      let res = null;
      if (canSendToBackend) {
        res = await salesApi.createSale({
          items: itemsPayload,
          cash_paid: numericReceived,
          payment_method: 'CASH',
        });
      }

      setCompletedSale(res || {
        receipt_number: `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 9000 + 1000)}`,
        total_amount: total,
        cash_paid: numericReceived,
        cash_change: change,
        offline: !canSendToBackend,
      });
    } catch (err) {
      console.warn('Backend sale error, fallback to local confirmation:', err.message);
      // Fallback local transaction
      setCompletedSale({
        receipt_number: `INV-OFFLINE-${Math.floor(Math.random() * 90000 + 10000)}`,
        total_amount: total,
        cash_paid: numericReceived,
        cash_change: change,
        offline: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishAndNewOrder = () => {
    if (onNewTransaction) onNewTransaction();
    onClose();
  };

  const handlePrintReceipt = () => {
    if (typeof window !== 'undefined' && window.print) {
      window.print();
    }
  };

  const now = new Date();
  const timeStr = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIcon}>
                <FontAwesomeIcon
                  icon={completedSale ? faReceipt : faMoneyBillWave}
                  size={14}
                  color={Colors.primaryBlue}
                />
              </View>
              <Text style={styles.headerTitle}>
                {completedSale ? 'Struk Pembayaran Berhasil' : 'Transaksi Tunai POS'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <FontAwesomeIcon icon={faXmark} size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* VIEW 1: Payment Input */}
          {!completedSale ? (
            <View>
              {/* Total Info */}
              <View style={styles.totalInfo}>
                <View>
                  <Text style={styles.totalLabel}>Total Tagihan</Text>
                  <Text style={styles.totalAmount}>Rp {total.toLocaleString('id-ID')}</Text>
                </View>
                <View style={styles.totalRight}>
                  <Text style={styles.totalLabel}>Jumlah Barang</Text>
                  <Text style={styles.totalItems}>{totalItems} Items</Text>
                </View>
              </View>

              {/* Error Message */}
              {errorMessage ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorBoxText}>{errorMessage}</Text>
                </View>
              ) : null}

              {/* Received Amount Input */}
              <View style={styles.receivedSection}>
                <Text style={styles.receivedLabel}>Uang Tunai Diterima (Rp)</Text>
                <View style={styles.receivedInputContainer}>
                  <TextInput
                    style={styles.receivedInput}
                    value={numericReceived > 0 ? numericReceived.toLocaleString('id-ID') : ''}
                    onChangeText={(text) => {
                      const num = text.replace(/\D/g, '');
                      setReceivedAmount(num);
                      setSelectedQuick(null);
                      setErrorMessage('');
                    }}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={Colors.textMuted}
                  />
                  {receivedAmount !== '' && (
                    <TouchableOpacity onPress={handleClearInput} style={styles.clearBtn}>
                      <FontAwesomeIcon icon={faXmark} size={12} color={Colors.textMuted} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Quick Amounts */}
              <View style={styles.quickAmounts}>
                {quickAmounts.map((qa, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.quickBtn,
                      selectedQuick === index && styles.quickBtnActive,
                    ]}
                    onPress={() => handleQuickSelect(index, qa.value)}
                  >
                    <Text
                      style={[
                        styles.quickBtnLabel,
                        selectedQuick === index && styles.quickBtnLabelActive,
                      ]}
                    >
                      {qa.label}
                    </Text>
                    <Text
                      style={[
                        styles.quickBtnSub,
                        selectedQuick === index && styles.quickBtnSubActive,
                      ]}
                    >
                      {qa.sub}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Change Box */}
              {numericReceived >= total && (
                <View style={styles.changeContainer}>
                  <Text style={styles.changeLabel}>Uang Kembalian</Text>
                  <Text style={styles.changeAmount}>
                    Rp {Math.max(0, change).toLocaleString('id-ID')}
                  </Text>
                </View>
              )}

              {/* Transaction Meta Info */}
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionId}>
                  ID Order: {orderId ? orderId.replace('#', '') : 'AURA-POS'}
                </Text>
                <Text style={styles.transactionTime}>Hari ini, {timeStr}</Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.cancelBtn, isSubmitting && { opacity: 0.6 }]}
                  onPress={onClose}
                  disabled={isSubmitting}
                >
                  <Text style={styles.cancelBtnText}>Batal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.newTransactionBtn,
                    (numericReceived < total || isSubmitting) && styles.btnDisabled,
                  ]}
                  onPress={handleProcessPayment}
                  disabled={numericReceived < total || isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color={Colors.white} />
                  ) : (
                    <Text style={styles.newTransactionBtnText}>
                      SELESAIKAN PEMBAYARAN
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* VIEW 2: Payment Receipt Confirmation */
            <View style={styles.receiptView}>
              <View style={styles.successIconBox}>
                <FontAwesomeIcon icon={faCircleCheck} size={48} color={Colors.green} />
              </View>
              <Text style={styles.successTitle}>Pembayaran Sukses!</Text>
              <Text style={styles.receiptNumText}>
                No. Struk: {completedSale.receipt_number || 'INV-20260912-0001'}
              </Text>

              <View style={styles.receiptDetailsBox}>
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Total Belanja</Text>
                  <Text style={styles.receiptVal}>
                    Rp {(completedSale.total_amount || total).toLocaleString('id-ID')}
                  </Text>
                </View>
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Uang Diterima</Text>
                  <Text style={styles.receiptVal}>
                    Rp {(completedSale.cash_paid || numericReceived).toLocaleString('id-ID')}
                  </Text>
                </View>
                <View style={[styles.receiptRow, styles.receiptRowHighlight]}>
                  <Text style={styles.receiptChangeLabel}>Uang Kembalian</Text>
                  <Text style={styles.receiptChangeVal}>
                    Rp {(completedSale.cash_change ?? change).toLocaleString('id-ID')}
                  </Text>
                </View>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.printBtn} onPress={handlePrintReceipt}>
                  <FontAwesomeIcon icon={faPrint} size={14} color={Colors.primaryBlue} />
                  <Text style={styles.printBtnText}>Cetak Struk (F10)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.newTransactionBtn}
                  onPress={handleFinishAndNewOrder}
                >
                  <Text style={styles.newTransactionBtnText}>Transaksi Baru (Enter)</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
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
    padding: 0,
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
    padding: 4,
  },
  totalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.darkBlue,
    marginHorizontal: 24,
    marginTop: 20,
    borderRadius: 10,
    padding: 16,
  },
  totalLabel: {
    fontSize: 11,
    color: Colors.primaryBlueLight,
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  totalAmount: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.white,
  },
  totalRight: {
    alignItems: 'flex-end',
  },
  totalItems: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.white,
  },
  receivedSection: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  receivedLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  receivedInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primaryBlue,
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 56,
  },
  receivedInput: {
    flex: 1,
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    outlineStyle: 'none',
  },
  clearBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.bgPage,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickAmounts: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginTop: 12,
    gap: 8,
  },
  quickBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  quickBtnActive: {
    backgroundColor: Colors.primaryBlue,
    borderColor: Colors.primaryBlue,
  },
  quickBtnLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  quickBtnLabelActive: {
    color: Colors.white,
  },
  quickBtnSub: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  quickBtnSubActive: {
    color: Colors.primaryBlueLight,
  },
  changeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 24,
    marginTop: 16,
    backgroundColor: Colors.greenBg,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.greenBorder,
  },
  changeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.green,
  },
  changeAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.green,
  },
  transactionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 16,
  },
  transactionId: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  transactionTime: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 12,
  },
  printBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  printBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  newTransactionBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: Colors.primaryBlue,
  },
  newTransactionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
  cancelBtn: {
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  btnDisabled: {
    backgroundColor: '#93C5FD',
  },
  errorBox: {
    marginHorizontal: 24,
    marginTop: 12,
    padding: 10,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorBoxText: {
    color: '#B91C1C',
    fontSize: 12,
    fontWeight: '600',
  },
  receiptView: {
    padding: 24,
    alignItems: 'center',
  },
  successIconBox: {
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  receiptNumText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 20,
  },
  receiptDetailsBox: {
    width: '100%',
    backgroundColor: Colors.bgPage,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptRowHighlight: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  receiptLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  receiptVal: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  receiptChangeLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.green,
  },
  receiptChangeVal: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.green,
  },
});

export default CashPaymentModal;
