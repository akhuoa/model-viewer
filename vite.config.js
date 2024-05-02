import { defineConfig } from "vite";

export default defineConfig({
  base: '/model-viewer/',
  assetsInclude: ['**/*.glb', '**/*.gltf'],
})
