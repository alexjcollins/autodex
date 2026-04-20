import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { useAuth } from '@/lib/auth/context';
import { apiFetch } from '@/lib/api-client';
import * as WebBrowser from 'expo-web-browser';
import { Alert } from 'react-native';

export default function SignIn() {
  const { signInAsGuest } = useAuth();

  async function signInWithWorkos() {
    try {
      const { url } = await apiFetch<{ url: string }>('/api/auth/sign-in');
      await WebBrowser.openBrowserAsync(url);
    } catch (e: any) {
      Alert.alert(
        'WorkOS not configured',
        'Add WORKOS_API_KEY + WORKOS_CLIENT_ID in .env.local, or continue as guest.',
      );
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <View className="flex-1 justify-between px-8 pb-10 pt-16">
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500 }}
        >
          <Text className="text-[13px] font-semibold uppercase tracking-[3px] text-accent">
            Autodex
          </Text>
          <Text className="mt-4 text-[40px] font-bold leading-[44px] text-ink">
            The Pokédex{'\n'}for special cars.
          </Text>
          <Text className="mt-5 text-[17px] leading-7 text-ink-muted">
            Browse a living archive of iconic marques. Build your garage. Chase
            your poster cars.
          </Text>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 160 }}
        >
          <Pressable
            onPress={signInWithWorkos}
            className="mb-3 items-center rounded-[18px] bg-ink py-4"
          >
            <Text className="text-[16px] font-semibold text-bg">
              Continue with WorkOS
            </Text>
          </Pressable>
          <Pressable
            onPress={signInAsGuest}
            className="items-center rounded-[18px] border border-hairline bg-bg-elevated py-4"
          >
            <Text className="text-[16px] font-semibold text-ink">
              Continue as guest
            </Text>
          </Pressable>
          <Text className="mt-4 text-center text-[12px] text-ink-subtle">
            Guest mode keeps everything on-device until you sign in.
          </Text>
        </MotiView>
      </View>
    </SafeAreaView>
  );
}
