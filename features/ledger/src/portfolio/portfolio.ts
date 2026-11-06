import { type Transaction } from "../transactions/index.ts"
import { type Asset, ASSETS, toAsset } from "./assets.ts"
export default class Portfolio {
  private amounts: Record<Asset, number> = { BTC: 0, ETH: 0, SOL: 0, USDT: 0 }
  private applied = 0
  public apply(tx: Transaction): void {
    const asset = toAsset(tx.asset)
    const balance = this.amounts[asset]
    let next: number
    if (tx.kind === "buy" || tx.kind === "deposit") next = balance + tx.amount
    else if (tx.kind === "sell") next = balance - tx.amount
    else if (tx.kind === "withdraw") next = balance - tx.amount - tx.fee
    else {
      if (balance + 1e-12 < tx.amount || tx.fee > tx.amount)
        throw new Error("Not enough " + asset + " to transfer with its fee")
      next = balance - tx.fee
    }
    if (!Number.isFinite(next) || next < -1e-12)
      throw new Error("Not enough " + asset + " to " + tx.kind)
    this.amounts[asset] = Math.max(0, next)
    this.applied++
  }
  public snapshot(): Record<Asset, number> {
    return { ...this.amounts }
  }
  public report(): string {
    return (
      "After " +
      this.applied +
      " transactions:" +
      ASSETS.map((asset) => "\n  " + asset + " " + this.amounts[asset]).join("")
    )
  }
}
