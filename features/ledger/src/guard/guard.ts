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
