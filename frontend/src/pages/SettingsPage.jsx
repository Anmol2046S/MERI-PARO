import { useState } from 'react'
import { HiOutlineUser, HiOutlineSave, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi'
import { motion } from 'framer-motion'
import useAuthStore from '../store/authStore'
import api from '../api/axios'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { user, fetchProfile } = useAuthStore()
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
  })
  const [saving, setSaving] = useState(false)

  // Password change state
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [pwSaving, setPwSaving] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handlePwChange = (e) => setPwForm({ ...pwForm, [e.target.name]: e.target.value })

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/auth/profile', form)
      await fetchProfile()
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.message || 'Update failed')
    }
    setSaving(false)
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (pwForm.newPassword.length < 8) return toast.error('New password must be at least 8 characters')
    if (pwForm.newPassword !== pwForm.confirmPassword) return toast.error('New passwords do not match')
    setPwSaving(true)
    try {
      await api.put('/auth/password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword })
      toast.success('Password changed successfully!')
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err.message || 'Password change failed')
    }
    setPwSaving(false)
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
  const pwStrength = getPasswordStrength(pwForm.newPassword)

  return (
    <div>
      <div className="section-header animate-fade-in-up">
        <h1>Account Settings</h1>
        <p>Manage your profile and security</p>
      </div>

      <div style={{ maxWidth: 640 }}>
        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, #4f46e5, #0891b2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, fontWeight: 800, color: '#fff',
            }}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>{user?.firstName} {user?.lastName}</h3>
              <p style={{ fontSize: 14, color: '#64748b' }}>{user?.email}</p>
              <span className={`badge ${user?.role === 'admin' ? 'badge-warning' : 'badge-primary'}`} style={{ marginTop: 4 }}>
                {user?.role}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Edit Form */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card" style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
            <HiOutlineUser size={18} style={{ color: '#4f46e5' }} />
            Edit Profile
          </h3>
          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>First Name</label>
                <input name="firstName" value={form.firstName} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Last Name</label>
                <input name="lastName" value={form.lastName} onChange={handleChange} className="input-field" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="input-field" placeholder="+1 234 567 8900" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Location</label>
                <input name="location" value={form.location} onChange={handleChange} className="input-field" placeholder="City, Country" />
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Bio</label>
              <textarea name="bio" value={form.bio} onChange={handleChange} className="input-field" style={{ minHeight: 100, resize: 'vertical' }}
                placeholder="Tell us about yourself..." />
            </div>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : <><HiOutlineSave size={18} /> Save Changes</>}
            </button>
          </form>
        </motion.div>

        {/* Change Password */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card">
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
            <HiOutlineLockClosed size={18} style={{ color: '#4f46e5' }} />
            Change Password
          </h3>
          <form onSubmit={handlePasswordChange}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Current Password</label>
              <div style={{ position: 'relative' }}>
                <input name="currentPassword" type={showCurrent ? 'text' : 'password'} value={pwForm.currentPassword} onChange={handlePwChange}
                  className="input-field" style={{ paddingRight: 42 }} placeholder="Enter current password" required />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                  {showCurrent ? <HiOutlineEyeOff size={18} /> : <HiOutlineEye size={18} />}
                </button>
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>New Password</label>
              <div style={{ position: 'relative' }}>
                <input name="newPassword" type={showNew ? 'text' : 'password'} value={pwForm.newPassword} onChange={handlePwChange}
                  className="input-field" style={{ paddingRight: 42 }} placeholder="Min 8 characters" required minLength={8} />
                <button type="button" onClick={() => setShowNew(!showNew)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                  {showNew ? <HiOutlineEyeOff size={18} /> : <HiOutlineEye size={18} />}
                </button>
              </div>
              {pwForm.newPassword && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ height: 4, borderRadius: 2, background: '#e2e8f0', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pwStrength.width}%`, background: pwStrength.color, transition: 'all 0.3s ease', borderRadius: 2 }} />
                  </div>
                  <p style={{ fontSize: 12, color: pwStrength.color, fontWeight: 600, marginTop: 4 }}>{pwStrength.label}</p>
                </div>
              )}
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Confirm New Password</label>
              <input name="confirmPassword" type="password" value={pwForm.confirmPassword} onChange={handlePwChange}
                className="input-field" placeholder="Re-enter new password" required />
            </div>
            <button type="submit" className="btn-primary" disabled={pwSaving} style={{ background: '#0f172a' }}>
              {pwSaving ? <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : <><HiOutlineLockClosed size={18} /> Update Password</>}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
