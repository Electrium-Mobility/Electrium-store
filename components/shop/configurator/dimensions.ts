/**
 * Per-bike 3D viewer config for the BikeViewer.
 *
 * v1: hardcoded mapping by bike_id. The bikes table doesn't carry geometry
 * data yet — once we add a `dimensions` JSONB column to the `bikes` table
 * (or a sibling `bike_3d_configs` table), this lookup becomes a fallback for
 * bikes that don't have geometry rows.
 *
 * Two render paths:
 *  - If `modelUrl` is set, BikeViewer loads the .glb via useGLTF and uses
 *    the primitive (built from wheelRadius/wheelbase/frameHeight) as the
 *    Suspense fallback while it downloads.
 *  - If `modelUrl` is undefined, BikeViewer renders the primitive directly.
 *
 * `transform` is a normalization layer applied to the loaded glTF scene so
 * the file from the mech team's CAD export lands correctly in our scene:
 *  - scale: uniform multiplier. STEP exports are usually in mm → set 0.001
 *    to convert to metres. Tools that export in metres can leave this 1.
 *  - rotation: [x, y, z] in radians. CAD is usually Z-up; three.js is Y-up,
 *    so a [-Math.PI / 2, 0, 0] rotation is the typical fix-up.
 *  - position: [x, y, z] offset after scale + rotation. Use to centre the
 *    bike at world origin with wheels touching y = 0.
 *
 * All measurements are in metres. Defaults approximate a typical commuter
 * bike (wheelbase ~1m, 700c wheels).
 */

export interface BikeViewerTransform {
  /** Uniform scale multiplier applied to the loaded glTF scene. */
  scale?: number
  /** Rotation in radians, applied after scale. CAD Z-up → R3F Y-up usually wants [-Math.PI/2, 0, 0]. */
  rotation?: [number, number, number]
  /** Position offset applied after scale + rotation. Use to ground the bike at y=0 and centre it. */
  position?: [number, number, number]
}

export interface BikeDimensions {
  wheelRadiusM: number
  wheelbaseM: number
  /** Distance from rear-hub height to the top of the seat tube. */
  frameHeightM: number
  /** Brand accent for the saddle + handlebars; falls back to the page accent. */
  accentColor?: string
  /** Path to a glTF/glb file under /public. When set, BikeViewer renders the model with the primitive as Suspense fallback. */
  modelUrl?: string
  /** Normalization applied to the loaded glTF scene. Only used when modelUrl is set. */
  transform?: BikeViewerTransform
}

export const DEFAULT_BIKE_DIMENSIONS: BikeDimensions = {
  wheelRadiusM: 0.34,
  wheelbaseM: 1.05,
  frameHeightM: 0.62,
}

const PER_BIKE: Record<number, BikeDimensions> = {
  // bike_id 1 — "Electric Mountain Bike" (sample seed)
  1: { wheelRadiusM: 0.36, wheelbaseM: 1.15, frameHeightM: 0.66 },
  // bike_id 2 — "Electric City Bike"
  2: { wheelRadiusM: 0.34, wheelbaseM: 1.05, frameHeightM: 0.60 },
  // bike_id 3 — "Electric Road Bike"
  3: { wheelRadiusM: 0.34, wheelbaseM: 1.00, frameHeightM: 0.58 },
}

export function getBikeDimensions(bikeId: number): BikeDimensions {
  return PER_BIKE[bikeId] ?? DEFAULT_BIKE_DIMENSIONS
}
