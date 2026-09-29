import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/session"
import { formatTimestamp } from "@/lib/format"

export default async function AdminUsersPage() {
  await requireAdmin()
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { bookings: { where: { status: "PAID" } } } },
    },
  })

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Utilizadores</h1>
      <div className="overflow-x-auto rounded-lg border bg-background">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Papel</th>
              <th className="px-4 py-3 text-right">Reservas pagas</th>
              <th className="px-4 py-3">Registo</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3 font-medium">{u.name ?? "—"}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">{u.role}</td>
                <td className="px-4 py-3 text-right">{u._count.bookings}</td>
                <td className="px-4 py-3 text-muted-foreground">{formatTimestamp(u.createdAt, "pt")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
