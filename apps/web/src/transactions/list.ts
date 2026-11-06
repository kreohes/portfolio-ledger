import describe, { type Transaction } from "ledger/transactions"
export function showTransactions(
  app: HTMLElement,
  transactions: Transaction[],
): () => void {
  const doc = document
  const title = doc.createElement("h2")
  title.textContent = "Transactions"
  const list = doc.createElement("ul")
  list.className = "transaction-list"
  const detail = doc.createElement("p")
  detail.className = "detail"
  detail.textContent = "Select a transaction to see its details."
  detail.setAttribute("aria-live", "polite")
  transactions.forEach((tx, index) => {
    const item = doc.createElement("li")
    const button = doc.createElement("button")
    button.type = "button"
    button.dataset.index = String(index)
    button.textContent = `${tx.date} · ${tx.kind} · ${tx.amount} ${tx.asset}`
    item.append(button)
    list.append(item)
  })
  if (transactions.length === 0) {
    const empty = doc.createElement("li")
    empty.textContent = "No transactions yet."
    list.append(empty)
  }
  function select(event: Event): void {
    if (!(event.target instanceof Element)) return
    const button = event.target.closest<HTMLButtonElement>("button[data-index]")
    if (!button || !list.contains(button)) return
    const index = Number(button.dataset.index)
    const tx = Number.isInteger(index) ? transactions[index] : undefined
    if (!tx) return
    detail.textContent = describe(tx) + (tx.note ? " · " + tx.note : "")
    for (const item of list.querySelectorAll("button"))
      item.setAttribute("aria-pressed", String(item === button))
  }
  // One listener handles the entire list. Its owner removes it before replacing it.
  list.addEventListener("click", select)
  app.append(title, list, detail)
  return () => list.removeEventListener("click", select)
}
