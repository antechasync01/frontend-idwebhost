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
import {
  faHouse,
  faClock,
  faIdCard,
  faLock,
  faEye,
  faEyeSlash,
  faRightToBracket,
  faCircleCheck,
  faCircleExclamation,
  faDeleteLeft,
  faUser,
  faCashRegister,
} from '@fortawesome/free-solid-svg-icons';
import Colors from '../constants/colors';
import { useAuth } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const { login, employeesList, storeInfo, isBackendOnline } = useAuth();

  const [employeeId, setEmployeeId] = useState('chasier@aura.pos');
  const [pin, setPin] = useState('chasier123');
  const [showPin, setShowPin] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeField, setActiveField] = useState('pin'); // 'id' or 'pin'
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const handleSelectEmployee = (emp) => {
    setEmployeeId(emp.email || emp.id);
    setPin(emp.password || emp.pin);
    setErrorMessage('');
    setActiveField('pin');
  };

  const handleKeypadPress = (val) => {
    setErrorMessage('');
    if (activeField === 'pin') {
      setPin((prev) => prev + val);
    } else {
      setEmployeeId((prev) => prev + val);
    }
  };

  const handleKeypadBackspace = () => {
    setErrorMessage('');
    if (activeField === 'pin') {
      setPin((prev) => prev.slice(0, -1));
    } else {
      setEmployeeId((prev) => prev.slice(0, -1));
    }
  };

  const handleKeypadClear = () => {
    setErrorMessage('');
    if (activeField === 'pin') {
      setPin('');
    } else {
      setEmployeeId('');
    }
  };

  const handleLogin = async () => {
    setErrorMessage('');
    setIsLoggingIn(true);
    try {
      const result = await login(employeeId, pin);
      setIsLoggingIn(false);
      if (result.success) {
        if (navigation) {
          navigation.replace('OpenShift');
        }
      } else {
        setErrorMessage(result.error);
      }
    } catch (err) {
      setIsLoggingIn(false);
      setErrorMessage(err.message || 'Gagal login ke sistem');
    }
  };

  const selectedEmployee = employeesList.find(
    (e) =>
      e.id.toLowerCase() === (employeeId || '').trim().toLowerCase() ||
      e.email.toLowerCase() === (employeeId || '').trim().toLowerCase() ||
      (e.backendUsername && e.backendUsername.toLowerCase() === (employeeId || '').trim().toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Top Header Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>A</Text>
            </View>
            <View style={styles.logoTextContainer}>
              <Text style={styles.brandName}>AURA</Text>
              <Text style={styles.brandSub}>SMART POS</Text>
            </View>
          </View>
          <View style={styles.headerDivider} />
          <View style={styles.storeInfo}>
            <FontAwesomeIcon icon={faHouse} size={14} color={Colors.textSecondary} />
            <Text style={styles.storeName}>{storeInfo.name}</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.systemBadge}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isBackendOnline ? Colors.green : Colors.yellow },
              ]}
            />
            <Text style={styles.systemBadgeText}>
              {isBackendOnline ? 'API Connected: 192.168.1.5:8000' : 'Offline Mode'}
            </Text>
          </View>
          <View style={styles.headerDivider} />
          <View style={styles.timeContainer}>
            <FontAwesomeIcon icon={faClock} size={14} color={Colors.textSecondary} />
            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
          </View>
        </View>
      </View>

      {/* Main Login Workspace */}
      <ScrollView
        style={styles.mainContent}
        contentContainerStyle={styles.mainContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.loginWrapper}>
          {/* Left Column: Login Form & Keypad */}
          <View style={styles.leftCard}>
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <View style={styles.cardIconBox}>
                <FontAwesomeIcon icon={faCashRegister} size={22} color={Colors.primaryBlue} />
              </View>
              <View style={styles.cardHeaderText}>
                <Text style={styles.cardTitle}>Masuk Shift Kasir</Text>
                <Text style={styles.cardSubtitle}>
                  Masuk dengan akun backend atau pilih karyawan di panel kanan
                </Text>
              </View>
            </View>

            {/* Error Banner */}
            {errorMessage ? (
              <View style={styles.errorBanner}>
                <FontAwesomeIcon icon={faCircleExclamation} size={16} color={Colors.red} />
                <Text style={styles.errorBannerText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Input 1: Email / Employee ID */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabelRow}>
                <Text style={styles.inputLabel}>EMAIL / EMPLOYEE ID</Text>
                {selectedEmployee && (
                  <Text style={styles.recognizedEmpText}>
                    ✓ {selectedEmployee.name} ({selectedEmployee.roleLabel || selectedEmployee.role})
                  </Text>
                )}
              </View>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setActiveField('id')}
                style={[
                  styles.inputBox,
                  activeField === 'id' && styles.inputBoxActive,
                ]}
              >
                <FontAwesomeIcon
                  icon={faIdCard}
                  size={16}
                  color={activeField === 'id' ? Colors.primaryBlue : Colors.textMuted}
                />
                <TextInput
                  style={styles.inputField}
                  value={employeeId}
                  onChangeText={(text) => {
                    setEmployeeId(text);
                    setErrorMessage('');
                  }}
                  onFocus={() => setActiveField('id')}
                  placeholder="Masukkan Email atau ID (contoh: chasier@aura.pos)"
                  placeholderTextColor={Colors.textMuted}
                  autoCapitalize="none"
                />
                {employeeId.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setEmployeeId('')}
                    style={styles.clearFieldBtn}
                  >
                    <Text style={styles.clearFieldBtnText}>✕</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            </View>

            {/* Input 2: Password / PIN */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabelRow}>
                <Text style={styles.inputLabel}>PASSWORD / PIN</Text>
              </View>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setActiveField('pin')}
                style={[
                  styles.inputBox,
                  activeField === 'pin' && styles.inputBoxActive,
                ]}
              >
                <FontAwesomeIcon
                  icon={faLock}
                  size={16}
                  color={activeField === 'pin' ? Colors.primaryBlue : Colors.textMuted}
                />
                <TextInput
                  style={styles.inputField}
                  value={pin}
                  onChangeText={(text) => {
                    setPin(text);
                    setErrorMessage('');
                  }}
                  onFocus={() => setActiveField('pin')}
                  placeholder="Masukkan Password atau PIN"
                  placeholderTextColor={Colors.textMuted}
                  secureTextEntry={!showPin}
                />
                <TouchableOpacity
                  onPress={() => setShowPin(!showPin)}
                  style={styles.eyeBtn}
                >
                  <FontAwesomeIcon
                    icon={showPin ? faEyeSlash : faEye}
                    size={16}
                    color={Colors.textSecondary}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>

            {/* Touch Numeric Keypad */}
            <View style={styles.keypadSection}>
              <View style={styles.keypadGrid}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={styles.keypadBtn}
                    onPress={() => handleKeypadPress(String(num))}
                  >
                    <Text style={styles.keypadBtnText}>{num}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={[styles.keypadBtn, styles.keypadBtnSpecial]}
                  onPress={handleKeypadClear}
                >
                  <Text style={styles.keypadClearText}>C</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.keypadBtn}
                  onPress={() => handleKeypadPress('0')}
                >
                  <Text style={styles.keypadBtnText}>0</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.keypadBtn, styles.keypadBtnSpecial]}
                  onPress={handleKeypadBackspace}
                >
                  <FontAwesomeIcon icon={faDeleteLeft} size={18} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.loginSubmitBtn,
                (!employeeId || !pin || isLoggingIn) && styles.loginSubmitBtnDisabled,
              ]}
              onPress={handleLogin}
              disabled={!employeeId || !pin || isLoggingIn}
            >
              <FontAwesomeIcon icon={faRightToBracket} size={16} color={Colors.white} />
              <Text style={styles.loginSubmitText}>
                {isLoggingIn ? 'MEMVERIFIKASI BACKEND...' : 'MULAI SHIFT KASIR'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Right Column: Employee Shift Directory & Quick Autofill */}
          <View style={styles.rightCard}>
            <View style={styles.rightCardHeader}>
              <View>
                <Text style={styles.rightCardTitle}>Akun Karyawan Terdaftar</Text>
                <Text style={styles.rightCardSubtitle}>
                  Pilih akun di bawah untuk verifikasi shift kasir
                </Text>
              </View>
            </View>

            <View style={styles.employeeList}>
              {employeesList.map((emp) => {
                const isSelected =
                  emp.id.toLowerCase() === (employeeId || '').trim().toLowerCase() ||
                  emp.email.toLowerCase() === (employeeId || '').trim().toLowerCase() ||
                  (emp.backendUsername && emp.backendUsername.toLowerCase() === (employeeId || '').trim().toLowerCase());

                return (
                  <TouchableOpacity
                    key={emp.id}
                    style={[
                      styles.employeeItem,
                      isSelected && styles.employeeItemSelected,
                    ]}
                    onPress={() => handleSelectEmployee(emp)}
                  >
                    <View
                      style={[
                        styles.empAvatar,
                        { backgroundColor: emp.avatarColor || Colors.primaryBlue },
                      ]}
                    >
                      <Text style={styles.empAvatarText}>
                        {emp.name.split(' ').map((n) => n[0]).join('')}
                      </Text>
                    </View>

                    <View style={styles.empDetails}>
                      <View style={styles.empNameRow}>
                        <Text style={styles.empName}>{emp.name}</Text>
                        <View style={styles.empBadge}>
                          <Text style={styles.empBadgeText}>{emp.roleLabel || emp.role}</Text>
                        </View>
                      </View>

                      <View style={styles.empCredRow}>
                        <Text style={styles.empEmailText}>{emp.email}</Text>
                        <Text style={styles.empDot}>•</Text>
                        <Text style={styles.empPwText}>pw: {emp.password}</Text>
                      </View>

                      <View style={styles.empMetaRow}>
                        <Text style={styles.empShift}>{emp.shiftTime}</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.selectActionBtn,
                        isSelected && styles.selectActionBtnActive,
                      ]}
                    >
                      {isSelected ? (
                        <FontAwesomeIcon icon={faCircleCheck} size={16} color={Colors.primaryBlue} />
                      ) : (
                        <Text style={styles.selectActionText}>PILIH</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Shift Notes / Store Information Card */}
            <View style={styles.terminalInfoBox}>
              <View style={styles.terminalInfoRow}>
                <FontAwesomeIcon icon={faUser} size={14} color={Colors.primaryBlue} />
                <Text style={styles.terminalInfoTitle}>Informasi Shift Kasir</Text>
              </View>
              <Text style={styles.terminalInfoDesc}>
                Setiap kasir bertanggung jawab atas kas laci selama shift berlangsung. Pastikan menghitung uang modal awal sebelum transaksi pertama.
              </Text>

              <View style={styles.demoPinTip}>
                <Text style={styles.demoPinTipTitle}>💡 Akun Akses Backend AURA POS:</Text>
                <Text style={styles.demoPinTipItem}>• Kasir: <Text style={styles.boldText}>chasier@aura.pos</Text> | <Text style={styles.boldText}>chasier123</Text></Text>
                <Text style={styles.demoPinTipItem}>• Owner: <Text style={styles.boldText}>owner@aura.pos</Text> | <Text style={styles.boldText}>owner123</Text></Text>
                <Text style={styles.demoPinTipItem}>• Admin Gudang: <Text style={styles.boldText}>admin@aura.pos</Text> | <Text style={styles.boldText}>admin123</Text></Text>
                <Text style={styles.demoPinTipItem}>• Staff Gudang: <Text style={styles.boldText}>staff@aura.pos</Text> | <Text style={styles.boldText}>staff123</Text></Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPage,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: '800',
  },
  logoTextContainer: {
    marginLeft: 10,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.navyBlue,
    lineHeight: 20,
  },
  brandSub: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.primaryBlue,
    letterSpacing: 1.2,
    lineHeight: 12,
  },
  headerDivider: {
    width: 1,
    height: 26,
    backgroundColor: Colors.border,
    marginHorizontal: 18,
  },
  storeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  storeName: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  systemBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.bgPage,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.green,
  },
  systemBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  mainContent: {
    flex: 1,
  },
  mainContentContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginWrapper: {
    flexDirection: 'row',
    maxWidth: 1060,
    width: '100%',
    gap: 28,
  },
  leftCard: {
    flex: 1.15,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 28,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  cardIconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: Colors.primaryBlueBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.redBg,
    borderWidth: 1,
    borderColor: Colors.redLight,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorBannerText: {
    fontSize: 13,
    color: Colors.redText,
    fontWeight: '600',
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  recognizedEmpText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.green,
  },
  pinCounterText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: Colors.bgPage,
    height: 48,
  },
  inputBoxActive: {
    borderColor: Colors.primaryBlue,
    backgroundColor: Colors.white,
  },
  inputField: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    outlineStyle: 'none',
  },
  clearFieldBtn: {
    padding: 6,
  },
  clearFieldBtnText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: 'bold',
  },
  eyeBtn: {
    padding: 6,
  },
  pinIndicatorsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
  },
  pinDotBox: {
    width: 38,
    height: 42,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.bgPage,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinDotBoxFilled: {
    borderColor: Colors.primaryBlue,
    backgroundColor: Colors.primaryBlueBg,
  },
  pinDotBoxCurrent: {
    borderColor: Colors.primaryBlue,
  },
  pinDotText: {
    fontSize: 18,
    color: Colors.textMuted,
  },
  pinDotTextFilled: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryBlue,
  },
  keypadSection: {
    marginTop: 6,
    marginBottom: 20,
  },
  keypadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  keypadBtn: {
    width: '31.5%',
    height: 48,
    borderRadius: 8,
    backgroundColor: Colors.bgPage,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keypadBtnSpecial: {
    backgroundColor: '#F1F5F9',
  },
  keypadBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  keypadClearText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.red,
  },
  loginSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.primaryBlue,
    paddingVertical: 14,
    borderRadius: 10,
  },
  loginSubmitBtnDisabled: {
    backgroundColor: '#93C5FD',
  },
  loginSubmitText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  rightCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 28,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'space-between',
  },
  rightCardHeader: {
    marginBottom: 16,
  },
  rightCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  rightCardSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  employeeList: {
    gap: 10,
  },
  employeeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.bgPage,
    gap: 12,
  },
  employeeItemSelected: {
    borderColor: Colors.primaryBlue,
    backgroundColor: Colors.primaryBlueBg,
  },
  empAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empAvatarText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  empDetails: {
    flex: 1,
  },
  empNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  empName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  empBadge: {
    backgroundColor: Colors.border,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  empBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  empCredRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  empEmailText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  empPwText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontFamily: 'monospace',
  },
  empMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  empRole: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  empDot: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  empShift: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  selectActionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  selectActionBtnActive: {
    borderColor: Colors.primaryBlue,
    backgroundColor: Colors.white,
  },
  selectActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  terminalInfoBox: {
    backgroundColor: Colors.bgPage,
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 20,
  },
  terminalInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  terminalInfoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  terminalInfoDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginBottom: 12,
  },
  demoPinTip: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
  },
  demoPinTipTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryBlue,
    marginBottom: 2,
  },
  demoPinTipItem: {
    fontSize: 11,
    color: Colors.textPrimary,
  },
  boldText: {
    fontWeight: '700',
  },
});

export default LoginScreen;
