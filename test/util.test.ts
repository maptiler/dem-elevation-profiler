import { describe, it, expect, test } from 'bun:test'
import {
  earthRadius,
  xyzToTileID,
  mToFt,
  degToRad,
  pointDistance,
  lineDistance,
  getZoomLevelResolution,
  polygonArea,
  multiPolygonArea,
  area
} from '../src/util'

test('earthRadius', () => {
  expect(earthRadius).toEqual(6371008.8)
})

describe('xyzToTileID', () => {
  it('managing tile x-y-z to ID', () => {
    expect(xyzToTileID(0, 0, 0)).toEqual(0)
    expect(xyzToTileID(0, 0, 1)).toEqual(1)
    expect(xyzToTileID(1, 0, 1)).toEqual(33)
    expect(xyzToTileID(1, 1, 1)).toEqual(97)
    expect(xyzToTileID(1048575, 1048575, 20)).toEqual(35184372088820)
  })

  it('xyzToTileID for all zooms 1-7', () => {
    const idCache = new Set<number>()
    for (let z = 1; z <= 7; z++) {
      for (let x = 0; x < 2 ** z; x++) {
        for (let y = 0; y < 2 ** z; y++) {
          const id = xyzToTileID(x, y, z)
          if (idCache.has(id)) throw new Error(`duplicate id ${id}`)
          idCache.add(id)
        }
      }
    }
  })
})

// test mToFt
describe('mToFt', () => {
  it('converts km to miles', () => {
    expect(mToFt(1)).toEqual(3.28084)
    expect(mToFt(10)).toEqual(32.8084)
    expect(mToFt(100)).toEqual(328.084)
    expect(mToFt(1000)).toEqual(3280.84)
  })
})

// test degToRad
describe('degToRad', () => {
  it('converts degrees to radians', () => {
    expect(degToRad(0)).toEqual(0)
    expect(degToRad(180)).toEqual(Math.PI)
    expect(degToRad(360)).toEqual(0)
    expect(degToRad(90)).toEqual(Math.PI / 2)
    expect(degToRad(270)).toEqual(3 * Math.PI / 2)
  })
})

// test distance
describe('pointDistance', () => {
  it('calculates distance between two points', () => {
    expect(pointDistance([0, 0], [0, 0])).toEqual(0)
    expect(pointDistance([0, 0], [0, 1])).toBeCloseTo(111195.0802335329)
    expect(pointDistance([0, 0], [1, 0])).toBeCloseTo(111195.0802335329)
    expect(pointDistance([0, 0], [1, 1])).toBeCloseTo(157249.5984740402)
    expect(pointDistance([0, 0], [0, 85])).toBeCloseTo(9451581.81985029)
    expect(pointDistance([0, 0], [85, 0])).toBeCloseTo(9451581.81985029)
    expect(pointDistance([0, 0], [80, 80])).toBeCloseTo(9815418.67483913)
  })
})

// test getZoomLevelResolution
describe('getZoomLevelResolution', () => {
  it('calculates resolution of a zoom level', () => {
    expect(getZoomLevelResolution(0, 0)).toBeCloseTo(78271.51696402048)
    expect(getZoomLevelResolution(0, 1)).toBeCloseTo(39135.75848201024)
    expect(getZoomLevelResolution(0, 2)).toBeCloseTo(19567.87924100512)
    expect(getZoomLevelResolution(0, 3)).toBeCloseTo(9783.93962050256)
    expect(getZoomLevelResolution(0, 4)).toBeCloseTo(4891.96981025128)
    expect(getZoomLevelResolution(0, 5)).toBeCloseTo(2445.98490512564)
    expect(getZoomLevelResolution(0, 6)).toBeCloseTo(1222.99245256282)
    expect(getZoomLevelResolution(0, 7)).toBeCloseTo(611.49622628141)
    expect(getZoomLevelResolution(0, 8)).toBeCloseTo(305.7481131407048)
    expect(getZoomLevelResolution(0, 9)).toBeCloseTo(152.8740565703525)
    expect(getZoomLevelResolution(0, 10)).toBeCloseTo(76.43702828517625)
    expect(getZoomLevelResolution(0, 11)).toBeCloseTo(38.21851414258813)
    expect(getZoomLevelResolution(0, 12)).toBeCloseTo(19.109257071294063)
    expect(getZoomLevelResolution(0, 13)).toBeCloseTo(9.554628535647032)
    expect(getZoomLevelResolution(0, 14)).toBeCloseTo(4.777314267823516)
    expect(getZoomLevelResolution(0, 15)).toBeCloseTo(2.388657133911758)
    expect(getZoomLevelResolution(0, 16)).toBeCloseTo(1.194328566955879)
    expect(getZoomLevelResolution(0, 17)).toBeCloseTo(0.5971642834779395)
    expect(getZoomLevelResolution(0, 18)).toBeCloseTo(0.29858214173896974)
    expect(getZoomLevelResolution(0, 19)).toBeCloseTo(0.14929107086948487)
  })

  it('calcuates resolution of the zoom level 15 at various latitudes', () => {
    expect(getZoomLevelResolution(0, 15)).toBeCloseTo(2.388657133911758)
    expect(getZoomLevelResolution(45, 15)).toBeCloseTo(1.6890356573186271)
    expect(getZoomLevelResolution(60, 15)).toBeCloseTo(1.194328566955879)
    expect(getZoomLevelResolution(75, 15)).toBeCloseTo(0.6182299584763652)
    expect(getZoomLevelResolution(85, 15)).toBeCloseTo(0.20818518667557157)
  })
})

describe('lineDistance', () => {
  it('calculates lineDistance between two points', () => {
    expect(
      lineDistance([
        [0, 0],
        [0, 0]
      ])
    ).toEqual(0)
    expect(
      lineDistance([
        [0, 0],
        [0, 1]
      ])
    ).toBeCloseTo(111195.0802335329)
    expect(
      lineDistance([
        [0, 0],
        [1, 0]
      ])
    ).toBeCloseTo(111195.0802335329)
    expect(
      lineDistance([
        [0, 0],
        [1, 1]
      ])
    ).toBeCloseTo(157249.5984740402)
    expect(
      lineDistance([
        [0, 0],
        [0, 85]
      ])
    ).toBeCloseTo(9451581.81985029)
    expect(
      lineDistance([
        [0, 0],
        [85, 0]
      ])
    ).toBeCloseTo(9451581.81985029)
    expect(
      lineDistance([
        [0, 0],
        [80, 80]
      ])
    ).toBeCloseTo(9815418.67483913)
  })

  it('calculates lineDistance between ten points', () => {
    expect(
      lineDistance([
        [0, 0],
        [10, 10],
        [20, 20],
        [30, 30],
        [40, 40],
        [50, 50],
        [60, 60],
        [70, 70],
        [80, 80],
        [90, 90]
      ])
    ).toBeCloseTo(12145778.91731941)
  })
})

describe('polygonArea', () => {
  it('calculates area of a large polygon', () => {
    const polygon = [
      [
        [1.404283598062392, 25.671203401104208],
        [1.4976545637456127, 23.867678415533746],
        [7.510639559396992, 22.690145037917404],
        [1.0258574133136733, 18.768380252608438],
        [14.157693326148063, 16.244283776311903],
        [12.827041515434559, 28.531285183216582],
        [10.004494946945528, 26.25510984318427],
        [3.151111353650606, 29.805262395793633],
        [1.404283598062392, 25.671203401104208]
      ]
    ]
    expect(polygonArea(polygon)).toBeCloseTo(1249125795191.9192)

    const polygonGeometry = {
      type: 'Polygon' as const,
      coordinates: polygon
    }
    expect(polygonArea(polygonGeometry)).toBeCloseTo(1249125795191.9192)
  })

  it('calculates area of a small polygon', () => {
    const polygon = [
      [
        [-73.98285854447201, 40.737949277809946],
        [-73.98234693946917, 40.73795818917185],
        [-73.98205291360522, 40.73845276788296],
        [-73.98307024309403, 40.738613171],
        [-73.98348775982026, 40.73816760583179],
        [-73.98285854447201, 40.737949277809946]
      ]
    ]
    expect(polygonArea(polygon)).toBeCloseTo(5917.869674028372)

    const polygonGeometry = {
      type: 'Polygon' as const,
      coordinates: polygon
    }
    expect(polygonArea(polygonGeometry)).toBeCloseTo(5917.869674028372)
  })
})

describe('multiPolygonArea', () => {
  it('calculates area of a large multiPolygon', () => {
    const multiPolygon = [
      [
        [
          [1.404283598062392, 25.671203401104208],
          [1.4976545637456127, 23.867678415533746],
          [7.510639559396992, 22.690145037917404],
          [1.0258574133136733, 18.768380252608438],
          [14.157693326148063, 16.244283776311903],
          [12.827041515434559, 28.531285183216582],
          [10.004494946945528, 26.25510984318427],
          [3.151111353650606, 29.805262395793633],
          [1.404283598062392, 25.671203401104208]
        ]
      ],
      [
        [
          [1.404283598062392, 25.671203401104208],
          [1.4976545637456127, 23.867678415533746],
          [7.510639559396992, 22.690145037917404],
          [1.0258574133136733, 18.768380252608438],
          [14.157693326148063, 16.244283776311903],
          [12.827041515434559, 28.531285183216582],
          [10.004494946945528, 26.25510984318427],
          [3.151111353650606, 29.805262395793633],
          [1.404283598062392, 25.671203401104208]
        ]
      ]
    ]
    expect(multiPolygonArea(multiPolygon)).toBeCloseTo(2498251590383.8384)

    const multiPolygonGeometry = {
      type: 'MultiPolygon' as const,
      coordinates: multiPolygon
    }
    expect(multiPolygonArea(multiPolygonGeometry)).toBeCloseTo(
      2498251590383.8384
    )
  })

  it('calculates area of a small multiPolygon', () => {
    const multiPolygon = [
      [
        [
          [-73.98285854447201, 40.737949277809946],
          [-73.98234693946917, 40.73795818917185],
          [-73.98205291360522, 40.73845276788296],
          [-73.98307024309403, 40.738613171],
          [-73.98348775982026, 40.73816760583179],
          [-73.98285854447201, 40.737949277809946]
        ]
      ],
      [
        [
          [-73.98285854447201, 40.737949277809946],
          [-73.98234693946917, 40.73795818917185],
          [-73.98205291360522, 40.73845276788296],
          [-73.98307024309403, 40.738613171],
          [-73.98348775982026, 40.73816760583179],
          [-73.98285854447201, 40.737949277809946]
        ]
      ]
    ]
    expect(multiPolygonArea(multiPolygon)).toBeCloseTo(11835.739348056744)
    const multiPolygonGeometry = {
      type: 'MultiPolygon' as const,
      coordinates: multiPolygon
    }
    expect(multiPolygonArea(multiPolygonGeometry)).toBeCloseTo(
      11835.739348056744
    )
  })
})

describe('area', () => {
  it('calculates area of a large polygon', () => {
    const polygon = [
      [
        [1.404283598062392, 25.671203401104208],
        [1.4976545637456127, 23.867678415533746],
        [7.510639559396992, 22.690145037917404],
        [1.0258574133136733, 18.768380252608438],
        [14.157693326148063, 16.244283776311903],
        [12.827041515434559, 28.531285183216582],
        [10.004494946945528, 26.25510984318427],
        [3.151111353650606, 29.805262395793633],
        [1.404283598062392, 25.671203401104208]
      ]
    ]
    const polygonGeometry = {
      type: 'Polygon' as const,
      coordinates: polygon
    }
    expect(area(polygonGeometry)).toBeCloseTo(1249125795191.9192)

    const polygonFeature = {
      type: 'Feature' as const,
      geometry: polygonGeometry,
      properties: {}
    }
    expect(area(polygonFeature)).toBeCloseTo(1249125795191.9192)
  })

  it('calculates area of a small polygon', () => {
    const polygon = [
      [
        [-73.98285854447201, 40.737949277809946],
        [-73.98234693946917, 40.73795818917185],
        [-73.98205291360522, 40.73845276788296],
        [-73.98307024309403, 40.738613171],
        [-73.98348775982026, 40.73816760583179],
        [-73.98285854447201, 40.737949277809946]
      ]
    ]
    const polygonGeometry = {
      type: 'Polygon' as const,
      coordinates: polygon
    }
    expect(area(polygonGeometry)).toBeCloseTo(5917.869674028372)

    const polygonFeature = {
      type: 'Feature' as const,
      geometry: polygonGeometry,
      properties: {}
    }
    expect(area(polygonFeature)).toBeCloseTo(5917.869674028372)
  })

  it('calculates area of a large multiPolygon', () => {
    const multiPolygon = [
      [
        [
          [1.404283598062392, 25.671203401104208],
          [1.4976545637456127, 23.867678415533746],
          [7.510639559396992, 22.690145037917404],
          [1.0258574133136733, 18.768380252608438],
          [14.157693326148063, 16.244283776311903],
          [12.827041515434559, 28.531285183216582],
          [10.004494946945528, 26.25510984318427],
          [3.151111353650606, 29.805262395793633],
          [1.404283598062392, 25.671203401104208]
        ]
      ],
      [
        [
          [1.404283598062392, 25.671203401104208],
          [1.4976545637456127, 23.867678415533746],
          [7.510639559396992, 22.690145037917404],
          [1.0258574133136733, 18.768380252608438],
          [14.157693326148063, 16.244283776311903],
          [12.827041515434559, 28.531285183216582],
          [10.004494946945528, 26.25510984318427],
          [3.151111353650606, 29.805262395793633],
          [1.404283598062392, 25.671203401104208]
        ]
      ]
    ]
    const multiPolygonGeometry = {
      type: 'MultiPolygon' as const,
      coordinates: multiPolygon
    }
    expect(area(multiPolygonGeometry)).toBeCloseTo(2498251590383.8384)
    const multiPolygonFeature = {
      type: 'Feature' as const,
      geometry: multiPolygonGeometry,
      properties: {}
    }
    expect(area(multiPolygonFeature)).toBeCloseTo(2498251590383.8384)
  })

  it('calculates area of a small multiPolygon', () => {
    const multiPolygon = [
      [
        [
          [-73.98285854447201, 40.737949277809946],
          [-73.98234693946917, 40.73795818917185],
          [-73.98205291360522, 40.73845276788296],
          [-73.98307024309403, 40.738613171],
          [-73.98348775982026, 40.73816760583179],
          [-73.98285854447201, 40.737949277809946]
        ]
      ],
      [
        [
          [-73.98285854447201, 40.737949277809946],
          [-73.98234693946917, 40.73795818917185],
          [-73.98205291360522, 40.73845276788296],
          [-73.98307024309403, 40.738613171],
          [-73.98348775982026, 40.73816760583179],
          [-73.98285854447201, 40.737949277809946]
        ]
      ]
    ]
    const multiPolygonGeometry = {
      type: 'MultiPolygon' as const,
      coordinates: multiPolygon
    }
    expect(area(multiPolygonGeometry)).toBeCloseTo(11835.739348056744)
    const multiPolygonFeature = {
      type: 'Feature' as const,
      geometry: multiPolygonGeometry,
      properties: {}
    }
    expect(area(multiPolygonFeature)).toBeCloseTo(11835.739348056744)
  })
})
