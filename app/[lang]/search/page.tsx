import { Suspense } from "react"
import { SearchContent } from "@/components/search-content"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { getDictionary } from "@/lib/get-dictionary"
import type { Locale } from "@/i18n-config"
import { Loader2 } from "lucide-react"

export default async function SearchPage({ params }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(params.lang)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SiteHeader lang={params.lang} dictionary={dictionary} />
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }
      >
        <SearchContent dictionary={dictionary} />
      </Suspense>
      <SiteFooter />
    </div>
  )
}
