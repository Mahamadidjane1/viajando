import Link from "next/link"

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-sm font-semibold text-primary">404</p>
      <h1 className="text-3xl font-bold">Página não encontrada</h1>
      <p className="text-muted-foreground">A página que procura não existe ou foi movida.</p>
      <Link href="/" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
        Voltar ao início
      </Link>
    </main>
  )
}
