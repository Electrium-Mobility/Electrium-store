'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import type { Bike } from '@/utils/getBike'
import BikeViewerSkeleton from './BikeViewerSkeleton'
import { CompareSyncProvider, useCompareSync, type CompareSlot } from './CompareSyncContext'

const BikeViewer = dynamic(() => import('./BikeViewer'), {
  ssr: false,
  loading: () => <BikeViewerSkeleton />,
})

const SLOTS: readonly CompareSlot[] = ['A', 'B', 'C']

interface CompareContentProps {
  bikes: Bike[]
}

export default function CompareContent({ bikes }: CompareContentProps) {
  const count = bikes.length
  const gridClass =
    count === 3
      ? 'grid grid-cols-1 lg:grid-cols-3 gap-4'
      : 'grid grid-cols-1 lg:grid-cols-2 gap-4'

  return (
    <CompareSyncProvider>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <header className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-baseline gap-4">
            <h1 className="text-2xl font-bold text-text-primary">
              Compare bikes <span className="text-text-muted font-normal">· {count}</span>
            </h1>
            <Link
              href="/"
              className="text-sm text-text-link hover:text-text-link-hover transition-colors"
            >
              ← Back to shop
            </Link>
          </div>
          <SyncToggleButton />
        </header>

        <div className={gridClass}>
          {bikes.map((bike, i) => (
            <ComparePane key={bike.bike_id} bike={bike} slot={SLOTS[i]} />
          ))}
        </div>

        <SpecComparisonTable bikes={bikes} />
      </div>
    </CompareSyncProvider>
  )
}

function SyncToggleButton() {
  const sync = useCompareSync()
  if (!sync) return null
  const { synced, toggle } = sync
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={synced}
      className={[
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium border transition-colors',
        synced
          ? 'bg-btn-primary border-btn-primary text-btn-primary-text hover:bg-btn-primary-hover'
          : 'bg-surface border-border hover:border-border-hover text-text-secondary hover:text-text-primary',
      ].join(' ')}
    >
      <LinkIcon broken={!synced} />
      <span>Sync cameras: {synced ? 'on' : 'off'}</span>
    </button>
  )
}

function LinkIcon({ broken }: { broken: boolean }) {
  if (broken) {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M9 17H7a5 5 0 0 1 0-10h2" />
        <path d="M15 7h2a5 5 0 0 1 4.5 7" />
        <path d="M2 2l20 20" />
      </svg>
    )
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5" />
      <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5" />
    </svg>
  )
}

function ComparePane({ bike, slot }: { bike: Bike; slot: CompareSlot }) {
  const slotStyles: Record<CompareSlot, string> = {
    A: 'bg-status-success text-status-success-text',
    B: 'bg-status-warning text-status-warning-text',
    C: 'bg-status-info text-status-info-text',
  }

  return (
    <section className="bg-surface rounded-2xl border border-border overflow-hidden">
      <div className="aspect-square relative bg-surface-hover">
        <BikeViewer bike={bike} className="absolute inset-0" syncSlot={slot} />
        <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
          <span
            className={`inline-flex items-center justify-center w-5 h-5 rounded-sm text-[10px] font-bold leading-none ${slotStyles[slot]}`}
            aria-label={`Slot ${slot}`}
          >
            {slot}
          </span>
          <span className="text-sm font-semibold text-text-primary">{bike.name}</span>
        </div>
      </div>
      <div className="p-4 space-y-1">
        <div className="flex items-baseline justify-between">
          <div className="text-xs uppercase tracking-wider text-text-muted">Sell price</div>
          <div className="text-xl font-bold text-status-success tabular-nums">
            CA ${bike.sell_price?.toFixed(2) ?? '—'}
          </div>
        </div>
        <div className="text-xs text-text-muted">
          Rental: CA ${bike.rental_rate?.toFixed(2) ?? '—'}/hr · {bike.amount_stocked} in stock
        </div>
      </div>
    </section>
  )
}

function SpecComparisonTable({ bikes }: { bikes: Bike[] }) {
  const tableColsClass =
    bikes.length === 3
      ? 'grid-cols-[1fr_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]'
      : 'grid-cols-[1fr_minmax(0,1fr)_minmax(0,1fr)]'

  const rows: Array<{ label: string; values: string[] }> = [
    { label: 'Sell price', values: bikes.map((b) => `CA $${b.sell_price?.toFixed(2) ?? '—'}`) },
    { label: 'Rental rate', values: bikes.map((b) => `CA $${b.rental_rate?.toFixed(2) ?? '—'}/hr`) },
    { label: 'In stock', values: bikes.map((b) => String(b.amount_stocked)) },
    { label: 'Damage rate', values: bikes.map((b) => `CA $${b.damage_rate?.toFixed(2) ?? '—'}`) },
    { label: 'Available for rent', values: bikes.map((b) => (b.for_rent ? 'Yes' : 'No')) },
  ]

  return (
    <section className="bg-surface rounded-2xl border border-border p-6">
      <h2 className="text-base font-semibold text-text-primary mb-4">Side-by-side specs</h2>
      <div className={`grid ${tableColsClass} gap-x-4 text-sm`}>
        <div className="text-xs uppercase tracking-wider text-text-muted pb-2 border-b border-border">
          Feature
        </div>
        {bikes.map((b, i) => (
          <div
            key={b.bike_id}
            className="text-xs uppercase tracking-wider text-text-muted pb-2 border-b border-border truncate"
          >
            {SLOTS[i]} · {b.name}
          </div>
        ))}
        {rows.map((row) => (
          <ComparisonRow key={row.label} label={row.label} values={row.values} />
        ))}
      </div>
    </section>
  )
}

function ComparisonRow({ label, values }: { label: string; values: string[] }) {
  return (
    <>
      <div className="py-2 text-text-muted">{label}</div>
      {values.map((v, i) => (
        <div key={i} className="py-2 text-text-primary tabular-nums">
          {v}
        </div>
      ))}
    </>
  )
}
