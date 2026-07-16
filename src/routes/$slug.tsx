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
  head: ({ loaderData }) => {
    const inv = loaderData
    const heroBlock = inv?.blocks?.find(
      (b: any) => b.blockType === 'hero',
    )
    const biodataBlock = inv?.blocks?.find(
      (b: any) => b.blockType === 'subject_biodata',
    )
    const countdownBlock = inv?.blocks?.find(
      (b: any) => b.blockType === 'countdown_event',
    )

    const name =
      biodataBlock?.config?.fullName || inv?.invitation?.title || 'Salarasa'
    const subtitle = heroBlock?.config?.subtitle || ''
    const venue = countdownBlock?.config?.venueName || ''
    const desc = [subtitle, venue].filter(Boolean).join(' — ')
    const url = `https://www.salarasa.my.id/${inv?.invitation?.slug || ''}`

    return {
      meta: [
        { title: `${name} — Salarasa Invitation` },
        { name: 'description', content: desc },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Salarasa' },
        { property: 'og:title', content: `${name} — Salarasa Invitation` },
        { property: 'og:description', content: desc },
        {
          property: 'og:image',
          content: 'https://www.salarasa.my.id/logo512.png',
        },
        { property: 'og:url', content: url },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: `${name} — Salarasa Invitation` },
        { name: 'twitter:description', content: desc },
        {
          name: 'twitter:image',
          content: 'https://www.salarasa.my.id/logo512.png',
        },
      ],
    }
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
