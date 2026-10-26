import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../assets/theme';
import { PrimaryButton } from '../components/PrimaryButton';

type Props = { onGetStarted: () => void; onSignIn: () => void };

export function WelcomeScreen({ onGetStarted, onSignIn }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, { paddingTop: Math.max(insets.top, 20) + 12, paddingBottom: Math.max(insets.bottom, 20) + 12 }]}>
      <View style={styles.topBar}>
        <View style={styles.brand}><View style={styles.brandMark}><View style={styles.brandLens} /></View><Text style={styles.brandName}>chotu</Text></View>
        <View style={styles.tag}><Text style={styles.tagText}>MADE FOR YOUR MOMENTS</Text></View>
      </View>
      <View style={styles.content}>
        <View style={styles.artwork} accessible accessibilityLabel="A cheerful little camera illustration">
          <View style={styles.sun} /><Text style={styles.sparkleOne}>✦</Text><Text style={styles.sparkleTwo}>✦</Text>
          <View style={styles.camera}><View style={styles.cameraTop} /><View style={styles.cameraFlash} />
            <View style={styles.cameraLensOuter}><View style={styles.cameraLensInner}><View style={styles.cameraLensShine} /></View></View><View style={styles.cameraDot} />
          </View>
          <View style={styles.artworkCaption}><Text style={styles.captionHeart}>♥</Text><Text style={styles.captionText}>your pocket-sized happy place</Text></View>
        </View>
        <View style={styles.intro}>
          <Text style={styles.eyebrow}>A LITTLE HELLO FROM US</Text>
          <Text style={styles.title}>Welcome to{'\n'}<Text style={styles.titleAccent}>Chotu.</Text></Text>
          <Text style={styles.description}>Little moments happen every day. Let’s make them a little more special.</Text>
        </View>
        <View style={styles.bottom}>
          <PrimaryButton label="Let’s get started" onPress={onGetStarted} icon={<Text style={styles.arrow}>→</Text>} />
          <Text style={styles.footer}>SMALL MOMENTS. BIG SMILES. <Text style={styles.footerStar}>✳</Text></Text>
          <Pressable onPress={onSignIn} accessibilityRole="button" style={styles.signIn}><Text style={styles.signInText}>Already have an account? <Text style={styles.signInAccent}>Sign in</Text></Text></Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 25 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  brandMark: { width: 34, height: 34, borderRadius: 12, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  brandLens: { width: 14, height: 14, borderRadius: 7, borderWidth: 2.5, borderColor: colors.background },
  brandName: { color: colors.ink, fontSize: 22, fontWeight: '800', letterSpacing: -1 },
  tag: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.accentSoft },
  tagText: { color: colors.accentDark, fontSize: 8, fontWeight: '800', letterSpacing: 1 },
  content: { flex: 1, justifyContent: 'space-between', paddingTop: 16 },
  artwork: { height: '42%', minHeight: 200, maxHeight: 340, borderRadius: 30, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' },
  sun: { width: 194, height: 194, borderRadius: 97, backgroundColor: '#DDD2F8', position: 'absolute', top: '10%' },
  sparkleOne: { position: 'absolute', top: '18%', left: '18%', color: colors.accent, fontSize: 25 },
  sparkleTwo: { position: 'absolute', top: '27%', right: '17%', color: colors.accent, fontSize: 25 },
  camera: { width: 172, height: 118, borderRadius: 27, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginTop: 8, shadowColor: '#A94D36', shadowOffset: { width: 0, height: 11 }, shadowOpacity: 0.18, shadowRadius: 13, elevation: 8 },
  cameraTop: { position: 'absolute', width: 58, height: 13, borderTopLeftRadius: 8, borderTopRightRadius: 8, backgroundColor: colors.accentDark, top: -8, left: 25 },
  cameraFlash: { position: 'absolute', width: 17, height: 10, borderRadius: 4, backgroundColor: '#E8DEFF', top: 17, left: 20 },
  cameraLensOuter: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#FFF2DA', alignItems: 'center', justifyContent: 'center' },
  cameraLensInner: { width: 55, height: 55, borderRadius: 28, backgroundColor: '#7863A9', alignItems: 'center', justifyContent: 'center' },
  cameraLensShine: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#D9CCFA', borderWidth: 4, borderColor: '#A995DC' },
  cameraDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: '#E8DEFF', position: 'absolute', right: 21, top: 18 },
  artworkCaption: { flexDirection: 'row', alignItems: 'center', gap: 6, position: 'absolute', bottom: 17 },
  captionHeart: { color: colors.accent, fontSize: 12 }, captionText: { color: '#766B8D', fontSize: 11, fontWeight: '600' },
  intro: { paddingTop: 18, paddingBottom: 8 },
  eyebrow: { color: colors.accentDark, fontSize: 10, fontWeight: '800', letterSpacing: 2, marginBottom: 9 },
  title: { color: colors.ink, fontSize: 42, fontWeight: '800', letterSpacing: -1.7, lineHeight: 46 },
  titleAccent: { color: colors.accent },
  description: { color: colors.muted, fontSize: 15, lineHeight: 22, marginTop: 9, maxWidth: 300 },
  bottom: { paddingTop: 8 }, arrow: { color: colors.surface, fontSize: 23, lineHeight: 26 },
  footer: { color: colors.subtle, fontSize: 9, fontWeight: '800', letterSpacing: 1.7, textAlign: 'center', marginTop: 14 },
  footerStar: { color: colors.accent }, signIn: { alignItems: 'center', paddingTop: 12 },
  signInText: { color: colors.muted, fontSize: 12 }, signInAccent: { color: colors.accentDark, fontWeight: '800' },
});