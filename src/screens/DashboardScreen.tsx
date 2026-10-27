
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  BottomNavigation,
  type MainTab,
} from '../components/BottomNavigation';
import { AIAssistantButton } from '../components/AIAssistantButton';
import { VoiceAssistant } from '../components/VoiceAssistant';
import { colors } from '../assets/theme';

import {
  checkInWithLocation,
  checkOutWithLocation,
  firebaseErrorMessage,
  subscribeToAttendance,
  type StoredAttendance,
} from '../services/firebase';

import { getAttendanceLocation } from '../services/location';

import { AttendanceScreen } from './AttendanceScreen';
import { CalendarScreen } from './CalendarScreen';
import { HomeScreen, type AttendanceRecord } from './HomeScreen';
import { ProfileScreen } from './ProfileScreen';

type Props = {
  uid: string;
  name: string;
  email: string;
  phoneNumber: string;
  onSignOut: () => void;
};

function formatTime(date: Date | null | undefined) {
  if (!date) return '--:--';

  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function formatDate(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatDuration(minutes: number | null) {
  if (minutes === null) return 'In progress';

  return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, '0')}m`;
}

function formatLocation(latitude: number, longitude: number) {
  return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
}

function getTodayKey() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${now.getFullYear()}-${month}-${day}`;
}

function mapAttendance(
  record: StoredAttendance,
  now: number,
): AttendanceRecord {
  const date = formatDate(record.dateKey);

  const minutesWorked = record.checkOutAt
    ? record.workedMinutes
    : Math.max(
        0,
        Math.floor((now - record.checkInAt.getTime()) / 60000),
      );

  return {
    id: record.id,
    date: new Intl.DateTimeFormat('en-IN', {
      month: 'short',
      day: 'numeric',
    }).format(date),
    dateKey: record.dateKey,
    day:
      record.dateKey === getTodayKey()
        ? 'Today'
        : new Intl.DateTimeFormat('en-IN', {
            weekday: 'long',
          }).format(date),
    checkIn: formatTime(record.checkInAt),
    checkOut: formatTime(record.checkOutAt),
    hours: formatDuration(minutesWorked),
    minutesWorked,
    checkInLocation: formatLocation(
      record.checkInLocation.latitude,
      record.checkInLocation.longitude,
    ),
    checkOutLocation: record.checkOutLocation
      ? formatLocation(
          record.checkOutLocation.latitude,
          record.checkOutLocation.longitude,
        )
      : '',
    checkedIn: record.checkOutAt === null,
    status: 'Present',
  };
}

export function DashboardScreen({
  uid,
  name,
  email,
  phoneNumber,
  onSignOut,
}: Props) {
  const insets = useSafeAreaInsets();

  const [tab, setTab] = useState<MainTab>('Home');
  const [storedRecords, setStoredRecords] = useState<StoredAttendance[]>([]);
  const [isLoadingAttendance, setIsLoadingAttendance] = useState(true);
  const [isWorking, setIsWorking] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [showAssistant, setShowAssistant] = useState(false);

  useEffect(() => {
    setIsLoadingAttendance(true);

    const unsubscribe = subscribeToAttendance(
      uid,
      records => {
        setStoredRecords(records);
        setIsLoadingAttendance(false);
      },
      error => {
        setIsLoadingAttendance(false);
        Alert.alert(
          'Attendance unavailable',
          firebaseErrorMessage(error),
        );
      },
    );

    return unsubscribe;
  }, [uid]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 30_000);

    return () => clearInterval(timer);
  }, []);

  const records = useMemo(
    () => storedRecords.map(record => mapAttendance(record, now)),
    [storedRecords, now],
  );

  const todayKey = getTodayKey();

  const todayRecord = storedRecords.find(
    record => record.dateKey === todayKey,
  );

  const checkedIn = Boolean(
    todayRecord && !todayRecord.checkOutAt,
  );

  const withLocation = async (
    action: 'check-in' | 'check-out',
  ) => {
    if (isWorking) return;

    if (action === 'check-in' && checkedIn) {
      Alert.alert('Already checked in', 'You have already checked in today.');
      return;
    }

    if (action === 'check-out' && !checkedIn) {
      Alert.alert('Not checked in', 'Check in before checking out.');
      return;
    }

    setIsWorking(true);

    try {
      const location = await getAttendanceLocation();

      if (action === 'check-in') {
        await checkInWithLocation(uid, location);

        Alert.alert(
          'Checked in!',
          'Your check-in time and location have been saved.',
        );
      } else {
        await checkOutWithLocation(uid, location);

        Alert.alert(
          'Checked out!',
          'Your check-out time and location have been saved.',
        );
      }
    } catch (error) {
      Alert.alert(
        action === 'check-in'
          ? 'Check-in not saved'
          : 'Check-out not saved',
        firebaseErrorMessage(error),
      );
    } finally {
      setIsWorking(false);
    }
  };

  const confirmAttendanceAction = (
    action: 'check-in' | 'check-out',
  ) => {
    if (isWorking) return;

    Alert.alert(
      action === 'check-in' ? 'Confirm check-in' : 'Confirm check-out',
      action === 'check-in'
        ? 'Use your current location to record your attendance?'
        : 'Use your current location to record your check-out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => void withLocation(action),
        },
      ],
    );
  };

  const handleVoiceCommand = (command: string) => {
    switch (command) {
      case 'calendar':
        setTab('Calendar');
        break;

      case 'attendance':
        setTab('Attendance');
        break;

      case 'checkin':
        confirmAttendanceAction('check-in');
        break;

      case 'checkout':
        confirmAttendanceAction('check-out');
        break;

      default:
        break;
    }
  };

  const handleAssistantCommand = (command: string) => {
    handleVoiceCommand(command);

    if (['calendar', 'attendance', 'checkin', 'checkout'].includes(command)) {
      setShowAssistant(false);
    }
  };

  const content =
    tab === 'Home' ? (
      <HomeScreen
        name={name}
        checkedIn={checkedIn}
        checkInTime={
          todayRecord
            ? formatTime(todayRecord.checkInAt)
            : undefined
        }
        checkOutTime={
          todayRecord?.checkOutAt
            ? formatTime(todayRecord.checkOutAt)
            : undefined
        }
        checkInLocation={
          todayRecord
            ? formatLocation(
                todayRecord.checkInLocation.latitude,
                todayRecord.checkInLocation.longitude,
              )
            : undefined
        }
        isWorking={isWorking}
        records={records}
        onCheckIn={() => void withLocation('check-in')}
        onCheckOut={() => void withLocation('check-out')}
        onOpenAttendance={() => setTab('Attendance')}
        onOpenProfile={() => setTab('Profile')}
      />
    ) : tab === 'Attendance' ? (
      <AttendanceScreen
        records={records}
        isLoading={isLoadingAttendance}
      />
    ) : tab === 'Calendar' ? (
      <CalendarScreen onBack={() => setTab('Home')} />
    ) : (
      <ProfileScreen
        name={name}
        email={email}
        phoneNumber={phoneNumber}
        onSignOut={onSignOut}
      />
    );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {content}
      </View>

      <View
        style={[
          styles.bottomNavigation,
          { paddingBottom: Math.max(insets.bottom, 6) },
        ]}
      >
        <BottomNavigation activeTab={tab} onChange={setTab} />
      </View>

      {tab === 'Home' && (
        <AIAssistantButton
          onPress={() => setShowAssistant(true)}
        />
      )}

      <Modal
        visible={showAssistant}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAssistant(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close AI assistant"
              onPress={() => setShowAssistant(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>✕</Text>
            </Pressable>

            <VoiceAssistant onCommand={handleAssistantCommand} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  bottomNavigation: {
    backgroundColor: colors.surface,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    maxHeight: '85%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  closeText: {
    fontSize: 22,
    color: colors.ink,
  },
});
