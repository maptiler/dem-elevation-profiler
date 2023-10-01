export const earthRadius = 6371008.8

/** Convert meters to feet */
export function mToFt (m: number): number {
  return m * 3.28084
}

/** Convert degrees to Radians */
export function degToRad (degrees: number): number {
  return ((degrees % 360) * Math.PI) / 180
}

/** Convert radians to degrees */
export function radToDeg (radians: number): number {
  return (radians * 180) / Math.PI
}

/** Given a latitude and zoom level, determine the max distance each segment can be in meters */
export function getZoomLevelResolution (latitude: number, zoom: number): number {
  return (
    (Math.cos((latitude * Math.PI) / 180.0) * 2 * Math.PI * 6378137) /
    (512 * 2 ** zoom)
  )
}

/** Convert a tile's zoom-x-y to a number hash */
export function xyzToTileID (x: number, y: number, zoom: number): number {
  return ((1 << zoom) * y + x) * 32 + zoom
}

/** Get the distance of a LineString in meters */
export function lineDistance (
  line:
  | GeoJSON.Feature<GeoJSON.LineString>
  | GeoJSON.LineString
  | GeoJSON.Position[]
): number {
  // grab the coordinates
  const coordinates =
    'geometry' in line
      ? line.geometry.coordinates
      : 'coordinates' in line
        ? line.coordinates
        : line
  // iterate through the coordinates and calculate the distance
  let distance = 0
  let prevCoord: GeoJSON.Position | undefined
  for (const coordinate of coordinates) {
    if (prevCoord !== undefined) {
      distance += pointDistance(prevCoord, coordinate)
    }
    prevCoord = coordinate
  }

  return distance
}

/** Get the distance between two lon-lat pairs in meters */
export function pointDistance (
  from: GeoJSON.Position,
  to: GeoJSON.Position
): number {
  const { pow, sin, cos, sqrt, atan2 } = Math
  const dLat = degToRad(to[1] - from[1])
  const dLon = degToRad(to[0] - from[0])
  const lat1 = degToRad(from[1])
  const lat2 = degToRad(to[1])

  const a =
    pow(sin(dLat / 2), 2) + pow(sin(dLon / 2), 2) * cos(lat1) * cos(lat2)

  return 2 * atan2(sqrt(a), sqrt(1 - a)) * earthRadius
}

/**
 * Finds the area of a Polygon or MultiPolygon in square meters.
 */
export function area (
  area:
  | GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>
  | GeoJSON.Polygon
  | GeoJSON.MultiPolygon
): number {
  const geometry = 'geometry' in area ? area.geometry : area
  const type = geometry.type
  if (type === 'MultiPolygon') {
    return multiPolygonArea(geometry.coordinates)
  }
  return polygonArea(geometry.coordinates)
}

/**
 * Finds the area of a MultiPolygon in square meters.
 */
export function multiPolygonArea (
  multiPoly: GeoJSON.MultiPolygon | GeoJSON.Position[][][]
): number {
  const coords = 'coordinates' in multiPoly ? multiPoly.coordinates : multiPoly
  let total = 0
  for (const polygon of coords) {
    total += polygonArea(polygon)
  }
  return total
}

/**
 * Finds the area of a Polygon in square meters.
 */
export function polygonArea (
  poly: GeoJSON.Polygon | GeoJSON.Position[][]
): number {
  const coords = 'coordinates' in poly ? poly.coordinates : poly
  let total = 0
  for (const ring of coords) {
    total += ringArea(ring)
  }
  return total
}

/**
 * Calculate the approximate area of the polygon were it projected onto the earth.
 * Note that this area will be positive if ring is oriented clockwise, otherwise it will be negative.
 *
 * Reference:
 * Robert. G. Chamberlain and William H. Duquette, "Some Algorithms for Polygons on a Sphere",
 * JPL Publication 07-03, Jet Propulsion
 * Laboratory, Pasadena, CA, June 2007 https://trs.jpl.nasa.gov/handle/2014/40409
 */
function ringArea (coords: GeoJSON.Position[]): number {
  let p1
  let p2
  let p3
  let lowerIndex
  let middleIndex
  let upperIndex
  let i
  let total = 0
  const coordsLength = coords.length

  if (coordsLength > 2) {
    for (i = 0; i < coordsLength; i++) {
      if (i === coordsLength - 2) {
        // i = N-2
        lowerIndex = coordsLength - 2
        middleIndex = coordsLength - 1
        upperIndex = 0
      } else if (i === coordsLength - 1) {
        // i = N-1
        lowerIndex = coordsLength - 1
        middleIndex = 0
        upperIndex = 1
      } else {
        // i = 0 to N-3
        lowerIndex = i
        middleIndex = i + 1
        upperIndex = i + 2
      }
      p1 = coords[lowerIndex]
      p2 = coords[middleIndex]
      p3 = coords[upperIndex]
      total += (degToRad(p3[0]) - degToRad(p1[0])) * Math.sin(degToRad(p2[1]))
    }

    total = (total * earthRadius * earthRadius) / 2
  }
  return Math.abs(total)
}
