export const colors = {
  bg: '#0A0A0C',
  bgElevated: '#14141A',
  bgCard: '#1C1C23',
  ink: '#F5F5F7',
  inkMuted: '#A1A1AA',
  inkSubtle: '#6B6B75',
  hairline: 'rgba(255,255,255,0.08)',
  accent: '#FF3B30',
};

export const radii = {
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  pill: 999,
};

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
};

export function formatUsd(n?: number | string | null) {
  if (n === null || n === undefined) return '—';
  const num = typeof n === 'number' ? n : Number(n);
  if (!Number.isFinite(num)) return '—';
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(num >= 10_000_000 ? 0 : 1)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}k`;
  return `$${num.toFixed(0)}`;
}

export function formatHp(hp?: number | null) {
  if (!hp) return '—';
  return `${hp.toLocaleString()} hp`;
}

export function formatZeroToSixty(s?: number | null) {
  if (!s) return '—';
  return `${s.toFixed(1)}s 0–60`;
}
