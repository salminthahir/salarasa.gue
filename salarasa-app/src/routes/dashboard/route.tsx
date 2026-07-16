import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
} from '@tanstack/react-router'
import { authMiddleware } from '#/server/auth-middleware'
import { createServerFn } from '@tanstack/react-start'
import { signOut } from '#/lib/auth-client'

const checkAuth = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    if (!context.user) throw new Error('Unauthorized')
    return context.user
  })

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    try {
      await checkAuth()
    } catch {
      throw redirect({ to: '/login' })
    }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b h-14 flex items-center justify-between px-6 shrink-0">
        <div className="font-bold tracking-tight">Salarasa Dashboard</div>
        <div className="flex items-center gap-4">
          <button
            onClick={async () => {
              await signOut()
              navigate({ to: '/login' })
            }}
            className="text-sm font-medium text-gray-600 hover:text-black"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="flex-1 max-w-6xl w-full mx-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}
