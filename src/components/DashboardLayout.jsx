import Header from './Header'
import Sidebar from './Sidebar'

export default function DashboardLayout({ children, role }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Header />
      <Sidebar />
      <main style={{ marginLeft: 220, paddingTop: '76px', paddingLeft: '2rem', paddingRight: '2rem', paddingBottom: '2rem' }}>
        {children}
      </main>
    </div>
  )
}
