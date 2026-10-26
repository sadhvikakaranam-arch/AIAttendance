import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../assets/theme';

type Props = { label: string; onPress: () => void; disabled?: boolean; icon?: ReactNode };

export function PrimaryButton({ label, onPress, disabled = false, icon }: Props) {
  return (
    <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress}
      style={({ pressed }) => [styles.button, disabled && styles.disabled, pressed && !disabled && styles.pressed]}>
      <Text style={styles.label}>{label}</Text>
      {icon ? <View style={styles.icon}>{icon}</View> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 58, paddingLeft: 22, paddingRight: 10, borderRadius: 18, backgroundColor: colors.ink, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { color: colors.surface, fontSize: 15, fontWeight: '700' },
  icon: { width: 40, height: 40, borderRadius: 14, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  disabled: { opacity: 0.55 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
});