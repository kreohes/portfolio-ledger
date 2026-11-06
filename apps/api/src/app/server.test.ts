import assert from "node:assert/strict"
import test from "node:test"
import { type Transaction, isTransaction, Portfolio } from "ledger"
import {
  type CreatedResponse,
  type LedgerResponse,
  type PortfolioResponse,
} from "ledger/api"
import { buildServer } from "./index.ts"

test("ledger routes implement params, headers, and the expected balances", async (t) => {
  const app = buildServer()
  t.after(() => app.close())
  assert.equal((await app.inject("/ledgers/missing")).statusCode, 404)
  assert.equal((await app.inject("/portfolio")).statusCode, 401)
  assert.equal(
    (
      await app.inject({
        url: "/portfolio",
        headers: { "x-ledger-id": "missing" },
      })
    ).statusCode,
    401,
  )
  const response = await app.inject({
    url: "/portfolio",
    headers: { "x-ledger-id": "demo" },
  })
  assert.equal(response.statusCode, 200)
  const result = response.json<PortfolioResponse>()
  assert.equal(result.transactions, 6)
  const amounts = Object.fromEntries(
    result.holdings.map((item) => [item.asset, item.amount]),
  )
  assert.equal(amounts.USDT, 449)
  assert.ok(Math.abs(amounts.BTC - 0.00398) < 1e-12)
  assert.ok(Math.abs(amounts.ETH - 0.03) < 1e-12)
  assert.equal(
    (
      await app.inject({
        url: "/transactions/nope",
        headers: { "x-ledger-id": "demo" },
      })
    ).statusCode,
    404,
  )
  assert.equal((await app.inject("/transactions/BTC")).statusCode, 401)
})

test("POST validates complete ledgers before storing and assigns an independent id", async (t) => {
  const app = buildServer()
  t.after(() => app.close())
  const demo = (await app.inject("/ledgers/demo")).json<LedgerResponse>()
  const response = await app.inject({
    method: "POST",
    url: "/ledgers",
    payload: { transactions: demo.transactions },
  })
  assert.equal(response.statusCode, 201)
  const id = response.json<CreatedResponse>().id
  assert.notEqual(id, "demo")
  assert.deepEqual(
    (await app.inject(`/ledgers/${id}`)).json<LedgerResponse>().transactions,
    demo.transactions,
  )
  const valid = demo.transactions[0]
  for (const payload of [
    {},
    { transactions: {} },
    { transactions: [{ ...valid, amount: -1 }] },
    { transactions: [{ ...valid, asset: "FAKE" }] },
    { transactions: [{ ...valid, date: "2026-02-30" }] },
    { transactions: [{ ...valid, amount: "1" }] },
    { transactions: [null] },
  ]) {
    assert.equal(
      (await app.inject({ method: "POST", url: "/ledgers", payload }))
        .statusCode,
      400,
    )
  }
  assert.equal(
    (
      await app.inject({
        method: "POST",
        url: "/ledgers",
        payload: {
          transactions: [
            {
              kind: "withdraw",
              date: "2026-10-01",
              asset: "BTC",
              amount: 1,
              fee: 0,
              account: "demo",
            },
          ],
        },
      })
    ).statusCode,
    400,
  )
})

test("numeric guards reject non-finite values and portfolio snapshots are copies", () => {
  const deposit: Transaction = {
    kind: "deposit",
    date: "2026-10-01",
    asset: "BTC",
    amount: 2,
    account: "demo",
  }
  assert.equal(isTransaction({ ...deposit, amount: Infinity }), false)
  assert.equal(isTransaction({ ...deposit, amount: NaN }), false)
  const portfolio = new Portfolio()
  portfolio.apply(deposit)
  const snapshot = portfolio.snapshot()
  snapshot.BTC = 999
  assert.equal(portfolio.snapshot().BTC, 2)
  assert.throws(
    () =>
      portfolio.apply({
        kind: "transfer",
        date: "2026-10-02",
        asset: "BTC",
        amount: 3,
        from: "a",
        to: "b",
        fee: 0,
      }),
    /Not enough/,
  )
})
