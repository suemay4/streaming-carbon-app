import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    // Tells Vitest to use a browser-like environment for components if needed
    environment: 'jsdom',
    // Automatically makes test methods like describe, test, and expect globally available
    globals: true,
  },
})
