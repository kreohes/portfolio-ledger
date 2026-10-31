import { readFile } from "node:fs/promises"

import { loadTransactions } from "../guard/index.ts"
import { type Transaction } from "../transactions/index.ts"

export async function loadLedger(file: string): Promise<Transaction[]> {
  let text: string

  try {
    text = await readFile(file, "utf8")
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      throw new Error("There is no ledger file at " + file, { cause: error })
    }

    throw error
  }

  // loadTransactions parses the text and checks every transaction
  return loadTransactions(text)
}
