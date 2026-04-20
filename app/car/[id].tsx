import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Plus, Star } from 'lucide-react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { apiFetch } from '@/lib/api-client';
import type { FallbackCar } from '@/lib/data/fallback';
import { FALLBACK_CARS } from '@/lib/data/fallback';
import { Spec, SpecGrid } from '@/components/SpecRow';
import { formatUsd } from '@/lib/theme';

async function fetchCar(id: string): Promise<FallbackCar | null> {
  try {
    const res = await apiFetch<{ car: FallbackCar }>(`/api/cars/${id}`);
    return res.car;
  } catch {
    return FALLBACK_CARS.find((c) => c.id === id || c.slug === id) ?? null;
  }
}

export default function CarDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: car } = useQuery({
    queryKey: ['car', id],
    queryFn: () => fetchCar(id as string),
    enabled: Boolean(id),
  });

  const addToGarage = useMutation({
    mutationFn: async () => {
      await apiFetch('/api/garage', {
        method: 'POST',
        body: JSON.stringify({ carId: id }),
      });
    },
    onSuccess: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      queryClient.invalidateQueries({ queryKey: ['garage'] });
      Alert.alert('Added', `${car?.name ?? 'Car'} is in your garage.`);
    },
  });

  const addToWishlist = useMutation({
    mutationFn: async () => {
      await apiFetch('/api/wishlist', {
        method: 'POST',
        body: JSON.stringify({ carId: id }),
      });
    },
    onSuccess: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      Alert.alert('Saved', `${car?.name ?? 'Car'} is on your wishlist.`);
    },
  });

  if (!car) {
    return (
      <View className="flex-1 items-center justify-center bg-bg">
        <Text className="text-ink">Loading…</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-bg">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="relative h-[420px]">
          <Image
            source={{ uri: car.heroImageUrl }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            transition={300}
          />
          <LinearGradient
            colors={['rgba(10,10,12,0.5)', 'transparent', 'rgba(10,10,12,0.95)']}
            locations={[0, 0.4, 1]}
            style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
          />
          <Pressable
            onPress={() => router.back()}
            className="absolute right-5 top-14 h-10 w-10 items-center justify-center rounded-full bg-black/50"
          >
            <X color="#fff" size={20} />
          </Pressable>
          <View className="absolute bottom-6 left-5 right-5">
            <Text className="text-[13px] font-semibold uppercase tracking-[3px] text-white/70">
              {car.brand}
            </Text>
            <Text className="mt-2 text-[40px] font-bold leading-[44px] text-white">
              {car.name}
            </Text>
            <Text className="mt-2 text-[15px] text-white/70">
              {car.yearStart}
              {car.yearEnd ? `–${car.yearEnd}` : '–present'} · {car.bodyStyle}
            </Text>
          </View>
        </View>

        <View className="mx-5 mt-6">
          <Text className="text-[17px] leading-7 text-ink">{car.blurb}</Text>
        </View>

        <SpecGrid>
          <Spec label="Horsepower" value={car.horsepowerHp ? `${car.horsepowerHp} hp` : null} />
          <Spec label="0–60 mph" value={car.zeroToSixtyS ? `${car.zeroToSixtyS.toFixed(1)}s` : null} />
          <Spec label="Top speed" value={car.topSpeedMph ? `${car.topSpeedMph} mph` : null} />
          <Spec label="Drivetrain" value={car.drivetrain?.toUpperCase() ?? null} />
          <Spec label="Weight" value={car.weightKg ? `${car.weightKg.toLocaleString()} kg` : null} />
          <Spec label="Torque" value={car.torqueNm ? `${car.torqueNm} Nm` : null} />
          <Spec label="MSRP" value={car.msrpUsd ? formatUsd(car.msrpUsd) : null} />
          <Spec label="Market" value={car.marketValueUsd ? formatUsd(car.marketValueUsd) : null} />
        </SpecGrid>

        <Section title="Videos">
          <Text className="text-[14px] text-ink-muted">
            YouTube aggregation coming soon — we'll pull reviews and first-drives.
          </Text>
        </Section>

        <Section title="Reviews">
          <Text className="text-[14px] text-ink-muted">
            Curated review excerpts from Evo, Top Gear and Car & Driver land
            next.
          </Text>
        </Section>
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 border-t border-hairline bg-bg px-5 pb-10 pt-4"
        style={{ flexDirection: 'row', gap: 10 }}
      >
        <Pressable
          disabled={addToGarage.isPending}
          onPress={() => addToGarage.mutate()}
          className="flex-1 flex-row items-center justify-center rounded-[18px] bg-ink py-4"
        >
          <Plus color="#0A0A0C" size={18} />
          <Text className="ml-2 text-[15px] font-semibold text-bg">
            Add to Garage
          </Text>
        </Pressable>
        <Pressable
          disabled={addToWishlist.isPending}
          onPress={() => addToWishlist.mutate()}
          className="flex-1 flex-row items-center justify-center rounded-[18px] border border-hairline bg-bg-elevated py-4"
        >
          <Star color="#F5F5F7" size={18} />
          <Text className="ml-2 text-[15px] font-semibold text-ink">
            Wishlist
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="mx-5 mt-8">
      <Text className="text-[13px] font-semibold uppercase tracking-[2px] text-ink-subtle">
        {title}
      </Text>
      <View className="mt-3 rounded-[20px] bg-bg-card p-4">{children}</View>
    </View>
  );
}
