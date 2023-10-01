await Bun.build({
  root: './src',
  entrypoints: [
    './src/getElevation.ts',
    './src/index.ts',
    './src/tileCover.ts',
    './src/util.ts'
  ],
  outdir: './dist',
  minify: true,
  sourcemap: 'external',
  splitting: false,
  target: 'browser'
})
