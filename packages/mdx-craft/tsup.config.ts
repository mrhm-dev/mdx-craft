import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/styles.css'],
  format: ['cjs', 'esm'],
  dts: {
    resolve: true,
  },
  sourcemap: true,
  clean: true,
  splitting: false,
  external: ['react', 'react-dom'],
  loader: {
    '.css': 'copy',
  },
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
    console.log('   • dist/styles.css')
  },
})
