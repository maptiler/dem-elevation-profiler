# dem-elevation-profiler [![npm][npm-image]][npm-url] [![downloads][downloads-image]][downloads-url] [![bundlephobia][bundlephobia-image]][bundlephobia-url] [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

[npm-image]: https://img.shields.io/npm/v/dem-elevation-profiler.svg
[npm-url]: https://npmjs.org/package/dem-elevation-profiler
[bundlephobia-image]: https://img.shields.io/bundlephobia/minzip/dem-elevation-profiler.svg
[bundlephobia-url]: https://bundlephobia.com/package/dem-elevation-profiler
[downloads-image]: https://img.shields.io/npm/dm/dem-elevation-profiler.svg
[downloads-url]: https://www.npmjs.com/package/dem-elevation-profiler

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
