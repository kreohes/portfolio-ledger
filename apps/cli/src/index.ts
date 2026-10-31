import path from "node:path"

import { Portfolio, type Transaction, describe, loadLedger } from "ledger"

const file = path.join(import.meta.dirname, "..", "data", "ledger.json")

let transactions: Transaction[]

try {
  transactions = await loadLedger(file)
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
}

console.log("Ledger: " + file)
console.log("")

for (let i = 0; i < transactions.length; i++) {
  console.log(describe(transactions[i]))
}
console.log("")

const portfolio = new Portfolio()
for (let i = 0; i < transactions.length; i++) {
  portfolio.apply(transactions[i])
}
console.log(portfolio.report())
