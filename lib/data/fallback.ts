// Minimal inline dataset so the UI is demoable without a live DB.
// Replace with real seed data later.

export type FallbackCar = {
  id: string;
  slug: string;
  brand: string;
  brandSlug: string;
  name: string;
  yearStart: number;
  yearEnd?: number;
  bodyStyle: string;
  drivetrain: 'rwd' | 'awd' | 'mid' | '4wd' | 'fwd';
  horsepowerHp: number;
  torqueNm?: number;
  zeroToSixtyS?: number;
  topSpeedMph?: number;
  weightKg?: number;
  msrpUsd?: number;
  marketValueUsd?: number;
  heroImageUrl: string;
  accentColor: string;
  blurb: string;
  rarity: 'iconic' | 'rare' | 'common';
  tags: string[];
};

export const FALLBACK_CARS: FallbackCar[] = [
  {
    id: 'car_f40',
    slug: 'ferrari-f40',
    brand: 'Ferrari',
    brandSlug: 'ferrari',
    name: 'F40',
    yearStart: 1987,
    yearEnd: 1992,
    bodyStyle: 'Coupe',
    drivetrain: 'rwd',
    horsepowerHp: 471,
    torqueNm: 577,
    zeroToSixtyS: 4.1,
    topSpeedMph: 201,
    weightKg: 1100,
    msrpUsd: 400000,
    marketValueUsd: 2500000,
    heroImageUrl:
      'https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?w=1600&q=80',
    accentColor: '#E11D1D',
    blurb:
      "Enzo's last blessing. A twin-turbo V8 wrapped in Kevlar and a raw analogue soul.",
    rarity: 'iconic',
    tags: ['turbo', 'v8', 'analogue', '80s'],
  },
  {
    id: 'car_porsche_911_gt3_rs_992',
    slug: 'porsche-911-gt3-rs-992',
    brand: 'Porsche',
    brandSlug: 'porsche',
    name: '911 GT3 RS',
    generation: '992',
    yearStart: 2023,
    bodyStyle: 'Coupe',
    drivetrain: 'rwd',
    horsepowerHp: 518,
    torqueNm: 465,
    zeroToSixtyS: 3.0,
    topSpeedMph: 184,
    weightKg: 1450,
    msrpUsd: 241300,
    marketValueUsd: 340000,
    heroImageUrl:
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1600&q=80',
    accentColor: '#F5B700',
    blurb:
      'Active aero, track-honed chassis, and a 9,000 rpm flat-six. Basically a road-legal Cup car.',
    rarity: 'iconic',
    tags: ['track', 'flat-six', 'aero', 'manual-era'],
  } as FallbackCar,
  {
    id: 'car_aston_db11',
    slug: 'aston-martin-db11',
    brand: 'Aston Martin',
    brandSlug: 'aston-martin',
    name: 'DB11',
    yearStart: 2016,
    yearEnd: 2023,
    bodyStyle: 'GT Coupe',
    drivetrain: 'rwd',
    horsepowerHp: 528,
    torqueNm: 700,
    zeroToSixtyS: 3.9,
    topSpeedMph: 200,
    weightKg: 1875,
    msrpUsd: 205600,
    marketValueUsd: 145000,
    heroImageUrl:
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1600&q=80',
    accentColor: '#1E3A5F',
    blurb:
      'Gaydon grand touring at its most sculptural — a V12 warble for continents, not corners.',
    rarity: 'rare',
    tags: ['v12', 'grand-tourer', 'british'],
  },
  {
    id: 'car_lambo_countach_lp400',
    slug: 'lamborghini-countach-lp400',
    brand: 'Lamborghini',
    brandSlug: 'lamborghini',
    name: 'Countach LP400',
    yearStart: 1974,
    yearEnd: 1977,
    bodyStyle: 'Coupe',
    drivetrain: 'mid',
    horsepowerHp: 375,
    torqueNm: 361,
    zeroToSixtyS: 5.4,
    topSpeedMph: 180,
    weightKg: 1065,
    msrpUsd: 52000,
    marketValueUsd: 1200000,
    heroImageUrl:
      'https://images.unsplash.com/photo-1621135802920-133df287f89c?w=1600&q=80',
    accentColor: '#F4A300',
    blurb:
      "Marcello Gandini's origami wedge. The original bedroom wall poster car.",
    rarity: 'iconic',
    tags: ['v12', 'wedge', '70s', 'poster'],
  },
  {
    id: 'car_mclaren_f1',
    slug: 'mclaren-f1',
    brand: 'McLaren',
    brandSlug: 'mclaren',
    name: 'F1',
    yearStart: 1992,
    yearEnd: 1998,
    bodyStyle: 'Coupe',
    drivetrain: 'rwd',
    horsepowerHp: 618,
    torqueNm: 651,
    zeroToSixtyS: 3.2,
    topSpeedMph: 240,
    weightKg: 1140,
    productionUnits: 106,
    msrpUsd: 815000,
    marketValueUsd: 20000000,
    heroImageUrl:
      'https://images.unsplash.com/photo-1610474139139-b85b9c0cf5a3?w=1600&q=80',
    accentColor: '#C0C0C8',
    blurb:
      'Gordon Murray built a no-compromise BMW-V12 masterpiece. Center-driver. Gold-lined bay. Era-defining.',
    rarity: 'iconic',
    tags: ['v12', 'center-seat', 'legend', '90s'],
  } as FallbackCar,
  {
    id: 'car_bmw_m3_e46',
    slug: 'bmw-m3-e46',
    brand: 'BMW',
    brandSlug: 'bmw',
    name: 'M3',
    generation: 'E46',
    yearStart: 2000,
    yearEnd: 2006,
    bodyStyle: 'Coupe',
    drivetrain: 'rwd',
    horsepowerHp: 333,
    torqueNm: 365,
    zeroToSixtyS: 4.8,
    topSpeedMph: 155,
    weightKg: 1570,
    msrpUsd: 55000,
    marketValueUsd: 55000,
    heroImageUrl:
      'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1600&q=80',
    accentColor: '#1E6FB5',
    blurb:
      'The last naturally aspirated inline-six M3. Still the benchmark everyone keeps chasing.',
    rarity: 'rare',
    tags: ['i6', 'manual', 'analogue', 'driver-car'],
  } as FallbackCar,
];

export const FALLBACK_BRANDS = Array.from(
  new Map(
    FALLBACK_CARS.map((c) => [
      c.brandSlug,
      { slug: c.brandSlug, name: c.brand },
    ]),
  ).values(),
);
