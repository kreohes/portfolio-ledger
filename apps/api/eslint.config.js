import config from "@ledger/tooling/eslint"
export default [
  ...config,
  { rules: { "no-console": ["warn", { allow: ["info", "warn", "error"] }] } },
]
