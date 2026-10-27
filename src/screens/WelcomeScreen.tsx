
import { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../assets/theme';
import { PrimaryButton } from '../components/PrimaryButton';

type Props = {
  onGetStarted: () => void;
  onSignIn: () => void;
};

export function WelcomeScreen({ onGetStarted, onSignIn }: Props) {
  const insets = useSafeAreaInsets();
  const entrance = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(entrance, {
      toValue: 1,
      damping: 15,
      stiffness: 85,
      useNativeDriver: true,
    }).start();

    const floatingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ]),
    );

    floatingAnimation.start();
    return () => floatingAnimation.stop();
  }, [entrance, float]);

  const entranceStyle = {
    opacity: entrance,
    transform: [
      {
        translateY: entrance.interpolate({
          inputRange: [0, 1],
          outputRange: [22, 0],
        }),
      },
    ],
  };

  const cameraFloat = {
    transform: [
      {
        translateY: float.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -7],
        }),
      },
    ],
  };

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: Math.max(insets.top, 20) + 12,
          paddingBottom: Math.max(insets.bottom, 20) + 12,
        },
      ]}
    >
      <View style={styles.topBar}>
        <View style={styles.brand}>
          <View style={styles.brandMark}>
            <View style={styles.brandLens} />
          </View>
          <Text style={styles.brandName}>chotu</Text>
        </View>

        <View style={styles.tag}>
          <Text style={styles.tagText}>MADE FOR YOUR MOMENTS</Text>
        </View>
      </View>

      <Animated.View style={[styles.content, entranceStyle]}>
        <View
          style={styles.artwork}
          accessible
          accessibilityLabel="A cheerful green camera illustration"
        >
          <View style={styles.sun} />
          <View style={styles.orbit} />

          <Text style={[styles.sparkle, styles.sparkleOne]}>*</Text>
          <Text style={[styles.sparkle, styles.sparkleTwo]}>+</Text>

          <Animated.View style={[styles.camera, cameraFloat]}>
            <View style={styles.cameraTop} />
            <View style={styles.cameraFlash} />

            <View style={styles.cameraLensOuter}>
              <View style={styles.cameraLensInner}>
                <View style={styles.cameraLensShine} />
              </View>
            </View>

            <View style={styles.cameraDot} />
          </Animated.View>

          <View style={styles.artworkCaption}>
            <View style={styles.captionDot} />
            <Text style={styles.captionText}>
              your pocket-sized happy place
            </Text>
          </View>
        </View>

        <View style={styles.intro}>
          <Text style={styles.eyebrow}>A LITTLE HELLO FROM US</Text>

          <Text style={styles.title}>
            Welcome to{'\n'}
            <Text style={styles.titleAccent}>Chotu.</Text>
          </Text>

          <Text style={styles.description}>
            Little moments happen every day. Let&apos;s make them a little
            more special.
          </Text>
        </View>

        <View style={styles.bottom}>
          <PrimaryButton
            label="Let's get started"
            onPress={onGetStarted}
            icon={<Text style={styles.arrow}>→</Text>}
          />

          <Text style={styles.footer}>
            SMALL MOMENTS. BIG SMILES.
            <Text style={styles.footerStar}>  *</Text>
          </Text>

          <Pressable
            onPress={onSignIn}
            accessibilityRole="button"
            style={styles.signIn}
          >
            <Text style={styles.signInText}>
              Already have an account?{' '}
              <Text style={styles.signInAccent}>Sign in</Text>
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 25,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  brandMark: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandLens: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2.5,
    borderColor: colors.background,
  },
  brandName: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -1,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.accentSoft,
  },
  tagText: {
    color: colors.accentDark,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 16,
  },
  artwork: {
    height: '42%',
    minHeight: 200,
    maxHeight: 340,
    borderRadius: 30,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  sun: {
    width: 194,
    height: 194,
    borderRadius: 97,
    backgroundColor: '#C9E5D0',
    position: 'absolute',
    top: '10%',
  },
  orbit: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1,
    borderColor: '#B5D8BF',
    position: 'absolute',
  },
  sparkle: {
    position: 'absolute',
    color: colors.accentDark,
    fontSize: 25,
    fontWeight: '800',
  },
  sparkleOne: {
    top: '18%',
    left: '18%',
  },
  sparkleTwo: {
    top: '27%',
    right: '17%',
  },
  camera: {
    width: 172,
    height: 118,
    borderRadius: 27,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: colors.accentDark,
    shadowOffset: { width: 0, height: 11 },
    shadowOpacity: 0.2,
    shadowRadius: 13,
    elevation: 8,
  },
  cameraTop: {
    position: 'absolute',
    width: 58,
    height: 13,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: colors.accentDark,
    top: -8,
    left: 25,
  },
  cameraFlash: {
    position: 'absolute',
    width: 17,
    height: 10,
    borderRadius: 4,
    backgroundColor: '#F3FAF3',
    top: 17,
    left: 20,
  },
  cameraLensOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F5FAF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraLensInner: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: colors.accentDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraLensShine: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#D7ECDD',
    borderWidth: 4,
    borderColor: '#9CCBA9',
  },
  cameraDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#F3FAF3',
    position: 'absolute',
    right: 21,
    top: 18,
  },
  artworkCaption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    position: 'absolute',
    bottom: 17,
  },
  captionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  captionText: {
    color: colors.accentDark,
    fontSize: 11,
    fontWeight: '600',
  },
  intro: {
    paddingTop: 18,
    paddingBottom: 8,
  },
  eyebrow: {
    color: colors.accentDark,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 9,
  },
  title: {
    color: colors.ink,
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: -1.7,
    lineHeight: 46,
  },
  titleAccent: {
    color: colors.accent,
  },
  description: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 9,
    maxWidth: 300,
  },
  bottom: {
    paddingTop: 8,
  },
  arrow: {
    color: colors.surface,
    fontSize: 23,
    lineHeight: 26,
  },
  footer: {
    color: colors.subtle,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.7,
    textAlign: 'center',
    marginTop: 14,
  },
  footerStar: {
    color: colors.accent,
  },
  signIn: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  signInText: {
    color: colors.muted,
    fontSize: 12,
  },
  signInAccent: {
    color: colors.accentDark,
    fontWeight: '800',
  },
});
