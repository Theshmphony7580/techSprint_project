import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'

export default function MainLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-background text-foreground">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">
            
            {/* LOGO */}
            <Link to="/" className="text-xl font-bold text-primary">
              GovTransparency
            </Link>

            {/* NAV */}
            <nav className="flex items-center gap-4">
              <Link
                to="/projects"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition"
              >
                Public Projects
              </Link>

              {user?.role === 'GOV_EMPLOYEE' && (
                <Button asChild variant="ghost" size="sm">
                  <Link to="/dashboard">My Dashboard</Link>
                </Button>
              )}

              {user?.role === 'ADMIN' && (
                <Button asChild variant="ghost" size="sm" className="text-purple-600">
                  <Link to="/admin">Admin Panel</Link>
                </Button>
              )}

              {/* AUTH SECTION */}
              {user ? (
                <div className="flex items-center gap-3 pl-4 ml-2 border-l">
                  <div className="text-right leading-tight">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.role.replace('_', ' ')}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={logout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <Button asChild size="sm">
                  <Link to="/login">Login</Link>
                </Button>
              )}
            </nav>

          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        © 2026 Government Project Transparency Platform
      </footer>
    </div>
  )
}
