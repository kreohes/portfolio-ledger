import { ASSETS, describe as describeTransaction, loadLedger } from "ledger"

import { locateLedger } from "../../lib/files.ts"

interface Options {
  file?: string
}

export default async function show(
  asset: string,
  options: Options,
): Promise<void> {
  let known = false
  for (let i = 0; i < ASSETS.length; i++) {
    if (ASSETS[i] === asset) {
      known = true
    }
  }
  if (!known) {
    throw new Error("Unknown asset " + asset + ", I know " + ASSETS.join(", "))
  }

  const transactions = await loadLedger(options.file ?? locateLedger())

  let found = 0
  for (let i = 0; i < transactions.length; i++) {
    if (transactions[i].asset === asset) {
      console.log(describeTransaction(transactions[i]))
      found = found + 1
    }
  }

  if (found === 0) {
    console.log("No transactions with " + asset)
  }
}
