'use client'

import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { useCompareSync, type CompareSlot } from './CompareSyncContext'

interface SyncedCameraProps {
  slot: CompareSlot
}

type ControlsLike = {
  target: { x: number; y: number; z: number; set: (x: number, y: number, z: number) => void }
  update: () => void
  addEventListener: (e: 'change', fn: () => void) => void
  removeEventListener: (e: 'change', fn: () => void) => void
}

export default function SyncedCamera({ slot }: SyncedCameraProps) {
  const sync = useCompareSync()
  const camera = useThree((s) => s.camera)
  const controls = useThree((s) => s.controls) as ControlsLike | null

  const suppressUntilRef = useRef(0)
  const syncedRef = useRef(false)
  syncedRef.current = sync?.synced ?? false

  // When sync flips ON and we're slot A, publish current state so B snaps to it.
  useEffect(() => {
    if (!sync?.synced || slot !== 'A' || !controls) return
    sync.push({
      position: [camera.position.x, camera.position.y, camera.position.z],
      target: [controls.target.x, controls.target.y, controls.target.z],
      origin: 'A',
    })
    // Only fire on the sync transition; intentionally omit camera/controls deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sync?.synced, slot])

  // Apply incoming state from the other slot.
  useEffect(() => {
    if (!sync?.synced || !sync.cameraState || sync.cameraState.origin === slot || !controls) return
    suppressUntilRef.current = performance.now() + 100
    const [px, py, pz] = sync.cameraState.position
    const [tx, ty, tz] = sync.cameraState.target
    camera.position.set(px, py, pz)
    controls.target.set(tx, ty, tz)
    controls.update()
  }, [sync?.cameraState, sync?.synced, slot, controls, camera])

  // Publish our state on OrbitControls 'change' (when sync is on, ignoring programmatic echoes).
  useEffect(() => {
    if (!controls || !sync) return
    const handler = () => {
      if (performance.now() < suppressUntilRef.current) return
      if (!syncedRef.current) return
      sync.push({
        position: [camera.position.x, camera.position.y, camera.position.z],
        target: [controls.target.x, controls.target.y, controls.target.z],
        origin: slot,
      })
    }
    controls.addEventListener('change', handler)
    return () => controls.removeEventListener('change', handler)
  }, [controls, sync, slot, camera])

  return null
}
