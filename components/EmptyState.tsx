import { Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

type Props = {
  title: string;
  subtitle: string;
  cta?: {
    label: string;
    href: string;
  };
};

export function EmptyState({ title, subtitle, cta }: Props) {
  const router = useRouter();
  return (
    <View className="flex-1 items-center justify-center px-10">
      <View
        className="mb-6 h-16 w-16 items-center justify-center rounded-[20px] bg-bg-card"
      >
        <Text className="text-3xl">🏁</Text>
      </View>
      <Text className="text-center text-[22px] font-bold text-ink">{title}</Text>
      <Text className="mt-2 text-center text-[15px] leading-6 text-ink-muted">
        {subtitle}
      </Text>
      {cta ? (
        <Pressable
          onPress={() => router.push(cta.href as never)}
          className="mt-6 rounded-pill bg-ink px-5 py-3"
        >
          <Text className="text-[15px] font-semibold text-bg">{cta.label}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
