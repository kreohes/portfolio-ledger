import { type Holding } from "../holding.ts"
import { type Asset } from "../portfolio/index.ts"
import { type Transaction } from "../transactions/index.ts"
export type Position = Pick<Holding, "asset" | "amount"> & { asset: Asset }
export interface LedgerResponse {
  id: string
  transactions: Transaction[]
}
export interface PortfolioResponse {
  ledger: string
  transactions: number
  holdings: Position[]
  report: string
}
export interface CreatedResponse {
  id: string
}
export interface TransactionsResponse {
  asset: Asset
  transactions: Transaction[]
}
export interface ErrorResponse {
  error: string
}
