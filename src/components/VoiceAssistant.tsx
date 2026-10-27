
import React, { useState } from 'react';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Tts from 'react-native-tts';
import { useRecognizer } from 'react-native-nitro-speech';

type Props = {
  onCommand?: (command: string) => void;
};

export function VoiceAssistant({ onCommand }: Props) {
  const [listening, setListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [language, setLanguage] = useState<'en-US' | 'kn-IN'>('en-US');

  const speak = (message: string, kannadaMessage?: string) => {
    Tts.stop();
    Tts.speak(language === 'kn-IN' && kannadaMessage
      ? kannadaMessage
      : message);
  };

  const { startListening, stopListening } = useRecognizer({
    onReadyForSpeech: () => setListening(true),
    onRecordingStopped: () => setListening(false),
    onResult: (batches) => {
      const text = batches.join(' ').trim();
      if (!text) return;

      setSpokenText(text);
      setListening(false);

      const command = text.toLowerCase();

      if (
        command.includes('check me in') ||
        command.includes('check in') ||
        command.includes('ಹಾಜರಾತಿ')
      ) {
        speak(
          'I heard your check-in request. Please confirm before marking attendance.',
          'ನಿಮ್ಮ ಚೆಕ್-ಇನ್ ವಿನಂತಿ ಬಂದಿದೆ. ಹಾಜರಾತಿ ದಾಖಲಿಸುವ ಮೊದಲು ದೃಢೀಕರಿಸಿ.'
        );
        onCommand?.('checkin');
      } else if (
        command.includes('check me out') ||
        command.includes('check out')
      ) {
        speak(
          'I heard your check-out request. Please confirm before continuing.',
          'ನಿಮ್ಮ ಚೆಕ್-ಔಟ್ ವಿನಂತಿ ಬಂದಿದೆ. ಮುಂದುವರಿಯುವ ಮೊದಲು ದೃಢೀಕರಿಸಿ.'
        );
        onCommand?.('checkout');
      } else if (command.includes('calendar')) {
        speak('Opening your calendar.', 'ನಿಮ್ಮ ಕ್ಯಾಲೆಂಡರ್ ತೆರೆಯುತ್ತಿದ್ದೇನೆ.');
        onCommand?.('calendar');
      } else if (command.includes('attendance')) {
        speak('Opening your attendance.', 'ನಿಮ್ಮ ಹಾಜರಾತಿ ತೆರೆಯುತ್ತಿದ್ದೇನೆ.');
        onCommand?.('attendance');
      } else {
        speak(
          `I heard ${text}. Please try a supported command.`,
          `ನೀವು ಹೇಳಿದ್ದು ${text}. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ.`
        );
      }
    },
    onError: () => {
      setListening(false);
      speak(
        'Sorry, I could not recognise that. Please try again.',
        'ಕ್ಷಮಿಸಿ, ನಿಮ್ಮ ಮಾತು ಅರ್ಥವಾಗಲಿಲ್ಲ. ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ.'
      );
    },
    onPermissionDenied: () => {
      setListening(false);
      Alert.alert(
        'Microphone permission',
        'Allow microphone access in Android settings to use voice commands.'
      );
    },
  });

  const startVoice = async () => {
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
      );

      if (result !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert(
          'Permission required',
          'Axentra needs microphone permission for voice commands.'
        );
        return;
      }
    }

    try {
      await startListening({ locale: language });
    } catch {
      setListening(false);
      Alert.alert(
        'Voice assistant',
        'Could not start listening. Please try again.'
      );
    }
  };

  const toggleListening = async () => {
    if (listening) {
      await stopListening();
      setListening(false);
    } else {
      await startVoice();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Axentra Voice Assistant</Text>

      <View style={styles.languages}>
        <Pressable
          style={[styles.languageButton, language === 'en-US' && styles.selected]}
          onPress={() => setLanguage('en-US')}
        >
          <Text style={styles.languageText}>English</Text>
        </Pressable>

        <Pressable
          style={[styles.languageButton, language === 'kn-IN' && styles.selected]}
          onPress={() => setLanguage('kn-IN')}
        >
          <Text style={styles.languageText}>ಕನ್ನಡ</Text>
        </Pressable>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={listening ? 'Stop listening' : 'Start voice command'}
        style={[styles.micButton, listening && styles.micActive]}
        onPress={toggleListening}
      >
        <Text style={styles.micIcon}>{listening ? '■' : '🎙️'}</Text>
        <Text style={styles.micText}>
          {listening ? 'Stop listening' : 'Tap to speak'}
        </Text>
      </Pressable>

      <Text style={styles.status}>
        {listening ? 'Listening…' : 'Ready for your command'}
      </Text>

      {!!spokenText && (
        <Text style={styles.transcript}>You said: {spokenText}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#172554',
    marginBottom: 16,
  },
  languages: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  languageButton: {
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
  },
  selected: {
    backgroundColor: '#BFDBFE',
  },
  languageText: {
    color: '#1E293B',
    fontWeight: '600',
  },
  micButton: {
    width: 130,
    height: 110,
    borderRadius: 22,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  micActive: {
    backgroundColor: '#DC2626',
  },
  micIcon: {
    fontSize: 28,
    color: '#FFFFFF',
  },
  micText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: 6,
  },
  status: {
    marginTop: 14,
    color: '#475569',
  },
  transcript: {
    marginTop: 10,
    color: '#172554',
    textAlign: 'center',
  },
});
