import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// 백엔드 서버 (받은 서버를 3000번으로 실행)
const API_SERVER = 'http://localhost:3000'

export default defineConfig({
  plugins: [react()],
  server: {
    // /api, /uploads 요청은 백엔드 서버로 전달 (CORS, 로그인 쿠키 문제 없음)
    proxy: {
      '/api': API_SERVER,
      '/uploads': API_SERVER,
    },
  },
})
