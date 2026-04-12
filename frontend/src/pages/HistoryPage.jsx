import { useEffect } from 'react'
import { HiOutlineClock, HiOutlineDocument, HiOutlineLightBulb, HiOutlineAcademicCap, HiOutlineBriefcase } from 'react-icons/hi'
import { motion } from 'framer-motion'
import useDashboardStore from '../store/dashboardStore'
import LoadingSpinner from '../components/common/LoadingSpinner'

const actionIcons = {
  resume_upload: HiOutlineDocument,
  prediction: HiOutlineLightBulb,
  skill_gap_analysis: HiOutlineAcademicCap,
  recommendation: HiOutlineLightBulb,
  profile_update: HiOutlineClock,
  job_match: HiOutlineBriefcase,
}

const actionColors = {
  resume_upload: '#0891b2',
  prediction: '#4f46e5',
  skill_gap_analysis: '#7c3aed',
  recommendation: '#10b981',
  profile_update: '#64748b',
  job_match: '#d97706',
}

export default function HistoryPage() {
  const { history, loading, fetchHistory } = useDashboardStore()

  useEffect(() => { fetchHistory() }, [])

  const historyItems = Array.isArray(history) ? history : (history?.items || [])

  return (
    <div>
      <div className="section-header animate-fade-in-up">
        <h1>Activity History</h1>
        <p>Track your career intelligence journey</p>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading history..." />
      ) : historyItems.length > 0 ? (
        <div style={{ position: 'relative', paddingLeft: 40 }}>
          {/* Timeline line */}
          <div style={{
            position: 'absolute', left: 15, top: 0, bottom: 0,
            width: 2, background: 'linear-gradient(to bottom, #4f46e5, rgba(79,70,229,0.1))',
          }} />

          {historyItems.map((item, i) => {
            const Icon = actionIcons[item.actionType || item.action_type] || HiOutlineClock
            const color = actionColors[item.actionType || item.action_type] || '#64748b'
            return (
              <motion.div
                key={item.id || i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{ position: 'relative', marginBottom: 20 }}
              >
                {/* Dot */}
                <div style={{
                  position: 'absolute', left: -33, top: 20, width: 12, height: 12,
                  borderRadius: '50%', background: color, border: '2px solid #fff',
                  boxShadow: '0 0 0 2px #e2e8f0'
                }} />

                <div className="glass-card" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <Icon size={18} style={{ color }} />
                    <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>
                      {(item.actionType || item.action_type || '').replace(/_/g, ' ')}
                    </span>
                    <span style={{ fontSize: 12, color: '#64748b', marginLeft: 'auto' }}>
                      {new Date(item.createdAt || item.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p style={{ fontSize: 14, color: '#334155' }}>{item.summary}</p>
                  {(item.careerScoreAtTime || item.career_score_at_time) && (
                    <p style={{ fontSize: 12, color: '#64748b', marginTop: 8 }}>
                      Career Score: <span style={{ color: '#4f46e5', fontWeight: 600 }}>{item.careerScoreAtTime || item.career_score_at_time}</span>
                    </p>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <div className="glass-card" style={{ textAlign: 'center', padding: 60 }}>
          <HiOutlineClock size={48} style={{ color: '#cbd5e1', marginBottom: 16 }} />
          <p style={{ fontSize: 16, color: '#334155', fontWeight: 600 }}>No activity yet</p>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 8 }}>Start by uploading a resume or making predictions</p>
        </div>
      )}
    </div>
  )
}
