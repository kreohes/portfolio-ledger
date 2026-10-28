// Cycle 3: a class that keeps the amounts privately

import { sample, type Transaction } from "./transactions.ts"

type Asset = "BTC" | "ETH" | "SOL" | "USDT"

export class Portfolio {
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
    let result = "After " + this.applied + " transactions:\n"
    result = result + "  BTC " + this.amounts.BTC + "\n"
    result = result + "  ETH " + this.amounts.ETH + "\n"
    result = result + "  SOL " + this.amounts.SOL + "\n"
    result = result + "  USDT " + this.amounts.USDT
    return result
  }
}

function toAsset(name: string): Asset {
  if (name === "BTC" || name === "ETH" || name === "SOL" || name === "USDT") {
    return name
  }
  throw new Error("Unknown asset " + name)
}

const portfolio = new Portfolio()

for (let i = 0; i < sample.length; i++) {
  portfolio.apply(sample[i])
}

console.log(portfolio.report())

// portfolio.amounts.BTC = 100  -> error, amounts is private
