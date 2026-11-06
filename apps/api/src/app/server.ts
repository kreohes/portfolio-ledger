import cors from "@fastify/cors"
import Fastify, { type FastifyError } from "fastify"
import ledger from "../routes/ledger/index.ts"
export function buildServer() {
  const app = Fastify()
  app.register(cors, {
    origin: ["http://127.0.0.1:5174", "http://localhost:5174"],
  })
  app.register(ledger)
  app.setErrorHandler<FastifyError>((error, request, reply) => {
    const status = error.statusCode ?? 500
    if (status >= 500) request.log.error(error)
    return reply.code(status).send({
      error:
        status >= 500
          ? "The server could not complete the request"
          : error.message,
    })
  })
  app.setNotFoundHandler((_, reply) =>
    reply.code(404).send({ error: "This route does not exist" }),
  )
  return app
}
