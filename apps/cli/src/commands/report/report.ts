import { input } from "@inquirer/prompts"
import { Portfolio, loadLedger } from "ledger"

import { locateLedger } from "../../lib/files.ts"

export default async function report(file: string | undefined): Promise<void> {
  // no file on the command line, so we ask for it
  file ??= await input({
    message: "Which ledger file?",
    default: locateLedger(),
  })

  const transactions = await loadLedger(file)

  const portfolio = new Portfolio()
  for (let i = 0; i < transactions.length; i++) {
    portfolio.apply(transactions[i])
  }

  console.log(portfolio.report())
}
