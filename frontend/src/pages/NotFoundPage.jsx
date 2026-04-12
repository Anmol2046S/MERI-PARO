import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiOutlineExclamation } from 'react-icons/hi'

export default function NotFoundPage() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: '#f8fafc', padding: 32, textAlign: 'center', position: 'relative', overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: -100, right: '15%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(79, 70, 229, 0.06), transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }} />

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} style={{ zIndex: 1 }}>
        <div style={{
          width: 100, height: 100, borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 32px', color: '#dc2626'
        }}>
          <HiOutlineExclamation size={48} />
        </div>

        <h1 style={{ fontSize: 96, fontWeight: 900, lineHeight: 1, marginBottom: 8 }}>
          <span className="gradient-text">404</span>
        </h1>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>Page Not Found</h2>
        <p style={{ fontSize: 16, color: '#64748b', marginBottom: 40, maxWidth: 400, lineHeight: 1.5 }}>
          Paro searched everywhere — under the database tables, behind the API routes, inside the neural networks — but this page doesn't exist.
        </p>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <Link to="/dashboard" className="btn-primary" style={{ padding: '12px 32px', fontSize: 15 }}>Go to Dashboard</Link>
          <Link to="/" className="btn-secondary" style={{ padding: '12px 32px', fontSize: 15 }}>Back to Home</Link>
        </div>
      </motion.div>
    </div>
  )
}
