import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiOutlineSparkles, HiOutlineDocumentText, HiOutlineChatAlt2, HiOutlineMap, HiOutlineExclamationCircle } from 'react-icons/hi'
import useResumeStore from '../store/resumeStore'
import api from '../api/axios'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function DeepInsightsPage() {
  const { resumes, fetchResumes } = useResumeStore()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [activeTab, setActiveTab] = useState(null)
  const [apiError, setApiError] = useState(null)
  
  useEffect(() => {
    fetchResumes()
  }, [])

  const handleGenerate = async (promptType) => {
    setActiveTab(promptType)
    setLoading(true)
    setResult('')
    setApiError(null)
    
    try {
      const primaryResume = resumes.find(r => r.isPrimary) || resumes[0]
      let contextData = 'User has no resume uploaded yet.'
      
      if (primaryResume) {
        contextData = primaryResume.raw_text || JSON.stringify(primaryResume.parsed_data) || 'User has a resume but text was not parsed yet.'
      }

      const res = await api.post('/gemini/generate', {
        promptType,
        contextData: contextData.substring(0, 15000)
      })
      
      if (res.data?.success || res.success) {
        setResult(res.data?.data || res.data)
        toast.success('AI Insights Generated!')
      } else {
        setApiError('Failed to generate insights. Please try again.')
      }
    } catch (err) {
      const msg = err.message || 'Something went wrong'
      if (msg.toLowerCase().includes('api key') || err.status === 401 || err.status === 500) {
        setApiError('GEMINI_API_KEY_MISSING')
      } else {
        setApiError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  const actions = [
    { id: 'resume_rewrite', icon: <HiOutlineDocumentText size={24} />, title: 'Resume Polisher', desc: 'Rewrite your bullets to be action-oriented' },
    { id: 'interview_prep', icon: <HiOutlineChatAlt2 size={24} />, title: 'Interview Coach', desc: 'Generate custom technical & behavioral questions' },
    { id: 'career_roadmap', icon: <HiOutlineMap size={24} />, title: 'Career Roadmap', desc: 'Build a step-by-step masterplan for growth' }
  ]

  return (
    <div>
      <div className="section-header animate-fade-in-up">
        <h1>Deep AI Insights <HiOutlineSparkles style={{ color: '#8b5cf6', display: 'inline', verticalAlign: 'middle' }} /></h1>
        <p>Premium Gemini-powered career coaching, tailored specifically to your profile.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 30 }}>
        {actions.map((act, i) => (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => handleGenerate(act.id)}
              className="glass-card zoom-hover"
              style={{ 
                  cursor: 'pointer',
                  border: activeTab === act.id ? '2px solid #8b5cf6' : '1px solid rgba(226, 232, 240, 0.8)',
                  boxShadow: activeTab === act.id ? '0 10px 25px rgba(139, 92, 246, 0.15)' : undefined
              }}
            >
              <div style={{ color: '#8b5cf6', marginBottom: 12 }}>{act.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>{act.title}</h3>
              <p style={{ fontSize: 13, color: '#64748b' }}>{act.desc}</p>
            </motion.div>
        ))}
      </div>

      {loading && (
        <div style={{ padding: 40, textAlign: 'center' }}>
            <LoadingSpinner text="Gemini is analyzing your profile..." />
        </div>
      )}

      {apiError && !loading && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ borderLeft: '4px solid #ef4444', padding: '24px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <HiOutlineExclamationCircle size={28} style={{ color: '#ef4444', flexShrink: 0, marginTop: 2 }} />
            <div>
              {apiError === 'GEMINI_API_KEY_MISSING' ? (
                <>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Gemini API Key Required</h3>
                  <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, marginBottom: 12 }}>
                    To use Deep AI Insights, configure your Google Gemini API key in the backend environment:
                  </p>
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 12, fontFamily: 'monospace', fontSize: 13, color: '#334155' }}>
                    GEMINI_API_KEY=your_api_key_here
                  </div>
                  <p style={{ fontSize: 13, color: '#64748b', marginTop: 8 }}>
                    Get your free key at <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ color: '#4f46e5', fontWeight: 600 }}>Google AI Studio</a>
                  </p>
                </>
              ) : (
                <>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Generation Failed</h3>
                  <p style={{ fontSize: 14, color: '#475569' }}>{apiError}</p>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {result && !loading && !apiError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card"
            style={{ 
                background: '#fafafa',
                borderLeft: '4px solid #8b5cf6',
                padding: '30px 40px'
            }}
          >
             <div className="markdown-prose" style={{ lineHeight: 1.6, color: '#334155', fontSize: 15 }}>
                 <ReactMarkdown>{result}</ReactMarkdown>
             </div>
          </motion.div>
      )}
    </div>
  )
}

