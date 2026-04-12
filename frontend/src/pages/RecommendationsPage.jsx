import { useEffect } from 'react'
import { HiOutlineChartBar, HiOutlineCheckCircle, HiOutlineLightBulb, HiOutlineRefresh } from 'react-icons/hi'
import { motion, AnimatePresence } from 'framer-motion'
import useDashboardStore from '../store/dashboardStore'
import LoadingSpinner from '../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const typeIcons = { course: '📚', certification: '🎓', project: '🛠️', career_move: '🚀', skill: '💡' }
const typeColors = { course: '#4f46e5', certification: '#7c3aed', project: '#0891b2', career_move: '#10b981', skill: '#d97706' }

export default function RecommendationsPage() {
  const { recommendations, loading, fetchRecommendations, generateRecommendations } = useDashboardStore()

  useEffect(() => { fetchRecommendations() }, [])

  const handleGenerate = async () => {
    const result = await generateRecommendations()
    if (result) toast.success('New recommendations generated!')
    else toast.error('Generation failed')
  }

  return (
    <div>
      <div className="section-header animate-fade-in-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Growth Recommendations</h1>
          <p>AI-powered career growth recommendations tailored to your profile.</p>
        </div>
        <button id="rec-generate" onClick={handleGenerate} className="btn-primary" disabled={loading} style={{ flexShrink: 0 }}>
          {loading ? <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : <><HiOutlineRefresh size={18} /> Generate New</>}
        </button>
      </div>

      {loading && !recommendations?.length ? (
        <LoadingSpinner text="Loading recommendations..." />
      ) : recommendations?.length > 0 ? (
        <div style={{ display: 'grid', gap: 16 }}>
          {recommendations.map((rec, i) => (
            <motion.div
              key={rec.id || i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass-card"
              style={{ borderLeft: `3px solid ${typeColors[rec.type] || '#4f46e5'}` }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: 16, flex: 1 }}>
                  <span style={{ fontSize: 28 }}>{typeIcons[rec.type] || '💡'}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{rec.title}</h3>
                      <span className={`badge ${rec.priority === 'high' || rec.priority === 'critical' ? 'badge-danger' : rec.priority === 'medium' ? 'badge-warning' : 'badge-primary'}`}>
                        {rec.priority}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5 }}>{rec.description}</p>
                    <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
                      {rec.provider && <span style={{ fontSize: 12, color: '#64748b' }}>📌 {rec.provider}</span>}
                      {rec.estimated_duration && <span style={{ fontSize: 12, color: '#64748b' }}>⏱ {rec.estimated_duration}</span>}
                      {rec.url && <a href={rec.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#4f46e5', textDecoration: 'none', fontWeight: 600 }}>🔗 Learn More</a>}
                    </div>
                  </div>
                </div>
                {rec.is_completed ? (
                  <HiOutlineCheckCircle size={24} style={{ color: '#10b981', flexShrink: 0 }} />
                ) : (
                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <p style={{ fontSize: 20, fontWeight: 800, color: '#4f46e5' }}>{rec.relevance_score || 0}</p>
                    <p style={{ fontSize: 10, color: '#64748b' }}>relevance</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-card" style={{ textAlign: 'center', padding: 60 }}>
          <HiOutlineLightBulb size={48} style={{ color: '#cbd5e1', marginBottom: 16 }} />
          <p style={{ fontSize: 16, color: '#334155', fontWeight: 600 }}>No recommendations yet</p>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 8, marginBottom: 24 }}>Upload a resume and run predictions first, then generate recommendations</p>
          <button onClick={handleGenerate} className="btn-primary" disabled={loading}>Generate Recommendations</button>
        </div>
      )}
    </div>
  )
}
