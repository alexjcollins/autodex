import { Text, View } from 'react-native';

export function SpecGrid({ children }: { children: React.ReactNode }) {
  return (
    <View className="mx-5 mt-6 flex-row flex-wrap gap-3">{children}</View>
  );
}

export function Spec({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <View
      className="rounded-[20px] bg-bg-card px-4 py-3"
      style={{ minWidth: '30%', flexGrow: 1 }}
    >
      <Text className="text-[11px] font-semibold uppercase tracking-[1.5px] text-ink-subtle">
        {label}
      </Text>
      <Text className="mt-1 text-[17px] font-semibold text-ink" numberOfLines={1}>
        {value ?? '—'}
      </Text>
    </View>
  );
}
