const tiles = [
  {
    id: 806666669,
    x: 1549,
    y: 3077,
    z: 13
  },
  {
    id: 3227091822,
    x: 3099,
    y: 6155,
    z: 14
  },
  {
    id: 3226567534,
    x: 3099,
    y: 6154,
    z: 14
  },
  {
    id: 3227091822,
    x: 3099,
    y: 6155,
    z: 14
  },
  {
    id: 3226567534,
    x: 3099,
    y: 6154,
    z: 14
  },
  {
    id: 3226043310,
    x: 3101,
    y: 6153,
    z: 14
  },
  {
    id: 3226043342,
    x: 3102,
    y: 6153,
    z: 14
  },
  {
    id: 3225519086,
    x: 3103,
    y: 6152,
    z: 14
  }
]

async function getTile (zoom: number, x: number, y: number): Promise<void> {
  const url = `https://api.maptiler.com/tiles/terrain-rgb-v2/${zoom}/${x}/${y}.webp?key=VmLHQ2lY5Ctaau3AV6tn`
  await fetch(url)
    .then(async (res) => {
      if (res.status !== 200) throw new Error(`Failed to fetch tile: ${res.status}, ${await res.text()}`)
      else return await res.arrayBuffer()
    })
    .then(async (buffer) => {
      await Bun.write(`test/fixtures/${zoom}-${x}-${y}.webp`, buffer)
    })
    .catch((err) => {
      console.error(err)
    })
}

for (const { x, y, z } of tiles) {
  console.log(`Fetching tile ${z}-${x}-${y}`)
  await getTile(z, x, y)
}
// await getTile(13, 1548, 3076)
