import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { CarCard } from '@/components/CarCard';
import { EmptyState } from '@/components/EmptyState';
import { apiFetch } from '@/lib/api-client';
import type { FallbackCar } from '@/lib/data/fallback';

type Entry = { carId: string; car: FallbackCar };

async function fetchGarage(): Promise<Entry[]> {
  try {
    const res = await apiFetch<{ entries: Entry[] }>('/api/garage');
    return res.entries;
  } catch {
    return [];
  }
}

export default function Garage() {
  const { data: entries = [] } = useQuery({
    queryKey: ['garage'],
    queryFn: fetchGarage,
  });

  if (entries.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
        <Header title="Garage" subtitle="Cars you own" />
        <EmptyState
          title="Your garage is empty"
          subtitle="Add the cars you currently own to track your collection."
          cta={{ label: 'Browse Autodex', href: '/(tabs)' }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <FlatList
        data={entries}
        keyExtractor={(e) => e.carId}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListHeaderComponent={<Header title="Garage" subtitle={`${entries.length} in the bay`} />}
        renderItem={({ item, index }) => <CarCard car={item.car} index={index} />}
      />
    </SafeAreaView>
  );
}

function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View className="px-5 pb-4 pt-2">
      <Text className="text-[13px] font-semibold uppercase tracking-[3px] text-accent">
        {subtitle}
      </Text>
      <Text className="mt-1 text-[40px] font-bold text-ink">{title}</Text>
    </View>
  );
}
