import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { CarCard } from '@/components/CarCard';
import { apiFetch } from '@/lib/api-client';
import { FALLBACK_BRANDS, FALLBACK_CARS, type FallbackCar } from '@/lib/data/fallback';

async function fetchCars(): Promise<FallbackCar[]> {
  try {
    const res = await apiFetch<{ cars: FallbackCar[] }>('/api/cars');
    return res.cars;
  } catch {
    return FALLBACK_CARS;
  }
}

export default function Discover() {
  const { data: cars = [] } = useQuery({ queryKey: ['cars'], queryFn: fetchCars });
  const [brand, setBrand] = useState<string | null>(null);

  const filtered = useMemo(
    () => (brand ? cars.filter((c) => c.brandSlug === brand) : cars),
    [cars, brand],
  );

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 120 }}
        renderItem={({ item, index }) => <CarCard car={item} index={index} />}
        ListHeaderComponent={
          <View>
            <View className="px-5 pb-2 pt-2">
              <Text className="text-[13px] font-semibold uppercase tracking-[3px] text-accent">
                Discover
              </Text>
              <Text className="mt-1 text-[40px] font-bold text-ink">Autodex</Text>
              <Text className="mt-2 text-[15px] text-ink-muted">
                A living archive of iconic cars. Tap to open.
              </Text>
            </View>
            <BrandRow selected={brand} onSelect={setBrand} />
          </View>
        }
      />
    </SafeAreaView>
  );
}

function BrandRow({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (b: string | null) => void;
}) {
  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={[{ slug: null, name: 'All' }, ...FALLBACK_BRANDS.map((b) => ({ slug: b.slug, name: b.name }))]}
      keyExtractor={(i) => i.slug ?? 'all'}
      contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 14, gap: 8 }}
      renderItem={({ item }) => {
        const isActive = selected === item.slug;
        return (
          <Pressable
            onPress={() => onSelect(item.slug)}
            className={`rounded-pill px-4 py-2 ${
              isActive ? 'bg-ink' : 'border border-hairline bg-bg-elevated'
            }`}
          >
            <Text
              className={`text-[13px] font-semibold ${
                isActive ? 'text-bg' : 'text-ink'
              }`}
            >
              {item.name}
            </Text>
          </Pressable>
        );
      }}
    />
  );
}
