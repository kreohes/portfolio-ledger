import path from "node:path"

export function locateLedger(): string {
  return path.join(import.meta.dirname, "..", "..", "data", "ledger.json")
}
