import { useState } from 'react';
import {
  Alert,
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
import { firebaseErrorMessage, registerAccount } from '../services/firebase';

type RegisterScreenProps = {
  onBack: () => void;
  onLogin: () => void;
  onRegistered: (profile: { uid: string; fullName: string; email: string; phoneNumber: string }) => void;
};

export function RegisterScreen({ onBack, onLogin, onRegistered }: RegisterScreenProps) {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const trimmedName = name.trim();
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const nameError = submitted && !trimmedName ? 'Please enter your name.' : undefined;
  const emailError = submitted && !emailIsValid ? 'Enter a valid email address.' : undefined;
  const passwordError = submitted && password.length < 8 ? 'Use at least 8 characters.' : undefined;
  const confirmError = submitted && password !== confirmPassword ? 'Passwords do not match.' : undefined;

  const handleCreateAccount = async () => {
    setSubmitted(true);
    setFormError('');
    if (!trimmedName || !emailIsValid || password.length < 8 || password !== confirmPassword || !acceptedTerms) {
      if (!acceptedTerms) Alert.alert('One last thing', 'Please agree to the Terms and Privacy Policy to continue.');
      return;
    }

    setIsSubmitting(true);
    try {
      const profile = await registerAccount({ fullName: trimmedName, email, phoneNumber: phone, password });
      onRegistered(profile);
    } catch (error) {
      setFormError(firebaseErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardView}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: Math.max(insets.top, 18) + 8, paddingBottom: Math.max(insets.bottom, 24) + 24 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={onBack} style={styles.backButton}>
            <Text style={styles.backArrow}>‹</Text>
          </Pressable>
          <View style={styles.brand}>
            <View style={styles.brandMark}><View style={styles.brandLens} /></View>
            <Text style={styles.brandName}>chotu</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.heading}>
          <View style={styles.kicker}><Text style={styles.kickerText}>YOUR NEXT CHAPTER</Text></View>
          <Text style={styles.title}>Let’s make it<Text style={styles.titleAccent}> yours.</Text></Text>
          <Text style={styles.subtitle}>Create an account and save the little moments you love.</Text>
        </View>

        <View style={styles.form}>
          <FormInput label="Your name" icon="✳" placeholder="e.g. Aanya Sharma" value={name} onChangeText={setName} autoCapitalize="words" autoComplete="name" returnKeyType="next" error={nameError} />
          <FormInput label="Email address" icon="@" placeholder="you@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoComplete="email" textContentType="emailAddress" returnKeyType="next" error={emailError} />
          <FormInput label="Phone number  ·  optional" icon="+" placeholder="Your mobile number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" autoComplete="tel" textContentType="telephoneNumber" />
          <FormInput label="Password" icon="⌑" placeholder="At least 8 characters" value={password} onChangeText={setPassword} secureTextEntry secureToggle autoComplete="new-password" textContentType="newPassword" returnKeyType="next" error={passwordError} />
          <FormInput label="Confirm password" icon="⌑" placeholder="Type your password again" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry secureToggle autoComplete="new-password" textContentType="newPassword" returnKeyType="done" error={confirmError} />
        </View>

        <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: acceptedTerms }} onPress={() => setAcceptedTerms(accepted => !accepted)} style={styles.termsRow}>
          <View style={[styles.checkbox, acceptedTerms && styles.checkboxSelected]}>
            {acceptedTerms ? <Text style={styles.checkmark}>✓</Text> : null}
          </View>
          <Text style={styles.termsText}>I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>.</Text>
        </Pressable>

        {formError ? <Text accessibilityRole="alert" style={styles.formError}>{formError}</Text> : null}

        <View style={styles.buttonWrap}>
          <PrimaryButton label={isSubmitting ? 'Creating account…' : 'Create my account'} onPress={handleCreateAccount} disabled={isSubmitting} icon={<Text style={styles.buttonArrow}>→</Text>} />
        </View>

        <Pressable accessibilityRole="button" onPress={onLogin} style={styles.loginLink}>
          <Text style={styles.loginText}>Already with us? <Text style={styles.loginAccent}>Sign in</Text></Text>
        </Pressable>
        <Text style={styles.footer}>A LITTLE SPACE FOR A LOT OF JOY <Text style={styles.footerStar}>✳</Text></Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { width: 40, height: 40, borderRadius: 14, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  backArrow: { color: colors.ink, fontSize: 31, lineHeight: 34, marginTop: -3 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandMark: { width: 30, height: 30, borderRadius: 11, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  brandLens: { width: 13, height: 13, borderRadius: 7, borderWidth: 2, borderColor: colors.background },
  brandName: { color: colors.ink, fontSize: 20, fontWeight: '800', letterSpacing: -0.8 },
  headerSpacer: { width: 40 },
  heading: { marginTop: 27, marginBottom: 23 },
  kicker: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 7, borderRadius: 14, backgroundColor: colors.accentSoft, marginBottom: 12 },
  kickerText: { color: colors.accentDark, fontSize: 9, fontWeight: '800', letterSpacing: 1.5 },
  title: { color: colors.ink, fontSize: 30, lineHeight: 36, fontWeight: '800', letterSpacing: -1 },
  titleAccent: { color: colors.accent },
  subtitle: { color: colors.muted, fontSize: 13, lineHeight: 19, marginTop: 7 },
  form: { marginTop: 1 },
  termsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2, marginBottom: 19 },
  checkbox: { width: 20, height: 20, borderWidth: 1.5, borderColor: colors.border, borderRadius: 6, marginRight: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  checkboxSelected: { backgroundColor: colors.accent, borderColor: colors.accent },
  checkmark: { color: colors.surface, fontSize: 13, fontWeight: '800', lineHeight: 16 },
  termsText: { flex: 1, color: colors.muted, fontSize: 11, lineHeight: 17 },
  termsLink: { color: colors.ink, fontWeight: '700' },
  buttonWrap: { marginTop: 1 },
  buttonArrow: { color: colors.surface, fontSize: 23, lineHeight: 26 },
  formError: { color: '#A64052', fontSize: 12, lineHeight: 18, marginBottom: 12 },
  loginLink: { alignItems: 'center', paddingVertical: 16 },
  loginText: { color: colors.muted, fontSize: 12 },
  loginAccent: { color: colors.accentDark, fontWeight: '800' },
  footer: { color: colors.subtle, fontSize: 9, fontWeight: '800', letterSpacing: 1.5, textAlign: 'center', marginTop: 'auto', paddingTop: 7 },
  footerStar: { color: colors.accent },
});