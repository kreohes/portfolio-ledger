import { describe, loadLedger } from "ledger"
import { createLedger, getTransactions } from "ledger/services"
interface Options {
  file?: string
  ledger?: string
}
export default async function show(
  asset: string,
  options: Options,
): Promise<void> {
  let id = options.ledger ?? "demo"
  if (options.file) id = (await createLedger(await loadLedger(options.file))).id
  const result = await getTransactions(id, asset)
  if (result.transactions.length === 0)
    console.log("No transactions with " + asset)
  for (const tx of result.transactions) console.log(describe(tx))
}
