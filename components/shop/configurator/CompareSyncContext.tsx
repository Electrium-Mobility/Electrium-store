'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

export type CompareSlot = 'A' | 'B' | 'C'

export interface CameraState {
  position: [number, number, number]
  target: [number, number, number]
  origin: CompareSlot
  rev: number
}

interface CompareSyncValue {
  synced: boolean
  cameraState: CameraState | null
  toggle: () => void
  push: (state: { position: [number, number, number]; target: [number, number, number]; origin: CompareSlot }) => void
}

const CompareSyncContext = createContext<CompareSyncValue | null>(null)

export function CompareSyncProvider({ children }: { children: ReactNode }) {
  const [synced, setSynced] = useState(false)
  const [cameraState, setCameraState] = useState<CameraState | null>(null)

  const toggle = useCallback(() => setSynced((s) => !s), [])

  const push = useCallback(
    (state: { position: [number, number, number]; target: [number, number, number]; origin: CompareSlot }) => {
      setCameraState((prev) => ({ ...state, rev: (prev?.rev ?? 0) + 1 }))
    },
    [],
  )

  const value = useMemo<CompareSyncValue>(
    () => ({ synced, cameraState, toggle, push }),
    [synced, cameraState, toggle, push],
  )

  return <CompareSyncContext.Provider value={value}>{children}</CompareSyncContext.Provider>
}

export function useCompareSync(): CompareSyncValue | null {
  return useContext(CompareSyncContext)
}
