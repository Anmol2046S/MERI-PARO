import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const { register, loading, error, clearError } = useAuthStore()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    const result = await register(form)
    if (result.success) {
      toast.success('Account created!')
      navigate('/dashboard')
    } else {
      toast.error(result.error || 'Registration failed')
    }
  }

  // Password strength calculator
  const getPasswordStrength = (pw) => {
    if (!pw) return { label: '', color: 'transparent', width: 0 }
    let score = 0
    if (pw.length >= 8) score++
    if (pw.length >= 12) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[0-9]/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    if (score <= 1) return { label: 'Weak', color: '#ef4444', width: 20 }
    if (score <= 2) return { label: 'Fair', color: '#f97316', width: 40 }
    if (score <= 3) return { label: 'Good', color: '#eab308', width: 60 }
    if (score <= 4) return { label: 'Strong', color: '#22c55e', width: 80 }
    return { label: 'Excellent', color: '#10b981', width: 100 }
  }
  const pwStrength = getPasswordStrength(form.password)

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#f8fafc', padding: 20, overflow: 'hidden', position: 'relative'
    }}>
      <div style={{ position: 'absolute', top: '10%', right: '20%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(79, 70, 229, 0.08), transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }} />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 8, letterSpacing: '-0.03em' }}>
            <span className="gradient-text">MERI PARO</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: 14, letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 600 }}>
            Join the future of careers
          </p>
        </div>

        <div className="glass-card" style={{ padding: 40 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: '#0f172a' }}>Create Account</h2>
          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 28 }}>Start your AI-powered career journey</p>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>First Name</label>
                <input id="reg-firstname" name="firstName" value={form.firstName} onChange={handleChange} className="input-field" placeholder="John" required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Last Name</label>
                <input id="reg-lastname" name="lastName" value={form.lastName} onChange={handleChange} className="input-field" placeholder="Doe" required />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <HiOutlineMail size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input id="reg-email" name="email" type="email" value={form.email} onChange={handleChange} className="input-field" style={{ paddingLeft: 42 }} placeholder="you@example.com" required />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <HiOutlineLockClosed size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input id="reg-password" name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} className="input-field" style={{ paddingLeft: 42, paddingRight: 42 }} placeholder="Min 8 characters" required minLength={8} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                  {showPassword ? <HiOutlineEyeOff size={18} /> : <HiOutlineEye size={18} />}
                </button>
              </div>
              {form.password && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ height: 4, borderRadius: 2, background: '#e2e8f0', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pwStrength.width}%`, background: pwStrength.color, transition: 'all 0.3s ease', borderRadius: 2 }} />
                  </div>
                  <p style={{ fontSize: 12, color: pwStrength.color, fontWeight: 600, marginTop: 4 }}>{pwStrength.label}</p>
                </div>
              )}
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input id="reg-confirm" name="confirmPassword" type={showConfirm ? 'text' : 'password'} value={form.confirmPassword} onChange={handleChange} className="input-field" style={{ paddingRight: 42 }} placeholder="Repeat your password" required />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                  {showConfirm ? <HiOutlineEyeOff size={18} /> : <HiOutlineEye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ padding: '10px 14px', borderRadius: 10, marginBottom: 24, background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', fontSize: 13, fontWeight: 500 }}>
                {error}
              </div>
            )}

            <button id="reg-submit" type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '12px 24px', fontSize: 15 }}>
              {loading ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#64748b' }}>
            Already have an account? <Link to="/login" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
