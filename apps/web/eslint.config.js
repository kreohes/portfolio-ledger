import config from "@ledger/tooling/eslint"

export default [
  ...config,
  {
    languageOptions: {
      globals: {
        document: "readonly",
        window: "readonly",
        Element: "readonly",
      },
    },
  },
]
