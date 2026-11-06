import { type PortfolioResponse } from "ledger/api"
export function showHoldings(
  app: HTMLElement,
  portfolio: PortfolioResponse,
): void {
  const doc = document
  const title = doc.createElement("h2")
  title.textContent = "Balances"
  const caption = doc.createElement("p")
  caption.textContent = `${portfolio.transactions} transactions · ledger ${portfolio.ledger}`
  const balances = doc.createElement("dl")
  balances.className = "balances"
  for (const holding of portfolio.holdings) {
    const group = doc.createElement("div")
    const label = doc.createElement("dt")
    label.textContent = holding.asset
    const amount = doc.createElement("dd")
    amount.textContent = String(Number(holding.amount.toFixed(10)))
    group.append(label, amount)
    balances.append(group)
  }
  app.append(title, caption, balances)
}
