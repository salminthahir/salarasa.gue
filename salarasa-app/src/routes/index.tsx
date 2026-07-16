import { createFileRoute, notFound, redirect } from '@tanstack/react-router'
import { getPublicInvitation } from '#/server/invitation-fns'
import { BlockRenderer } from '#/components/invitation/BlockRenderer'
import type { BlockEntry } from '#/components/invitation/BlockRenderer'
import { createServerFn } from '@tanstack/react-start'
import { getRequestHost } from '@tanstack/react-start/server'
import { env } from '#/env'

const checkHostAndFetch = createServerFn({ method: 'GET' })
  .validator((d: { slugFallback?: string }) => d)
  .handler(async ({ data }) => {
    let host = getRequestHost() || 'localhost:3000'
    const baseDomain = env.APP_BASE_DOMAIN || 'localhost:3000'

    // Jika ini base domain, redirect
    if (host === baseDomain || host.startsWith('www.')) {
      return { type: 'redirect' as const }
    }

    // Jika ini subdomain, extract slug
    const slug = host.replace(`.${baseDomain}`, '')
    if (!slug || slug === host) {
      return { type: 'redirect' as const }
    }

    // Fetch undangan by subdomain slug
    const invData = await getPublicInvitation({ data: { slug } })
    if (!invData) return { type: 'not_found' as const }

    return { type: 'ok' as const, data: invData }
  })

export const Route = createFileRoute('/')({
  loader: async () => {
    // Jalankan server function untuk mendapatkan data aman dari host header
    const res = await checkHostAndFetch({ data: {} })
    if (res.type === 'redirect') {
      throw redirect({ to: '/dashboard' })
    }
    if (res.type === 'not_found') {
      throw notFound()
    }
    return res.data
  },
  component: InvitationIndexPage,
})

function InvitationIndexPage() {
  const { invitation, theme, blocks } = Route.useLoaderData()
  const search = Route.useSearch() as Record<string, string | undefined>
  const guestName = search.to

  return (
    <main className="invitation-root">
      <BlockRenderer
        invitationId={invitation.id}
        blocks={blocks as any}
        theme={theme!.styleConfig as any}
        guestName={guestName}
      />
    </main>
  )
}