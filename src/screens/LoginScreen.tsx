import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../assets/theme';
import { FormInput } from '../components/FormInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { firebaseErrorMessage, sendPasswordReset } from '../services/firebase';

type LoginScreenProps = {
  onCreateAccount: () => void;
  onSignIn: (email: string, password: string) => Promise<void>;
};

export function LoginScreen({ onCreateAccount, onSignIn }: LoginScreenProps) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const heroEntrance = useRef(new Animated.Value(0)).current;
  const formEntrance = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(130, [
      Animated.spring(heroEntrance, {
        toValue: 1,
        damping: 14,
        stiffness: 100,
        useNativeDriver: true,
      }),
      Animated.spring(formEntrance, {
        toValue: 1,
        damping: 16,
        stiffness: 95,
        useNativeDriver: true,
      }),
    ]).start();

    const floatAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: 1, duration: 1700, useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 1700, useNativeDriver: true }),
      ]),
    );
    floatAnimation.start();

    return () => floatAnimation.stop();
  }, [float, formEntrance, heroEntrance]);

  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const heroMotion = {
    opacity: heroEntrance,
    transform: [
      { translateY: heroEntrance.interpolate({ inputRange: [0, 1], outputRange: [22, 0] }) },
      { translateY: float.interpolate({ inputRange: [0, 1], outputRange: [0, -8] }) },
    ],
  };
  const formMotion = {
    opacity: formEntrance,
    transform: [{ translateY: formEntrance.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) }],
  };

  const handleSignIn = async () => {
    setSubmitted(true);
    setFormError('');
    if (!emailIsValid || !password) return;
    setIsSubmitting(true);
    try {
      await onSignIn(email.trim(), password);
    } catch (error) {
      setFormError(firebaseErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!emailIsValid) {
      setSubmitted(true);
      setFormError('Enter your email address first, then tap Forgot password.');
      return;
    }
    try {
      await sendPasswordReset(email);
      Alert.alert('Check your email', 'We sent you a password reset link.');
    } catch (error) {
      setFormError(firebaseErrorMessage(error));
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardView}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: Math.max(insets.top, 18) + 12, paddingBottom: Math.max(insets.bottom, 20) + 20 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.brand}>
            <View style={styles.brandMark}><View style={styles.brandLens} /></View>
            <Text style={styles.brandName}>chotu</Text>
          </View>
          <View style={styles.headerPill}><Text style={styles.headerPillText}>YOUR HAPPY PLACE</Text></View>
        </View>

        <Animated.View style={[styles.hero, heroMotion]}>
          <View style={styles.orbit} />
          <View style={styles.orbitInner} />
          <Animated.View style={[styles.sparkle, styles.sparkleLeft, { transform: [{ rotate: '-12deg' }, { scale: float.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1.12] }) }] }]}>
            <Text style={styles.sparkleText}>✦</Text>
          </Animated.View>
          <Animated.View style={[styles.sparkle, styles.sparkleRight, { opacity: float.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }]}>
            <Text style={styles.sparkleText}>✧</Text>
          </Animated.View>
          <View style={styles.camera}>
            <View style={styles.cameraTop} />
            <View style={styles.cameraFlash} />
            <View style={styles.lensOuter}>
              <View style={styles.lensInner}><View style={styles.lensGlint} /></View>
            </View>
            <View style={styles.cameraDot} />
          </View>
          <View style={styles.heroCaption}>
            <View style={styles.captionDot} />
            <Text style={styles.captionText}>A little joy, just for you</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.intro, formMotion]}>
          <Text style={styles.eyebrow}>GOOD TO SEE YOU AGAIN</Text>
          <Text style={styles.title}>Welcome<Text style={styles.titleAccent}> back.</Text></Text>
          <Text style={styles.subtitle}>Your favorite little moments are waiting.</Text>
        </Animated.View>

        <Animated.View style={[styles.form, formMotion]}>
          <FormInput
            label="Email address"
            icon="@"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
            error={submitted && !emailIsValid ? 'Enter a valid email address.' : undefined}
          />
          <FormInput
            label="Password"
            icon="⌑"
            placeholder="Your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            secureToggle
            autoComplete="current-password"
            textContentType="password"
            returnKeyType="done"
            error={submitted && !password ? 'Please enter your password.' : undefined}
          />
          <Pressable
            accessibilityRole="button"
            onPress={handlePasswordReset}
            style={styles.forgotButton}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </Pressable>
          {formError ? <Text accessibilityRole="alert" style={styles.formError}>{formError}</Text> : null}
          <View style={styles.signInButton}>
            <PrimaryButton label={isSubmitting ? 'Signing in…' : 'Sign in to Chotu'} onPress={handleSignIn} disabled={isSubmitting} icon={<Text style={styles.buttonArrow}>→</Text>} />
          </View>
          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerLabel}>A SMALL NOTE</Text>
            <View style={styles.divider} />
          </View>
          <Text style={styles.privacyNote}>Your memories are yours. We’ll always treat them with care.</Text>
        </Animated.View>

        <View style={styles.footer}>
          <Text style={styles.footerPrompt}>New to Chotu? </Text>
          <Pressable accessibilityRole="button" onPress={onCreateAccount} hitSlop={8}>
            <Text style={styles.createAccount}>Create an account</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1, paddingHorizontal: 25 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  brandMark: { width: 34, height: 34, borderRadius: 12, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  brandLens: { width: 14, height: 14, borderRadius: 7, borderWidth: 2.5, borderColor: colors.background },
  brandName: { color: colors.ink, fontSize: 22, fontWeight: '800', letterSpacing: -1 },
  headerPill: { paddingHorizontal: 11, paddingVertical: 8, borderRadius: 16, backgroundColor: colors.accentSoft },
  headerPillText: { color: colors.accentDark, fontSize: 8, fontWeight: '800', letterSpacing: 1 },
  hero: { height: 184, marginTop: 18, borderRadius: 28, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  orbit: { position: 'absolute', width: 158, height: 158, borderRadius: 79, borderWidth: 1, borderColor: '#D9CCF5' },
  orbitInner: { position: 'absolute', width: 126, height: 126, borderRadius: 63, backgroundColor: '#E3D9FA' },
  sparkle: { position: 'absolute' },
  sparkleLeft: { top: 35, left: '23%' },
  sparkleRight: { right: '22%', bottom: 40 },
  sparkleText: { color: colors.accentDark, fontSize: 25, fontWeight: '700' },
  camera: { width: 138, height: 94, borderRadius: 24, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', shadowColor: '#685299', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.18, shadowRadius: 12, elevation: 7 },
  cameraTop: { position: 'absolute', width: 48, height: 11, borderTopLeftRadius: 7, borderTopRightRadius: 7, backgroundColor: colors.accentDark, top: -7, left: 21 },
  cameraFlash: { position: 'absolute', width: 14, height: 8, borderRadius: 3, backgroundColor: '#E8DEFF', top: 14, left: 17 },
  lensOuter: { width: 59, height: 59, borderRadius: 30, backgroundColor: '#F8F3FF', alignItems: 'center', justifyContent: 'center' },
  lensInner: { width: 45, height: 45, borderRadius: 23, backgroundColor: '#716097', alignItems: 'center', justifyContent: 'center' },
  lensGlint: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#D9CCFA', borderWidth: 4, borderColor: '#A995DC' },
  cameraDot: { position: 'absolute', width: 8, height: 8, borderRadius: 4, backgroundColor: '#E8DEFF', right: 17, top: 15 },
  heroCaption: { position: 'absolute', bottom: 13, flexDirection: 'row', alignItems: 'center', gap: 6 },
  captionDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent },
  captionText: { color: '#75698E', fontSize: 10, fontWeight: '600', letterSpacing: 0.2 },
  intro: { marginTop: 19, marginBottom: 17 },
  eyebrow: { color: colors.accentDark, fontSize: 9, fontWeight: '800', letterSpacing: 1.8, marginBottom: 7 },
  title: { color: colors.ink, fontSize: 33, lineHeight: 39, fontWeight: '800', letterSpacing: -1.1 },
  titleAccent: { color: colors.accent },
  subtitle: { color: colors.muted, fontSize: 13, marginTop: 5 },
  form: { width: '100%' },
  formError: { color: '#A64052', fontSize: 12, lineHeight: 18, marginBottom: 10 },
  forgotButton: { alignSelf: 'flex-end', marginTop: -5, marginBottom: 14, paddingVertical: 4 },
  forgotText: { color: colors.accentDark, fontSize: 12, fontWeight: '700' },
  signInButton: { marginTop: 1 },
  buttonArrow: { color: colors.surface, fontSize: 23, lineHeight: 26 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 11, marginTop: 18 },
  divider: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerLabel: { color: colors.subtle, fontSize: 8, fontWeight: '800', letterSpacing: 1.3 },
  privacyNote: { color: colors.muted, fontSize: 11, lineHeight: 17, textAlign: 'center', marginTop: 9 },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 'auto', paddingTop: 22 },
  footerPrompt: { color: colors.muted, fontSize: 12 },
  createAccount: { color: colors.accentDark, fontSize: 12, fontWeight: '800' },
});