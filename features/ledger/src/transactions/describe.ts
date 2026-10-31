import { type Transaction } from "./types.ts"

// only this file needs it, so it stays private to the folder
function money(value: number): string {
  return value.toFixed(2)
}

export default function describe(tx: Transaction): string {
  if (tx.kind === "buy") {
    return (
      tx.date +
      " bought " +
      tx.amount +
      " " +
      tx.asset +
      " at " +
      money(tx.price) +
      " on " +
      tx.account +
      " (fee " +
      tx.fee +
      ")"
    )
  } else if (tx.kind === "sell") {
    return (
      tx.date +
      " sold " +
      tx.amount +
      " " +
      tx.asset +
      " at " +
      money(tx.price) +
      " on " +
      tx.account +
      " (fee " +
      tx.fee +
      ")"
    )
  } else if (tx.kind === "deposit") {
    return (
      tx.date + " deposit " + tx.amount + " " + tx.asset + " to " + tx.account
    )
  } else if (tx.kind === "withdraw") {
    return (
      tx.date +
      " withdraw " +
      tx.amount +
      " " +
      tx.asset +
      " from " +
      tx.account +
      " (fee " +
      tx.fee +
      ")"
    )
  } else if (tx.kind === "transfer") {
    return (
      tx.date +
      " transfer " +
      tx.amount +
      " " +
      tx.asset +
      " from " +
      tx.from +
      " to " +
      tx.to +
      " (fee " +
      tx.fee +
      ")"
    )
  } else {
    throw new Error("Unknown kind of transaction")
  }
}
