
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import type { RootScreen } from './types';
import {
  firebaseErrorMessage,
  loadUserProfile,
  logOut,
  signIn,
  subscribeToAuth,
  type UserProfile,
} from '../services/firebase';
import {
  authenticateBiometric,
  checkBiometricAvailability,
} from '../services/biometric';
import { colors } from '../assets/theme';

const biometricKey = (uid: string) => `biometric_unlock_${uid}`;

export function AppNavigator() {
  const [currentScreen, setCurrentScreen] =
    useState<RootScreen>('Login');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isBiometricLocked, setIsBiometricLocked] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const currentScreenRef = useRef(currentScreen);
  const initialAuthResolved = useRef(false);

  currentScreenRef.current = currentScreen;

  useEffect(() => {
    const unsubscribe = subscribeToAuth(user => {
      void (async () => {
        if (!user) {
          initialAuthResolved.current = true;
          setProfile(null);
          setIsBiometricLocked(false);
          setCurrentScreen('Login');
          setIsAuthReady(true);
          return;
        }

        try {
          const userProfile = await loadUserProfile(user);

          setProfile(userProfile);

          // Gate only the initial restored Firebase session.
          // A fresh password login is handled separately below.
          if (!initialAuthResolved.current) {
            initialAuthResolved.current = true;

            const enabled = await AsyncStorage.getItem(
              biometricKey(user.uid),
            );

            if (enabled === 'true') {
              setIsBiometricLocked(true);
            } else if (currentScreenRef.current !== 'Register') {
              setCurrentScreen('Home');
            }
          } else if (currentScreenRef.current !== 'Register') {
            setCurrentScreen('Home');
          }
        } catch (error) {
          Alert.alert(
            'Could not load your profile',
            firebaseErrorMessage(error),
          );

          setProfile({
            uid: user.uid,
            fullName: user.displayName || '',
            email: user.email || '',
            phoneNumber: '',
          });

          initialAuthResolved.current = true;

          if (currentScreenRef.current !== 'Register') {
            setCurrentScreen('Home');
          }
        } finally {
          setIsAuthReady(true);
        }
      })();
    });

    return unsubscribe;
  }, []);

  const handleBiometricUnlock = async () => {
    if (isUnlocking) return;

    setIsUnlocking(true);

    try {
      const result = await authenticateBiometric();

      if (result.success) {
        setIsBiometricLocked(false);
        setCurrentScreen('Home');
      } else {
        Alert.alert('Unlock not completed', result.message);
      }
    } catch {
      Alert.alert(
        'Biometric error',
        'Could not complete biometric authentication. Please try again.',
      );
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
      setIsBiometricLocked(false);
    } catch (error) {
      Alert.alert('Sign out failed', firebaseErrorMessage(error));
    }
  };

  const handlePasswordSignIn = async (
    email: string,
    password: string,
  ) => {
    const userProfile = await signIn(email, password);

    // Offer biometric unlock only after a successful password login.
    try {
      const availability = await checkBiometricAvailability();

      if (availability.available) {
        await new Promise<void>(resolve => {
          let completed = false;

          const finish = () => {
            if (completed) return;
            completed = true;
            resolve();
          };

          Alert.alert(
            'Enable biometric unlock?',
            'Use your fingerprint or face to unlock Chotu on this device next time.',
            [
              {
                text: 'Not now',
                style: 'cancel',
                onPress: finish,
              },
              {
                text: 'Enable',
                onPress: () => {
                  void (async () => {
                    try {
                      const result = await authenticateBiometric();

                      if (result.success) {
                        await AsyncStorage.setItem(
                          biometricKey(userProfile.uid),
                          'true',
                        );
                        Alert.alert(
                          'Biometric unlock enabled',
                          'You can use biometrics to unlock Chotu on this device.',
                        );
                      } else {
                        Alert.alert(
                          'Not enabled',
                          result.message,
                        );
                      }
                    } catch {
                      Alert.alert(
                        'Not enabled',
                        'Could not save your biometric preference.',
                      );
                    } finally {
                      finish();
                    }
                  })();
                },
              },
            ],
            { cancelable: false },
          );
        });
      }
    } catch {
      // Biometrics are optional. Continue with normal sign-in.
    }

    setProfile(userProfile);
    setIsBiometricLocked(false);
    setCurrentScreen('Home');
  };

  if (!isAuthReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.accent} />
        <Text style={styles.loadingText}>
          Getting your Chotu ready…
        </Text>
      </View>
    );
  }

  if (isBiometricLocked && profile) {
    return (
      <View style={styles.lockScreen}>
        <View style={styles.lockIcon}>
          <Text style={styles.lockEmoji}>🔒</Text>
        </View>

        <Text style={styles.lockTitle}>Welcome back</Text>
        <Text style={styles.lockSubtitle}>
          Verify your identity to unlock Chotu.
        </Text>

        <Pressable
          accessibilityRole="button"
          disabled={isUnlocking}
          onPress={() => void handleBiometricUnlock()}
          style={[
            styles.unlockButton,
            isUnlocking && styles.disabledButton,
          ]}
        >
          {isUnlocking ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.unlockButtonText}>
              Unlock with biometrics
            </Text>
          )}
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() =>
            Alert.alert(
              'Sign out of Chotu?',
              'You will need to sign in again to access your account.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Sign out',
                  style: 'destructive',
                  onPress: () => void handleSignOut(),
                },
              ],
            )
          }
          style={styles.signOutButton}
        >
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>
      </View>
    );
  }

  if (currentScreen === 'Home') {
    return profile ? (
      <DashboardScreen
        uid={profile.uid}
        name={
          profile.fullName ||
          profile.email.split('@')[0] ||
          'Chotu friend'
        }
        email={profile.email}
        phoneNumber={profile.phoneNumber}
        onSignOut={() => void handleSignOut()}
      />
    ) : (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (currentScreen === 'Login') {
    return (
      <LoginScreen
        onCreateAccount={() => setCurrentScreen('Register')}
        onSignIn={handlePasswordSignIn}
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
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: colors.background,
  },
  loadingText: {
    color: colors.muted,
    fontSize: 13,
  },
  lockScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: colors.background,
  },
  lockIcon: {
    width: 86,
    height: 86,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentSoft,
    marginBottom: 22,
  },
  lockEmoji: {
    fontSize: 36,
  },
  lockTitle: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: '800',
  },
  lockSubtitle: {
    color: colors.muted,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 26,
  },
  unlockButton: {
    minHeight: 52,
    width: '100%',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    backgroundColor: colors.accent,
  },
  disabledButton: {
    opacity: 0.7,
  },
  unlockButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  signOutButton: {
    marginTop: 20,
    padding: 12,
  },
  signOutText: {
    color: colors.accentDark,
    fontSize: 14,
    fontWeight: '700',
  },
});
