import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/lib/auth/context';

export default function Profile() {
  const { user, signOut } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <View className="px-5 pb-4 pt-2">
        <Text className="text-[13px] font-semibold uppercase tracking-[3px] text-accent">
          Account
        </Text>
        <Text className="mt-1 text-[40px] font-bold text-ink">Profile</Text>
      </View>

      <View className="mx-5 mt-2 rounded-[24px] bg-bg-card p-5">
        <View className="h-14 w-14 items-center justify-center rounded-full bg-bg-elevated">
          <Text className="text-2xl font-semibold text-ink">
            {(user?.name ?? user?.email ?? '?').slice(0, 1).toUpperCase()}
          </Text>
        </View>
        <Text className="mt-4 text-[20px] font-bold text-ink">
          {user?.name ?? 'Guest Driver'}
        </Text>
        <Text className="mt-1 text-[14px] text-ink-muted">
          {user?.email ?? '—'}
        </Text>
        {user?.guest ? (
          <View className="mt-3 self-start rounded-pill bg-bg-elevated px-3 py-1">
            <Text className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
              Guest mode
            </Text>
          </View>
        ) : null}
      </View>

      <View className="mx-5 mt-6">
        <Pressable
          onPress={signOut}
          className="items-center rounded-[18px] border border-hairline bg-bg-elevated py-4"
        >
          <Text className="text-[15px] font-semibold text-ink">Sign out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
