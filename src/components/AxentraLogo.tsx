
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  size?: number;
  showTagline?: boolean;
  showIconOnly?: boolean;
};

export default function AxentraLogo({
  size = 72,
  showTagline = true,
  showIconOnly = false,
}: Props) {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconBox,
          {
            width: size,
            height: size,
            borderRadius: size * 0.27,
          },
        ]}
      >
        {/* Abstract A symbol */}
        <View
          style={[
            styles.leftStroke,
            {
              height: size * 0.48,
              width: size * 0.085,
              left: size * 0.30,
              top: size * 0.25,
              borderRadius: size * 0.04,
              transform: [{ rotate: '19deg' }],
            },
          ]}
        />

        <View
          style={[
            styles.rightStroke,
            {
              height: size * 0.48,
              width: size * 0.085,
              right: size * 0.30,
              top: size * 0.25,
              borderRadius: size * 0.04,
              transform: [{ rotate: '-19deg' }],
            },
          ]}
        />

        {/* A crossbar */}
        <View
          style={[
            styles.crossbar,
            {
              width: size * 0.29,
              height: size * 0.075,
              top: size * 0.56,
              borderRadius: size * 0.04,
            },
          ]}
        />

        {/* Emerald checkmark */}
        <View
          style={[
            styles.checkShort,
            {
              width: size * 0.16,
              height: size * 0.075,
              left: size * 0.53,
              top: size * 0.58,
              borderRadius: size * 0.04,
              transform: [{ rotate: '45deg' }],
            },
          ]}
        />
        <View
          style={[
            styles.checkLong,
            {
              width: size * 0.28,
              height: size * 0.075,
              left: size * 0.57,
              top: size * 0.53,
              borderRadius: size * 0.04,
              transform: [{ rotate: '-48deg' }],
            },
          ]}
        />
      </View>

      {!showIconOnly && (
        <View style={styles.wordmark}>
          <Text style={[styles.name, { fontSize: size * 0.31 }]}>
            Axentra
          </Text>

          {showTagline && (
            <Text style={[styles.tagline, { fontSize: size * 0.105 }]}>
              PRECISION. PRESENCE. PROGRESS.
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBox: {
    backgroundColor: '#245B3B',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  leftStroke: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
  rightStroke: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
  crossbar: {
    position: 'absolute',
    left: '35%',
    backgroundColor: '#FFFFFF',
  },
  checkShort: {
    position: 'absolute',
    backgroundColor: '#A9D8B2',
  },
  checkLong: {
    position: 'absolute',
    backgroundColor: '#A9D8B2',
  },
  wordmark: {
    alignItems: 'center',
    marginTop: 12,
  },
  name: {
    color: '#24412D',
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  tagline: {
    color: '#718071',
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 5,
  },
});

