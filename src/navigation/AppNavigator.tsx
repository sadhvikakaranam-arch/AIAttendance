import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import type { RootScreen } from './types';
import { firebaseErrorMessage, loadUserProfile, logOut, signIn, subscribeToAuth, type UserProfile } from '../services/firebase';
import { colors } from '../assets/theme';

export function AppNavigator() {
  const [currentScreen, setCurrentScreen] = useState<RootScreen>('Login');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const currentScreenRef = useRef(currentScreen);
  currentScreenRef.current = currentScreen;

  useEffect(() => subscribeToAuth(user => {
    if (!user) {
      setProfile(null);
      setCurrentScreen('Login');
      setIsAuthReady(true);
      return;
    }
    void loadUserProfile(user)
      .then(userProfile => {
        setProfile(userProfile);
        if (currentScreenRef.current !== 'Register') setCurrentScreen('Home');
      })
      .catch(error => {
        Alert.alert('Could not load your profile', firebaseErrorMessage(error));
        setProfile({ uid: user.uid, fullName: user.displayName || '', email: user.email || '', phoneNumber: '' });
        if (currentScreenRef.current !== 'Register') setCurrentScreen('Home');
      })
      .finally(() => setIsAuthReady(true));
  }), []);

  if (!isAuthReady) {
    return <View style={styles.loading}><ActivityIndicator color={colors.accent} /><Text style={styles.loadingText}>Getting your Chotu ready…</Text></View>;
  }

  if (currentScreen === 'Home') {
    return profile ? (
      <DashboardScreen
        uid={profile.uid}
        name={profile.fullName || profile.email.split('@')[0] || 'Chotu friend'}
        email={profile.email}
        phoneNumber={profile.phoneNumber}
        onSignOut={async () => { try { await logOut(); } catch (error) { Alert.alert('Sign out failed', firebaseErrorMessage(error)); } }}
      />
    ) : <View style={styles.loading}><ActivityIndicator color={colors.accent} /></View>;
  }

  if (currentScreen === 'Login') {
    return (
      <LoginScreen
        onCreateAccount={() => setCurrentScreen('Register')}
        onSignIn={async (email, password) => {
          const userProfile = await signIn(email, password);
          setProfile(userProfile);
          setCurrentScreen('Home');
        }}
      />
    );
  }

  if (currentScreen === 'Register') {
    return (
      <RegisterScreen
        onBack={() => setCurrentScreen('Welcome')}
        onLogin={() => setCurrentScreen('Login')}
          onRegistered={userProfile => {
            setProfile(userProfile);
            setCurrentScreen('Home');
        }}
      />
    );
  }

  return (
    <WelcomeScreen
      onGetStarted={() => setCurrentScreen('Register')}
      onSignIn={() => setCurrentScreen('Login')}
    />
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: colors.background },
  loadingText: { color: colors.muted, fontSize: 13 },
});