import { NavLink, useNavigate } from 'react-router-dom'
import { HiOutlineLogout, HiOutlineShieldCheck, HiOutlineUser, HiOutlineMenu, HiOutlineX } from 'react-icons/hi'
import useAuthStore from '../../store/authStore'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/resume', label: 'Resume' },
  { path: '/predictions', label: 'Predictions' },
  { path: '/skills', label: 'Skills Gap' },
  { path: '/job-match', label: 'Job Match' },
  { path: '/recommendations', label: 'Growth' },
  { path: '/history', label: 'History' },
]

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownOpen])

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      logout()
      navigate('/login')
    }
  }

  return (
    <nav style={{
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid #e2e8f0',
      position: 'sticky', top: 0, zIndex: 50,
      padding: '0 32px'
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', height: 72 }}>
        {/* Logo */}
        <NavLink to="/" style={{ textDecoration: 'none', marginRight: 48 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>
            <span className="gradient-text">MERI PARO</span>
          </h1>
        </NavLink>

        {/* Desktop Links */}
        <div style={{ display: 'flex', gap: 24, flex: 1 }} className="nav-desktop-links">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#0f172a' : '#64748b',
                padding: '24px 0',
                borderBottom: isActive ? '2px solid #4f46e5' : '2px solid transparent',
                transition: 'color 0.2s',
                marginBottom: '-1px'
              })}
            >
              {item.label}
            </NavLink>
          ))}
          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              style={({ isActive }) => ({
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#b45309' : '#64748b',
                padding: '24px 0',
                borderBottom: isActive ? '2px solid #d97706' : '2px solid transparent',
                display: 'flex', alignItems: 'center', gap: 6,
                marginBottom: '-1px'
              })}
            >
              <HiOutlineShieldCheck size={16} /> Admin
            </NavLink>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="nav-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none', background: 'none', border: 'none',
            cursor: 'pointer', color: '#0f172a', padding: 8, marginLeft: 'auto'
          }}
        >
          {mobileMenuOpen ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
        </button>

        {/* User Dropdown */}
        <div style={{ position: 'relative', marginLeft: 16 }} ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{ 
              background: 'none', border: 'none', cursor: 'pointer', 
              display: 'flex', alignItems: 'center', gap: 12 
            }}
          >
            <div style={{ textAlign: 'right' }} className="nav-user-info">
              <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: 0 }}>{user?.firstName} {user?.lastName}</p>
              <p style={{ fontSize: 11, color: '#64748b', margin: 0, textTransform: 'capitalize' }}>{user?.role}</p>
            </div>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'linear-gradient(135deg, #4f46e5, #818cf8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 15, fontWeight: 700
            }}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: 12,
                  background: '#fff', borderRadius: 12, width: 220,
                  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.1)',
                  border: '1px solid #e2e8f0', padding: 8, zIndex: 60
                }}
              >
                <div style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9', marginBottom: 8 }}>
                  <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>Signed in as</p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>{user?.email}</p>
                </div>
                
                <button
                  onClick={() => { setDropdownOpen(false); navigate('/settings'); }}
                  className="btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', color: '#0f172a', marginBottom: 4 }}
                >
                  <HiOutlineUser size={16} /> Account Details
                </button>
                <button
                  onClick={handleLogout}
                  className="btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', color: '#dc2626' }}
                >
                  <HiOutlineLogout size={16} /> Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden', borderTop: '1px solid #e2e8f0' }}
            className="nav-mobile-menu"
          >
            <div style={{ padding: '12px 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {navItems.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  style={({ isActive }) => ({
                    textDecoration: 'none',
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#4f46e5' : '#64748b',
                    padding: '10px 16px',
                    borderRadius: 8,
                    background: isActive ? '#eef2ff' : 'transparent',
                  })}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
