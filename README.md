# Portfolio Ledger

My personal project for FE403 (Advanced JavaScript and TypeScript, Harbour.Space).

## Idea

A small program to keep track of my crypto and stocks. I have coins on a few exchanges
and wallets and I never know how much I actually have and if I am in plus or minus. The
idea is to write all transactions in a file and the program counts everything.

## Data

A list of transactions. Every transaction has a date, an asset (BTC, ETH, AAPL...) and an
amount. Depending on the kind it has more fields:

- buy / sell - price, fee, account
- deposit / withdraw - account, fee
- transfer - from account, to account, fee

The transactions will be in a JSON file, later maybe CSV export from the exchange. The
program must check the data before using it, because a typo in the file should not give
NaN in the report.

## What it will do

- check every transaction
- count how much of every asset I have and the average price
- count the profit (realized and not realized)
- print a report in the terminal

Later: a small server and a page in the browser with the same report.

## How to run

```
pnpm install
pnpm start
pnpm lint
```

It is a pnpm workspace now, with three packages:

- `features/ledger` - the library: types, `describe`, `Portfolio`, `loadTransactions`
- `apps/cli` - the program that uses the library and prints things (`pnpm start`)
- `internal/tooling` - shared settings for TypeScript, ESLint and Prettier

`pnpm lint` runs lint in every package with Nx, tooling first because the others depend
on it. The workflow in `.github` runs the same lint on push.

## Files

In `features/ledger/src`, every folder is a modlet with its own `index.ts`:

- `holding.ts` - the Holding interface, my main piece of data
- `transactions/` - five kinds of transactions in one union (types.ts) and `describe` (describe.ts)
- `portfolio/` - the Portfolio class (portfolio.ts) and the list of assets (assets.ts)
- `guard/` - `isTransaction` and `loadTransactions`, checks JSON text before using it
- `ledger/` - `loadLedger(file)`, reads a JSON file with await and checks it with the guard
- `index.ts` - what the package exports, only through the indexes of the folders

The cli reads `apps/cli/data/ledger.json`, the path is built from the folder of the script.
A missing file, broken JSON and a wrong shape give three different messages and exit code 1.

## Status

Module 1: data shape, kinds, class, guard. Module 2: workspace with a library and a cli.
Module 3: modlets, the ledger comes from a JSON file. Commands for the terminal come next.
