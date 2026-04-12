import { useState, useEffect } from 'react'
import { HiOutlineLightBulb, HiOutlinePlay, HiOutlineChip } from 'react-icons/hi'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'
import useDashboardStore from '../store/dashboardStore'
import useResumeStore from '../store/resumeStore'
import LoadingSpinner from '../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function PredictionsPage() {
  const [selectedResume, setSelectedResume] = useState('')
  const [modelType, setModelType] = useState('ml')
  const { predictions, loading, predictJobRoles } = useDashboardStore()
  const { resumes, fetchResumes } = useResumeStore()

  useEffect(() => { fetchResumes() }, [])

  const completedResumes = resumes.filter(r => r.parsingStatus === 'completed')

  const handlePredict = async () => {
    if (!selectedResume) return toast.error('Select a resume first')
    const result = await predictJobRoles(parseInt(selectedResume), modelType)
    if (result) toast.success('Prediction completed!')
    else toast.error('Prediction failed')
  }

  const chartData = predictions?.predictions?.map(p => ({
    name: p.role,
    confidence: Math.round((p.confidence || 0) * 100),
  })) || []

  return (
    <div>
      <div className="section-header animate-fade-in-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Job Predictions</h1>
          <p>AI-powered job role prediction using 3-layer ML pipeline</p>
        </div>
        <button onClick={() => window.print()} className="btn-secondary" style={{ display: predictions ? 'inline-flex' : 'none' }}>
          🖨️ Export PDF
        </button>
      </div>

      {/* Controls */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ marginBottom: 32 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 16, alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Select Resume</label>
            <select id="pred-resume" value={selectedResume} onChange={(e) => setSelectedResume(e.target.value)}
              className="input-field" style={{ cursor: 'pointer' }}>
              <option value="">Choose a completed resume...</option>
              {completedResumes.map(r => (
                <option key={r.id} value={r.id}>{r.fileName} ({r.skills?.length || 0} skills)</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Model Type</label>
            <select id="pred-model" value={modelType} onChange={(e) => setModelType(e.target.value)} className="input-field" style={{ cursor: 'pointer' }}>
              <option value="baseline">Baseline (Keyword Matching)</option>
              <option value="ml">ML (TF-IDF + Ensemble)</option>
              <option value="deep_learning">Deep Learning (Neural Network)</option>
            </select>
          </div>
          <button id="pred-run" onClick={handlePredict} className="btn-primary" disabled={loading || !selectedResume}
            style={{ padding: '12px 32px' }}>
            {loading ? <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : <><HiOutlinePlay size={18} /> Predict</>}
          </button>
        </div>
      </motion.div>

      {/* Model Info */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Baseline', desc: 'Keyword matching', icon: '🔤', active: modelType === 'baseline' },
          { label: 'ML Ensemble', desc: 'TF-IDF + LR + RF', icon: '🤖', active: modelType === 'ml' },
          { label: 'Deep Learning', desc: 'Neural Network + Embeddings', icon: '🧠', active: modelType === 'deep_learning' },
        ].map((m, i) => (
          <div key={i} className="glass-card" style={{
            borderColor: m.active ? 'rgba(79,70,229,0.5)' : undefined,
            background: m.active ? 'rgba(79,70,229,0.06)' : undefined,
            cursor: 'pointer', textAlign: 'center',
          }} onClick={() => setModelType(m.label === 'Baseline' ? 'baseline' : m.label === 'ML Ensemble' ? 'ml' : 'deep_learning')}>
            <p style={{ fontSize: 28, marginBottom: 8 }}>{m.icon}</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: m.active ? '#4f46e5' : '#0f172a' }}>{m.label}</p>
            <p style={{ fontSize: 12, color: '#64748b' }}>{m.desc}</p>
          </div>
        ))}
      </div>

      {/* Results */}
      {predictions && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 20 }}>Prediction Results</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} angle={-20} textAnchor="end" height={80} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, color: '#0f172a' }} />
                <Bar dataKey="confidence" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card">
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 20 }}>Detailed Results</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {predictions.predictions?.slice(0, 5).map((pred, i) => (
                <div key={i} style={{
                  padding: 16, borderRadius: 12,
                  background: i === 0 ? 'rgba(79,70,229,0.06)' : '#f8fafc',
                  border: `1px solid ${i === 0 ? 'rgba(79,70,229,0.2)' : '#e2e8f0'}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: i === 0 ? '#4f46e5' : '#0f172a' }}>
                      {i === 0 ? '🏆 ' : `#${i + 1} `}{pred.role}
                    </span>
                    <span style={{ fontSize: 20, fontWeight: 800, color: '#4f46e5' }}>{Math.round(pred.confidence * 100)}%</span>
                  </div>
                  <div className="progress-bar"><div className="progress-bar-fill" style={{ width: `${Math.round(pred.confidence * 100)}%` }} /></div>
                  {pred.matched_skills && (
                    <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {pred.matched_skills?.slice(0, 5).map((s, si) => (
                        <span key={si} className="badge badge-primary" style={{ fontSize: 10 }}>{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {predictions.model_used && (
              <p style={{ fontSize: 12, color: '#64748b', marginTop: 16 }}>
                <HiOutlineChip style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                Model: {predictions.model_used} | Processing: {predictions.processingTimeMs || predictions.processing_time_ms}ms
              </p>
            )}
          </motion.div>
        </div>
      )}
    </div>
  )
}
