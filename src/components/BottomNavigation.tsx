
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../assets/theme';

export type MainTab =
  | 'Home'
  | 'Attendance'
  | 'Calendar'
  | 'Profile';

type Props = {
  activeTab: MainTab;
  onChange: (tab: MainTab) => void;
};

const tabs: { key: MainTab; icon: string }[] = [
  { key: 'Home', icon: '⌂' },
  { key: 'Attendance', icon: '◷' },
  { key: 'Calendar', icon: '▦' },
  { key: 'Profile', icon: '◎' },
];

export function BottomNavigation({ activeTab, onChange }: Props) {
  return (
    <View style={styles.bar}>
      {tabs.map(tab => {
        const selected = activeTab === tab.key;

        return (
          <Pressable
            key={tab.key}
            accessibilityRole="tab"
            accessibilityLabel={tab.key}
            accessibilityState={{ selected }}
            onPress={() => onChange(tab.key)}
            style={({ pressed }) => [
              styles.tab,
              pressed && styles.pressed,
            ]}
          >
            <View
              style={[
                styles.iconWrap,
                selected && styles.iconWrapSelected,
              ]}
            >
              <Text
                style={[
                  styles.icon,
                  selected && styles.iconSelected,
                ]}
              >
                {tab.icon}
              </Text>
              {selected ? <View style={styles.activeDot} /> : null}
            </View>

            <Text
              style={[
                styles.label,
                selected && styles.labelSelected,
              ]}
            >
              {tab.key}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    minHeight: 76,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minHeight: 53,
    borderRadius: 16,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },
  iconWrap: {
    width: 52,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconWrapSelected: {
    backgroundColor: colors.accentSoft,
  },
  icon: {
    color: colors.muted,
    fontSize: 23,
    lineHeight: 28,
  },
  iconSelected: {
    color: colors.accentDark,
  },
  activeDot: {
    position: 'absolute',
    bottom: 1,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent,
  },
  label: {
    color: colors.subtle,
    fontSize: 10,
    fontWeight: '600',
  },
  labelSelected: {
    color: colors.accentDark,
    fontWeight: '800',
  },
});
