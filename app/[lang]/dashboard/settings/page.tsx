import { prisma } from "@/lib/db"
import { requireUser } from "@/lib/session"
import { AccountSettings } from "@/components/account-settings"

export default async function SettingsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const sessionUser = await requireUser(lang)
  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: { name: true, email: true, password: true },
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Definições</h1>
      <AccountSettings name={user?.name ?? ""} email={user?.email ?? ""} hasPassword={Boolean(user?.password)} />
    </div>
  )
}
