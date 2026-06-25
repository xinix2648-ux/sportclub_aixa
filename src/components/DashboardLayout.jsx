import Header from './Header'
import Sidebar from './Sidebar'

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-bg">
      <Header />
      <Sidebar />
      <main style={{ marginLeft: 220, paddingTop: '76px', paddingLeft: '2rem', paddingRight: '2rem', paddingBottom: '2rem' }}>
        {children}
      </main>
    </div>
  )
}
