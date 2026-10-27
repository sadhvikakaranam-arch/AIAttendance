
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

type ProfileScreenProps = {
  name: string;
  email: string;
  phoneNumber: string;
  onSignOut: () => void;
};

function DetailRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailIcon}>
        <Text style={styles.detailIconText}>{icon}</Text>
      </View>

      <View style={styles.detailCopy}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

export function ProfileScreen({
  name,
  email,
  phoneNumber,
  onSignOut,
}: ProfileScreenProps) {
  const insets = useSafeAreaInsets();
  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.spring(rise, {
        toValue: 0,
        speed: 15,
        bounciness: 3,
        useNativeDriver: true,
      }),
    ]);

    animation.start();
    return () => animation.stop();
  }, [fade, rise]);

  const initials =
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'U';

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
        <View style={styles.topLine}>
          <View style={styles.brandMark}>
            <Text style={styles.brandMarkText}>✓</Text>
          </View>
          <Text style={styles.brandText}>
            CHOTU <Text style={styles.brandAccent}>/ PROFILE</Text>
          </Text>
        </View>

        <Text style={styles.eyebrow}>YOUR SPACE</Text>
        <Text style={styles.title}>Your profile</Text>
        <Text style={styles.subtitle}>
          Your account details, all together.
        </Text>

        <View style={styles.profileCard}>
          <View style={styles.profileDecor} />
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
            <View style={styles.avatarBadge}>
              <Text style={styles.avatarBadgeText}>✓</Text>
            </View>
          </View>

          <Text style={styles.name}>{name || 'User'}</Text>
          <Text style={styles.email}>{email}</Text>

          <View style={styles.memberPill}>
            <View style={styles.memberDot} />
            <Text style={styles.memberText}>ACCOUNT ACTIVE</Text>
          </View>
        </View>

        <View style={styles.sectionTitleRow}>
          <View>
            <Text style={styles.sectionTitle}>Personal details</Text>
            <Text style={styles.sectionSubtitle}>
              Your registered information
            </Text>
          </View>
          <View style={styles.securePill}>
            <Text style={styles.secureText}>ACCOUNT</Text>
          </View>
        </View>

        <View style={styles.detailsCard}>
          <DetailRow
            label="Full name"
            value={name || 'Not added'}
            icon="U"
          />
          <View style={styles.separator} />

          <DetailRow
            label="Email address"
            value={email || 'Not added'}
            icon="@"
          />
          <View style={styles.separator} />

          <DetailRow
            label="Phone number"
            value={phoneNumber || 'Not added'}
            icon="+"
          />
        </View>

        <View style={styles.sectionTitleRow}>
          <View>
            <Text style={styles.sectionTitle}>Account settings</Text>
            <Text style={styles.sectionSubtitle}>
              Useful information about your account
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoIconBox}>
            <Text style={styles.infoIcon}>✓</Text>
          </View>
          <View style={styles.infoCopy}>
            <Text style={styles.infoTitle}>Attendance sync</Text>
            <Text style={styles.infoText}>
              Your attendance records are linked to your signed-in account.
            </Text>
          </View>
          <View style={styles.connectedDot} />
        </View>

        <View style={styles.infoCard}>
          <View style={[styles.infoIconBox, styles.infoIconAlt]}>
            <Text style={styles.infoIcon}>⌖</Text>
          </View>
          <View style={styles.infoCopy}>
            <Text style={styles.infoTitle}>Location privacy</Text>
            <Text style={styles.infoText}>
              Location is requested when you check in or check out.
            </Text>
          </View>
        </View>

        <View style={styles.signOutCard}>
          <Text style={styles.signOutTitle}>Signing off?</Text>
          <Text style={styles.signOutText}>
            You can sign back in whenever you need to access your account.
          </Text>

          <View style={styles.signOutButton}>
            <Text style={styles.signOutIcon}>↗</Text>
            <View style={styles.signOutButtonCopy}>
              <Text style={styles.signOutButtonTitle}>Sign out</Text>
              <Text style={styles.signOutButtonSubtitle}>
                End this session
              </Text>
            </View>
            <View style={styles.signOutAction}>
              <Text style={styles.signOutActionText}>›</Text>
            </View>
          </View>

          <View style={styles.signOutPressable}>
            <Text
              accessibilityRole="button"
              onPress={onSignOut}
              style={styles.signOutTapTarget}
            >
              Sign out of your account
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>
          CHOTU · YOUR WORKDAY, SIMPLIFIED
        </Text>
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
  profileCard: {
    position: 'relative',
    alignItems: 'center',
    overflow: 'hidden',
    paddingHorizontal: 18,
    paddingVertical: 26,
    marginTop: 23,
    borderRadius: 25,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  profileDecor: {
    position: 'absolute',
    top: -74,
    right: -45,
    width: 155,
    height: 155,
    borderRadius: 78,
    backgroundColor: colors.accentSoft,
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentDark,
  },
  avatarText: {
    color: colors.surface,
    fontSize: 27,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  avatarBadge: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBadgeText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '900',
  },
  name: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 16,
  },
  email: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 5,
    textAlign: 'center',
  },
  memberPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 13,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: colors.accentSoft,
  },
  memberDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  memberText: {
    color: colors.accentDark,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 25,
    marginBottom: 11,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: colors.muted,
    fontSize: 10,
    marginTop: 4,
  },
  securePill: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 9,
    backgroundColor: colors.accentSoft,
  },
  secureText: {
    color: colors.accentDark,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  detailsCard: {
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailRow: {
    minHeight: 69,
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    width: 39,
    height: 39,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentSoft,
  },
  detailIconText: {
    color: colors.accentDark,
    fontSize: 16,
    fontWeight: '800',
  },
  detailCopy: {
    flex: 1,
    marginLeft: 12,
  },
  detailLabel: {
    color: colors.subtle,
    fontSize: 10,
  },
  detailValue: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 51,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 10,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoIconBox: {
    width: 39,
    height: 39,
    borderRadius: 13,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoIconAlt: {
    backgroundColor: '#EAF0E8',
  },
  infoIcon: {
    color: colors.accentDark,
    fontSize: 19,
    fontWeight: '800',
  },
  infoCopy: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '800',
  },
  infoText: {
    color: colors.muted,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 4,
  },
  connectedDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginLeft: 8,
  },
  signOutCard: {
    padding: 17,
    marginTop: 19,
    borderRadius: 21,
    backgroundColor: '#E6F0E7',
  },
  signOutTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '800',
  },
  signOutText: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginTop: 15,
    borderRadius: 16,
    backgroundColor: colors.accentDark,
  },
  signOutIcon: {
    color: colors.surface,
    fontSize: 20,
    fontWeight: '800',
    paddingHorizontal: 5,
  },
  signOutButtonCopy: {
    flex: 1,
    marginLeft: 10,
  },
  signOutButtonTitle: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '800',
  },
  signOutButtonSubtitle: {
    color: '#C8E1CE',
    fontSize: 9,
    marginTop: 3,
  },
  signOutAction: {
    width: 29,
    height: 29,
    borderRadius: 10,
    backgroundColor: '#3C7954',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutActionText: {
    color: colors.surface,
    fontSize: 21,
  },
  signOutPressable: {
    marginTop: 8,
  },
  signOutTapTarget: {
    color: colors.accentDark,
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
    paddingVertical: 9,
  },
  footer: {
    color: colors.subtle,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 21,
  },
});
