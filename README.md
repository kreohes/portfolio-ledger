# Portfolio Ledger

My personal project for FE403. It reads transactions and counts how much of each
asset I have. The file has sample data, not real accounts. It knows BTC, ETH, SOL and USDT.

## Run

Node 24 or newer and pnpm 12.16.1 are needed.

```sh
pnpm install --frozen-lockfile
pnpm api
```

Keep the server running. In another terminal:

```sh
pnpm web
```

Open http://127.0.0.1:5174. The API is http://127.0.0.1:3001.
Use the Asset list to show transactions for one asset. Click a transaction for
its details. Create demo copy makes a new ledger on the API.

The terminal also uses the API:

```sh
pnpm --filter ledger-cli exec node . report
pnpm --filter ledger-cli exec node . show BTC --ledger demo
pnpm --filter ledger-cli exec node . report ../api/src/data/ledger.json
```

The last command sends a local JSON file to the server. This path is relative to
`apps/cli`. `show` also has `--file`, and `report` has `--ledger`.
Use `pnpm --filter @ledger/api dev` for automatic restart.

## Check

```sh
pnpm lint
pnpm test
pnpm build
```

The workflow runs these on GitHub.

## Folders

- `features/ledger`: transaction kinds, Portfolio class, guards, loading and services
- `apps/api`: ledger routes and the sample data
- `apps/cli`: report and show commands
- `apps/web`: balances, transaction list and click listener
- `internal/tooling`: shared lint and TypeScript settings

The folders are modlets with `index.ts`. Services use a generic request function.
Position uses Pick from Holding. The page uses createElement and textContent, with
one listener for the transaction list. The old listener is removed when the list changes.

## API and status

GET `/ledgers/:id` reads a ledger. POST `/ledgers` creates one from `{ transactions: [...] }`.
GET `/portfolio` and `/transactions/:asset` need the `x-ledger-id` header, for example `demo`.
Wrong data gives 400, a missing header gives 401, and an unknown item gives 404.

The program counts units, not prices or profit. Withdraw removes the amount and fee.
Transfer only changes the total by its fee. Buy and sell fees are quote-currency data.
Transactions are applied in the file order. New ledgers are in memory and disappear
on restart. Next I would save them to a file and add prices.
