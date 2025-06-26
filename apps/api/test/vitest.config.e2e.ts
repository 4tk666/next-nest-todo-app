import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  // @ts-ignore - SWCプラグインの型エラーを回避
  plugins: [swc.vite()],
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.e2e-spec.ts'],
    setupFiles: ['reflect-metadata'],
    testTimeout: 30000,
  },
  resolve: {
    alias: {
      '@': '../src',
    },
  },
})
