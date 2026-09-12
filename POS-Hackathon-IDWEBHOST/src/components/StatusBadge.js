import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/colors';

const StatusBadge = ({ status }) => {
  let bgColor, textColor;

  switch (status) {
    case 'NORMAL':
      bgColor = Colors.greenBg;
      textColor = Colors.green;
      break;
    case 'LOW STOCK':
      bgColor = Colors.yellowBg;
      textColor = Colors.yellow;
      break;
    case 'OUT OF STOCK':
      bgColor = Colors.redBg;
      textColor = Colors.red;
      break;
    default:
      bgColor = Colors.greenBg;
      textColor = Colors.green;
  }

  return (
    <View style={[styles.badge, { backgroundColor: bgColor }]}>
      <Text style={[styles.badgeText, { color: textColor }]}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default StatusBadge;
