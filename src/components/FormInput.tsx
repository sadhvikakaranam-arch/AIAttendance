import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type KeyboardTypeOptions, type TextInputProps } from 'react-native';
import { colors } from '../assets/theme';

type Props = { label: string; icon: string; error?: string; secureToggle?: boolean; keyboardType?: KeyboardTypeOptions } & Omit<TextInputProps, 'style'>;

export function FormInput({ label, icon, error, secureToggle = false, secureTextEntry, ...inputProps }: Props) {
  const [visible, setVisible] = useState(false);
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrap, error && styles.inputError]}>
        <Text style={styles.icon}>{icon}</Text>
        <TextInput {...inputProps} accessibilityLabel={label} autoCapitalize={inputProps.autoCapitalize ?? 'none'}
          placeholderTextColor={colors.subtle} secureTextEntry={Boolean(secureToggle && secureTextEntry && !visible)} style={styles.input} />
        {secureToggle ? <Pressable accessibilityRole="button" accessibilityLabel={visible ? 'Hide password' : 'Show password'} onPress={() => setVisible(v => !v)} hitSlop={10}><Text style={styles.toggle}>{visible ? 'HIDE' : 'SHOW'}</Text></Pressable> : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { marginBottom: 15 },
  label: { color: colors.ink, fontSize: 12, fontWeight: '700', marginBottom: 8 },
  inputWrap: { minHeight: 52, borderWidth: 1, borderColor: colors.border, borderRadius: 15, backgroundColor: colors.field, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14 },
  inputError: { borderColor: colors.accent },
  icon: { width: 27, color: colors.accent, fontSize: 16, fontWeight: '700' },
  input: { flex: 1, minHeight: 50, paddingVertical: 0, color: colors.ink, fontSize: 14 },
  toggle: { color: colors.muted, fontSize: 9, fontWeight: '800', letterSpacing: 0.8, paddingLeft: 8 },
  error: { color: colors.accentDark, fontSize: 11, marginTop: 5 },
});