import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import useAuthStore from '../store/authStore'
import { HiOutlineLightningBolt, HiOutlineSparkles, HiOutlineChartBar, HiOutlineCloudUpload, HiOutlineChip, HiOutlineMap } from 'react-icons/hi'

export default function LandingPage() {
  const { token } = useAuthStore()

  // Redirect to dashboard if logged in
  if (token) return <Navigate to="/dashboard" replace />

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Navbar Minimal */}
      <nav style={{ padding: '0 32px', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.03em' }}>
          <span className="gradient-text">MERI PARO</span>
        </h1>
        <div style={{ display: 'flex', gap: 16 }}>
          <Link to="/login" className="btn-secondary">Sign In</Link>
          <Link to="/register" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', position: 'relative' }}>
        
        {/* Background Gradients */}
        <div style={{ position: 'absolute', top: -100, right: '10%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(79, 70, 229, 0.08), transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: -100, left: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08), transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }} />

        <motion.div 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          style={{ maxWidth: 800, textAlign: 'center', zIndex: 1 }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: '#e0e7ff', color: '#4338ca', borderRadius: 999, fontSize: 13, fontWeight: 600, marginBottom: 24 }}>
            <span>✨ Introducing the Intelligent Career Oracle</span>
          </div>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, color: '#0f172a', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 24 }}>
            Stop guessing.<br />
            Start <span className="gradient-text">advancing.</span>
          </h2>
          <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: '#64748b', marginBottom: 40, lineHeight: 1.6, maxWidth: 600, margin: '0 auto 40px' }}>
            Upload your resume and let AI instantly reveal your skill gaps, predict job matches, and tell you exactly what hiring managers actually see.
          </p>
          <Link to="/register" className="btn-primary-lg">
            Upload Your Resume
          </Link>
        </motion.div>

        {/* Feature Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, maxWidth: 1080, width: '100%', marginTop: 80, zIndex: 1 }}>
          {[
            { icon: HiOutlineChartBar, title: "Career Score", desc: "Get an objective 0-100 score based on market demand and ATS parsing." },
            { icon: HiOutlineSparkles, title: "Paro's Take", desc: "Receive unfiltered, witty feedback on your resume's vibe and formatting." },
            { icon: HiOutlineLightningBolt, title: "Skill Gaps", desc: "Discover exactly what skills you're missing for your target dream role." }
          ].map((feat, i) => (
            <motion.div 
              key={feat.title}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 + (i * 0.1) }}
              className="glass-card" style={{ padding: 32, textAlign: 'center' }}
            >
              <div style={{ width: 48, height: 48, background: '#eef2ff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#4f46e5' }}>
                <feat.icon size={24} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>{feat.title}</h3>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.5 }}>{feat.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* How It Works Section */}
        <div style={{ maxWidth: 900, width: '100%', marginTop: 100, zIndex: 1, paddingBottom: 60 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: 12 }}>
              How It <span className="gradient-text">Works</span>
            </h2>
            <p style={{ fontSize: 15, color: '#64748b', maxWidth: 500, margin: '0 auto' }}>Our 3-layer AI pipeline processes your resume through multiple intelligence models.</p>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 32 }}>
            {[
              { icon: HiOutlineCloudUpload, step: '01', title: 'Upload Resume', desc: 'Drop your PDF. Our NLP engine extracts skills, experience, and contact data in seconds.', color: '#4f46e5' },
              { icon: HiOutlineChip, step: '02', title: 'AI Analysis', desc: 'Your profile runs through TF-IDF, Logistic Regression, Random Forest, and Neural Networks.', color: '#7c3aed' },
              { icon: HiOutlineMap, step: '03', title: 'Career Roadmap', desc: 'Receive predicted job matches, skill gap analysis, and a personalized learning path.', color: '#10b981' },
            ].map((s, i) => (
              <motion.div key={s.step} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 + i * 0.15 }}
                style={{ textAlign: 'center', position: 'relative' }}
              >
                <div style={{
                  width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `${s.color}10`, border: `2px solid ${s.color}30`, margin: '0 auto 20px', color: s.color
                }}>
                  <s.icon size={28} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 800, color: s.color, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Step {s.step}</span>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '8px 0 8px' }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.5 }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: 13, borderTop: '1px solid #e2e8f0' }}>
        <p style={{ marginBottom: 6 }}>M.E.R.I. P.A.R.O. — Machine-learning Engine for Resume Intelligence & Professional Advancement Readiness Oracle</p>
        <p style={{ color: '#cbd5e1', fontSize: 11 }}>
          Powered by TF-IDF · Logistic Regression · Random Forest · Neural Networks · SentenceTransformers
        </p>
      </footer>
    </div>
  )
}
