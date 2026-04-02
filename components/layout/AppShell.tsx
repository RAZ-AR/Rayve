import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppSidebar } from './AppSidebar'
import { MobileNav } from './MobileNav'

export async function AppShell({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-muted)' }}>
      {/* Desktop sidebar — 64px dark */}
      <div className="hidden lg:flex lg:shrink-0">
        <AppSidebar />
      </div>

      {/* Mobile top bar */}
      <div
        className="fixed inset-x-0 top-0 z-40 flex h-12 items-center px-4 lg:hidden"
        style={{ background: 'var(--sidebar-bg)', borderBottom: '1px solid var(--sidebar-border)' }}
      >
        <MobileNav />
      </div>

      {/* Main content */}
      <main className="flex flex-1 flex-col overflow-hidden pt-12 lg:pt-0">
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
