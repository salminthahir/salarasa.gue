import { createFileRoute, notFound } from '@tanstack/react-router'
import { getPublicInvitation } from '#/server/invitation-fns'
import { BlockRenderer } from '#/components/invitation/BlockRenderer'
import type { BlockEntry } from '#/components/invitation/BlockRenderer'

export const Route = createFileRoute('/$slug')({
  loader: async ({ params }) => {
    const data = await getPublicInvitation({ data: { slug: params.slug } })
    if (!data) throw notFound()
    return data
  },
  component: InvitationPage,
})

function InvitationPage() {
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
      {/* 
        TODO: Audio player (can be implemented later or via a simple fixed floating button) 
      */}
    </main>
  )
}
