import { create } from 'zustand'
import api from '../api/axios'

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('mp_user') || 'null'),
  token: localStorage.getItem('mp_token') || null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const res = await api.post('/auth/login', { email, password })
      const { user, token } = res.data
      localStorage.setItem('mp_token', token)
      localStorage.setItem('mp_user', JSON.stringify(user))
      set({ user, token, loading: false })
      return { success: true }
    } catch (err) {
      const message = err.message || 'Login failed'
      set({ error: message, loading: false })
      return { success: false, error: message }
    }
  },

  register: async (data) => {
    set({ loading: true, error: null })
    try {
      const res = await api.post('/auth/register', data)
      const { user, token } = res.data
      localStorage.setItem('mp_token', token)
      localStorage.setItem('mp_user', JSON.stringify(user))
      set({ user, token, loading: false })
      return { success: true }
    } catch (err) {
      const message = err.message || 'Registration failed'
      set({ error: message, loading: false })
      return { success: false, error: message }
    }
  },

  logout: () => {
    localStorage.removeItem('mp_token')
    localStorage.removeItem('mp_user')
    set({ user: null, token: null, error: null })
  },

  fetchProfile: async () => {
    try {
      const res = await api.get('/auth/profile')
      const user = res.data
      localStorage.setItem('mp_user', JSON.stringify(user))
      set({ user })
    } catch (err) {
      console.error('Profile fetch failed:', err)
    }
  },

  clearError: () => set({ error: null }),
}))

export default useAuthStore
