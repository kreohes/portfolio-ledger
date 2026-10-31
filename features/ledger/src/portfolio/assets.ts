export type Asset = "BTC" | "ETH" | "SOL" | "USDT"

export const ASSETS: Asset[] = ["BTC", "ETH", "SOL", "USDT"]

export function toAsset(name: string): Asset {
  if (name === "BTC" || name === "ETH" || name === "SOL" || name === "USDT") {
    return name
  }
  throw new Error("Unknown asset " + name)
}
