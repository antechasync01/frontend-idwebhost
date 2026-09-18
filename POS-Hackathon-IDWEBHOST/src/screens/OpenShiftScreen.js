import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import OpenShiftSuccessModal from '../components/OpenShiftSuccessModal';

const QUICK_NOMINALS = [
  { value: 100000, label: 'Rp 100.000' },
  { value: 200000, label: 'Rp 200.000' },
  { value: 500000, label: 'Rp 500.000' },
  { value: 1000000, label: 'Rp 1.000.000' },
];

const OpenShiftScreen = ({ navigation }) => {
  const { currentUser, storeInfo, openShift } = useAuth();

  const [nominal, setNominal] = useState('0');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatIndonesianDate = (date) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
    ];
    const dayName = days[date.getDay()];
    const dayNumber = date.getDate();
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();
    return `${dayName}, ${dayNumber} ${monthName} ${year}`;
  };

  const formatTimeHHmm = (date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}.${minutes}`;
  };

  const numericValue = parseInt((nominal || '0').replace(/\D/g, ''), 10) || 0;

  const handleQuickNominal = (val) => {
    setNominal(val.toLocaleString('id-ID'));
  };

  const handleInputChange = (text) => {
    const clean = text.replace(/\D/g, '');
    if (!clean) {
      setNominal('0');
      return;
    }
    const num = parseInt(clean, 10);
    setNominal(num.toLocaleString('id-ID'));
  };

  const handleStartShift = () => {
    openShift(numericValue);
    setShowSuccessModal(true);
  };

  const handleProceedToPOS = () => {
    setShowSuccessModal(false);
    if (navigation) {
      navigation.replace('POS');
    }
  };

  // Fallback defaults matching design reference
  const cashierName = currentUser?.name || 'Andi Kasir';
  const employeeId = currentUser?.id || 'KSR001';
  const storeName = storeInfo?.name || 'Toko Belitung 01';
  const terminalId = storeInfo?.terminalId || 'POS-01';
  const roleName = currentUser?.role || 'Kasir';

  return (
    <View style={styles.container}>
      {/* Left Column: Dark Blue Info Area */}
      <View style={styles.leftColumn}>
        <View style={styles.leftInner}>
          {/* Badge: BUKA SHIFT */}
          <View style={styles.bukaShiftBadge}>
            <Text style={styles.bukaShiftBadgeText}>BUKA SHIFT</Text>
          </View>

          {/* Date & Huge Time Display */}
          <Text style={styles.dateText}>{formatIndonesianDate(currentTime)}</Text>
          <Text style={styles.timeText}>{formatTimeHHmm(currentTime)}</Text>

          {/* INFORMASI KASIR Card */}
          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>INFORMASI KASIR</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Kasir</Text>
              <Text style={styles.infoValue}>{cashierName}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Employee ID</Text>
              <Text style={styles.infoValue}>{employeeId}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Toko</Text>
              <Text style={styles.infoValue}>{storeName}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Terminal</Text>
              <Text style={styles.infoValue}>{terminalId}</Text>
            </View>

            <View style={[styles.infoRow, styles.infoRowLast]}>
              <Text style={styles.infoLabel}>Role</Text>
              <Text style={styles.roleValue}>{roleName}</Text>
            </View>
          </View>

          {/* Bottom Info Banner */}
          <View style={styles.infoBanner}>
            <FontAwesomeIcon icon={faCircleInfo} size={15} color="#38BDF8" style={styles.infoBannerIcon} />
            <Text style={styles.infoBannerText}>
              Masukkan jumlah kas awal sebelum memulai shift. Kas awal akan dicatat sebagai saldo awal untuk rekonsiliasi saat closing shift.
            </Text>
          </View>
        </View>
      </View>

      {/* Right Column: Light Background with Floating Modal Card */}
      <View style={styles.rightColumn}>
        <ScrollView
          contentContainerStyle={styles.rightScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.floatingCard}>
            {/* Card Titles */}
            <Text style={styles.cardTitle}>Kas Awal Shift</Text>
            <Text style={styles.cardSubtitle}>Masukkan jumlah uang tunai di laci kas</Text>

            {/* Dark Amount Box */}
            <View style={styles.amountBox}>
              <Text style={styles.amountBoxLabel}>JUMLAH</Text>
              <Text style={styles.amountBoxValue}>Rp {numericValue.toLocaleString('id-ID')}</Text>
            </View>

            {/* Input: Nominal (Rp) */}
            <Text style={styles.inputLabel}>Nominal (Rp)</Text>
            <TextInput
              style={styles.textInput}
              value={nominal}
              onChangeText={handleInputChange}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#94A3B8"
            />

            {/* Quick Nominals */}
            <Text style={styles.quickNominalsLabel}>NOMINAL CEPAT</Text>
            <View style={styles.quickGrid}>
              {QUICK_NOMINALS.map((item) => {
                const isSelected = numericValue === item.value;
                return (
                  <TouchableOpacity
                    key={item.value}
                    style={[
                      styles.quickButton,
                      isSelected && styles.quickButtonSelected,
                    ]}
                    onPress={() => handleQuickNominal(item.value)}
                  >
                    <Text
                      style={[
                        styles.quickButtonText,
                        isSelected && styles.quickButtonTextSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Summary Row */}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Kas Awal</Text>
              <Text style={styles.summaryValue}>Rp {numericValue.toLocaleString('id-ID')}</Text>
            </View>

            {/* Mulai Shift Action Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleStartShift}
              activeOpacity={0.85}
            >
              <Text style={styles.submitButtonText}>Mulai Shift</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* Animated Open Shift Success Modal */}
      <OpenShiftSuccessModal
        visible={showSuccessModal}
        cashierName={cashierName}
        openingCash={numericValue}
        shiftLabel={currentUser?.shiftLabel || 'Shift Pagi'}
        shiftTime={currentUser?.shiftTime || '08:00 - 16:00'}
        terminalId={terminalId}
        storeName={storeName}
        onProceed={handleProceedToPOS}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
  },
  leftColumn: {
    flex: 1,
    backgroundColor: '#0A3655',
    paddingHorizontal: 48,
    paddingVertical: 44,
    justifyContent: 'center',
  },
  leftInner: {
    maxWidth: 520,
    width: '100%',
    alignSelf: 'center',
  },
  bukaShiftBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#0099FF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  bukaShiftBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  dateText: {
    color: '#BAE6FD',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 4,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 68,
    fontWeight: '800',
    marginBottom: 32,
    letterSpacing: -1,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    padding: 20,
    marginBottom: 36,
  },
  infoCardTitle: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.07)',
  },
  infoRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 2,
  },
  infoLabel: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '500',
  },
  infoValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  roleValue: {
    color: '#38BDF8',
    fontSize: 14,
    fontWeight: '700',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(2, 132, 199, 0.15)',
    borderWidth: 1,
    borderColor: '#0284C7',
    borderRadius: 8,
    padding: 14,
    gap: 10,
  },
  infoBannerIcon: {
    marginTop: 2,
  },
  infoBannerText: {
    flex: 1,
    color: '#BAE6FD',
    fontSize: 12,
    lineHeight: 18,
  },
  rightColumn: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  floatingCard: {
    width: 440,
    maxWidth: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.07,
    shadowRadius: 24,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 20,
  },
  amountBox: {
    backgroundColor: '#0A3655',
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  amountBoxLabel: {
    color: '#7DD3FC',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  amountBoxValue: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '800',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  textInput: {
    height: 48,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    outlineStyle: 'none',
    backgroundColor: '#FFFFFF',
  },
  quickNominalsLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.8,
    marginTop: 18,
    marginBottom: 10,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  quickButton: {
    width: '48.2%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickButtonSelected: {
    borderColor: '#0099FF',
    backgroundColor: '#F0F9FF',
  },
  quickButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  quickButtonTextSelected: {
    color: '#0099FF',
    fontWeight: '700',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  summaryLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  submitButton: {
    backgroundColor: '#0099FF',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default OpenShiftScreen;
