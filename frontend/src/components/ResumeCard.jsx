import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineDocument, HiOutlineChevronDown, HiOutlineChevronUp, HiOutlineSparkles, HiOutlineTrash } from 'react-icons/hi'
import { getParoTake } from '../utils/humorRegistry'
import useAuthStore from '../store/authStore'

export default function ResumeCard({ resume, stats, selectable = false, selected = false, onSelect, onDelete }) {
  const { user } = useAuthStore()
  const [expanded, setExpanded] = useState(false)
  const isHrOrAdmin = user?.role === 'admin' || user?.role === 'HR' || user?.role === 'MD'

  const score = resume.atsScore || 0
  const skills = resume.skills || []
  const topSkill = skills[0] || 'core'
  // Mock missing skills since they aren't directly on the resume object without gap analysis
  const mockMissingSkills = stats?.targetRole ? ['SQL', 'Docker', 'AWS'] : [] 

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card" 
      style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {selectable && (
            <input 
              type="checkbox" 
              checked={selected} 
              onChange={() => onSelect?.(resume.id)}
              style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#4f46e5', marginTop: 2 }}
            />
          )}
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: '#eef2ff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#4f46e5'
          }}>
            <HiOutlineDocument size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: '0 0 2px 0' }}>{resume.fileName}</h4>
            <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
              {(resume.fileSize / 1024).toFixed(1)} KB • Parsed: {resume.parsingStatus}
            </p>
          </div>
        </div>
        <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 16 }}>
          {onDelete && (
             <button onClick={() => onDelete(resume.id)} className="btn-ghost" style={{ padding: 8, color: '#ef4444', borderRadius: 8, border: '1px solid #fee2e2' }} title="Delete Resume">
                <HiOutlineTrash size={20} />
             </button>
          )}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: score >= 75 ? '#10b981' : score >= 50 ? '#d97706' : '#dc2626', lineHeight: 1 }}>
              {score}
            </div>
            <p style={{ fontSize: 11, color: '#64748b', margin: '2px 0 0 0', fontWeight: 600, letterSpacing: '0.02em', textTransform: 'uppercase' }}>ATS Match</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {skills.slice(0, 5).map((skill, i) => (
          <span key={i} className="skill-chip skill-chip-present" style={{ fontSize: 12, padding: '4px 10px' }}>
            {skill}
          </span>
        ))}
        {skills.length > 5 && (
          <span className="skill-chip skill-chip-present" style={{ fontSize: 12, padding: '4px 10px', background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0' }}>
            +{skills.length - 5}
          </span>
        )}
      </div>

      <button 
        onClick={() => setExpanded(!expanded)} 
        className="btn-ghost" 
        style={{ alignSelf: 'flex-start', padding: '6px 12px', fontSize: 13, marginTop: 8 }}
      >
        {expanded ? <><HiOutlineChevronUp /> Hide Details</> : <><HiOutlineChevronDown /> View Details</>}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 16, marginTop: 4, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {isHrOrAdmin && (
                <div className="paro-insight">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <HiOutlineSparkles style={{ color: '#d97706' }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Paro's Take</span>
                  </div>
                  <p style={{ fontSize: 14, color: '#334155', fontStyle: 'italic', lineHeight: 1.5, margin: 0 }}>
                    {getParoTake({ resumeScore: score, missingSkills: mockMissingSkills, topSkill })}
                  </p>
                </div>
              )}
              
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>All Detected Skills</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {skills.map((skill, i) => (
                    <span key={`all-${i}`} className="badge badge-slate">{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
