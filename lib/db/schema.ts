import { relations, sql } from 'drizzle-orm';
import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';

export const rarityEnum = pgEnum('car_rarity', ['iconic', 'rare', 'common']);
export const drivetrainEnum = pgEnum('drivetrain', ['rwd', 'awd', 'fwd', 'mid', '4wd']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  workosId: text('workos_id').notNull().unique(),
  email: text('email').notNull(),
  name: text('name'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const brands = pgTable('brands', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  country: text('country'),
  logoUrl: text('logo_url'),
  foundedYear: integer('founded_year'),
});

export const cars = pgTable(
  'cars',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    brandId: uuid('brand_id')
      .notNull()
      .references(() => brands.id, { onDelete: 'cascade' }),
    slug: text('slug').notNull().unique(),
    name: text('name').notNull(),
    generation: text('generation'),
    yearStart: integer('year_start').notNull(),
    yearEnd: integer('year_end'),
    bodyStyle: text('body_style'),
    drivetrain: drivetrainEnum('drivetrain'),
    transmission: text('transmission'),
    engineConfig: text('engine_config'),
    displacementCc: integer('displacement_cc'),
    horsepowerHp: integer('horsepower_hp'),
    torqueNm: integer('torque_nm'),
    zeroToSixtyS: real('zero_to_sixty_s'),
    topSpeedMph: integer('top_speed_mph'),
    weightKg: integer('weight_kg'),
    productionUnits: integer('production_units'),
    msrpUsd: numeric('msrp_usd', { precision: 12, scale: 2 }),
    marketValueUsd: numeric('market_value_usd', { precision: 12, scale: 2 }),
    heroImageUrl: text('hero_image_url'),
    galleryUrls: jsonb('gallery_urls').$type<string[]>().default(sql`'[]'::jsonb`),
    accentColor: text('accent_color'),
    blurb: text('blurb'),
    rarity: rarityEnum('rarity').notNull().default('rare'),
    tags: text('tags').array().default(sql`ARRAY[]::text[]`),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    brandIdx: index('cars_brand_id_idx').on(t.brandId),
    rarityIdx: index('cars_rarity_idx').on(t.rarity),
  }),
);

export const garageEntries = pgTable(
  'garage_entries',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    carId: uuid('car_id')
      .notNull()
      .references(() => cars.id, { onDelete: 'cascade' }),
    acquiredAt: date('acquired_at'),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index('garage_user_idx').on(t.userId),
    uniqOwnership: unique('garage_user_car_uniq').on(t.userId, t.carId),
  }),
);

export const wishlistEntries = pgTable(
  'wishlist_entries',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    carId: uuid('car_id')
      .notNull()
      .references(() => cars.id, { onDelete: 'cascade' }),
    priority: integer('priority').notNull().default(0),
    targetPriceUsd: numeric('target_price_usd', { precision: 12, scale: 2 }),
    targetDate: date('target_date'),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index('wishlist_user_idx').on(t.userId),
    uniqWish: unique('wishlist_user_car_uniq').on(t.userId, t.carId),
  }),
);

// --- Stubs for post-MVP features (tables created, UI not wired) ---
export const savingsGoals = pgTable('savings_goals', {
  id: uuid('id').primaryKey().defaultRandom(),
  wishlistEntryId: uuid('wishlist_entry_id')
    .notNull()
    .references(() => wishlistEntries.id, { onDelete: 'cascade' }),
  targetAmountUsd: numeric('target_amount_usd', { precision: 12, scale: 2 }).notNull(),
  currentAmountUsd: numeric('current_amount_usd', { precision: 12, scale: 2 })
    .notNull()
    .default('0'),
  monthlyContributionUsd: numeric('monthly_contribution_usd', { precision: 12, scale: 2 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const videos = pgTable('videos', {
  id: uuid('id').primaryKey().defaultRandom(),
  carId: uuid('car_id')
    .notNull()
    .references(() => cars.id, { onDelete: 'cascade' }),
  youtubeId: text('youtube_id').notNull(),
  title: text('title').notNull(),
  channel: text('channel'),
  publishedAt: timestamp('published_at', { withTimezone: true }),
});

export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  carId: uuid('car_id')
    .notNull()
    .references(() => cars.id, { onDelete: 'cascade' }),
  source: text('source').notNull(),
  excerpt: text('excerpt').notNull(),
  url: text('url'),
  rating: real('rating'),
  featured: boolean('featured').notNull().default(false),
});

// Relations
export const brandRelations = relations(brands, ({ many }) => ({
  cars: many(cars),
}));

export const carRelations = relations(cars, ({ one, many }) => ({
  brand: one(brands, { fields: [cars.brandId], references: [brands.id] }),
  garageEntries: many(garageEntries),
  wishlistEntries: many(wishlistEntries),
  videos: many(videos),
  reviews: many(reviews),
}));

export const userRelations = relations(users, ({ many }) => ({
  garage: many(garageEntries),
  wishlist: many(wishlistEntries),
}));

export type User = typeof users.$inferSelect;
export type Brand = typeof brands.$inferSelect;
export type Car = typeof cars.$inferSelect;
export type GarageEntry = typeof garageEntries.$inferSelect;
export type WishlistEntry = typeof wishlistEntries.$inferSelect;
