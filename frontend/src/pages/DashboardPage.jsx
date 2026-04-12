import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { HiOutlineStar, HiOutlineLightBulb, HiOutlineAcademicCap, HiOutlineDocument, HiOutlineTrendingUp, HiOutlineSparkles } from 'react-icons/hi'
import { AreaChart, Area, RadialBarChart, RadialBar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import useDashboardStore from '../store/dashboardStore'
import useAuthStore from '../store/authStore'
import { getParoTake } from '../utils/humorRegistry'

function StatCard({ icon: Icon, label, value, sub, delay }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay }} className="glass-card">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>{label}</p>
          <p style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{value}</p>
          {sub && <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 8, fontWeight: 500 }}>{sub}</p>}
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
          <Icon size={24} />
        </div>
      </div>
    </motion.div>
  )
}

export default function DashboardPage() {
  const { dashboard, loading, fetchDashboard } = useDashboardStore()
  const { user } = useAuthStore()
  const paroRef = useRef(null)
  const isParoInView = useInView(paroRef, { once: true, margin: "-100px" })

  useEffect(() => { fetchDashboard() }, [])

  if (loading && !dashboard) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 40 }}>
      <div className="skeleton" style={{ height: 40, width: 200 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
        {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 120 }} />)}
      </div>
      <div className="skeleton" style={{ height: 300 }} />
    </div>
  )

  const careerScore = dashboard?.careerScore || 0
  const stats = dashboard?.stats || {}
  const predictedRoles = dashboard?.predictedRoles || []
  const skills = dashboard?.skills || []
  const missingSkills = dashboard?.missingSkills || []
  const progressHistory = dashboard?.progressHistory || []
  const isHrOrAdmin = user?.role === 'admin' || user?.role === 'HR' || user?.role === 'MD'

  const radialData = [{ name: 'Score', value: careerScore, fill: '#4f46e5' }]

  // Format progress chart data
  const chartData = progressHistory.length > 0
    ? progressHistory.map(h => ({ date: new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), score: h.score }))
    : [{ date: 'Start', score: 0 }, { date: 'Now', score: careerScore }]

  return (
    <div>
      <div className="section-header animate-fade-in-up">
        <h1>Dashboard</h1>
        <p>Your AI-powered career overview.</p>
      </div>

      {/* Level 1: Core Metrics Above Fold */}
      <div className="responsive-grid-4" style={{ marginBottom: 32 }}>
        <StatCard icon={HiOutlineStar} label="Career Score" value={careerScore} sub="out of 100" delay={0.1} />
        <StatCard icon={HiOutlineAcademicCap} label="Total Skills" value={stats.totalSkills || 0} sub="detected" delay={0.2} />
        <StatCard icon={HiOutlineDocument} label="Resumes" value={stats.resumeCount || 0} sub="uploaded" delay={0.3} />
        <StatCard icon={HiOutlineLightBulb} label="Predictions" value={stats.predictionCount || 0} sub="made" delay={0.4} />
      </div>

      <div className="responsive-grid-sidebar" style={{ marginBottom: 40 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ alignSelf: 'flex-start', fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 0 }}>ATS Readiness</h3>
          <div style={{ width: '100%', height: 220, marginTop: -20 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" startAngle={180} endAngle={0} data={radialData}>
                <RadialBar dataKey="value" cornerRadius={12} background={{ fill: '#f1f5f9' }} max={100} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ textAlign: 'center', marginTop: -60 }}>
            <p style={{ fontSize: 56, fontWeight: 900, lineHeight: 1 }} className="gradient-text">{careerScore}</p>
            <p style={{ fontSize: 13, color: '#64748b', fontWeight: 500, marginTop: 4 }}>Target: {stats.targetRole || 'Not Set'}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="glass-card">
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <HiOutlineTrendingUp className="gradient-text" /> Top Predicted Roles
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {predictedRoles.length > 0 ? predictedRoles.map((role, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>{role.role}</span>
                  <span style={{ fontSize: 13, color: '#4f46e5', fontWeight: 700 }}>{Math.round(role.confidence * 100)}%</span>
                </div>
                <div className="progress-bar"><div className="progress-bar-fill" style={{ width: `${role.confidence * 100}%` }} /></div>
              </div>
            )) : <p style={{ color: '#64748b', fontSize: 14 }}>Upload a resume to generate role predictions.</p>}
          </div>
        </motion.div>
      </div>

      {/* Career Progress Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="glass-card" style={{ marginBottom: 40 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <HiOutlineTrendingUp style={{ color: '#4f46e5' }} /> Career Progress
        </h3>
        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8 }} />
              <Area type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={2} fill="url(#scoreGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Level 2: Paro's Take */}
      {isHrOrAdmin && (
        <div ref={paroRef} style={{ marginBottom: 40, minHeight: 100 }}>
          {isParoInView && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="paro-insight">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <HiOutlineSparkles size={20} style={{ color: '#d97706' }} />
                <span style={{ fontSize: 14, fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Paro's Executive Summary</span>
              </div>
              <p style={{ fontSize: 16, color: '#334155', fontStyle: 'italic', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                "{getParoTake({ resumeScore: careerScore, missingSkills, topSkill: skills[0]?.name })}"
              </p>
            </motion.div>
          )}
        </div>
      )}

    </div>
  )
}
