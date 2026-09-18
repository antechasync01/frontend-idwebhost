import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faCashRegister,
  faCircleCheck,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import Colors from '../constants/colors';
import Header from '../components/Header';
import ConfirmModal from '../components/ConfirmModal';
import EndShiftSuccessModal from '../components/EndShiftSuccessModal';
import { useAuth } from '../context/AuthContext';
import { closingApi } from '../api/closingApi';

const DENOMINATIONS = [
  { value: 100000, label: 'Rp 100.000' },
  { value: 50000, label: 'Rp 50.000' },
  { value: 20000, label: 'Rp 20.000' },
  { value: 10000, label: 'Rp 10.000' },
  { value: 5000, label: 'Rp 5.000' },
  { value: 2000, label: 'Rp 2.000' },
];

const INITIAL_COUNTS = {
  100000: 15,
  50000: 12,
  20000: 10,
  10000: 11,
  5000: 8,
  2000: 5,
};

const CashierClosingScreen = ({ navigation }) => {
  const { currentUser, logout, startingCash, isBackendOnline } = useAuth();
  const [denomCounts, setDenomCounts] = useState(INITIAL_COUNTS);
  const [physicalAmount, setPhysicalAmount] = useState(String(startingCash || '2450000'));
  const [remarks, setRemarks] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [backendSummary, setBackendSummary] = useState(null);

  useEffect(() => {
    loadClosingSummary();
  }, []);

  const loadClosingSummary = async () => {
    try {
      const summary = await closingApi.getCashSummary(startingCash || 0);
      if (summary) {
        setBackendSummary(summary);
        if (summary.expected_cash) {
          setPhysicalAmount(String(summary.expected_cash));
        }
      }
    } catch (e) {
      console.log('Error loading cash summary:', e.message);
    }
  };

  const cashierDisplayName = currentUser ? currentUser.name : 'Andi Kasir';
  const shiftDisplayTime = currentUser ? `${currentUser.shiftTime} (${currentUser.shift})` : '08:00 - 16:00 (Shift-01)';

  const expectedAmount = backendSummary?.expected_cash ?? (startingCash || 2450000);
  const physicalNum = parseInt(physicalAmount) || 0;
  const variance = physicalNum - expectedAmount;

  const getDenomTotal = (denomination) => {
    return (denomCounts[denomination] || 0) * denomination;
  };

  const getDenomCountLabel = (count) => {
    return `${count} Lembar`;
  };

  const handleConfirmClose = async () => {
    setShowConfirmModal(false);
    try {
      if (isBackendOnline) {
        await closingApi.submitCashClosing({
          opening_cash: startingCash || 0,
          actual_cash: physicalNum,
          cash_adjustment: variance,
          adjustment_notes: variance !== 0 ? `Selisih kas ${variance > 0 ? 'lebih' : 'kurang'}` : null,
          notes: remarks || 'Closing shift kasir AURA POS',
        }).catch((err) => console.warn('Submit closing warning:', err.message));
      }
    } catch (e) {
      console.warn('Closing submission error:', e.message);
    } finally {
      logout();
      if (navigation) {
        navigation.replace('Login');
      }
    }
    // Show End Shift Success animation modal
    setShowSuccessModal(true);
  };

  const handleProceedToLogin = () => {
    setShowSuccessModal(false);
    logout();
    if (navigation) {
      navigation.replace('Login');
    }
  };

  return (
    <View style={styles.container}>
      <Header
        cashierName={`${cashierDisplayName} (${currentUser ? currentUser.shift : 'Morn-A'})`}
        showEndShift={false}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainCard}>
          {/* Title */}
          <View style={styles.titleRow}>
            <View style={styles.titleLeft}>
              <FontAwesomeIcon icon={faCashRegister} size={20} color={Colors.primaryBlue} />
              <View>
                <Text style={styles.title}>Tutup Shift & Rekonsiliasi Kas</Text>
                <Text style={styles.subtitle}>
                  Formulir penutupan kasir dan penghitungan fisik uang laci.
                </Text>
              </View>
            </View>
            <View style={styles.shiftEndBadge}>
              <Text style={styles.shiftEndBadgeText}>SHIFT END ACTIVE</Text>
            </View>
          </View>

          {/* Cashier Info */}
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>KASIR AKTIF</Text>
              <Text style={styles.infoValue}>{cashierDisplayName}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>WAKTU SHIFT</Text>
              <Text style={styles.infoValue}>{shiftDisplayTime}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>JUMLAH TRANSAKSI</Text>
              <Text style={styles.infoValue}>148 Transaksi</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>METODE PEMBAYARAN</Text>
              <Text style={styles.infoValue}>Tunai: 98 | QRIS: 50</Text>
            </View>
          </View>

          {/* Cash Amounts */}
          <View style={styles.cashRow}>
            <View style={styles.cashItem}>
              <Text style={styles.cashLabel}>Uang Laci Sistem (Expected)</Text>
              <View style={styles.cashInputLocked}>
                <Text style={styles.cashInputText}>Rp {expectedAmount.toLocaleString('id-ID')}</Text>
                <FontAwesomeIcon icon={faLock} size={14} color={Colors.textMuted} />
              </View>
            </View>
            <View style={styles.cashItem}>
              <Text style={styles.cashLabel}>Penghitungan Fisik (Actual)</Text>
              <View style={styles.cashInputEditable}>
                <TextInput
                  style={styles.cashInputField}
                  value={`Rp ${physicalNum.toLocaleString('id-ID')}`}
                  onChangeText={(text) => {
                    const num = text.replace(/\D/g, '');
                    setPhysicalAmount(num);
                  }}
                />
              </View>
            </View>
            <View style={styles.cashItem}>
              <Text style={styles.cashLabel}>Selisih / Variance</Text>
              <View style={[styles.varianceBox, variance === 0 ? styles.varianceOk : variance > 0 ? styles.variancePositive : styles.varianceNegative]}>
                <FontAwesomeIcon icon={faCircleCheck} size={16} color={variance === 0 ? Colors.green : Colors.red} />
                <Text style={[styles.varianceText, { color: variance === 0 ? Colors.green : Colors.red }]}>
                  Rp {Math.abs(variance).toLocaleString('id-ID')} {variance === 0 ? '(COCOK)' : variance > 0 ? '(LEBIH)' : '(KURANG)'}
                </Text>
              </View>
            </View>
          </View>

          {/* Denomination Table */}
          <View style={styles.denomSection}>
            <Text style={styles.denomTitle}>Rincian Denominasi Uang Kertas & Koin</Text>
            <View style={styles.denomTable}>
              <View style={styles.denomHeader}>
                <Text style={[styles.denomHeaderText, { flex: 1 }]}>Denominasi</Text>
                <Text style={[styles.denomHeaderText, { flex: 1 }]}>Jumlah Lembar/Koin</Text>
                <Text style={[styles.denomHeaderText, { flex: 1, textAlign: 'right' }]}>Total</Text>
              </View>
              {DENOMINATIONS.map((denom) => (
                <View key={denom.value} style={styles.denomRow}>
                  <Text style={[styles.denomCell, { flex: 1 }]}>{denom.label}</Text>
                  <Text style={[styles.denomCell, { flex: 1 }]}>
                    {getDenomCountLabel(denomCounts[denom.value] || 0)}
                  </Text>
                  <Text style={[styles.denomCell, { flex: 1, textAlign: 'right', fontWeight: '600' }]}>
                    Rp {getDenomTotal(denom.value).toLocaleString('id-ID')}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Remarks */}
          <View style={styles.remarksSection}>
            <Text style={styles.remarksLabel}>Catatan / remarks</Text>
            <TextInput
              style={styles.remarksInput}
              value={remarks}
              onChangeText={setRemarks}
              placeholder="Laci kasir cocok sepenuhnya. Tidak ada kelebihan atau kekurangan tunai pada shift pagi ini."
              placeholderTextColor={Colors.textMuted}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.confirmShiftBtn}
              onPress={() => setShowConfirmModal(true)}
            >
              <Text style={styles.confirmShiftBtnText}>Konfirmasi Tutup Shift</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => navigation && navigation.goBack()}
            >
              <Text style={styles.cancelBtnText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <ConfirmModal
        visible={showConfirmModal}
        title="Are you sure?"
        message="this action can't be undone. please confirm if you want to proceed"
        onConfirm={handleConfirmClose}
        onCancel={() => setShowConfirmModal(false)}
      />

      <EndShiftSuccessModal
        visible={showSuccessModal}
        cashierName={cashierDisplayName}
        startingCash={startingCash || 0}
        physicalCash={physicalNum}
        expectedCash={expectedAmount}
        variance={variance}
        shiftLabel={currentUser?.shiftLabel || currentUser?.shift || 'Shift Pagi'}
        shiftTime={currentUser?.shiftTime || '08:00 - 16:00'}
        onProceed={handleProceedToLogin}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPage,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 40,
    alignItems: 'center',
  },
  mainCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 32,
    width: '100%',
    maxWidth: 900,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  titleLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  shiftEndBadge: {
    backgroundColor: Colors.redBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.redLight,
  },
  shiftEndBadgeText: {
    color: Colors.red,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  infoGrid: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryBlueBg,
    borderRadius: 10,
    padding: 16,
    marginBottom: 24,
    gap: 24,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  cashRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 28,
  },
  cashItem: {
    flex: 1,
  },
  cashLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  cashInputLocked: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.bgPage,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
  },
  cashInputText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  cashInputEditable: {
    borderWidth: 1.5,
    borderColor: Colors.primaryBlue,
    borderRadius: 10,
    overflow: 'hidden',
  },
  cashInputField: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    padding: 14,
    outlineStyle: 'none',
  },
  varianceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 10,
  },
  varianceOk: {
    backgroundColor: Colors.greenBg,
    borderWidth: 1,
    borderColor: Colors.greenBorder,
  },
  variancePositive: {
    backgroundColor: Colors.yellowBg,
  },
  varianceNegative: {
    backgroundColor: Colors.redBg,
  },
  varianceText: {
    fontSize: 14,
    fontWeight: '700',
  },
  denomSection: {
    marginBottom: 24,
  },
  denomTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  denomTable: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  denomHeader: {
    flexDirection: 'row',
    backgroundColor: Colors.bgPage,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  denomHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  denomRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  denomCell: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  remarksSection: {
    marginBottom: 28,
  },
  remarksLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  remarksInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 14,
    fontSize: 14,
    color: Colors.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top',
    outlineStyle: 'none',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmShiftBtn: {
    backgroundColor: Colors.primaryBlue,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 10,
  },
  confirmShiftBtnText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  cancelBtn: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});

export default CashierClosingScreen;
