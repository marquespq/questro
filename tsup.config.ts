import { defineConfig } from 'tsup';

export default defineConfig({
  // Entry points for tree-shaking
  entry: {
    index: 'src/index.ts',
    'points/index': 'src/points/index.ts',
    'badges/index': 'src/badges/index.ts',
  },

  // Output formats
  format: ['esm', 'cjs'],

  // Generate TypeScript declarations
  dts: true,

  // Code splitting for better tree-shaking
  splitting: true,

  // Source maps for debugging
  sourcemap: true,

  // Clean output directory before build
  clean: true,

  // Minify production builds
  minify: true,

  // External dependencies (not bundled)
  external: ['react', 'react-dom'],

  // Tree-shaking
  treeshake: true,

  // Target modern browsers
  target: 'es2020',

  // Bundle analysis
  metafile: true,
});
