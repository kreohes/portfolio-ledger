import { program } from "commander"

import report from "./commands/report/index.ts"
import show from "./commands/show/index.ts"

program.name("ledger").description("Look at my portfolio from the terminal")

program
  .command("report")
  .description("Count how much of every asset I have")
  .argument("[file]", "optional local JSON file to send to the API")
  .option("-l, --ledger <id>", "ledger on the API", "demo")
  .action(report)

program
  .command("show")
  .description("List the transactions of one asset")
  .argument("<asset>", "the asset, for example BTC")
  .option("-f, --file <file>", "local JSON file to send to the API")
  .option("-l, --ledger <id>", "ledger on the API", "demo")
  .action(show)

try {
  await program.parseAsync()
} catch (error) {
  if (error instanceof Error && error.name === "ExitPromptError") {
    // Ctrl+C in a prompt, nothing to print
    process.exitCode = 130
  } else {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  }
}
