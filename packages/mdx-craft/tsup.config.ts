import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: {
    resolve: true,
    entry: ['src/index.ts'],
  },
  sourcemap: true,
  clean: true,
  splitting: false,
  external: ['react', 'react-dom'],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client"',
    }
  },
  onSuccess: async () => {
    console.log('✅ Build completed successfully')
    console.log('📁 Generated files:')
    console.log('   • dist/index.js (ESM)')
    console.log('   • dist/index.cjs (CommonJS)')
    console.log('   • dist/index.d.ts (TypeScript definitions)')
    console.log('   • dist/index.d.cts (CommonJS TypeScript definitions)')
  },
})
