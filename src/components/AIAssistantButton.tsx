
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  onPress: () => void;
};

export function AIAssistantButton({ onPress }: Props) {
  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Open AI voice assistant"
        style={({ pressed }) => [
          styles.button,
          pressed && styles.pressed,
        ]}
      >
        <Text style={styles.icon}>✦</Text>
      </Pressable>
      <Text style={styles.label}>AI Assistant</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    right: 18,
    bottom: 82,
    alignItems: 'center',
    zIndex: 100,
    elevation: 10,
  },
  button: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  icon: {
    fontSize: 30,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  label: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '600',
    color: '#2563EB',
  },
});
