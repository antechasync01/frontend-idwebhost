import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faCheck,
  faArrowRight,
  faCashRegister,
  faClock,
  faUser,
  faStore,
} from '@fortawesome/free-solid-svg-icons';
import Colors from '../constants/colors';
import { playSuccessChime } from '../utils/scannerSound';

const OpenShiftSuccessModal = ({
  visible,
  cashierName = 'Andi Kasir',
  openingCash = 0,
  shiftLabel = 'Shift Pagi',
  shiftTime = '08:00 - 16:00',
  terminalId = 'POS-01',
  storeName = 'Toko Belitung 01',
  onProceed,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.75)).current;
  const checkScale = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let timer = null;
    let pulseLoop = null;

    if (visible) {
      // 1. Play success chime
      playSuccessChime();

      // 2. Reset animations
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.75);
      checkScale.setValue(0);
      pulseAnim.setValue(1);
      progressAnim.setValue(0);

      // 3. Run entrance animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 70,
          useNativeDriver: true,
        }),
        Animated.spring(checkScale, {
          toValue: 1,
          friction: 5,
          tension: 90,
          delay: 140,
          useNativeDriver: true,
        }),
      ]).start();

      // 4. Subtle pulsing ring animation
      pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.12,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      pulseLoop.start();

      // 5. Progress bar animation for auto-redirect (2.5s)
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 2500,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();

      // 6. Auto-proceed after 2.6s
      timer = setTimeout(() => {
        if (onProceed) onProceed();
      }, 2600);
    }

    return () => {
      if (timer) clearTimeout(timer);
      if (pulseLoop) pulseLoop.stop();
    };
  }, [visible]);

  if (!visible) return null;

  const now = new Date();
  const timeFormatted = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: fadeAnim,
            },
          ]}
        />

        <Animated.View
          style={[
            styles.card,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Animated Success Icon with Pulse Ring */}
          <View style={styles.iconWrapper}>
            <Animated.View
              style={[
                styles.pulseRing,
                {
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.iconCircle,
                {
                  transform: [{ scale: checkScale }],
                },
              ]}
            >
              <FontAwesomeIcon icon={faCheck} size={36} color={Colors.white} />
            </Animated.View>
          </View>

          {/* Header Title */}
          <Text style={styles.title}>Buka Shift Berhasil!</Text>
          <Text style={styles.subtitle}>
            Shift kasir aktif dan siap melayani transaksi pelanggan.
          </Text>

          {/* Summary Box */}
          <View style={styles.summaryContainer}>
            {/* Cashier & Shift */}
            <View style={styles.summaryRow}>
              <View style={styles.summaryItemLeft}>
                <FontAwesomeIcon icon={faUser} size={14} color={Colors.primaryBlue} />
                <Text style={styles.summaryLabel}>Kasir Bertugas</Text>
              </View>
              <Text style={styles.summaryValueName}>{cashierName}</Text>
            </View>

            {/* Opening Cash Highlight */}
            <View style={styles.cashHighlightBox}>
              <View style={styles.cashLabelRow}>
                <FontAwesomeIcon icon={faCashRegister} size={14} color="#16A34A" />
                <Text style={styles.cashLabel}>Modal Awal Kasir (Float Cash)</Text>
              </View>
              <Text style={styles.cashAmount}>
                Rp {Number(openingCash).toLocaleString('id-ID')}
              </Text>
            </View>

            {/* Shift & Time */}
            <View style={styles.detailsGrid}>
              <View style={styles.detailCol}>
                <Text style={styles.detailHeader}>SHIFT</Text>
                <Text style={styles.detailText}>{shiftLabel} ({shiftTime})</Text>
              </View>
              <View style={styles.detailDivider} />
              <View style={styles.detailCol}>
                <Text style={styles.detailHeader}>WAKTU BUKA</Text>
                <Text style={styles.detailText}>{timeFormatted} WIB</Text>
              </View>
            </View>

            {/* Store & Terminal */}
            <View style={styles.terminalRow}>
              <FontAwesomeIcon icon={faStore} size={12} color={Colors.textMuted} />
              <Text style={styles.terminalText}>
                {storeName} • Terminal {terminalId}
              </Text>
            </View>
          </View>

          {/* Progress Bar for Auto Redirect */}
          <View style={styles.progressSection}>
            <View style={styles.progressBarTrack}>
              <Animated.View
                style={[
                  styles.progressBarFill,
                  {
                    width: progressWidth,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              Mengalihkan ke layar kasir otomatis...
            </Text>
          </View>

          {/* Manual Proceed Button */}
          <TouchableOpacity
            style={styles.proceedBtn}
            onPress={onProceed}
            activeOpacity={0.85}
          >
            <Text style={styles.proceedBtnText}>Lanjut ke Layar Kasir</Text>
            <FontAwesomeIcon icon={faArrowRight} size={14} color={Colors.white} />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 25, 47, 0.72)',
  },
  card: {
    width: 480,
    maxWidth: '92%',
    backgroundColor: Colors.white,
    borderRadius: 24,
    paddingHorizontal: 32,
    paddingVertical: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.25,
    shadowRadius: 28,
    elevation: 12,
  },
  iconWrapper: {
    position: 'relative',
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  pulseRing: {
    position: 'absolute',
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#DCFCE7',
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  summaryContainer: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    gap: 12,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  summaryValueName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  cashHighlightBox: {
    backgroundColor: '#DCFCE7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  cashLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  cashLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  cashAmount: {
    fontSize: 24,
    fontWeight: '900',
    color: '#15803D',
    letterSpacing: 0.5,
  },
  detailsGrid: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  detailCol: {
    flex: 1,
    alignItems: 'center',
  },
  detailDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  detailHeader: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  detailText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  terminalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 2,
  },
  terminalText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  progressSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressBarTrack: {
    width: '100%',
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#22C55E',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  proceedBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#0284C7',
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  proceedBtnText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default OpenShiftSuccessModal;

