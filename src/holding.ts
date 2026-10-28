// Cycle 1: my own data shape

export interface Holding {
  asset: string
  amount: number
  account: string
  tags: string[]
  staked: boolean
}

const btc: Holding = {
  asset: "BTC",
  amount: 0.042,
  account: "ledger-wallet",
  tags: ["long term", "cold"],
  staked: false,
}

console.log(btc.asset + ": " + btc.amount + " in " + btc.account)
console.log("tags: " + btc.tags.join(", "))

// I tried amount: "0.042" and tags: [1, 2] and tsc showed both errors,
// then fixed them back
