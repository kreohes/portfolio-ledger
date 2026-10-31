import { type Transaction } from "../transactions/index.ts"

import { type Asset, ASSETS, toAsset } from "./assets.ts"

export default class Portfolio {
  private amounts: Record<Asset, number> = { BTC: 0, ETH: 0, SOL: 0, USDT: 0 }
  private applied = 0

  public apply(tx: Transaction): void {
    const asset = toAsset(tx.asset)

    if (tx.kind === "buy" || tx.kind === "deposit") {
      this.amounts[asset] = this.amounts[asset] + tx.amount
    } else if (tx.kind === "sell" || tx.kind === "withdraw") {
      if (this.amounts[asset] < tx.amount) {
        throw new Error("Not enough " + asset + " to " + tx.kind)
      }
      this.amounts[asset] = this.amounts[asset] - tx.amount
    } else {
      // a transfer moves the coins between my accounts, the total stays the same
      this.amounts[asset] = this.amounts[asset] - tx.fee
    }

    this.applied = this.applied + 1
  }

  public report(): string {
    let result = "After " + this.applied + " transactions:"
    for (let i = 0; i < ASSETS.length; i++) {
      result = result + "\n  " + ASSETS[i] + " " + this.amounts[ASSETS[i]]
    }
    return result
  }
}
