
import { useEffect, useRef } from 'react';
import {
  Animated,
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { ReactNode } from 'react';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
};

const violet = '#7C3AED';
const deepViolet = '#6D28D9';
const lavender = '#C4B5FD';
const background = '#17152D';
const white = '#F8F7FC';

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  icon,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 1600,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
      glow.stopAnimation();
    };
  }, [glow]);

  const animatePress = (pressed: boolean) => {
    Animated.spring(scale, {
      toValue: pressed ? 0.96 : 1,
      useNativeDriver: true,
      speed: 24,
      bounciness: 5,
    }).start();
  };

  const glowOpacity = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.04, 0.18],
  });

  const isDisabled = disabled || loading;

  return (
    <Animated.View
      style={[
        styles.wrapper,
        { transform: [{ scale }] },
        isDisabled && styles.disabled,
      ]}
    >
      <Animated.View
        pointerEvents="none"
        style={[styles.glow, { opacity: glowOpacity }]}
      />

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        disabled={isDisabled}
        onPress={onPress}
        onPressIn={() => animatePress(true)}
        onPressOut={() => animatePress(false)}
        style={({ pressed }) => [
          styles.button,
          pressed && !isDisabled && styles.pressed,
        ]}
      >
        <View style={styles.labelArea}>
          <Text style={styles.label}>
            {loading ? 'Please wait...' : label}
          </Text>
          <Text style={styles.subtitle}>
            Secure attendance with live location
          </Text>
        </View>

        <View style={styles.icon}>
          {loading ? (
            <ActivityIndicator color={white} size="small" />
          ) : icon ? (
            icon
          ) : (
            <Text style={styles.defaultIcon}>{'>'}</Text>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    marginVertical: 4,
    shadowColor: violet,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 5,
  },
  glow: {
    ...StyleSheet.absoluteFill,
    backgroundColor: lavender,
    borderRadius: 19,
  },
  button: {
    minHeight: 64,
    paddingLeft: 20,
    paddingRight: 10,
    borderRadius: 18,
    backgroundColor: violet,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#A78BFA',
  },
  labelArea: {
    flex: 1,
    paddingVertical: 10,
  },
  label: {
    color: white,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  subtitle: {
    color: '#E9DDFF',
    fontSize: 10,
    marginTop: 4,
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: deepViolet,
    borderWidth: 1,
    borderColor: '#A78BFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultIcon: {
    color: white,
    fontSize: 22,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.65,
  },
  pressed: {
    backgroundColor: deepViolet,
  },
});
