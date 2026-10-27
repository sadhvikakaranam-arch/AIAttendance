import AxentraLogo from '../components/AxentraLogo';
import { useEffect, useRef } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../assets/theme';
import { PrimaryButton } from '../components/PrimaryButton';
import { AIAssistantButton } from './AIAssistantButton';


export type AttendanceRecord = {
  id: string;
  date: string;
  dateKey: string;
  day: string;
  checkIn: string;
  checkOut: string;
  hours: string;
  minutesWorked: number | null;
  checkInLocation: string;
  checkOutLocation: string;
  checkedIn: boolean;
  status: 'Present' | 'Late' | 'Half day';
};

type Props = {
  name: string;
  checkedIn: boolean;
  checkInTime?: string;
  checkOutTime?: string;
  checkInLocation?: string;
  isWorking: boolean;
  records: AttendanceRecord[];
  onCheckIn: () => void;
  onCheckOut: () => void;
  onOpenAttendance: () => void;
  onOpenProfile: () => void;
};

const today = () =>
  new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'GOOD MORNING';
  if (hour < 17) return 'GOOD AFTERNOON';
  return 'GOOD EVENING';
};

export function HomeScreen({
  name,
  checkedIn,
  checkInTime,
  checkOutTime,
  checkInLocation,
  isWorking,
  records,
  onCheckIn,
  onCheckOut,
  onOpenAttendance,
  onOpenProfile,
}: Props) {
  const insets = useSafeAreaInsets();
  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(18)).current;
  const walker = useRef(new Animated.Value(-18)).current;

  useEffect(() => {
    const entrance = Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 550,
        useNativeDriver: true,
      }),
      Animated.spring(rise, {
        toValue: 0,
        speed: 15,
        bounciness: 4,
        useNativeDriver: true,
      }),
    ]);

    entrance.start();
    return () => entrance.stop();
  }, [fade, rise]);

  useEffect(() => {
    const walking = Animated.loop(
      Animated.sequence([
        Animated.timing(walker, {
          toValue: 18,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(walker, {
          toValue: -18,
          duration: 1,
          useNativeDriver: true,
        }),
      ]),
    );

    walking.start();
    return () => walking.stop();
  }, [walker]);

  const firstName = name.trim().split(/\s+/)[0] || 'there';

  const present = records.filter(
    row => row.status === 'Present',
  ).length;

  const completedRecords = records.filter(
    row => row.minutesWorked !== null && row.minutesWorked > 0,
  );

  const averageMinutes =
    completedRecords.length > 0
      ? Math.round(
          completedRecords.reduce(
            (total, row) => total + (row.minutesWorked ?? 0),
            0,
          ) / completedRecords.length,
        )
      : null;

  const averageWorkday =
    averageMinutes === null
      ? '--'
      : `${Math.floor(averageMinutes / 60)}h ${String(
          averageMinutes % 60,
        ).padStart(2, '0')}m`;

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        { paddingTop: Math.max(insets.top, 16) + 10 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View
        style={{
          opacity: fade,
          transform: [{ translateY: rise }],
        }}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.greetingBlock}>
            <Text style={styles.greeting}>{greeting()} ✦</Text>
            <Text style={styles.title}>Hey, {firstName}!</Text>
            <Text style={styles.headerSubtitle}>
              Your campus, your day.
            </Text>
          </View>

          <View style={styles.headerRight}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoLeaf}>✳</Text>
            </View>
            <Text style={styles.brand}>
              chotu<Text style={styles.brandDot}>.</Text>
            </Text>
          </View>
        </View>

        {/* CAMPUS HERO */}
        <View style={styles.campusHero}>
          <View style={styles.sun} />

          <Text style={styles.campusEyebrow}>
            A NEW DAY AWAITS
          </Text>
          <Text style={styles.campusTitle}>
            Make today count.
          </Text>
          <Text style={styles.campusSubtitle}>
            Every day is a chance to show up.
          </Text>

          {/* Campus scene */}
          <View style={styles.campusScene}>
            <View style={styles.distantHill} />

            <View style={styles.campusBuilding}>
              <View style={styles.buildingRoof} />

              <View style={styles.buildingWindows}>
                {[0, 1, 2, 3, 4, 5].map(item => (
                  <View key={item} style={styles.buildingWindow} />
                ))}
              </View>

              <View style={styles.buildingDoor} />
            </View>

            <View style={[styles.tree, styles.treeOne]}>
              <View style={styles.treeTop} />
              <View style={styles.treeTrunk} />
            </View>

            <View style={[styles.tree, styles.treeTwo]}>
              <View style={styles.treeTop} />
              <View style={styles.treeTrunk} />
            </View>

            <View style={styles.path} />

            {/* Moving student illustration */}
            <Animated.View
              style={[
                styles.student,
                { transform: [{ translateX: walker }] },
              ]}
            >
              <View style={styles.studentHead} />
              <View style={styles.studentBody} />
              <View style={styles.studentBag} />
              <View style={styles.studentLegLeft} />
              <View style={styles.studentLegRight} />
            </Animated.View>

            <View style={[styles.student, styles.studentTwo]}>
              <View style={styles.studentHead} />
              <View style={[styles.studentBody, styles.studentBodyAlt]} />
              <View style={styles.studentLegLeft} />
              <View style={styles.studentLegRight} />
            </View>
          </View>

          <View style={styles.dateRow}>
            <View style={styles.dateIcon}>
              <Text style={styles.dateIconText}>▦</Text>
            </View>
            <View>
              <Text style={styles.dateLabel}>TODAY</Text>
              <Text style={styles.dateValue}>{today()}</Text>
            </View>
          </View>
        </View>

        {/* COMPACT ATTENDANCE CARD */}
        <View style={styles.attendanceCard}>
          <View style={styles.attendanceHeader}>
            <View style={styles.attendanceIcon}>
              <Text style={styles.attendanceIconText}>
                {checkedIn ? '✓' : '→'}
              </Text>
            </View>

            <View style={styles.attendanceCopy}>
              <Text style={styles.attendanceTitle}>
                {checkedIn ? 'You’re checked in' : 'Ready for today?'}
              </Text>
              <Text style={styles.attendanceSubtitle}>
                {checkedIn
                  ? `Started at ${checkInTime || '--:--'}`
                  : 'Your attendance starts here.'}
              </Text>
            </View>

            <View style={styles.statusPill}>
              <View
                style={[
                  styles.statusDot,
                  checkedIn && styles.statusDotActive,
                ]}
              />
              <Text style={styles.statusText}>
                {checkedIn ? 'ACTIVE' : 'READY'}
              </Text>
            </View>
          </View>

          <View style={styles.attendanceDivider} />

          <View style={styles.timeRow}>
            <View style={styles.timeBlock}>
              <Text style={styles.timeLabel}>CHECK-IN</Text>
              <Text style={styles.timeValue}>
                {checkInTime || '--:--'}
              </Text>
            </View>

            <View style={styles.timeSeparator} />

            <View style={styles.timeBlock}>
              <Text style={styles.timeLabel}>CHECK-OUT</Text>
              <Text style={styles.timeValue}>
                {checkedIn ? 'In progress' : checkOutTime || '--:--'}
              </Text>
            </View>
          </View>

          <View style={styles.buttonWrap}>
            <PrimaryButton
              label={
                isWorking
                  ? 'Getting location...'
                  : checkedIn
                    ? 'Check out'
                    : 'Check in'
              }
              onPress={checkedIn ? onCheckOut : onCheckIn}
              disabled={isWorking}
              icon={
                <Text style={styles.buttonIcon}>
                  {checkedIn ? '↗' : '→'}
                </Text>
              }
            />
          </View>

          <Text style={styles.locationNote}>
            {checkInLocation
              ? `⌖ Checked in at ${checkInLocation}`
              : '⌖ Location is requested when you check in or out.'}
          </Text>
        </View>

        {/* ATTENDANCE OVERVIEW */}
        <View style={styles.sectionHead}>
          <View>
            <Text style={styles.sectionTitle}>Your overview</Text>
            <Text style={styles.sectionSub}>
              Your attendance at a glance
            </Text>
          </View>

          <View style={styles.sectionMark}>
            <Text style={styles.sectionMarkText}>✦</Text>
          </View>
        </View>

        <View style={styles.stats}>
          <View style={[styles.statCard, styles.statGreen]}>
            <View style={styles.statIconCircle}>
              <Text style={styles.statIcon}>✓</Text>
            </View>
            <Text style={styles.statValue}>{present}</Text>
            <Text style={styles.statLabel}>Days present</Text>
            <Text style={styles.statCaption}>
              Recorded attendance
            </Text>
          </View>

          <View style={[styles.statCard, styles.statWhite]}>
            <View style={styles.statIconCircle}>
              <Text style={styles.statIcon}>◷</Text>
            </View>
            <Text style={[styles.statValue, styles.statValueSmall]}>
              {averageWorkday}
            </Text>
            <Text style={styles.statLabel}>Avg. workday</Text>
            <Text style={styles.statCaption}>
              Completed days only
            </Text>
          </View>
        </View>

        {/* QUICK ACTIONS */}
        <View style={styles.quickHead}>
          <Text style={styles.sectionTitle}>Quick actions</Text>
          <Text style={styles.sectionSub}>
            Your shortcuts
          </Text>
        </View>

        <View style={styles.quickRow}>
          <View style={styles.quickIconBox}>
            <Text style={styles.quickIcon}>▤</Text>
          </View>

          <View style={styles.quickCopy}>
            <Text style={styles.quickTitle}>Attendance history</Text>
            <Text style={styles.quickDescription}>
              Review your recorded workdays
            </Text>
          </View>

          <Text
            onPress={onOpenAttendance}
            accessibilityRole="button"
            accessibilityLabel="Open attendance history"
            style={styles.arrow}
          >
            ›
          </Text>
        </View>

        <View style={styles.quickRow}>
          <View style={[styles.quickIconBox, styles.profileIconBox]}>
            <Text style={[styles.quickIcon, styles.profileIcon]}>◉</Text>
          </View>

          <View style={styles.quickCopy}>
            <Text style={styles.quickTitle}>Your profile</Text>
            <Text style={styles.quickDescription}>
              Personal details and account
            </Text>
          </View>

          <Text
            onPress={onOpenProfile}
            accessibilityRole="button"
            accessibilityLabel="Open your profile"
            style={styles.arrow}
          >
            ›
          </Text>
        </View>

        {/* RECENT ATTENDANCE */}
        <View style={styles.recentHead}>
          <View>
            <Text style={styles.sectionTitle}>Recent attendance</Text>
            <Text style={styles.sectionSub}>
              Your latest recorded activity
            </Text>
          </View>

          <Text
            onPress={onOpenAttendance}
            accessibilityRole="button"
            style={styles.viewAll}
          >
            View all ›
          </Text>
        </View>

        {records.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconCircle}>
              <Text style={styles.emptyIcon}>✦</Text>
            </View>
            <Text style={styles.emptyTitle}>
              Your story starts here
            </Text>
            <Text style={styles.emptyDescription}>
              Your attendance records will appear here after your first
              check-in.
            </Text>
          </View>
        ) : (
          records.slice(0, 3).map(row => (
            <View key={row.id} style={styles.recentRow}>
              <View style={styles.dayBadge}>
                <Text style={styles.dayNum}>
                  {row.date.split(' ')[1] ?? ''}
                </Text>
                <Text style={styles.dayMonth}>
                  {row.date.split(' ')[0] ?? ''}
                </Text>
              </View>

              <View style={styles.recentCopy}>
                <Text style={styles.recentDay}>{row.day}</Text>
                <Text style={styles.recentTime}>
                  {row.checkIn} — {row.checkOut}
                </Text>
                <Text style={styles.recentLocation}>
                  {row.checkInLocation}
                </Text>
              </View>

              <View style={styles.hoursBadge}>
                <Text style={styles.hours}>{row.hours}</Text>
              </View>
            </View>
          ))
        )}

        <Text style={styles.footer}>
          Small steps. Consistent days. ✦
        </Text>

        <View style={{ height: 20 }} />
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greetingBlock: {
    flex: 1,
  },
  greeting: {
    color: '#36764B',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  title: {
    color: '#23352A',
    fontSize: 27,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  headerSubtitle: {
    color: '#7B857C',
    fontSize: 12,
    marginTop: 4,
  },
  headerRight: {
    alignItems: 'center',
    gap: 5,
  },
  logoCircle: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: '#E0EFE2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLeaf: {
    color: '#2C7444',
    fontSize: 21,
    fontWeight: '800',
  },
  brand: {
    color: '#26372B',
    fontSize: 15,
    fontWeight: '800',
  },
  brandDot: {
    color: '#2F8650',
  },

  /* Campus illustration */
  campusHero: {
    backgroundColor: '#EDF3E8',
    borderRadius: 25,
    padding: 18,
    paddingBottom: 14,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E9DB',
  },
  sun: {
    position: 'absolute',
    top: -30,
    right: -10,
    width: 105,
    height: 105,
    borderRadius: 53,
    backgroundColor: '#D9E9C9',
  },
  campusEyebrow: {
    color: '#39754C',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  campusTitle: {
    color: '#213A2A',
    fontSize: 23,
    fontWeight: '800',
    marginTop: 8,
  },
  campusSubtitle: {
    color: '#718071',
    fontSize: 11,
    marginTop: 5,
  },
  campusScene: {
    height: 125,
    marginTop: 15,
    backgroundColor: '#DCEAD8',
    borderRadius: 16,
    overflow: 'hidden',
  },
  distantHill: {
    position: 'absolute',
    left: -20,
    top: 34,
    width: 160,
    height: 75,
    borderRadius: 45,
    backgroundColor: '#C5DCC1',
  },
  campusBuilding: {
    position: 'absolute',
    right: 23,
    bottom: 29,
    width: 125,
    height: 67,
    backgroundColor: '#F8F5E9',
    borderWidth: 1,
    borderColor: '#D6DFCE',
  },
  buildingRoof: {
    position: 'absolute',
    top: -6,
    left: -5,
    right: -5,
    height: 7,
    backgroundColor: '#8AA687',
  },
  buildingWindows: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    paddingTop: 12,
    gap: 7,
  },
  buildingWindow: {
    width: 13,
    height: 12,
    backgroundColor: '#B6D1BC',
    borderRadius: 2,
  },
  buildingDoor: {
    position: 'absolute',
    bottom: 0,
    left: 53,
    width: 20,
    height: 27,
    backgroundColor: '#9DB49C',
  },
  tree: {
    position: 'absolute',
    bottom: 28,
    alignItems: 'center',
  },
  treeOne: {
    left: 18,
  },
  treeTwo: {
    right: 7,
    bottom: 31,
    transform: [{ scale: 0.75 }],
  },
  treeTop: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: '#7FA585',
  },
  treeTrunk: {
    width: 6,
    height: 18,
    backgroundColor: '#927957',
  },
  path: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 29,
    backgroundColor: '#D0D7C2',
    borderTopWidth: 1,
    borderTopColor: '#C0CEB7',
  },
  student: {
    position: 'absolute',
    left: '34%',
    bottom: 15,
    width: 18,
    height: 48,
    alignItems: 'center',
    zIndex: 3,
  },
  studentTwo: {
    left: '61%',
    bottom: 16,
    transform: [{ scale: 0.8 }],
  },
  studentHead: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#B9825F',
  },
  studentBody: {
    width: 14,
    height: 20,
    borderRadius: 5,
    backgroundColor: '#39754C',
    marginTop: 2,
  },
  studentBodyAlt: {
    backgroundColor: '#D2A06E',
  },
  studentBag: {
    position: 'absolute',
    top: 14,
    right: 0,
    width: 6,
    height: 12,
    borderRadius: 3,
    backgroundColor: '#8A6C4F',
  },
  studentLegLeft: {
    position: 'absolute',
    top: 30,
    left: 3,
    width: 4,
    height: 14,
    borderRadius: 2,
    backgroundColor: '#364B3A',
    transform: [{ rotate: '12deg' }],
  },
  studentLegRight: {
    position: 'absolute',
    top: 30,
    right: 3,
    width: 4,
    height: 14,
    borderRadius: 2,
    backgroundColor: '#364B3A',
    transform: [{ rotate: '-12deg' }],
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 13,
    gap: 9,
  },
  dateIcon: {
    width: 31,
    height: 31,
    borderRadius: 10,
    backgroundColor: '#DCEBDD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateIconText: {
    color: '#36764B',
    fontSize: 17,
  },
  dateLabel: {
    color: '#718071',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
  },
  dateValue: {
    color: '#314B37',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 3,
  },

  /* Compact attendance card */
  attendanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 21,
    borderWidth: 1,
    borderColor: '#E4E9E0',
    padding: 15,
    marginBottom: 4,
  },
  attendanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendanceIcon: {
    width: 37,
    height: 37,
    borderRadius: 13,
    backgroundColor: '#E4F1E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  attendanceIconText: {
    color: '#267344',
    fontSize: 20,
    fontWeight: '800',
  },
  attendanceCopy: {
    flex: 1,
    marginLeft: 10,
  },
  attendanceTitle: {
    color: '#26362A',
    fontSize: 12,
    fontWeight: '800',
  },
  attendanceSubtitle: {
    color: '#7A847B',
    fontSize: 9,
    marginTop: 4,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#F0F5EF',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#B4A16B',
  },
  statusDotActive: {
    backgroundColor: '#258451',
  },
  statusText: {
    color: '#526B56',
    fontSize: 8,
    fontWeight: '800',
  },
  attendanceDivider: {
    height: 1,
    backgroundColor: '#EDF0EB',
    marginVertical: 13,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  timeBlock: {
    flex: 1,
  },
  timeSeparator: {
    width: 1,
    height: 30,
    backgroundColor: '#E5EBE3',
    marginHorizontal: 12,
  },
  timeLabel: {
    color: '#7A877C',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.7,
    marginBottom: 5,
  },
  timeValue: {
    color: '#26362A',
    fontSize: 14,
    fontWeight: '800',
  },
  buttonWrap: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  buttonIcon: {
    color: colors.surface,
    fontSize: 22,
    fontWeight: '700',
  },
  locationNote: {
    color: '#718071',
    fontSize: 9,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 14,
  },

  /* Section headings */
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 13,
  },
  sectionTitle: {
    color: '#26372B',
    fontSize: 17,
    fontWeight: '800',
  },
  sectionSub: {
    color: '#7A847B',
    fontSize: 11,
    marginTop: 4,
  },
  sectionMark: {
    width: 35,
    height: 35,
    borderRadius: 13,
    backgroundColor: '#E0EFE2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionMarkText: {
    color: '#2F7444',
    fontSize: 19,
  },

  /* Statistics */
  stats: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minHeight: 145,
    borderRadius: 21,
    padding: 15,
  },
  statGreen: {
    backgroundColor: '#E0EFE2',
  },
  statWhite: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E9E0',
  },
  statIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 11,
    backgroundColor: '#FFFFFFB8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statIcon: {
    color: '#2F7444',
    fontSize: 17,
    fontWeight: '800',
  },
  statValue: {
    color: '#26372B',
    fontSize: 27,
    fontWeight: '800',
  },
  statValueSmall: {
    fontSize: 20,
    marginTop: 4,
    marginBottom: 3,
  },
  statLabel: {
    color: '#26372B',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 3,
  },
  statCaption: {
    color: '#7A847B',
    fontSize: 9,
    marginTop: 5,
  },

  /* Quick actions */
  quickHead: {
    marginTop: 25,
    marginBottom: 12,
  },
  quickRow: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    marginBottom: 10,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E9E0',
  },
  quickIconBox: {
    width: 41,
    height: 41,
    borderRadius: 14,
    backgroundColor: '#E0EFE2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickIcon: {
    color: '#2F7444',
    fontSize: 21,
  },
  profileIconBox: {
    backgroundColor: '#E8F0E9',
  },
  profileIcon: {
    color: '#557D63',
  },
  quickCopy: {
    flex: 1,
    marginLeft: 12,
  },
  quickTitle: {
    color: '#26372B',
    fontSize: 12,
    fontWeight: '800',
  },
  quickDescription: {
    color: '#7A847B',
    fontSize: 10,
    marginTop: 4,
  },
  arrow: {
    color: '#2F7444',
    fontSize: 28,
    paddingHorizontal: 7,
    paddingVertical: 8,
  },

  /* Recent attendance */
  recentHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 12,
  },
  viewAll: {
    color: '#2F7444',
    fontSize: 11,
    fontWeight: '800',
    paddingVertical: 8,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 73,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E9E0',
  },
  dayBadge: {
    width: 43,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    backgroundColor: '#E0EFE2',
  },
  dayNum: {
    color: '#2F7444',
    fontSize: 14,
    fontWeight: '800',
  },
  dayMonth: {
    color: '#2F7444',
    fontSize: 8,
    fontWeight: '700',
    marginTop: 1,
  },
  recentCopy: {
    flex: 1,
    marginLeft: 11,
  },
  recentDay: {
    color: '#26372B',
    fontSize: 11,
    fontWeight: '800',
  },
  recentTime: {
    color: '#7A847B',
    fontSize: 10,
    marginTop: 4,
  },
  recentLocation: {
    color: '#9AA49A',
    fontSize: 8,
    marginTop: 3,
  },
  hoursBadge: {
    backgroundColor: '#F0F5F0',
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderRadius: 10,
    marginLeft: 5,
  },
  hours: {
    color: '#2F7444',
    fontSize: 10,
    fontWeight: '800',
  },
  emptyCard: {
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 25,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E9E0',
    borderRadius: 20,
  },
  emptyIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#E0EFE2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 11,
  },
  emptyIcon: {
    color: '#2F7444',
    fontSize: 22,
  },
  emptyTitle: {
    color: '#26372B',
    fontSize: 13,
    fontWeight: '800',
  },
  emptyDescription: {
    color: '#7A847B',
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 6,
  },
  footer: {
    color: '#9AA49A',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 23,
    fontWeight: '600',
  },
});
