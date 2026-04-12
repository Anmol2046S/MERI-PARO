import { useState, useEffect } from 'react'
import { HiOutlineSearch, HiOutlineShieldCheck, HiOutlineSparkles, HiOutlineBriefcase } from 'react-icons/hi'
import { motion } from 'framer-motion'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { getVibeBadge, getRemoteScore, getParoTake } from '../utils/humorRegistry'

export default function AdminPage() {
  const [users, setUsers] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [usersRes, analyticsRes] = await Promise.all([
        api.get('/admin/users'), api.get('/admin/analytics')
      ])
      // Enrich users with humor logic for the HR perspective
      const enrichedUsers = (usersRes.data || []).map(u => ({
        ...u,
        vibe: getVibeBadge({ resumeScore: u.careerScore }),
        remoteIndex: getRemoteScore({ skills: u.skills || [] })
      }))
      setUsers(enrichedUsers)
      setAnalytics(analyticsRes.data || null)
    } catch (err) {
      toast.error(err.message || 'Failed to load data')
    }
    setLoading(false)
  }

  const filteredUsers = users.filter(u =>
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.firstName?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>Loading Command Center...</div>

  return (
    <div>
      <div className="section-header animate-fade-in-up">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <HiOutlineShieldCheck style={{ color: '#d97706' }} /> HR Command Center
        </h1>
        <p>Candidate analytics, vibe checks, and system intelligence.</p>
      </div>

      {/* Paro's Exec Summary for the System */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="paro-insight" style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <HiOutlineSparkles size={18} style={{ color: '#d97706' }} />
          <span style={{ fontSize: 13, fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.05em' }}>System Intelligence Readout</span>
        </div>
        <p style={{ fontSize: 14, color: '#334155', fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>
          "{getParoTake({ resumeScore: analytics?.resumes?.avg_ats_score || 55 })} System average ATS score is {Math.round(analytics?.resumes?.avg_ats_score || 0)}. 
          We have {analytics?.users?.active_users} active candidates. Proceed with measured optimism."
        </p>
      </motion.div>

      <div className="glass-card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>Candidate Roster</h3>
          <div style={{ position: 'relative', width: 300 }}>
            <HiOutlineSearch size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="input-field" style={{ paddingLeft: 40 }} placeholder="Search candidates..." />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Candidate</th>
                <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Score</th>
                <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Vibe Assessment</th>
                <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>🛌 REI</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, i) => (
                <tr key={user.id} className="table-row">
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#eef2ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{user.firstName} {user.lastName}</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', fontSize: 15, fontWeight: 800, color: user.careerScore >= 75 ? '#10b981' : '#0f172a' }}>
                    {user.careerScore || 'N/A'}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div className="tooltip-wrapper" style={{ display: 'inline-block' }}>
                      <span className="vibe-badge">✨ Vibe: {user.vibe.score}/10</span>
                      <div className="tooltip-content" style={{ width: 200, whiteSpace: 'normal', textAlign: 'left', lineHeight: 1.4 }}>
                        {user.vibe.read}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div className="tooltip-wrapper">
                      <div className="remote-bar">
                        <div className="remote-bar-fill" style={{ width: `${user.remoteIndex}%` }} />
                      </div>
                      <div className="tooltip-content">Remote Efficiency Index</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
