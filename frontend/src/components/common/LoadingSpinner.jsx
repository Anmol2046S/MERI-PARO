export default function LoadingSpinner({ size = 40, text = 'Loading...' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      gap: 16,
    }}>
      <div className="spinner" style={{ width: size, height: size }} />
      {text && <p style={{ color: '#94a3b8', fontSize: 14 }}>{text}</p>}
    </div>
  )
}
