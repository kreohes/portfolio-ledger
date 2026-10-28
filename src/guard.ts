// Cycle 4: transactions from a file are unknown until we check them

import { type Transaction, describe } from "./transactions.ts"

export function loadTransactions(text: string): Transaction[] {
  let value: unknown

  try {
    value = JSON.parse(text)
  } catch {
    throw new Error("The ledger is not valid JSON")
  }

  if (!Array.isArray(value)) {
    throw new Error("The ledger must be a list of transactions")
  }

  const result: Transaction[] = []
  for (let i = 0; i < value.length; i++) {
    const item: unknown = value[i]
    if (!isTransaction(item)) {
      throw new Error("Transaction " + (i + 1) + " has a wrong shape")
    }
    result.push(item)
  }

  return result
}

export function isTransaction(value: unknown): value is Transaction {
  if (typeof value !== "object" || value === null) {
    return false
  }

  if (!("date" in value) || typeof value.date !== "string") {
    return false
  }
  if (!("asset" in value) || typeof value.asset !== "string") {
    return false
  }
  if (!("amount" in value) || typeof value.amount !== "number") {
    return false
  }
  if ("note" in value && typeof value.note !== "string") {
    return false
  }

  if (!("kind" in value)) {
    return false
  }

  if (value.kind === "buy" || value.kind === "sell") {
    return (
      "price" in value &&
      typeof value.price === "number" &&
      "fee" in value &&
      typeof value.fee === "number" &&
      "account" in value &&
      typeof value.account === "string"
    )
  }

  if (value.kind === "deposit") {
    return "account" in value && typeof value.account === "string"
  }

  if (value.kind === "withdraw") {
    return (
      "account" in value &&
      typeof value.account === "string" &&
      "fee" in value &&
      typeof value.fee === "number"
    )
  }

  if (value.kind === "transfer") {
    return (
      "from" in value &&
      typeof value.from === "string" &&
      "to" in value &&
      typeof value.to === "string" &&
      "fee" in value &&
      typeof value.fee === "number"
    )
  }

  return false
}

const good = `[
  { "kind": "deposit", "date": "2026-10-01", "asset": "USDT", "amount": 500, "account": "binance" },
  { "kind": "buy", "date": "2026-10-02", "asset": "BTC", "amount": 0.004, "price": 95000, "fee": 0.4, "account": "binance", "note": "first one" }
]`

const broken = [
  `[{ "kind": "buy", "date": "2026-10-02", "asset": "BTC", "amount": "0.004" }]`,
  `[{ "kind": "gift", "date": "2026-10-02", "asset": "BTC", "amount": 1 }]`,
  `[{ "kind": "deposit", "date": "2026-10-01", "asset": "USDT", "amount": 5, "account": "binance", "note": 7 }]`,
  `{ "kind": "deposit" }`,
  `[{ "kind": "deposit",`,
]

const loaded = loadTransactions(good)
for (let i = 0; i < loaded.length; i++) {
  console.log(describe(loaded[i]))
}

for (let i = 0; i < broken.length; i++) {
  try {
    loadTransactions(broken[i])
  } catch (error) {
    if (error instanceof Error) {
      console.log("broken " + (i + 1) + ": " + error.message)
    }
  }
}
