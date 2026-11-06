import { randomUUID } from "node:crypto"
import { fileURLToPath } from "node:url"
import { type FastifyPluginAsync } from "fastify"
import {
  ASSETS,
  type Transaction,
  Portfolio,
  loadLedger,
  loadTransactions,
} from "ledger"
import {
  type ErrorResponse,
  type LedgerResponse,
  type PortfolioResponse,
  type CreatedResponse,
  type TransactionsResponse,
} from "ledger/api"
interface Headers {
  "x-ledger-id"?: string
}
const ledger: FastifyPluginAsync = async (app) => {
  const demo = await loadLedger(
    fileURLToPath(new URL("../../data/ledger.json", import.meta.url)),
  )
  const ledgers = new Map<string, Transaction[]>([["demo", demo]])
  function portfolio(transactions: Transaction[]) {
    const result = new Portfolio()
    for (const tx of transactions) result.apply(tx)
    return result
  }
  portfolio(demo)
  app.get<{ Params: { id: string }; Reply: LedgerResponse | ErrorResponse }>(
    "/ledgers/:id",
    async (request, reply) => {
      const transactions = ledgers.get(request.params.id)
      if (!transactions)
        return reply.code(404).send({ error: "Ledger not found" })
      return { id: request.params.id, transactions }
    },
  )
  app.post<{
    Body: { transactions?: unknown } | undefined
    Reply: CreatedResponse | ErrorResponse
  }>("/ledgers", async (request, reply) => {
    const value = request.body?.transactions
    if (!Array.isArray(value))
      return reply
        .code(400)
        .send({ error: "The body needs a list of transactions" })
    let transactions: Transaction[]
    try {
      transactions = loadTransactions(JSON.stringify(value))
      portfolio(transactions)
    } catch (error) {
      return reply.code(400).send({
        error: error instanceof Error ? error.message : "Invalid ledger",
      })
    }
    const id = randomUUID()
    ledgers.set(id, transactions)
    return reply.code(201).send({ id })
  })
  app.get<{ Headers: Headers; Reply: PortfolioResponse | ErrorResponse }>(
    "/portfolio",
    async (request, reply) => {
      const id = request.headers["x-ledger-id"]
      const transactions = typeof id === "string" ? ledgers.get(id) : undefined
      if (!id || !transactions)
        return reply
          .code(401)
          .send({ error: "Supply a known x-ledger-id header" })
      const result = portfolio(transactions)
      const balances = result.snapshot()
      return {
        ledger: id,
        transactions: transactions.length,
        holdings: ASSETS.map((asset) => ({ asset, amount: balances[asset] })),
        report: result.report(),
      }
    },
  )
  app.get<{
    Headers: Headers
    Params: { asset: string }
    Reply: TransactionsResponse | ErrorResponse
  }>("/transactions/:asset", async (request, reply) => {
    const id = request.headers["x-ledger-id"]
    const transactions = typeof id === "string" ? ledgers.get(id) : undefined
    if (!transactions)
      return reply
        .code(401)
        .send({ error: "Supply a known x-ledger-id header" })
    const asset = ASSETS.find((asset) => asset === request.params.asset)
    if (!asset)
      return reply
        .code(404)
        .send({ error: "Unknown asset; choose " + ASSETS.join(", ") })
    return {
      asset,
      transactions: transactions.filter((tx) => tx.asset === asset),
    }
  })
}
export default ledger
