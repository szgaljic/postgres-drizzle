import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { InferSelectModel, InferInsertModel } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

// Import our paper trader schema
import {
  PortfolioAccountsTable,
  AssetsTable,
  TradesTable,
  AccountTransactionsTable,
  UsersTable,
} from './schema/paper-trader'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

// Export our paper trader types
export type User = InferSelectModel<typeof UsersTable>
export type NewUser = InferInsertModel<typeof UsersTable>
export type PortfolioAccount = InferSelectModel<typeof PortfolioAccountsTable>
export type NewPortfolioAccount = InferInsertModel<typeof PortfolioAccountsTable>
export type Asset = InferSelectModel<typeof AssetsTable>
export type NewAsset = InferInsertModel<typeof AssetsTable>
export type Trade = InferSelectModel<typeof TradesTable>
export type NewTrade = InferInsertModel<typeof TradesTable>
export type AccountTransaction = InferSelectModel<typeof AccountTransactionsTable>
export type NewAccountTransaction = InferInsertModel<typeof AccountTransactionsTable>

// Connect to Postgres
export const db = drizzle(sql)

// Export our paper trader tables
export {
  UsersTable,
  PortfolioAccountsTable,
  AssetsTable,
  TradesTable,
  AccountTransactionsTable,
}
