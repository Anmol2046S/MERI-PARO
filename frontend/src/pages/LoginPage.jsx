import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login, loading, error, clearError } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    const result = await login(email, password)
    if (result.success) {
      toast.success('Welcome back!')
      navigate('/dashboard')
    } else {
      toast.error(result.error || 'Login failed')
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#f8fafc', padding: 20, overflow: 'hidden', position: 'relative'
    }}>
      {/* Background decoration */}
      <div style={{ position: 'absolute', top: -100, right: '10%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(79, 70, 229, 0.08), transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', bottom: -100, left: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08), transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }} />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 8, letterSpacing: '-0.03em' }}>
            <span className="gradient-text">MERI PARO</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: 14, letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 600 }}>
            AI Career Intelligence
          </p>
        </div>

        <div className="glass-card" style={{ padding: 40 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: '#0f172a' }}>Welcome Back</h2>
          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 32 }}>Sign in to your account to continue</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <HiOutlineMail size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" style={{ paddingLeft: 42 }} placeholder="you@example.com" required />
              </div>
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <HiOutlineLockClosed size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input id="login-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" style={{ paddingLeft: 42, paddingRight: 42 }} placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                  {showPassword ? <HiOutlineEyeOff size={18} /> : <HiOutlineEye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ padding: '10px 14px', borderRadius: 10, marginBottom: 24, background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', fontSize: 13, fontWeight: 500 }}>
                {error}
              </div>
            )}

            <button id="login-submit" type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '12px 24px', fontSize: 15 }}>
              {loading ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#64748b' }}>
            <Link to="/login" onClick={(e) => { e.preventDefault(); toast('Password reset coming soon! Contact admin@meriparo.com', { icon: '📧' }); }} style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 600 }}>Forgot Password?</Link>
          </p>
          <p style={{ textAlign: 'center', marginTop: 12, fontSize: 14, color: '#64748b' }}>
            Don't have an account? <Link to="/register" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 600 }}>Create Account</Link>
          </p>
        </div>

        <div style={{ marginTop: 24, padding: 20, borderRadius: 16, background: 'rgba(255, 255, 255, 0.5)', border: '1px solid rgba(79, 70, 229, 0.1)', textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: '#64748b', marginBottom: 8, fontWeight: 500 }}>Demo Credentials (click to fill)</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <button onClick={() => { setEmail('admin@meriparo.com'); setPassword('Admin@123456'); }} className="btn-ghost" style={{ justifyContent: 'center', fontSize: 12, background: '#fff' }}>Admin</button>
            <button onClick={() => { setEmail('user@meriparo.com'); setPassword('User@123456'); }} className="btn-ghost" style={{ justifyContent: 'center', fontSize: 12, background: '#fff' }}>User</button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
