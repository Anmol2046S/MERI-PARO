import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor - add JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mp_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('mp_token')
      localStorage.removeItem('mp_user')
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login'
      }
    }

    const message = error.response?.data?.message || error.message || 'Something went wrong'
    const status = error.response?.status

    // Create a proper Error object so catch blocks work correctly
    const apiError = new Error(message)
    apiError.status = status
    apiError.data = error.response?.data

    return Promise.reject(apiError)
  }
)

export default api
