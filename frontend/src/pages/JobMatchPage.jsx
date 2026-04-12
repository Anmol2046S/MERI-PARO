import { useState } from 'react'
import { HiOutlineBriefcase, HiOutlineSearch } from 'react-icons/hi'
import { motion, AnimatePresence } from 'framer-motion'
import useDashboardStore from '../store/dashboardStore'
import toast from 'react-hot-toast'

export default function JobMatchPage() {
  const [form, setForm] = useState({ title: '', company: '', description: '' })
  const [result, setResult] = useState(null)
  const { loading, analyzeJobDescription } = useDashboardStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.description.length < 50) return toast.error('Description must be at least 50 characters')
    const res = await analyzeJobDescription(form.title, form.description, form.company)
    if (res) { setResult(res); toast.success('Job description analyzed!') }
    else toast.error('Analysis failed')
  }

  return (
    <div>
      <div className="section-header animate-fade-in-up">
        <h1>Job Match Analyzer</h1>
        <p>Paste a job description to see how well you match</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: 20 }}>
        {/* Input Form */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Job Title *</label>
              <input id="jm-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input-field" placeholder="e.g. Senior Frontend Developer" required />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Company (optional)</label>
              <input id="jm-company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="input-field" placeholder="e.g. Google" />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Job Description *</label>
              <textarea id="jm-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input-field" style={{ minHeight: 200, resize: 'vertical' }}
                placeholder="Paste the full job description here (minimum 50 characters)..." required />
            </div>
            <button id="jm-analyze" type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : <><HiOutlineSearch size={18} /> Analyze Match</>}
            </button>
          </form>
        </motion.div>

        {/* Results */}
        <div style={{ position: 'relative' }}>
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div key="result" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                {/* Match Score */}
                <div className="glass-card" style={{ textAlign: 'center', marginBottom: 20 }}>
                  <p style={{ fontSize: 64, fontWeight: 900, color: result.matchScore >= 75 ? '#10b981' : result.matchScore >= 50 ? '#d97706' : '#dc2626' }}>
                    {result.matchScore}%
                  </p>
                  <p style={{ fontSize: 18, fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>{result.recommendation}</p>
                  <p style={{ fontSize: 14, color: '#64748b' }}>{result.title}{result.company ? ` at ${result.company}` : ''}</p>
                </div>

                {/* Matching Skills */}
                <div className="glass-card" style={{ marginBottom: 20 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#10b981', marginBottom: 12 }}>✓ Matching Skills ({result.matchingSkills?.length || 0})</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {(result.matchingSkills || []).map((s, i) => <span key={i} className="skill-chip skill-chip-present">{s}</span>)}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="glass-card">
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#dc2626', marginBottom: 12 }}>✗ Missing Skills ({result.missingSkills?.length || 0})</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {(result.missingSkills || []).map((s, i) => <span key={i} className="skill-chip skill-chip-missing">{s}</span>)}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, border: '2px dashed #e2e8f0', background: 'transparent', boxShadow: 'none' }}>
                <HiOutlineSearch size={48} style={{ color: '#cbd5e1', marginBottom: 16 }} />
                <p style={{ fontSize: 16, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Ready to Analyze</p>
                <p style={{ fontSize: 14, color: '#94a3b8', textAlign: 'center', maxWidth: 300 }}>Paste a job description on the left to see your match breakdown and missing skills.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
