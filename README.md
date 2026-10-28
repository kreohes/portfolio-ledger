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
npm install
npm start
npm run lint
```

## Files

- `src/holding.ts` - the Holding interface, my main piece of data
- `src/transactions.ts` - five kinds of transactions in one union and `describe`
- `src/portfolio.ts` - the Portfolio class, keeps the amounts of every asset private
- `src/guard.ts` - `isTransaction` and `loadTransactions`, checks JSON text before using it

Every file can be run alone with `node src/<file>.ts`, `npm start` just prints this list.

## Status

Module 1 done: data shape, kinds, class, guard. The real ledger file and the report
come next.
