import { isTransaction } from "../guard/index.ts"
import { ASSETS } from "../portfolio/index.ts"
import {
  type LedgerResponse,
  type PortfolioResponse,
  type CreatedResponse,
  type TransactionsResponse,
} from "./types.ts"
function object(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}
function transactions(value: unknown): boolean {
  return Array.isArray(value) && value.every(isTransaction)
}
export function isLedger(value: unknown): value is LedgerResponse {
  return (
    object(value) &&
    typeof value.id === "string" &&
    transactions(value.transactions)
  )
}
export function isCreated(value: unknown): value is CreatedResponse {
  return object(value) && typeof value.id === "string" && value.id.length > 0
}
export function isPortfolio(value: unknown): value is PortfolioResponse {
  if (!object(value)) return false
  if (typeof value.ledger !== "string" || typeof value.report !== "string")
    return false
  if (
    typeof value.transactions !== "number" ||
    !Number.isInteger(value.transactions) ||
    value.transactions < 0
  )
    return false
  if (!Array.isArray(value.holdings) || value.holdings.length !== ASSETS.length)
    return false

  const found: string[] = []
  for (const holding of value.holdings) {
    if (!object(holding) || typeof holding.asset !== "string") return false
    if (!ASSETS.some((asset) => asset === holding.asset)) return false
    if (found.includes(holding.asset)) return false
    if (
      typeof holding.amount !== "number" ||
      !Number.isFinite(holding.amount) ||
      holding.amount < 0
    )
      return false
    found.push(holding.asset)
  }
  return true
}
export function isTransactions(value: unknown): value is TransactionsResponse {
  return (
    object(value) &&
    ASSETS.some((asset) => asset === value.asset) &&
    transactions(value.transactions)
  )
}
