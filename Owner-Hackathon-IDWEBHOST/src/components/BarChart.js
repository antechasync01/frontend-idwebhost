import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, fonts, spacing } from '../styles/colors';

const AnimatedBar = ({ targetHeight, color, delay }) => {
  const heightAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    heightAnim.setValue(0);
    Animated.sequence([
      Animated.delay(delay),
      Animated.spring(heightAnim, {
        toValue: targetHeight,
        tension: 40,
        friction: 7,
        useNativeDriver: false,
      }),
    ]).start();
  }, [targetHeight, delay]);

  return (
    <Animated.View
      style={[
        styles.bar,
        {
          height: heightAnim,
          backgroundColor: color,
        },
      ]}
    />
  );
};

const BarChart = ({ data, height = 200 }) => {
  const maxValue = Math.max(...data.flatMap((d) => [d.value1, d.value2 || 0]));
  const labelAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    labelAnim.setValue(0);
    Animated.timing(labelAnim, {
      toValue: 1,
      duration: 400,
      delay: 200,
      useNativeDriver: true,
    }).start();
  }, [data]);

  return (
    <View style={[styles.container, { height }]}>
      <View style={styles.chartArea}>
        {data.map((item, idx) => {
          const bar1Height = maxValue > 0 ? (item.value1 / maxValue) * (height - 40) : 0;
          const bar2Height = item.value2 !== undefined && maxValue > 0
            ? (item.value2 / maxValue) * (height - 40)
            : 0;
          const staggerDelay = idx * 80;

          return (
            <View key={idx} style={styles.barGroup}>
              <View style={styles.barsWrap}>
                {item.value2 !== undefined && (
                  <AnimatedBar
                    targetHeight={bar2Height}
                    color={colors.chartGray}
                    delay={staggerDelay + 40}
                  />
                )}
                <AnimatedBar
                  targetHeight={bar1Height}
                  color={colors.chartBlue}
                  delay={staggerDelay}
                />
              </View>
              <Animated.Text style={[styles.barLabel, { opacity: labelAnim }]}>
                {item.label}
              </Animated.Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  chartArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingBottom: spacing.xl,
  },
  barGroup: {
    alignItems: 'center',
    flex: 1,
  },
  barsWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  bar: {
    width: 18,
    borderRadius: 3,
    minHeight: 4,
  },
  barLabel: {
    marginTop: spacing.sm,
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
    fontFamily: fonts.regular,
  },
});

export default BarChart;
