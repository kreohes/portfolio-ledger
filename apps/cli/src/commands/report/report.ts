import { loadLedger } from "ledger"
import { createLedger, getPortfolio } from "ledger/services"
interface Options {
  ledger?: string
}
export default async function report(
  file: string | undefined,
  options: Options,
): Promise<void> {
  let id = options.ledger ?? "demo"
  if (file) id = (await createLedger(await loadLedger(file))).id
  console.log((await getPortfolio(id)).report)
}
