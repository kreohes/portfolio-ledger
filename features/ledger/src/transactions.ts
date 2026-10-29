// Cycle 2: transactions come in several kinds

interface BaseTransaction {
  date: string
  asset: string
  amount: number
  note?: string
}

export interface Buy extends BaseTransaction {
  kind: "buy"
  price: number
  fee: number
  account: string
}

export interface Sell extends BaseTransaction {
  kind: "sell"
  price: number
  fee: number
  account: string
}

export interface Deposit extends BaseTransaction {
  kind: "deposit"
  account: string
}

export interface Withdraw extends BaseTransaction {
  kind: "withdraw"
  account: string
  fee: number
}

export interface Transfer extends BaseTransaction {
  kind: "transfer"
  from: string
  to: string
  fee: number
}

export type Transaction = Buy | Sell | Deposit | Withdraw | Transfer

export function describe(tx: Transaction): string {
  if (tx.kind === "buy") {
    return (
      tx.date +
      " bought " +
      tx.amount +
      " " +
      tx.asset +
      " at " +
      tx.price +
      " on " +
      tx.account +
      " (fee " +
      tx.fee +
      ")"
    )
  } else if (tx.kind === "sell") {
    return (
      tx.date +
      " sold " +
      tx.amount +
      " " +
      tx.asset +
      " at " +
      tx.price +
      " on " +
      tx.account +
      " (fee " +
      tx.fee +
      ")"
    )
  } else if (tx.kind === "deposit") {
    return (
      tx.date + " deposit " + tx.amount + " " + tx.asset + " to " + tx.account
    )
  } else if (tx.kind === "withdraw") {
    return (
      tx.date +
      " withdraw " +
      tx.amount +
      " " +
      tx.asset +
      " from " +
      tx.account +
      " (fee " +
      tx.fee +
      ")"
    )
  } else if (tx.kind === "transfer") {
    return (
      tx.date +
      " transfer " +
      tx.amount +
      " " +
      tx.asset +
      " from " +
      tx.from +
      " to " +
      tx.to +
      " (fee " +
      tx.fee +
      ")"
    )
  } else {
    throw new Error("Unknown kind of transaction")
  }
}

export const sample: Transaction[] = [
  {
    kind: "deposit",
    date: "2026-10-01",
    asset: "USDT",
    amount: 500,
    account: "binance",
  },
  {
    kind: "buy",
    date: "2026-10-02",
    asset: "BTC",
    amount: 0.004,
    price: 95000,
    fee: 0.4,
    account: "binance",
  },
  {
    kind: "buy",
    date: "2026-10-05",
    asset: "ETH",
    amount: 0.05,
    price: 3200,
    fee: 0.2,
    account: "binance",
  },
  {
    kind: "transfer",
    date: "2026-10-10",
    asset: "BTC",
    amount: 0.004,
    from: "binance",
    to: "ledger-wallet",
    fee: 0.00002,
  },
  {
    kind: "sell",
    date: "2026-10-20",
    asset: "ETH",
    amount: 0.02,
    price: 3400,
    fee: 0.1,
    account: "binance",
  },
  {
    kind: "withdraw",
    date: "2026-10-25",
    asset: "USDT",
    amount: 50,
    account: "binance",
    fee: 1,
  },
]
