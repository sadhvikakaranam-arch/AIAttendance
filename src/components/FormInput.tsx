
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type TextInputProps,
} from 'react-native';
import { colors } from '../assets/theme';

type Props = {
  label: string;
  icon: string;
  error?: string;
  secureToggle?: boolean;
  keyboardType?: KeyboardTypeOptions;
} & Omit<TextInputProps, 'style'>;

export function FormInput({
  label,
  icon,
  error,
  secureToggle = false,
  secureTextEntry,
  ...inputProps
}: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>

      <View
        style={[
          styles.inputWrap,
          error ? styles.inputError : undefined,
        ]}
      >
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>{icon}</Text>
        </View>

        <TextInput
          {...inputProps}
          accessibilityLabel={label}
          autoCapitalize={inputProps.autoCapitalize ?? 'none'}
          placeholderTextColor={colors.subtle}
          secureTextEntry={Boolean(
            secureToggle && secureTextEntry && !visible,
          )}
          selectionColor={colors.accent}
          style={styles.input}
        />

        {secureToggle ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={visible ? 'Hide password' : 'Show password'}
            onPress={() => setVisible(value => !value)}
            hitSlop={10}
            style={styles.toggleButton}
          >
            <Text style={styles.toggle}>
              {visible ? 'HIDE' : 'SHOW'}
            </Text>
          </Pressable>
        ) : null}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    marginBottom: 16,
  },
  label: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    marginLeft: 2,
  },
  inputWrap: {
    minHeight: 56,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 17,
    backgroundColor: colors.field,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
  },
  inputError: {
    borderColor: '#C65D5D',
    backgroundColor: '#FFF9F8',
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },
  icon: {
    color: colors.accentDark,
    fontSize: 15,
    fontWeight: '800',
  },
  input: {
    flex: 1,
    minHeight: 52,
    paddingVertical: 0,
    color: colors.ink,
    fontSize: 14,
  },
  toggleButton: {
    paddingLeft: 8,
    paddingVertical: 10,
  },
  toggle: {
    color: colors.accentDark,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  error: {
    color: '#A64040',
    fontSize: 11,
    marginTop: 6,
    marginLeft: 2,
  },
});
