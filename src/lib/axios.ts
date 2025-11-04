// lib/axios.ts
import axios from 'axios'

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACK_END_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor untuk handle 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jika 401 dan bukan dari endpoint login, hapus token
    if (error.response?.status === 401 && !error.config?.url?.includes('/login')) {
      localStorage.removeItem('token')
      // Redirect ke login hanya jika tidak sedang di halaman auth
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth')) {
        window.location.href = '/auth/login'
      }
    }
    
    return Promise.reject(error)
  }
)