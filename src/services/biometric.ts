
import {
  isSensorAvailable,
  simplePrompt,
} from '@sbaiahmed1/react-native-biometrics';

export async function checkBiometricAvailability() {
  try {
    const sensor = await isSensorAvailable();

    return {
      available: sensor.available,
      type: sensor.biometryType ?? 'Biometrics',
      error: sensor.error,
    };
  } catch {
    return {
      available: false,
      type: 'Unknown',
      error: 'Could not check biometric availability.',
    };
  }
}

export async function authenticateBiometric() {
  try {
    const sensor = await isSensorAvailable();

    if (!sensor.available) {
      return {
        success: false,
        message:
          sensor.error ||
          'Set up biometrics in your device settings first.',
      };
    }

    const result = await simplePrompt(
      'Authenticate to unlock Chotu',
    );

    return {
      success: result.success,
      message: result.success
        ? 'Authentication successful.'
        : 'Authentication was not completed.',
    };
  } catch {
    return {
      success: false,
      message: 'Biometric authentication failed or was cancelled.',
    };
  }
}
