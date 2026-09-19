import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { localApi } from './server/localApi.js'

function localApiPlugin() {
  const attachApi = (server) => {
    server.middlewares.use('/api', localApi)
  }

  return {
    name: 'local-api',
    configureServer: attachApi,
    configurePreviewServer: attachApi,
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), localApiPlugin()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{js,jsx}'],
  },
})
