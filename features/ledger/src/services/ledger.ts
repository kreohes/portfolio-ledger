import { type Transaction } from "../transactions/index.ts"
import {
  type LedgerResponse,
  type CreatedResponse,
  type PortfolioResponse,
  type TransactionsResponse,
  isLedger,
  isCreated,
  isPortfolio,
  isTransactions,
} from "../api/index.ts"
import { request } from "./request.ts"

export async function getLedger(id: string): Promise<LedgerResponse> {
  return request<LedgerResponse>("/ledgers/" + encodeURIComponent(id), isLedger)
}

export async function createLedger(
  transactions: Transaction[],
): Promise<CreatedResponse> {
  return request<CreatedResponse>("/ledgers", isCreated, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ transactions }),
  })
}

export async function getPortfolio(id: string): Promise<PortfolioResponse> {
  return request<PortfolioResponse>("/portfolio", isPortfolio, {
    headers: { "x-ledger-id": id },
  })
}

export async function getTransactions(
  id: string,
  asset: string,
): Promise<TransactionsResponse> {
  return request<TransactionsResponse>(
    "/transactions/" + encodeURIComponent(asset),
    isTransactions,
    {
      headers: { "x-ledger-id": id },
    },
  )
}
