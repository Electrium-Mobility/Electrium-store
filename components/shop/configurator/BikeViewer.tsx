'use client'

import { Component, ReactNode, Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { Vector3, Quaternion, Group } from 'three'
import type { Bike } from '@/utils/getBike'
import { getBikeDimensions, type BikeDimensions, type BikeViewerTransform } from './dimensions'
import SyncedCamera from './SyncedCamera'
import type { CompareSlot } from './CompareSyncContext'

const FRAME_COLOR = '#3f3f46'
const WHEEL_COLOR = '#18181b'
const DEFAULT_ACCENT = '#16a34a'
const TUBE_RADIUS = 0.022

interface BikeViewerProps {
  bike: Bike
  accentColor?: string
  className?: string
  /** When provided, this viewer participates in a CompareSyncProvider's camera sync. */
  syncSlot?: CompareSlot
}

export default function BikeViewer({ bike, accentColor, className, syncSlot }: BikeViewerProps) {
  const dims = getBikeDimensions(bike.bike_id)
  const accent = accentColor ?? dims.accentColor ?? DEFAULT_ACCENT

  return (
    <div className={className ?? 'w-full h-full min-h-[360px]'}>
      <BikeViewerErrorBoundary fallback={<StaticBikeFallback bike={bike} />}>
        <Canvas
          shadows
          camera={{ position: [2.4, 1.6, 3.2], fov: 40 }}
          gl={{ alpha: true, antialias: true }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[4, 6, 4]}
            intensity={0.9}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight position={[-3, 2, -3]} intensity={0.2} color={accent} />

          {/*
           * Two render paths:
           *  - modelUrl set → GltfBike suspends on download; PrimitiveBike is the Suspense fallback.
           *  - no modelUrl → render PrimitiveBike directly (no suspension).
           * The primitive is always available, so users never see a spinner inside the canvas.
           */}
          <Suspense fallback={<PrimitiveBike dimensions={dims} accentColor={accent} />}>
            {dims.modelUrl ? (
              <GltfBike url={dims.modelUrl} transform={dims.transform} />
            ) : (
              <PrimitiveBike dimensions={dims} accentColor={accent} />
            )}
          </Suspense>

          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
            <planeGeometry args={[8, 8]} />
            <shadowMaterial opacity={0.25} />
          </mesh>

          <OrbitControls
            makeDefault
            enableDamping
            minDistance={1.5}
            maxDistance={8}
            maxPolarAngle={Math.PI / 2 - 0.05}
            target={[0, 0.55, 0]}
          />

          {syncSlot && <SyncedCamera slot={syncSlot} />}
        </Canvas>
      </BikeViewerErrorBoundary>
    </div>
  )
}

/**
 * Loads a glTF/glb from a /public URL and renders it. Applies the per-bike
 * transform (scale/rotation/position) so CAD exports in mm + Z-up land
 * correctly in the metre + Y-up scene.
 *
 * useGLTF caches by URL, but the parsed scene is shared — if we mounted this
 * twice on /compare we'd be mutating the same Group. So we clone per instance.
 */
function GltfBike({ url, transform }: { url: string; transform?: BikeViewerTransform }) {
  const { scene } = useGLTF(url)
  const cloned = useMemo(() => scene.clone(true), [scene])

  const scale = transform?.scale ?? 1
  const rotation = transform?.rotation ?? [0, 0, 0]
  const position = transform?.position ?? [0, 0, 0]

  useMemo(() => {
    cloned.traverse((obj) => {
      if ('castShadow' in obj) (obj as any).castShadow = true
      if ('receiveShadow' in obj) (obj as any).receiveShadow = true
    })
  }, [cloned])

  return (
    <group scale={scale} rotation={rotation} position={position}>
      <primitive object={cloned} />
    </group>
  )
}

export function PrimitiveBike({
  dimensions,
  accentColor,
}: {
  dimensions: BikeDimensions
  accentColor: string
}) {
  const { wheelRadiusM: r, wheelbaseM: wb, frameHeightM: fh } = dimensions

  const points = useMemo(() => {
    const frontHub: [number, number, number] = [+wb / 2, r, 0]
    const rearHub: [number, number, number] = [-wb / 2, r, 0]
    const bottomBracket: [number, number, number] = [-0.05, r, 0]
    const headTubeTop: [number, number, number] = [+wb / 2 - 0.18, r + fh * 0.75, 0]
    const seatTubeTop: [number, number, number] = [-0.20, r + fh, 0]
    const saddle: [number, number, number] = [-0.28, r + fh + 0.08, 0]
    const handlebars: [number, number, number] = [headTubeTop[0] + 0.04, headTubeTop[1] + 0.10, 0]
    return { frontHub, rearHub, bottomBracket, headTubeTop, seatTubeTop, saddle, handlebars }
  }, [r, wb, fh])

  return (
    <group>
      <Wheel position={points.frontHub} radius={r} />
      <Wheel position={points.rearHub} radius={r} />

      <Tube from={points.headTubeTop} to={points.bottomBracket} />
      <Tube from={points.bottomBracket} to={points.seatTubeTop} />
      <Tube from={points.seatTubeTop} to={points.headTubeTop} />
      <Tube from={points.bottomBracket} to={points.rearHub} />
      <Tube from={points.seatTubeTop} to={points.rearHub} />
      <Tube from={points.headTubeTop} to={points.frontHub} />
      <Tube from={points.headTubeTop} to={points.handlebars} radius={TUBE_RADIUS * 0.9} />
      <Tube from={points.seatTubeTop} to={points.saddle} radius={TUBE_RADIUS * 0.9} />

      <mesh position={points.saddle} castShadow>
        <boxGeometry args={[0.20, 0.035, 0.08]} />
        <meshStandardMaterial color={accentColor} metalness={0} roughness={1} />
      </mesh>

      <mesh position={points.handlebars} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.38, 12]} />
        <meshStandardMaterial color={accentColor} metalness={0} roughness={1} />
      </mesh>
    </group>
  )
}

function Wheel({
  position,
  radius,
}: {
  position: [number, number, number]
  radius: number
}) {
  return (
    <mesh position={position} rotation={[Math.PI / 2, 0, 0]} castShadow>
      <cylinderGeometry args={[radius, radius, 0.05, 28]} />
      <meshStandardMaterial color={WHEEL_COLOR} metalness={0} roughness={1} />
    </mesh>
  )
}

function Tube({
  from,
  to,
  radius = TUBE_RADIUS,
  color = FRAME_COLOR,
}: {
  from: [number, number, number]
  to: [number, number, number]
  radius?: number
  color?: string
}) {
  const { position, quaternion, length } = useMemo(() => {
    const start = new Vector3(...from)
    const end = new Vector3(...to)
    const dir = end.clone().sub(start)
    const len = dir.length()
    const mid = start.clone().add(end).multiplyScalar(0.5)
    const q = new Quaternion().setFromUnitVectors(
      new Vector3(0, 1, 0),
      dir.normalize(),
    )
    return { position: mid.toArray() as [number, number, number], quaternion: q, length: len }
  }, [from, to])

  return (
    <mesh position={position} quaternion={quaternion} castShadow>
      <cylinderGeometry args={[radius, radius, length, 12]} />
      <meshStandardMaterial color={color} metalness={0} roughness={1} />
    </mesh>
  )
}

/**
 * Catches render errors from the <Canvas> subtree — most importantly WebGL
 * context creation failure (no GPU, sandboxed iframe, driver crash). Error
 * Boundaries must be class components; React has no hooks equivalent.
 */
class BikeViewerErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.warn('BikeViewer falling back to static image:', error.message)
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}

function StaticBikeFallback({ bike }: { bike: Bike }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[hsl(var(--background))]">
      {bike.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={String(bike.image)}
          alt={bike.name}
          className="max-w-full max-h-full object-contain"
        />
      ) : (
        <div className="text-text-muted text-sm">3D preview unavailable</div>
      )}
    </div>
  )
}
