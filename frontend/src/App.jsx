import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/layout/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ResumePage from './pages/ResumePage'
import PredictionsPage from './pages/PredictionsPage'
import SkillsPage from './pages/SkillsPage'
import JobMatchPage from './pages/JobMatchPage'
import RecommendationsPage from './pages/RecommendationsPage'
import HistoryPage from './pages/HistoryPage'
import SettingsPage from './pages/SettingsPage'
import AdminPage from './pages/AdminPage'
import DeepInsightsPage from './pages/DeepInsightsPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="resume" element={<ResumePage />} />
        <Route path="predictions" element={<PredictionsPage />} />
        <Route path="skills" element={<SkillsPage />} />
        <Route path="job-match" element={<JobMatchPage />} />
        <Route path="recommendations" element={<RecommendationsPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="deep-insights" element={<DeepInsightsPage />} />
        <Route path="admin" element={
          <ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>
        } />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
