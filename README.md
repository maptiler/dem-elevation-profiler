# dem-elevation-profiler

## About

Convert a geojson LineString to a elevation profile.

## Install

```bash
# NPM
npm install dem-elevation-profiler
# PNPM
pnpm add dem-elevation-profiler
# Yarn
yarn add dem-elevation-profiler
# Bun
bun add dem-elevation-profiler
```

## Usage

```ts
import profile from 'dem-elevation-profiler'
// if nodejs or bun the tileRequest can be local using sharp
import sharp from 'sharp'

// create a geojson LineString
const path = {
  type: 'Feature' as const,
  properties: {},
  geometry: {
    type: 'LineString' as const,
    coordinates: GeoJSON.Position[] = [...]
  }
}
// OR create the LineString geometry directly
const path = {
  type: 'LineString' as const,
  coordinates: GeoJSON.Position[] = [...]
}

// build the options
const options = {
  metric: 'm' as 'm' | 'ft',
  zoom: 13,
  tileSize: 512,
  tileRequest: async (x: number, y: number, z: number) => {
  const buf = await sharp(`test/fixtures/${z}-${x}-${y}.webp`)
      .raw()
      .toBuffer({ resolveWithObject: true })
    return {
      channels: buf.info.channels,
      image: new Uint8ClampedArray(buf.data)
    }
  },
  elevationParser: (r: number, g: number, b: number, _a: number) => {
    return -10000 + ((r * 256 * 256 + g * 256 + b) * 0.1)
  }
}

// profile the geometry
await profile(path, options)
```
