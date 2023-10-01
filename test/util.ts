import { pxToLL, tilePxBounds } from 'web-merc-projection'

export function getTileCenter (
  tile: [zoom: number, x: number, y: number],
  tileSize: number
): [number, number] {
  // get bounds
  const bbox = tilePxBounds(tile, tileSize)
  const llBoundsLower = pxToLL([bbox[0], bbox[1]], tile[0], tileSize)
  const llBoundsUpper = pxToLL([bbox[2], bbox[3]], tile[0], tileSize)
  // get center
  const center = [
    (llBoundsLower[0] + llBoundsUpper[0]) / 2,
    (llBoundsLower[1] + llBoundsUpper[1]) / 2
  ]

  return center as [number, number]
}
