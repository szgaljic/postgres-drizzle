import {
  pgTable,
  uuid,
  text,
  timestamp,
  decimal,
  integer,
  serial,
  varchar,
} from 'drizzle-orm/pg-core';

// Define explicit enums for type safety
export enum AssetType {
  Stock = 'stock',
  Fund = 'fund',
  Crypto = 'crypto',
}

export enum TradeType {
  Buy = 'buy',
  Sell = 'sell',
}

export enum TransactionType {
  Deposit = 'deposit',
  Trade = 'trade',
  Reset = 'reset',
}

export const UsersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  googleId: varchar('google_id', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const PortfolioAccountsTable = pgTable('portfolio_accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: integer('user_id').references(() => UsersTable.id),
  name: text('name').notNull(),
  initialBalance: decimal('initial_balance', { precision: 12, scale: 2 }).notNull().default('0'),
  currentBalance: decimal('current_balance', { precision: 12, scale: 2 }).notNull().default('0'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const AssetsTable = pgTable('assets', {
  id: uuid('id').primaryKey().defaultRandom(),
  symbol: text('symbol').notNull().unique(),
  name: text('name').notNull(),
  assetType: text('asset_type', { enum: Object.values(AssetType) }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const TradesTable = pgTable('trades', {
  id: uuid('id').primaryKey().defaultRandom(),
  portfolioAccountId: uuid('portfolio_account_id')
    .notNull()
    .references(() => PortfolioAccountsTable.id),
  assetId: uuid('asset_id')
    .notNull()
    .references(() => AssetsTable.id),
  quantity: integer('quantity').notNull(),
  price: decimal('price', { precision: 12, scale: 2 }).notNull(),
  tradeTimestamp: timestamp('trade_timestamp', { withTimezone: true }).defaultNow().notNull(),
  tradeType: text('trade_type', { enum: Object.values(TradeType) }).notNull(),
});

export const AccountTransactionsTable = pgTable('account_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  portfolioAccountId: uuid('portfolio_account_id')
    .notNull()
    .references(() => PortfolioAccountsTable.id),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  transactionType: text('transaction_type', { enum: Object.values(TransactionType) }).notNull(),
  description: text('description'),
  tradeId: uuid('trade_id').references(() => TradesTable.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
