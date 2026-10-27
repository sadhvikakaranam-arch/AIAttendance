
import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

type Props = {
  onBack: () => void;
};

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function CalendarScreen({ onBack }: Props) {
  const [monthDate, setMonthDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();

  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const totalDays = new Date(year, month + 1, 0).getDate();

  const days: (number | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.back}>
        <Text style={styles.backText}>‹ Back to Home</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Attendance Calendar</Text>
      <Text style={styles.subtitle}>Plan and review your attendance</Text>

      <View style={styles.card}>
        <View style={styles.monthRow}>
          <TouchableOpacity
            onPress={() => {
              setMonthDate(new Date(year, month - 1, 1));
              setSelectedDay(1);
            }}
          >
            <Text style={styles.arrow}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.monthTitle}>
            {monthDate.toLocaleDateString('en-IN', {
              month: 'long',
              year: 'numeric',
            })}
          </Text>

          <TouchableOpacity
            onPress={() => {
              setMonthDate(new Date(year, month + 1, 1));
              setSelectedDay(1);
            }}
          >
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {weekdays.map(day => (
            <Text key={day} style={styles.weekday}>{day}</Text>
          ))}

          {days.map((day, index) => (
            <TouchableOpacity
              key={index}
              disabled={day === null}
              style={[
                styles.day,
                day === selectedDay && styles.selectedDay,
              ]}
              onPress={() => {
                if (day !== null) setSelectedDay(day);
              }}
            >
              <Text
                style={[
                  styles.dayText,
                  day === selectedDay && styles.selectedDayText,
                ]}
              >
                {day ?? ''}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.detailTitle}>Selected Date</Text>
        <Text style={styles.dateText}>
          {new Date(year, month, selectedDay).toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </Text>
        <Text style={styles.note}>
          Calendar layout is ready. Actual attendance records will be
          connected in the next step.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F6FC' },
  back: { padding: 20 },
  backText: { color: '#4338CA', fontSize: 15, fontWeight: '600' },
  title: { fontSize: 25, fontWeight: '800', color: '#172554', marginHorizontal: 20 },
  subtitle: { fontSize: 14, color: '#64748B', margin: 20, marginTop: 6 },
  card: { backgroundColor: '#FFFFFF', marginHorizontal: 16, marginBottom: 16, padding: 16, borderRadius: 18, elevation: 2 },
  monthRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  monthTitle: { fontSize: 17, fontWeight: '700', color: '#172554' },
  arrow: { fontSize: 30, color: '#4338CA', paddingHorizontal: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  weekday: { width: `${100 / 7}%`, textAlign: 'center', color: '#64748B', fontSize: 11, fontWeight: '700', paddingBottom: 10 },
  day: { width: `${100 / 7}%`, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 10 },
  dayText: { color: '#334155', fontSize: 14 },
  selectedDay: { backgroundColor: '#4338CA' },
  selectedDayText: { color: '#FFFFFF', fontWeight: '800' },
  detailTitle: { color: '#172554', fontWeight: '800', fontSize: 17, marginBottom: 12 },
  dateText: { color: '#475569', fontSize: 14 },
  note: { color: '#64748B', fontSize: 13, lineHeight: 20, marginTop: 14 },
});
