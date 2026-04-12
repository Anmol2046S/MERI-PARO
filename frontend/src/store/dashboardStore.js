import { create } from 'zustand'
import api from '../api/axios'

const useDashboardStore = create((set) => ({
  dashboard: null,
  predictions: null,
  skillGap: null,
  recommendations: [],
  history: [],
  jobRoles: [],
  loading: false,
  error: null,

  fetchDashboard: async () => {
    set({ loading: true, error: null })
    try {
      const res = await api.get('/ai/dashboard')
      set({ dashboard: res.data, loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  predictJobRoles: async (resumeId, modelType = 'ml') => {
    set({ loading: true, error: null })
    try {
      const res = await api.post('/predictions/job-roles', { resumeId, modelType })
      set({ predictions: res.data, loading: false })
      return res.data
    } catch (err) {
      set({ error: err.message, loading: false })
      return null
    }
  },

  analyzeSkillGap: async (targetRole, resumeId) => {
    set({ loading: true, error: null })
    try {
      const res = await api.post('/predictions/skill-gap', { targetRole, resumeId })
      set({ skillGap: res.data, loading: false })
      return res.data
    } catch (err) {
      set({ error: err.message, loading: false })
      return null
    }
  },

  analyzeJobDescription: async (title, description, company) => {
    set({ loading: true, error: null })
    try {
      const res = await api.post('/predictions/job-description', { title, description, company })
      set({ loading: false })
      return res.data
    } catch (err) {
      set({ error: err.message, loading: false })
      return null
    }
  },

  simulateCareer: async (addedSkills) => {
    set({ loading: true, error: null })
    try {
      const res = await api.post('/predictions/simulate', { addedSkills })
      set({ loading: false })
      return res.data
    } catch (err) {
      set({ error: err.message, loading: false })
      return null
    }
  },

  fetchRecommendations: async () => {
    set({ error: null })
    try {
      const res = await api.get('/ai/recommendations')
      set({ recommendations: res.data })
    } catch (err) {
      set({ error: err.message })
    }
  },

  generateRecommendations: async () => {
    set({ loading: true, error: null })
    try {
      const res = await api.post('/ai/recommendations/generate')
      set({ recommendations: res.data, loading: false })
      return res.data
    } catch (err) {
      set({ error: err.message, loading: false })
      return null
    }
  },

  fetchHistory: async (page = 1) => {
    set({ error: null })
    try {
      const res = await api.get(`/history?page=${page}`)
      set({ history: res.data })
    } catch (err) {
      set({ error: err.message })
    }
  },

  fetchJobRoles: async () => {
    set({ error: null })
    try {
      const res = await api.get('/predictions/job-roles')
      set({ jobRoles: res.data })
    } catch (err) {
      set({ error: err.message })
    }
  },
}))

export default useDashboardStore
