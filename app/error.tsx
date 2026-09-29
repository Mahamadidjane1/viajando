"use client"

import { useEffect } from "react"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-2xl font-bold">Algo correu mal</h1>
      <p className="text-muted-foreground">
        Ocorreu um erro inesperado. Tente novamente; se persistir, contacte o apoio ao cliente
        {error.digest ? ` indicando o código ${error.digest}` : ""}.
      </p>
      <button onClick={reset} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
        Tentar novamente
      </button>
    </main>
  )
}
