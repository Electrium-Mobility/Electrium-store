'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import type { Bike } from '@/utils/getBike'

interface CompareWithPickerProps {
  currentBike: Bike
}

export default function CompareWithPicker({ currentBike }: CompareWithPickerProps) {
  const router = useRouter()
  const [bikes, setBikes] = useState<Bike[]>([])
  const [selected, setSelected] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const supabase = createClient()
    supabase
      .from('bikes')
      .select('*')
      .then(({ data, error }) => {
        if (!mounted) return
        setLoading(false)
        if (error || !data) return
        setBikes((data as Bike[]).filter((b) => b.bike_id !== currentBike.bike_id))
      })
    return () => {
      mounted = false
    }
  }, [currentBike.bike_id])

  if (loading || bikes.length === 0) return null

  const handleCompare = () => {
    if (!selected) return
    router.push(`/compare?bikes=${currentBike.bike_id},${selected}`)
  }

  return (
    <div className="border-t border-border pt-6 space-y-3">
      <div>
        <h3 className="font-semibold text-text-primary">Compare in 3D</h3>
        <p className="text-sm text-text-muted">
          See {currentBike.name} side-by-side with another bike, with synced cameras.
        </p>
      </div>
      <div className="flex gap-2">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          aria-label="Bike to compare with"
          className="flex-1 px-3 py-2 rounded-md border border-border bg-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-border-focus"
        >
          <option value="">Pick a bike…</option>
          {bikes.map((b) => (
            <option key={b.bike_id} value={b.bike_id}>
              {b.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled={!selected}
          onClick={handleCompare}
          className="px-4 py-2 rounded-md bg-btn-primary text-btn-primary-text text-sm font-medium hover:bg-btn-primary-hover disabled:bg-btn-disabled disabled:text-btn-disabled-text disabled:cursor-not-allowed transition-colors whitespace-nowrap"
        >
          Compare →
        </button>
      </div>
    </div>
  )
}
