import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import type { FallbackCar } from '@/lib/data/fallback';
import { formatHp, formatZeroToSixty, formatUsd } from '@/lib/theme';

type Props = {
  car: FallbackCar;
  index?: number;
};

export function CarCard({ car, index = 0 }: Props) {
  const router = useRouter();

  return (
    <MotiView
      from={{ opacity: 0, translateY: 24 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 420, delay: index * 60 }}
    >
      <Pressable
        onPress={() => {
          Haptics.selectionAsync();
          router.push({ pathname: '/car/[id]', params: { id: car.id } });
        }}
        style={({ pressed }) => ({
          transform: [{ scale: pressed ? 0.98 : 1 }],
        })}
      >
        <View
          className="mx-5 mb-5 overflow-hidden rounded-[28px] bg-bg-card"
          style={{
            shadowColor: '#000',
            shadowOpacity: 0.5,
            shadowRadius: 28,
            shadowOffset: { width: 0, height: 12 },
          }}
        >
          <View className="relative h-64 w-full">
            <Image
              source={{ uri: car.heroImageUrl }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
              transition={280}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.75)']}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: 180,
              }}
            />
            <View
              style={{
                position: 'absolute',
                top: 14,
                left: 14,
                backgroundColor: 'rgba(0,0,0,0.35)',
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 999,
              }}
            >
              <Text className="text-[11px] font-semibold uppercase tracking-wider text-white">
                {car.rarity}
              </Text>
            </View>
          </View>
          <View className="px-5 py-4">
            <Text className="text-[13px] font-medium uppercase tracking-[2px] text-ink-muted">
              {car.brand}
            </Text>
            <Text className="mt-1 text-[26px] font-bold text-ink" numberOfLines={1}>
              {car.name}
            </Text>
            <View className="mt-3 flex-row items-center gap-4">
              <Stat label={formatHp(car.horsepowerHp)} />
              <Stat label={formatZeroToSixty(car.zeroToSixtyS)} />
              <Stat label={formatUsd(car.marketValueUsd ?? car.msrpUsd)} />
            </View>
          </View>
        </View>
      </Pressable>
    </MotiView>
  );
}

function Stat({ label }: { label: string }) {
  return <Text className="text-[13px] font-medium text-ink-muted">{label}</Text>;
}
