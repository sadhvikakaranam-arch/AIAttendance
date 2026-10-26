import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../assets/theme';

export type MainTab = 'Home' | 'Attendance' | 'Profile';
type Props = { activeTab: MainTab; onChange: (tab: MainTab) => void };
const tabs: { key: MainTab; icon: string }[] = [
  { key: 'Home', icon: '⌂' }, { key: 'Attendance', icon: '▤' }, { key: 'Profile', icon: '◉' },
];

export function BottomNavigation({ activeTab, onChange }: Props) {
  return (
    <View style={styles.bar}>
      {tabs.map(tab => {
        const selected = activeTab === tab.key;
        return <Pressable key={tab.key} accessibilityRole="tab" accessibilityState={{ selected }} onPress={() => onChange(tab.key)} style={styles.tab}>
          <View style={[styles.iconWrap, selected && styles.iconWrapSelected]}><Text style={[styles.icon, selected && styles.iconSelected]}>{tab.icon}</Text></View>
          <Text style={[styles.label, selected && styles.labelSelected]}>{tab.key}</Text>
        </Pressable>;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { minHeight: 74, paddingHorizontal: 18, paddingTop: 9, paddingBottom: 7, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface, flexDirection: 'row', justifyContent: 'space-around' },
  tab: { minWidth: 76, alignItems: 'center', gap: 3 },
  iconWrap: { width: 40, height: 32, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  iconWrapSelected: { backgroundColor: colors.accentSoft },
  icon: { color: colors.muted, fontSize: 21, lineHeight: 24 }, iconSelected: { color: colors.accentDark },
  label: { color: colors.subtle, fontSize: 10, fontWeight: '600' }, labelSelected: { color: colors.accentDark, fontWeight: '800' },
});