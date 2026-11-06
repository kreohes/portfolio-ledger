import { buildServer } from "./app/index.ts"

const app = buildServer()
await app.listen({ port: 3001, host: "127.0.0.1" })
console.info("API on http://127.0.0.1:3001")
