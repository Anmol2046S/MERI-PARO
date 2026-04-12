import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main className="page-container" style={{ flex: 1, width: '100%', boxSizing: 'border-box' }}>
        <Outlet />
      </main>
      <footer style={{
        padding: '24px 32px', textAlign: 'center', borderTop: '1px solid #e2e8f0',
        background: '#fafbfc', color: '#94a3b8', fontSize: 12
      }}>
        <p style={{ marginBottom: 6 }}>M.E.R.I. P.A.R.O. — Machine-learning Engine for Resume Intelligence & Professional Advancement Readiness Oracle</p>
        <p style={{ color: '#cbd5e1', fontSize: 11 }}>
          Powered by TF-IDF · Logistic Regression · Random Forest · Neural Networks · SentenceTransformers · FastAPI · React
        </p>
      </footer>
    </div>
  )
}
