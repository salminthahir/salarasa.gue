import type { ThemeStyleConfig } from '#/lib/blocks/types'
import type { BlockType } from '#/db/schema'

import { SplashCoverBlock } from '#/components/blocks/SplashCover'
import { HeroBlock } from '#/components/blocks/Hero'
import { SubjectBiodataBlock } from '#/components/blocks/SubjectBiodata'
import { CountdownEventBlock } from '#/components/blocks/CountdownEvent'
import { DresscodeBlock } from '#/components/blocks/Dresscode'
import { GiftBlock } from '#/components/blocks/Gift'
import { RsvpBlock } from '#/components/blocks/Rsvp'
import { GuestbookBlock } from '#/components/blocks/Guestbook'
import { ThankYouBlock } from '#/components/blocks/ThankYou'
import { FooterBlock } from '#/components/blocks/Footer'

export type BlockEntry = {
  id: number
  blockType: BlockType
  config: Record<string, any>
  orderIndex: number
}

export function BlockRenderer({
  blocks,
  theme,
  guestName,
  invitationId,
}: {
  blocks: BlockEntry[]
  theme: ThemeStyleConfig
  guestName?: string
  invitationId: string
}) {
  return (
    <>
      {blocks.map((b) => {
        const props = { theme, guestName, invitationId }
        switch (b.blockType) {
          case 'splash_cover':
            return (
              <SplashCoverBlock
                key={b.id}
                {...props}
                config={b.config as any}
              />
            )
          case 'hero':
            return <HeroBlock key={b.id} {...props} config={b.config as any} />
          case 'subject_biodata':
            return (
              <SubjectBiodataBlock
                key={b.id}
                {...props}
                config={b.config as any}
              />
            )
          case 'countdown_event':
            return (
              <CountdownEventBlock
                key={b.id}
                {...props}
                config={b.config as any}
              />
            )
          case 'dresscode':
            return (
              <DresscodeBlock key={b.id} {...props} config={b.config as any} />
            )
          case 'gift':
            return <GiftBlock key={b.id} {...props} config={b.config as any} />
          case 'rsvp':
            return <RsvpBlock key={b.id} {...props} config={b.config as any} />
          case 'guestbook':
            return (
              <GuestbookBlock key={b.id} {...props} config={b.config as any} />
            )
          case 'thank_you':
            return (
              <ThankYouBlock key={b.id} {...props} config={b.config as any} />
            )
          case 'footer':
            return (
              <FooterBlock key={b.id} {...props} config={b.config as any} />
            )
          default:
            return null
        }
      })}
    </>
  )
}
