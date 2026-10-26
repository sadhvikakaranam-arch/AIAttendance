import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../assets/theme';
import { PrimaryButton } from '../components/PrimaryButton';

type ProfileScreenProps = { name: string; email: string; phoneNumber: string; onSignOut: () => void };

function DetailRow({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailIcon}><Text style={styles.detailIconText}>{icon}</Text></View>
      <View style={styles.detailCopy}><Text style={styles.detailLabel}>{label}</Text><Text style={styles.detailValue}>{value}</Text></View>
      <Text style={styles.chevron}>›</Text>
    </View>
  );
}

export function ProfileScreen({ name, email, phoneNumber, onSignOut }: ProfileScreenProps) {
  const insets = useSafeAreaInsets();
  const initials = name.split(' ').filter(Boolean).map(part => part[0]).slice(0, 2).join('').toUpperCase() || 'DC';

  return (
    <ScrollView contentContainerStyle={[styles.content, { paddingTop: Math.max(insets.top, 16) + 10 }]} showsVerticalScrollIndicator={false}>
      <Text style={styles.eyebrow}>A LITTLE ABOUT YOU</Text>
      <Text style={styles.title}>Your profile</Text>
      <Text style={styles.subtitle}>Your details, all in one cozy place.</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text><View style={styles.avatarBadge}><Text style={styles.avatarBadgeText}>✦</Text></View></View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
        <View style={styles.memberPill}><View style={styles.memberDot} /><Text style={styles.memberText}>CHOTU MEMBER</Text></View>
      </View>

      <View style={styles.sectionTitleRow}><Text style={styles.sectionTitle}>Personal details</Text><Text style={styles.editLabel}>FIREBASE ACCOUNT</Text></View>
      <View style={styles.detailsCard}>
        <DetailRow label="Full name" value={name} icon="✳" />
        <View style={styles.separator} />
        <DetailRow label="Email address" value={email} icon="@" />
        <View style={styles.separator} />
        <DetailRow label="Phone number" value={phoneNumber || 'Not added'} icon="+" />
      </View>

      <View style={styles.sectionTitleRow}><Text style={styles.sectionTitle}>Preferences</Text></View>
      <View style={styles.detailsCard}>
        <DetailRow label="Notifications" value="Attendance reminders on" icon="♧" />
        <View style={styles.separator} />
        <DetailRow label="Work schedule" value="Monday – Friday · 9:00 AM" icon="◷" />
      </View>

      <Pressable accessibilityRole="button" onPress={onSignOut} style={styles.signOutWrap}>
        <PrimaryButton label="Sign out" onPress={onSignOut} icon={<Text style={styles.signOutIcon}>↗</Text>} />
      </Pressable>
      <Text style={styles.footer}>CHOTU · LITTLE MOMENTS, WELL KEPT</Text>
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 22, paddingBottom: 24 },
  eyebrow: { color: colors.accentDark, fontSize: 9, fontWeight: '800', letterSpacing: 1.7, marginBottom: 6 },
  title: { color: colors.ink, fontSize: 28, fontWeight: '800', letterSpacing: -0.8 },
  subtitle: { color: colors.muted, fontSize: 12, marginTop: 5 },
  profileCard: { alignItems: 'center', paddingVertical: 22, marginTop: 20, borderRadius: 22, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  avatar: { width: 78, height: 78, borderRadius: 27, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.accentSoft },
  avatarText: { color: colors.accentDark, fontSize: 25, fontWeight: '800', letterSpacing: 0.5 },
  avatarBadge: { position: 'absolute', right: -4, bottom: -4, width: 23, height: 23, borderRadius: 12, backgroundColor: colors.accent, borderWidth: 2, borderColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  avatarBadgeText: { color: colors.surface, fontSize: 11 },
  name: { color: colors.ink, fontSize: 19, fontWeight: '800', marginTop: 13 },
  email: { color: colors.muted, fontSize: 11, marginTop: 4 },
  memberPill: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 12, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, backgroundColor: colors.accentSoft },
  memberDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.accent },
  memberText: { color: colors.accentDark, fontSize: 8, fontWeight: '800', letterSpacing: 1 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 23, marginBottom: 10 },
  sectionTitle: { color: colors.ink, fontSize: 15, fontWeight: '800' },
  editLabel: { color: colors.subtle, fontSize: 8, fontWeight: '800', letterSpacing: 0.8 },
  detailsCard: { paddingHorizontal: 13, borderRadius: 18, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  detailRow: { minHeight: 63, flexDirection: 'row', alignItems: 'center' },
  detailIcon: { width: 35, height: 35, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.accentSoft },
  detailIconText: { color: colors.accentDark, fontSize: 15, fontWeight: '700' },
  detailCopy: { flex: 1, marginLeft: 10 },
  detailLabel: { color: colors.subtle, fontSize: 9 },
  detailValue: { color: colors.ink, fontSize: 11, fontWeight: '700', marginTop: 3 },
  chevron: { color: colors.subtle, fontSize: 23 },
  separator: { height: 1, backgroundColor: colors.border, marginLeft: 45 },
  signOutWrap: { marginTop: 24 },
  signOutIcon: { color: colors.surface, fontSize: 20 },
  footer: { color: colors.subtle, fontSize: 8, fontWeight: '700', letterSpacing: 1.2, textAlign: 'center', marginTop: 17 },
});