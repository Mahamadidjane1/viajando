import { z } from "zod"

const isProduction = process.env.NODE_ENV === "production"

const optional = z
  .string()
  .optional()
  .transform((value) => (value ? value : undefined))

const schema = z.object({
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET deve ter pelo menos 32 caracteres (use `npx auth secret`)"),
  NEXT_PUBLIC_APP_URL: z.string().url(),

  STRIPE_SECRET_KEY: isProduction ? z.string().startsWith("sk_") : optional,
  STRIPE_WEBHOOK_SECRET: isProduction ? z.string().startsWith("whsec_") : optional,

  AUTH_GOOGLE_ID: optional,
  AUTH_GOOGLE_SECRET: optional,

  AMADEUS_API_KEY: optional,
  AMADEUS_API_SECRET: optional,

  KV_REST_API_URL: optional,
  KV_REST_API_TOKEN: optional,

  SMTP_URL: optional,
  EMAIL_FROM: optional,
})

export type Env = z.infer<typeof schema>

/**
 * Valida as variaveis de ambiente no arranque do servidor.
 * Em producao falha logo; em desenvolvimento apenas avisa.
 */
export function validateEnv(): Env | null {
  const parsed = schema.safeParse(process.env)
  if (parsed.success) return parsed.data

  const problems = parsed.error.issues.map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`).join("\n")

  if (isProduction) {
    throw new Error(`Configuracao invalida:\n${problems}`)
  }

  console.warn(`[env] Configuracao incompleta (ok em desenvolvimento):\n${problems}`)
  return null
}

export function getAppUrl(): string {
  return (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "")
}

/** Resultados de demonstracao so sao permitidos fora de producao ou com opt-in explicito. */
export function isDemoDataEnabled(): boolean {
  if (process.env.ENABLE_DEMO_DATA === "true") return true
  if (process.env.ENABLE_DEMO_DATA === "false") return false
  return !isProduction
}
