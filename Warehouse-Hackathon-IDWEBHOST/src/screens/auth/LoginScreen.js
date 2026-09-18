import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Animated } from 'react-native';
import { colors, fonts, spacing, borderRadius, staffColors } from '../../styles/colors';
import { useWarehouse } from '../../context/WarehouseContext';

const LoginScreen = () => {
  const { handleLogin } = useWarehouse();
  const [employeeId, setEmployeeId] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handlePinPress = (digit) => {
    if (pin.length < 4) {
      setPin((prev) => prev + digit);
      setError('');
    }
  };

  const handlePinDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError('');
  };

  const handleSubmit = () => {
    if (!employeeId.trim()) {
      setError('Masukkan Employee ID');
      triggerShake();
      return;
    }
    if (pin.length < 4) {
      setError('PIN harus 4 digit');
      triggerShake();
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = handleLogin(employeeId.trim(), pin);
      if (!result.success) {
        setError(result.error);
        setPin('');
        triggerShake();
      }
      setIsLoading(false);
    }, 800);
  };

  React.useEffect(() => {
    if (pin.length === 4 && employeeId.trim()) {
      handleSubmit();
    }
  }, [pin]);

  const pinDots = [0, 1, 2, 3];

  return (
    <View style={styles.container}>
      {/* Background gradient decoration */}
      <View style={styles.bgGradientTop} />
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <Animated.View
        style={[
          styles.loginCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { translateX: shakeAnim }],
          },
        ]}
      >
        {/* Logo & Brand */}
        <View style={styles.brandSection}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>A</Text>
          </View>
          <Text style={styles.brandTitle}>AURA WAREHOUSE</Text>
          <Text style={styles.brandSubtitle}>Staff Operations Portal</Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Employee ID Input */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>EMPLOYEE ID</Text>
          <View style={styles.inputWrapper}>
            <i className="fa-solid fa-id-badge" style={{ fontSize: 16, color: colors.primary, marginRight: 10 }} />
            <TextInput
              style={styles.textInput}
              placeholder="Contoh: EMP-002"
              placeholderTextColor={colors.textMuted}
              value={employeeId}
              onChangeText={(text) => {
                setEmployeeId(text);
                setError('');
              }}
              autoCapitalize="characters"
              autoCorrect={false}
            />
          </View>
        </View>

        {/* PIN Display */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>PIN (4 DIGIT)</Text>
          <View style={styles.pinDotsRow}>
            {pinDots.map((i) => (
              <View
                key={i}
                style={[
                  styles.pinDot,
                  pin.length > i && styles.pinDotFilled,
                ]}
              >
                {pin.length > i && <View style={styles.pinDotInner} />}
              </View>
            ))}
          </View>
        </View>

        {/* Error Message */}
        {error ? (
          <View style={styles.errorBox}>
            <i className="fa-solid fa-circle-exclamation" style={{ color: colors.danger, fontSize: 13, marginRight: 6 }} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Number Pad */}
        <View style={styles.numPad}>
          {[
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
            ['', '0', 'del'],
          ].map((row, ri) => (
            <View key={ri} style={styles.numPadRow}>
              {row.map((digit, di) => {
                if (digit === '') {
                  return <View key={di} style={styles.numPadKeyEmpty} />;
                }
                if (digit === 'del') {
                  return (
                    <TouchableOpacity
                      key={di}
                      style={styles.numPadKey}
                      onPress={handlePinDelete}
                      activeOpacity={0.6}
                    >
                      <i className="fa-solid fa-delete-left" style={{ fontSize: 18, color: colors.textSecondary }} />
                    </TouchableOpacity>
                  );
                }
                return (
                  <TouchableOpacity
                    key={di}
                    style={styles.numPadKey}
                    onPress={() => handlePinPress(digit)}
                    activeOpacity={0.6}
                  >
                    <Text style={styles.numPadKeyText}>{digit}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        {/* Loading indicator */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingSpinner}>
              <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: 28, color: colors.primary }} />
              <Text style={styles.loadingText}>Memverifikasi...</Text>
            </View>
          </View>
        )}

        {/* Quick Demo Login Buttons */}
        <View style={styles.hintSection}>
          <Text style={styles.hintTitle}>AKSES CEPAT (DEMO):</Text>
          <View style={styles.demoButtonsRow}>
            <TouchableOpacity
              style={[styles.demoBtn, styles.demoBtnAdmin]}
              onPress={() => {
                setEmployeeId('EMP-001');
                setPin('1234');
                handleLogin('EMP-001', '1234');
              }}
              activeOpacity={0.8}
            >
              <i className="fa-solid fa-shield-halved" style={{ fontSize: 11, color: colors.primary, marginRight: 5 }} />
              <Text style={styles.demoBtnAdminText}>Admin (EMP-001)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.demoBtn, styles.demoBtnStaff]}
              onPress={() => {
                setEmployeeId('EMP-002');
                setPin('5678');
                handleLogin('EMP-002', '5678');
              }}
              activeOpacity={0.8}
            >
              <i className="fa-solid fa-mobile-screen-button" style={{ fontSize: 11, color: '#059669', marginRight: 5 }} />
              <Text style={styles.demoBtnStaffText}>Staff (EMP-002)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0EFFF',
    minHeight: '100vh',
    padding: spacing.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  bgGradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '35%',
    backgroundColor: '#4F46E5',
    backgroundImage: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #8B5CF6 100%)',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  bgCircle1: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  bgCircle2: {
    position: 'absolute',
    top: 80,
    left: -50,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  loginCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: spacing.xl,
    boxShadow: '0 20px 60px rgba(79, 70, 229, 0.15), 0 8px 20px rgba(0,0,0,0.08)',
    zIndex: 10,
    position: 'relative',
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logoBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#4F46E5',
    backgroundImage: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    boxShadow: '0 8px 24px rgba(79, 70, 229, 0.35)',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: fonts.weights.bold,
  },
  brandTitle: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.extrabold,
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  brandSubtitle: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.base,
  },
  inputSection: {
    marginBottom: spacing.base,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: fonts.weights.bold,
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.base,
    height: 48,
    backgroundColor: colors.background,
  },
  textInput: {
    flex: 1,
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
    outlineStyle: 'none',
    letterSpacing: 1,
    fontFamily: fonts.mono,
  },
  pinDotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: spacing.md,
  },
  pinDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  pinDotFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  pinDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dangerBg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  errorText: {
    fontSize: fonts.sizes.sm,
    color: colors.danger,
    fontWeight: fonts.weights.semibold,
  },
  numPad: {
    gap: 8,
    marginBottom: spacing.base,
  },
  numPadRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  numPadKey: {
    width: 72,
    height: 52,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  numPadKeyEmpty: {
    width: 72,
    height: 52,
  },
  numPadKeyText: {
    fontSize: 22,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  loadingSpinner: {
    alignItems: 'center',
    gap: spacing.md,
  },
  loadingText: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    fontWeight: fonts.weights.semibold,
  },
  hintSection: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(79, 70, 229, 0.15)',
  },
  hintTitle: {
    fontSize: 10,
    fontWeight: fonts.weights.bold,
    color: colors.primary,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  demoButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  demoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },
  demoBtnAdmin: {
    backgroundColor: '#FFFFFF',
    borderColor: colors.primary,
  },
  demoBtnAdminText: {
    fontSize: 11,
    fontWeight: fonts.weights.bold,
    color: colors.primary,
  },
  demoBtnStaff: {
    backgroundColor: '#FFFFFF',
    borderColor: '#059669',
  },
  demoBtnStaffText: {
    fontSize: 11,
    fontWeight: fonts.weights.bold,
    color: '#059669',
  },
});

export default LoginScreen;
