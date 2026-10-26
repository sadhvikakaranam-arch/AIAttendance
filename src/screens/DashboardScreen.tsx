import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomNavigation, type MainTab } from '../components/BottomNavigation';
import { colors } from '../assets/theme';
import { checkInWithLocation, checkOutWithLocation, firebaseErrorMessage, subscribeToAttendance, type StoredAttendance } from '../services/firebase';
import { getAttendanceLocation } from '../services/location';
import { AttendanceScreen } from './AttendanceScreen';
import { HomeScreen, type AttendanceRecord } from './HomeScreen';
import { ProfileScreen } from './ProfileScreen';

type Props = { uid: string; name: string; email: string; phoneNumber: string; onSignOut: () => void };

function formatTime(date: Date | null) {
  if (!date) return '— — : — —';
  return new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit' }).format(date);
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

function mapAttendance(record: StoredAttendance): AttendanceRecord {
  const date = formatDate(record.dateKey);
  return {
    id: record.id,
    date: new Intl.DateTimeFormat('en-IN', { month: 'short', day: 'numeric' }).format(date),
    dateKey: record.dateKey,
    day: record.dateKey === getTodayKey() ? 'Today' : new Intl.DateTimeFormat('en-IN', { weekday: 'long' }).format(date),
    checkIn: formatTime(record.checkInAt),
    checkOut: formatTime(record.checkOutAt),
    hours: formatDuration(record.workedMinutes),
    minutesWorked: record.workedMinutes,
    checkInLocation: formatLocation(record.checkInLocation.latitude, record.checkInLocation.longitude),
    checkOutLocation: record.checkOutLocation ? formatLocation(record.checkOutLocation.latitude, record.checkOutLocation.longitude) : '',
    checkedIn: record.checkOutAt === null,
    status: 'Present',
  };
}

export function DashboardScreen({ uid, name, email, phoneNumber, onSignOut }: Props) {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<MainTab>('Home');
  const [storedRecords, setStoredRecords] = useState<StoredAttendance[]>([]);
  const [isLoadingAttendance, setIsLoadingAttendance] = useState(true);
  const [isWorking, setIsWorking] = useState(false);

  useEffect(() => subscribeToAttendance(uid, records => {
    setStoredRecords(records);
    setIsLoadingAttendance(false);
  }, error => {
    setIsLoadingAttendance(false);
    Alert.alert('Attendance unavailable', firebaseErrorMessage(error));
  }), [uid]);

  const records = useMemo(() => storedRecords.map(mapAttendance), [storedRecords]);
  const todayKey = new Date().toLocaleDateString('en-CA');
  const todayRecord = storedRecords.find(record => record.dateKey === todayKey);
  const checkedIn = Boolean(todayRecord && !todayRecord.checkOutAt);

  const withLocation = async (action: 'check-in' | 'check-out') => {
    setIsWorking(true);
    try {
      const location = await getAttendanceLocation();
      if (action === 'check-in') {
        await checkInWithLocation(uid, location);
        Alert.alert('Checked in!', 'Your check-in time and location have been saved.');
      } else {
        await checkOutWithLocation(uid, location);
        Alert.alert('Checked out!', 'Your check-out time and location have been saved.');
      }
    } catch (error) {
      Alert.alert(action === 'check-in' ? 'Check-in not saved' : 'Check-out not saved', firebaseErrorMessage(error));
    } finally {
      setIsWorking(false);
    }
  };

  const content = tab === 'Home' ? (
    <HomeScreen
      name={name}
      checkedIn={checkedIn}
      checkInTime={todayRecord ? formatTime(todayRecord.checkInAt) : undefined}
      checkOutTime={todayRecord?.checkOutAt ? formatTime(todayRecord.checkOutAt) : undefined}
      checkInLocation={todayRecord ? formatLocation(todayRecord.checkInLocation.latitude, todayRecord.checkInLocation.longitude) : undefined}
      isWorking={isWorking}
      records={records}
      onCheckIn={() => void withLocation('check-in')}
      onCheckOut={() => void withLocation('check-out')}
      onOpenAttendance={() => setTab('Attendance')}
      onOpenProfile={() => setTab('Profile')}
    />
  ) : tab === 'Attendance' ? (
    <AttendanceScreen records={records} isLoading={isLoadingAttendance} />
  ) : (
    <ProfileScreen name={name} email={email} phoneNumber={phoneNumber} onSignOut={onSignOut} />
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1 }}>{content}</View>
      <View style={{ paddingBottom: Math.max(insets.bottom, 6), backgroundColor: colors.surface }}>
        <BottomNavigation activeTab={tab} onChange={setTab} />
      </View>
    </View>
  );
}

function getTodayKey() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}