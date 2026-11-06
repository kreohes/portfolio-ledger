import { createLedger, getLedger, getPortfolio } from "ledger/services"
import { showHoldings } from "./holdings/index.ts"
import { showTransactions } from "./transactions/index.ts"
import "./style.css"

const app = document.querySelector<HTMLElement>("#app")
const form = document.querySelector<HTMLFormElement>("#load")
const field = document.querySelector<HTMLInputElement>("#ledger")
const copy = document.querySelector<HTMLButtonElement>("#copy")
if (!app || !form || !field || !copy) {
  throw new Error("The page is missing an element")
}

let removeListListener: (() => void) | undefined
let loading = false

const load = async (makeCopy: boolean): Promise<void> => {
  if (loading) return
  loading = true
  const buttons = form.querySelectorAll("button")
  for (const button of buttons) button.disabled = true
  if (removeListListener) removeListListener()
  app.textContent = "Loading..."

  try {
    let id = field.value.trim()
    if (makeCopy) {
      const demo = await getLedger("demo")
      const created = await createLedger(demo.transactions)
      id = created.id
      field.value = id
    }

    const ledger = await getLedger(id)
    const portfolio = await getPortfolio(id)
    app.replaceChildren()
    showHoldings(app, portfolio)
    removeListListener = showTransactions(app, ledger.transactions)
  } catch (error) {
    app.textContent =
      error instanceof Error ? error.message : "Could not load the ledger"
  } finally {
    loading = false
    for (const button of buttons) button.disabled = false
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault()
  void load(false)
})
copy.addEventListener("click", () => {
  void load(true)
})
window.addEventListener(
  "pagehide",
  () => {
    if (removeListListener) removeListListener()
  },
  { once: true },
)

void load(false)
