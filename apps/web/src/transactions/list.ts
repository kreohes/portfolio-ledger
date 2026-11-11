import describe, { type Transaction } from "ledger/transactions"
import { ASSETS } from "ledger/portfolio"
export function showTransactions(
  app: HTMLElement,
  transactions: Transaction[],
): () => void {
  const doc = document
  const title = doc.createElement("h2")
  title.textContent = "Transactions"
  const label = doc.createElement("label")
  label.textContent = "Asset "
  const filter = doc.createElement("select")
  for (const asset of ["", ...ASSETS]) {
    const option = doc.createElement("option")
    option.value = asset
    option.textContent = asset || "All assets"
    filter.append(option)
  }
  label.append(filter)
  const list = doc.createElement("ul")
  list.className = "transaction-list"
  const detail = doc.createElement("p")
  detail.className = "detail"
  detail.setAttribute("aria-live", "polite")

  function render(): void {
    const asset = filter.value
    list.replaceChildren()
    for (const [index, tx] of transactions.entries()) {
      if (asset && tx.asset !== asset) continue
      const item = doc.createElement("li")
      const button = doc.createElement("button")
      button.type = "button"
      button.dataset.index = String(index)
      button.textContent = `${tx.date} · ${tx.kind} · ${tx.amount} ${tx.asset}`
      item.append(button)
      list.append(item)
    }
    detail.textContent = "Select a transaction to see its details."
    if (list.childElementCount === 0) {
      detail.textContent = asset
        ? `No transactions for ${asset}.`
        : "No transactions yet."
    }
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
  filter.addEventListener("change", render)
  render()
  app.append(title, label, list, detail)
  return () => {
    list.removeEventListener("click", select)
    filter.removeEventListener("change", render)
  }
}
