import { NavLink, useNavigate } from 'react-router-dom'
import { HiOutlineHome, HiOutlineDocument, HiOutlineLightBulb, HiOutlineChartBar, HiOutlineCog, HiOutlineLogout, HiOutlineAcademicCap, HiOutlineBriefcase, HiOutlineClock, HiOutlineShieldCheck, HiOutlineSparkles } from 'react-icons/hi'
import useAuthStore from '../../store/authStore'

const navItems = [
  { path: '/dashboard', icon: HiOutlineHome, label: 'Dashboard' },
  { path: '/resume', icon: HiOutlineDocument, label: 'Resume' },
  { path: '/predictions', icon: HiOutlineLightBulb, label: 'Predictions' },
  { path: '/skills', icon: HiOutlineAcademicCap, label: 'Skills' },
  { path: '/job-match', icon: HiOutlineBriefcase, label: 'Job Match' },
  { path: '/recommendations', icon: HiOutlineChartBar, label: 'Recommendations' },
  { path: '/deep-insights', icon: HiOutlineSparkles, label: 'Deep Insights' },
  { path: '/history', icon: HiOutlineClock, label: 'History' },
  { path: '/settings', icon: HiOutlineCog, label: 'Settings' },
]

export default function Sidebar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside style={{
      width: 260,
      minHeight: '100vh',
      background: 'rgba(15, 23, 42, 0.95)',
      borderRight: '1px solid rgba(99,102,241,0.1)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(99,102,241,0.1)' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>
          <span className="gradient-text">MERI PARO</span>
        </h1>
        <p style={{ fontSize: 11, color: '#64748b', marginTop: 4, letterSpacing: '1px', textTransform: 'uppercase' }}>
          AI Career Intelligence
        </p>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 14px',
              borderRadius: 10,
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? '#a5b4fc' : '#94a3b8',
              background: isActive ? 'rgba(99,102,241,0.12)' : 'transparent',
              transition: 'all 0.2s ease',
            })}
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}

        {user?.role === 'admin' && (
          <NavLink
            to="/admin"
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 14px',
              borderRadius: 10,
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? '#fcd34d' : '#94a3b8',
              background: isActive ? 'rgba(245,158,11,0.12)' : 'transparent',
              transition: 'all 0.2s ease',
            })}
          >
            <HiOutlineShieldCheck size={18} />
            Admin Panel
          </NavLink>
        )}
      </nav>

      {/* User Section */}
      <div style={{ padding: '16px 16px', borderTop: '1px solid rgba(99,102,241,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: '#fff',
          }}>
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>
              {user?.firstName} {user?.lastName}
            </p>
            <p style={{ fontSize: 11, color: '#64748b' }}>{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', gap: 8, width: '100%',
          padding: '8px 14px', borderRadius: 8, border: 'none',
          background: 'rgba(239,68,68,0.1)', color: '#fca5a5',
          fontSize: 13, cursor: 'pointer', transition: 'all 0.2s',
        }}>
          <HiOutlineLogout size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
