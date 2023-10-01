export const earthRadius = 6371008.8

/** Convert meters to feet */
export function mToFeet (m: number): number {
  return m * 3.28084
}

/** Convert degrees to Radians */
export function degToRad (degrees: number): number {
  return ((degrees % 360) * Math.PI) / 180
}

/** Get the distance between two lon-lat pairs in meters */
export function distance (
  from: [lon: number, lat: number],
  to: [lon: number, lat: number]
): number {
  const { pow, sin, cos, atan2, sqrt } = Math
  const dLat = degToRad(to[1] - from[1])
  const dLon = degToRad(to[0] - from[0])
  const lat1 = degToRad(from[1])
  const lat2 = degToRad(to[1])

  const a =
    pow(sin(dLat / 2), 2) +
    pow(sin(dLon / 2), 2) * cos(lat1) * cos(lat2)

  return 2 * atan2(sqrt(a), sqrt(1 - a)) * earthRadius
}

/** Given a latitude and zoom level, determine the max distance each segment can be */
export function getZoomLevelResolution (latitude: number, zoom: number): number {
  return (Math.cos(latitude * Math.PI / 180.0) * 2 * Math.PI * 6378137) / (512 * 2 ** zoom)
}

/** Convert a tile's zoom-x-y to a number hash */
export function xyzToTileID (x: number, y: number, zoom: number): number {
  return (((1 << zoom) * y + x) * 32) + zoom
}
