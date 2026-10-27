
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
import type { AttendanceRecord } from './HomeScreen';

type Props = {
  records: AttendanceRecord[];
  isLoading?: boolean;
};

export function AttendanceScreen({
  records,
  isLoading = false,
}: Props) {
  const insets = useSafeAreaInsets();
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(fade, {
      toValue: 1,
      duration: 450,
      useNativeDriver: true,
    });

    animation.start();
    return () => animation.stop();
  }, [fade]);

  const present = records.filter(
    row => row.status === 'Present',
  ).length;

  const totalMinutes = records.reduce(
    (sum, row) => sum + (row.minutesWorked ?? 0),
    0,
  );

  const completedDays = records.filter(
    row => row.minutesWorked !== null && row.minutesWorked > 0,
  ).length;

  const hours = (totalMinutes / 60).toFixed(1);
  const attendancePercent = Math.min((present / 22) * 100, 100);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        { paddingTop: Math.max(insets.top, 16) + 10 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View style={{ opacity: fade }}>
        <View style={styles.topLine}>
          <View style={styles.brandMark}>
            <Text style={styles.brandMarkText}>✓</Text>
          </View>
          <Text style={styles.brandText}>
            CHOTU <Text style={styles.brandAccent}>/ TIME</Text>
          </Text>
        </View>

        <Text style={styles.eyebrow}>YOUR TIME, AT A GLANCE</Text>
        <Text style={styles.title}>Attendance</Text>
        <Text style={styles.subtitle}>
          Every workday, all in one place.
        </Text>

        <View style={styles.summary}>
          <View style={styles.summaryTop}>
            <View>
              <Text style={styles.summaryLabel}>
                ATTENDANCE OVERVIEW
              </Text>
              <Text style={styles.summaryCaption}>
                Recorded presence
              </Text>
            </View>
            <View style={styles.summaryIcon}>
              <Text style={styles.summaryIconText}>✳</Text>
            </View>
          </View>

          <View style={styles.summaryNumberRow}>
            <Text style={styles.summaryValue}>{present}</Text>
            <View style={styles.summaryNumberCopy}>
              <Text style={styles.summaryTotal}>days present</Text>
              <Text style={styles.summarySmall}>
                out of a reference 22 days
              </Text>
            </View>
          </View>

          <View style={styles.track}>
            <View
              style={[
                styles.fill,
                { width: `${attendancePercent}%` },
              ]}
            />
          </View>

          <View style={styles.summaryFoot}>
            <Text style={styles.summaryFootText}>
              {attendancePercent.toFixed(0)}% of reference days
            </Text>
            <Text style={styles.summaryFootText}>
              {hours}h recorded
            </Text>
          </View>
        </View>

        <View style={styles.metrics}>
          <View style={styles.metricCard}>
            <Text style={styles.metricIcon}>◷</Text>
            <Text style={styles.metricValue}>{hours}h</Text>
            <Text style={styles.metricLabel}>Total time logged</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricIcon}>✓</Text>
            <Text style={styles.metricValue}>{completedDays}</Text>
            <Text style={styles.metricLabel}>Completed days</Text>
          </View>
        </View>

        <View style={styles.listHead}>
          <View>
            <Text style={styles.listTitle}>Attendance history</Text>
            <Text style={styles.listSubtitle}>
              Your latest saved records
            </Text>
          </View>

          <View style={styles.livePill}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>

        {records.map(row => (
          <View key={row.id} style={styles.card}>
            <View style={styles.dateBox}>
              <Text style={styles.dateDay}>
                {row.date.split(' ')[1] ?? ''}
              </Text>
              <Text style={styles.dateMonth}>
                {row.date.split(' ')[0] ?? ''}
              </Text>
            </View>

            <View style={styles.details}>
              <View style={styles.dayHead}>
                <Text style={styles.dayName}>{row.day}</Text>
                <View
                  style={[
                    styles.status,
                    row.checkedIn && styles.statusActive,
                  ]}
                >
                  <View
                    style={[
                      styles.statusDot,
                      row.checkedIn && styles.statusDotActive,
                    ]}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      row.checkedIn && styles.statusTextActive,
                    ]}
                  >
                    {row.checkedIn ? 'In progress' : 'Complete'}
                  </Text>
                </View>
              </View>

              <View style={styles.times}>
                <Text style={styles.timeText}>↓ {row.checkIn}</Text>
                <Text style={styles.timeText}>↑ {row.checkOut}</Text>
              </View>

              <Text style={styles.hoursText}>{row.hours}</Text>

              <Text style={styles.locationText} numberOfLines={2}>
                ⌖ In: {row.checkInLocation}
              </Text>

              {row.checkOutLocation ? (
                <Text style={styles.locationText} numberOfLines={2}>
                  ⌖ Out: {row.checkOutLocation}
                </Text>
              ) : null}
            </View>
          </View>
        ))}

        {!isLoading && records.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIconBox}>
              <Text style={styles.emptyIcon}>✳</Text>
            </View>
            <Text style={styles.emptyTitle}>
              Your journey starts here
            </Text>
            <Text style={styles.emptyText}>
              Your saved attendance will appear here after your first
              check-in.
            </Text>
          </View>
        ) : null}

        {isLoading ? (
          <Text style={styles.loadingText}>
            Syncing your attendance...
          </Text>
        ) : null}

        <View style={styles.note}>
          <View style={styles.noteIconBox}>
            <Text style={styles.noteIcon}>i</Text>
          </View>
          <Text style={styles.noteText}>
            Your attendance is synced to your account. Location is
            recorded when you check in or check out.
          </Text>
        </View>

        <View style={{ height: 24 }} />
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 22,
    paddingBottom: 24,
    backgroundColor: colors.background,
  },
  topLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginBottom: 24,
  },
  brandMark: {
    width: 29,
    height: 29,
    borderRadius: 10,
    backgroundColor: colors.accentDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandMarkText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '800',
  },
  brandText: {
    color: colors.ink,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  brandAccent: {
    color: colors.accent,
  },
  eyebrow: {
    color: colors.accentDark,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.7,
    marginBottom: 6,
  },
  title: {
    color: colors.ink,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 5,
  },
  summary: {
    marginTop: 23,
    padding: 20,
    borderRadius: 25,
    backgroundColor: colors.ink,
  },
  summaryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    color: '#B8D9C1',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  summaryCaption: {
    color: '#D0E1D4',
    fontSize: 10,
    marginTop: 5,
  },
  summaryIcon: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: '#2D513A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryIconText: {
    color: '#A5DAB5',
    fontSize: 20,
  },
  summaryNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 15,
  },
  summaryValue: {
    color: colors.surface,
    fontSize: 43,
    fontWeight: '800',
  },
  summaryNumberCopy: {
    flex: 1,
  },
  summaryTotal: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '700',
  },
  summarySmall: {
    color: '#B8D2BE',
    fontSize: 9,
    marginTop: 4,
  },
  track: {
    height: 7,
    backgroundColor: '#3D5A45',
    borderRadius: 5,
    marginTop: 15,
    overflow: 'hidden',
  },
  fill: {
    height: 7,
    backgroundColor: '#8DD4A1',
    borderRadius: 5,
  },
  summaryFoot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  summaryFootText: {
    color: '#C4DCCB',
    fontSize: 9,
  },
  metrics: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  metricCard: {
    flex: 1,
    minHeight: 110,
    padding: 15,
    borderRadius: 19,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metricIcon: {
    color: colors.accentDark,
    fontSize: 19,
  },
  metricValue: {
    color: colors.ink,
    fontSize: 23,
    fontWeight: '800',
    marginTop: 7,
  },
  metricLabel: {
    color: colors.muted,
    fontSize: 10,
    marginTop: 4,
  },
  listHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 28,
    marginBottom: 14,
  },
  listTitle: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '800',
  },
  listSubtitle: {
    color: colors.muted,
    fontSize: 10,
    marginTop: 4,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: colors.accentSoft,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  liveText: {
    color: colors.accentDark,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 13,
    marginBottom: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 19,
  },
  dateBox: {
    width: 46,
    minHeight: 49,
    borderRadius: 14,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateDay: {
    color: colors.accentDark,
    fontSize: 16,
    fontWeight: '800',
  },
  dateMonth: {
    color: colors.accentDark,
    fontSize: 8,
    fontWeight: '800',
  },
  details: {
    flex: 1,
    marginLeft: 12,
  },
  dayHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
  },
  dayName: {
    color: colors.ink,
    fontSize: 11,
    fontWeight: '800',
    flexShrink: 1,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 9,
    backgroundColor: '#E1F1E5',
  },
  statusActive: {
    backgroundColor: '#FFF1D8',
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  statusDotActive: {
    backgroundColor: '#B47B26',
  },
  statusText: {
    color: colors.accentDark,
    fontSize: 8,
    fontWeight: '800',
  },
  statusTextActive: {
    color: '#91631D',
  },
  times: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 10,
  },
  timeText: {
    color: colors.muted,
    fontSize: 10,
  },
  hoursText: {
    color: colors.ink,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 7,
  },
  locationText: {
    color: colors.subtle,
    fontSize: 9,
    lineHeight: 14,
    marginTop: 5,
  },
  empty: {
    alignItems: 'center',
    padding: 25,
    marginTop: 12,
    borderRadius: 21,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyIconBox: {
    width: 48,
    height: 48,
    borderRadius: 17,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    color: colors.accentDark,
    fontSize: 25,
  },
  emptyTitle: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '800',
    marginTop: 12,
  },
  emptyText: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 6,
  },
  loadingText: {
    color: colors.muted,
    fontSize: 11,
    textAlign: 'center',
    padding: 16,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    marginTop: 10,
    borderRadius: 16,
    backgroundColor: colors.accentSoft,
  },
  noteIconBox: {
    width: 25,
    height: 25,
    borderRadius: 9,
    backgroundColor: '#C8E5D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteIcon: {
    color: colors.accentDark,
    fontSize: 13,
    fontWeight: '900',
  },
  noteText: {
    flex: 1,
    color: colors.accentDark,
    fontSize: 10,
    lineHeight: 15,
  },
});
