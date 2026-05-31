import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    proxy: {
      "/api": {
        target: "https://172.31.16.1:7206",
        changeOrigin: true,
        secure: false,
      },
      "/Images": {
        target: "https://172.31.16.1:7206",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
