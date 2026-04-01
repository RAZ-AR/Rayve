import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getBusinessByUserId } from '@/lib/db/businesses'
import { AppSidebar } from './AppSidebar'
import { AppHeader } from './AppHeader'
import { MobileNav } from './MobileNav'

export async function AppShell({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const business = await getBusinessByUserId(user.id).catch(() => null)

  return (
    <div className="flex h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <AppSidebar />
      </div>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header row — mobile nav + AppHeader */}
        <div className="flex items-center" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center px-4 lg:hidden">
            <MobileNav />
          </div>
          <div className="flex-1">
            <AppHeader
              userEmail={user.email ?? null}
              businessType={business?.business_type ?? null}
              businessName={business?.name ?? null}
            />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
