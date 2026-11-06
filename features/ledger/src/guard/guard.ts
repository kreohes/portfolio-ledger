import { ASSETS } from "../portfolio/index.ts"
import { type Transaction } from "../transactions/index.ts"

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

  if (
    !("date" in value) ||
    typeof value.date !== "string" ||
    !validDate(value.date)
  ) {
    return false
  }
  if (
    !("asset" in value) ||
    typeof value.asset !== "string" ||
    !ASSETS.some((asset) => asset === value.asset)
  ) {
    return false
  }
  if (
    !("amount" in value) ||
    typeof value.amount !== "number" ||
    !Number.isFinite(value.amount) ||
    value.amount <= 0
  ) {
    return false
  }
  if (
    "note" in value &&
    (typeof value.note !== "string" || value.note.length > 500)
  ) {
    return false
  }

  if (!("kind" in value)) {
    return false
  }

  if (value.kind === "buy" || value.kind === "sell") {
    return (
      "price" in value &&
      typeof value.price === "number" &&
      Number.isFinite(value.price) &&
      value.price > 0 &&
      "fee" in value &&
      typeof value.fee === "number" &&
      Number.isFinite(value.fee) &&
      value.fee >= 0 &&
      "account" in value &&
      typeof value.account === "string" &&
      value.account.trim().length > 0 &&
      value.account.length <= 100
    )
  }

  if (value.kind === "deposit") {
    return (
      "account" in value &&
      typeof value.account === "string" &&
      value.account.trim().length > 0 &&
      value.account.length <= 100
    )
  }

  if (value.kind === "withdraw") {
    return (
      "account" in value &&
      typeof value.account === "string" &&
      value.account.trim().length > 0 &&
      value.account.length <= 100 &&
      "fee" in value &&
      typeof value.fee === "number" &&
      Number.isFinite(value.fee) &&
      value.fee >= 0
    )
  }

  if (value.kind === "transfer") {
    return (
      "from" in value &&
      typeof value.from === "string" &&
      value.from.trim().length > 0 &&
      value.from.length <= 100 &&
      "to" in value &&
      typeof value.to === "string" &&
      value.to.trim().length > 0 &&
      value.to.length <= 100 &&
      "fee" in value &&
      typeof value.fee === "number" &&
      Number.isFinite(value.fee) &&
      value.fee >= 0
    )
  }

  return false
}

function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(value)
  return (
    Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
  )
}
