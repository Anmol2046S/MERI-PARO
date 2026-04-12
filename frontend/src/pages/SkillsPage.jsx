import { useState, useEffect } from 'react'
import { HiOutlineAcademicCap, HiOutlineSearch, HiOutlineInformationCircle } from 'react-icons/hi'
import { motion, AnimatePresence } from 'framer-motion'
import useDashboardStore from '../store/dashboardStore'
import useResumeStore from '../store/resumeStore'
import toast from 'react-hot-toast'
import { getSkillDemand } from '../utils/humorRegistry'

export default function SkillsPage() {
  const [targetRole, setTargetRole] = useState('')
  const { skillGap, loading, analyzeSkillGap, fetchJobRoles, jobRoles } = useDashboardStore()
  const { resumes, fetchResumes } = useResumeStore()

  useEffect(() => { fetchResumes(); fetchJobRoles() }, [])

  const primaryResume = resumes.find(r => r.isPrimary && r.parsingStatus === 'completed') || resumes[0]
  const allSkills = primaryResume?.skills || []

  const handleAnalyze = async () => {
    if (!targetRole) return toast.error('Select a target role')
    const result = await analyzeSkillGap(targetRole)
    if (result) toast.success('Skill gap analysis complete!')
    else toast.error('Analysis failed')
  }

  // Tooltip helper component
  const SkillChip = ({ skill, missing = false }) => {
    const demand = getSkillDemand(skill)
    return (
      <div className="tooltip-wrapper" style={{ display: 'inline-block' }}>
        <span className={`skill-chip ${missing ? 'skill-chip-missing' : 'skill-chip-present'}`}>
          {skill} {missing && <span style={{ textDecoration: 'none', marginLeft: 2 }}>🚀</span>}
        </span>
        <div className="tooltip-content">
          <div style={{ padding: '2px 4px' }}>
            <span style={{ color: demand.demand === 'High' ? '#fde047' : '#94a3b8' }}>
              {demand.demand === 'High' ? '🔥' : '📈'} {demand.demand} Demand
            </span>
            <span style={{ display: 'block', marginTop: 4, color: '#e2e8f0', fontSize: 11 }}>
              ~{demand.jobs} open roles
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="section-header animate-fade-in-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Skill Gap Analysis</h1>
          <p>Compare your precise skill matrix against market realities.</p>
        </div>
        <button onClick={() => window.print()} className="btn-secondary" style={{ display: skillGap ? 'inline-flex' : 'none' }}>
          🖨️ Export PDF
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ marginBottom: 32, padding: '24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Select Target Role</label>
            <select value={targetRole} onChange={(e) => setTargetRole(e.target.value)} className="input-field" style={{ cursor: 'pointer' }}>
              <option value="">Choose a role to analyze...</option>
              {(jobRoles || []).map(r => (
                <option key={r.id} value={r.title}>{r.title} — {r.demand_level || r.demandLevel}</option>
              ))}
            </select>
          </div>
          <button onClick={handleAnalyze} className="btn-primary" disabled={loading || !targetRole} style={{ height: 42 }}>
            {loading ? <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : <><HiOutlineSearch size={18} /> Run Analysis</>}
          </button>
        </div>
      </motion.div>

      {!skillGap && resumes.filter(r => r.parsingStatus === 'completed').length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card" style={{ borderLeft: '4px solid #f59e0b', marginBottom: 24, padding: '16px 24px' }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#92400e' }}>⚠️ No parsed resumes found</p>
          <p style={{ fontSize: 13, color: '#78716c', marginTop: 4 }}>Upload and wait for a resume to finish parsing before running a skill gap analysis.</p>
        </motion.div>
      )}

      {!skillGap && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card" style={{ textAlign: 'center', padding: 60 }}>
          <HiOutlineAcademicCap size={48} style={{ color: '#cbd5e1', margin: '0 auto 16px' }} />
          <p style={{ fontSize: 16, fontWeight: 600, color: '#334155' }}>Your skills are ready for analysis</p>
          <p style={{ fontSize: 14, color: '#64748b', marginTop: 8 }}>Select a target role above to identify your gaps and generate a learning path.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 24, maxWidth: 600, margin: '24px auto 0' }}>
            {allSkills.slice(0, 15).map((s, i) => <span key={i} className="skill-chip skill-chip-present">{s}</span>)}
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {skillGap && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {/* Left Col: Gaps */}
            <div className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>{skillGap.targetRole}</h3>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 32, fontWeight: 900, color: skillGap.matchPercentage >= 70 ? '#10b981' : skillGap.matchPercentage >= 40 ? '#d97706' : '#dc2626', lineHeight: 1 }}>{skillGap.matchPercentage}%</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4 }}>Match Rate</div>
                </div>
              </div>
              
              <div className="progress-bar" style={{ height: 10, marginBottom: 32 }}>
                <div className="progress-bar-fill" style={{ width: `${skillGap.matchPercentage}%`, background: skillGap.matchPercentage >= 70 ? 'linear-gradient(90deg, #10b981, #34d399)' : undefined }} />
              </div>

              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#10b981' }}>✓</span> Present Skills
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {(skillGap.matchingSkills?.required || []).map((s, i) => <SkillChip key={`r-${i}`} skill={s} />)}
                  {(skillGap.matchingSkills?.optional || []).map((s, i) => <SkillChip key={`o-${i}`} skill={s} />)}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#dc2626' }}>✗</span> Missing Skills
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {(skillGap.missingSkills?.required || []).map((s, i) => <SkillChip key={`mr-${i}`} skill={s} missing />)}
                  {(skillGap.missingSkills?.optional || []).map((s, i) => <SkillChip key={`mo-${i}`} skill={s} missing />)}
                </div>
              </div>
            </div>

            {/* Right Col: Timeline/Path */}
            <div className="glass-card">
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 24 }}>Recommended Learning Path</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {(skillGap.learningPath || []).map((phase, i) => (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + (i * 0.1) }} key={i} style={{ position: 'relative', paddingLeft: 24 }}>
                    {/* Timeline dot and line */}
                    <div style={{ position: 'absolute', left: 0, top: 6, bottom: i === skillGap.learningPath.length - 1 ? 'auto' : -20, width: 2, background: '#e2e8f0' }} />
                    <div style={{ position: 'absolute', left: -4, top: 6, width: 10, height: 10, borderRadius: '50%', background: '#4f46e5', border: '2px solid #fff' }} />
                    
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{phase.title}</span>
                        <span className="badge badge-primary" style={{ background: '#e0e7ff' }}>{phase.duration}</span>
                      </div>
                      <p style={{ fontSize: 13, color: '#475569', marginBottom: 12, lineHeight: 1.5 }}>{phase.description}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {phase.skills?.map((s, si) => <span key={si} className="badge badge-amber">{s}</span>)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
