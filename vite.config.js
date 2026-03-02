import { defineConfig } from "vite";

export default defineConfig({
  base: '/model-viewer/',
  assetsInclude: ['**/*.glb', '**/*.gltf'],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
