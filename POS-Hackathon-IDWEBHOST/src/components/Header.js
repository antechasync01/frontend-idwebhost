import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faStore,
  faHouse,
  faClock,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import Colors from '../constants/colors';
import { useAuth } from '../context/AuthContext';

const Header = ({
  cashierName,
  storeName,
  shiftTime,
  onEndShift,
  showEndShift = true,
}) => {
  const { currentUser, storeInfo } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  const activeCashier = cashierName || (currentUser ? `${currentUser.name} (${currentUser.shift})` : 'Andi Kasir (Shift-01)');
  const activeStore = storeName || (storeInfo ? storeInfo.name : 'Toko Belitung 01');
  const activeShift = shiftTime || (currentUser ? currentUser.shiftTime : '08:00 - 16:00');

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

  return (
    <View style={styles.header}>
      {/* Left: Logo & Store */}
      <View style={styles.leftSection}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>A</Text>
          </View>
          <View style={styles.logoTextContainer}>
            <Text style={styles.brandName}>AURA</Text>
            <Text style={styles.brandSub}>SMART POS</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.storeInfo}>
          <FontAwesomeIcon icon={faHouse} size={14} color={Colors.textSecondary} />
          <Text style={styles.storeName}>{activeStore}</Text>
        </View>
      </View>

      {/* Right: Cashier, Shift, Time, End Shift */}
      <View style={styles.rightSection}>
        <Text style={styles.cashierName}>{activeCashier}</Text>

        <View style={styles.divider} />

        <Text style={styles.shiftText}>Shift: {activeShift}</Text>

        <View style={styles.divider} />

        <View style={styles.timeContainer}>
          <FontAwesomeIcon icon={faClock} size={14} color={Colors.textSecondary} />
          <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
        </View>

        {showEndShift && (
          <TouchableOpacity style={styles.endShiftBtn} onPress={onEndShift}>
            <Text style={styles.endShiftText}>END SHIFT</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  logoTextContainer: {
    marginLeft: 8,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.navyBlue,
    lineHeight: 20,
  },
  brandSub: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.primaryBlue,
    letterSpacing: 1,
    lineHeight: 12,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
    marginHorizontal: 16,
  },
  storeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  storeName: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cashierName: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  shiftText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  endShiftBtn: {
    marginLeft: 16,
    backgroundColor: Colors.redBg,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.red,
  },
  endShiftText: {
    color: Colors.red,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default Header;
