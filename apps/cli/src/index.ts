import {
  type Holding,
  Portfolio,
  describe as describeTransaction,
  loadTransactions,
  sample,
} from "ledger"

// the demo of module 1, now it uses the ledger package

const btc: Holding = {
  asset: "BTC",
  amount: 0.042,
  account: "ledger-wallet",
  tags: ["long term", "cold"],
  staked: false,
}
console.log(btc.asset + ": " + btc.amount + " in " + btc.account)
console.log("")

for (let i = 0; i < sample.length; i++) {
  console.log(describeTransaction(sample[i]))
}
console.log("")

const portfolio = new Portfolio()
for (let i = 0; i < sample.length; i++) {
  portfolio.apply(sample[i])
}
console.log(portfolio.report())
console.log("")

const good = `[
  { "kind": "deposit", "date": "2026-10-01", "asset": "USDT", "amount": 500, "account": "binance" },
  { "kind": "buy", "date": "2026-10-02", "asset": "BTC", "amount": 0.004, "price": 95000, "fee": 0.4, "account": "binance", "note": "first one" }
]`

const broken = [
  `[{ "kind": "buy", "date": "2026-10-02", "asset": "BTC", "amount": "0.004" }]`,
  `[{ "kind": "gift", "date": "2026-10-02", "asset": "BTC", "amount": 1 }]`,
  `{ "kind": "deposit" }`,
  `[{ "kind": "deposit",`,
]

const loaded = loadTransactions(good)
console.log("loaded " + loaded.length + " transactions from text")

for (let i = 0; i < broken.length; i++) {
  try {
    loadTransactions(broken[i])
  } catch (error) {
    if (error instanceof Error) {
      console.log("broken " + (i + 1) + ": " + error.message)
    }
  }
}
