import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'memberfun.beplus-agent.com', // Allow this specific host
      '.beplus-agent.com'           // Wildcard to allow all subdomains (alternative)
    ],
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,   
    watch: {
      usePolling: true  
    }
  },
})
