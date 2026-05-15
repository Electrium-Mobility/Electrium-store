import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getManyBikes, type Bike } from '@/utils/getBike'
import CompareContent from '@/components/shop/configurator/CompareContent'

interface ComparePageProps {
  searchParams: Promise<{ bikes?: string }>
}

const MIN_BIKES = 2
const MAX_BIKES = 3

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const { bikes: bikesParam } = await searchParams

  const ids = parseAndValidateIds(bikesParam)

  if (ids.length < MIN_BIKES) {
    return (
      <ComparePageShell>
        <EmptyState
          title="Pick 2 or 3 bikes to compare"
          body={
            bikesParam
              ? `The link \`?bikes=${bikesParam}\` didn't resolve to enough unique bikes. Select bikes from the shop and try again.`
              : 'Head to the shop, pick a couple of bikes from the compare section, and we\'ll line them up here.'
          }
        />
      </ComparePageShell>
    )
  }

  const bikes = await getManyBikes(ids)
  if (!bikes || bikes.length < MIN_BIKES) notFound()

  // Preserve the requested order (Supabase doesn't guarantee result order matches the IN list).
  const byId = new Map<string, Bike>(bikes.map((b) => [String(b.bike_id), b]))
  const orderedBikes = ids.map((id) => byId.get(id)).filter((b): b is Bike => Boolean(b))
  if (orderedBikes.length < MIN_BIKES) notFound()

  return (
    <ComparePageShell>
      <CompareContent bikes={orderedBikes} />
    </ComparePageShell>
  )
}

function parseAndValidateIds(raw: string | undefined): string[] {
  if (!raw) return []
  const parts = raw.split(',').map((s) => s.trim()).filter(Boolean)
  const numericOnly = parts.filter((p) => /^\d+$/.test(p))
  const unique = Array.from(new Set(numericOnly))
  return unique.slice(0, MAX_BIKES)
}

function ComparePageShell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-background">{children}</div>
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <h1 className="text-2xl font-bold text-text-primary mb-2">{title}</h1>
      <p className="text-text-muted">{body}</p>
      <Link
        href="/"
        className="inline-block mt-6 text-sm text-text-link hover:text-text-link-hover"
      >
        ← Back to shop
      </Link>
    </div>
  )
}
