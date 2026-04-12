import { create } from 'zustand'
import api from '../api/axios'

const useResumeStore = create((set) => ({
  resumes: [],
  currentResume: null,
  uploading: false,
  loading: false,
  error: null,

  fetchResumes: async () => {
    set({ loading: true })
    try {
      const res = await api.get('/resumes')
      set({ resumes: res.data, loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  uploadResume: async (file) => {
    set({ uploading: true, error: null })
    try {
      const formData = new FormData()
      formData.append('resume', file)
      const res = await api.post('/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      set((state) => ({
        resumes: [res.data, ...state.resumes],
        currentResume: res.data,
        uploading: false,
      }))
      return res.data
    } catch (err) {
      set({ error: err.message, uploading: false })
      return null
    }
  },

  getResume: async (id) => {
    try {
      const res = await api.get(`/resumes/${id}`)
      set({ currentResume: res.data })
      return res.data
    } catch (err) {
      set({ error: err.message })
      return null
    }
  },

  deleteResume: async (id) => {
    try {
      await api.delete(`/resumes/${id}`)
      set((state) => ({
        resumes: state.resumes.filter((r) => r.id !== id),
      }))
      return true
    } catch (err) {
      set({ error: err.message })
      return false
    }
  },

  deleteMultipleResumes: async (ids) => {
    try {
      await Promise.all(ids.map((id) => api.delete(`/resumes/${id}`)))
      set((state) => ({
        resumes: state.resumes.filter((r) => !ids.includes(r.id)),
      }))
      return true
    } catch (err) {
      set({ error: err.message })
      return false
    }
  },

  setPrimary: async (id) => {
    try {
      await api.patch(`/resumes/${id}/primary`)
      set((state) => ({
        resumes: state.resumes.map((r) => ({ ...r, isPrimary: r.id === id })),
      }))
    } catch (err) {
      set({ error: err.message })
    }
  },
}))

export default useResumeStore
