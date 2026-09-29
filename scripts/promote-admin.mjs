// Uso: npm run admin:promote -- utilizador@exemplo.com
import { PrismaClient } from "@prisma/client"

const email = process.argv[2]?.trim().toLowerCase()
if (!email) {
  console.error("Uso: npm run admin:promote -- <email>")
  process.exit(1)
}

const prisma = new PrismaClient()
try {
  const user = await prisma.user.update({ where: { email }, data: { role: "ADMIN" } })
  console.log(`${user.email} e agora ADMIN. Termine a sessao e volte a entrar para aplicar.`)
} catch {
  console.error(`Utilizador ${email} nao encontrado. Registe a conta primeiro.`)
  process.exitCode = 1
} finally {
  await prisma.$disconnect()
}
