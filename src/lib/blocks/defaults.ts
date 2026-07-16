import type { BlockType } from '#/db/schema'

import {
  splashCoverConfigSchema,
  heroConfigSchema,
  subjectBiodataConfigSchema,
  countdownEventConfigSchema,
  dresscodeConfigSchema,
  giftConfigSchema,
  rsvpConfigSchema,
  guestbookConfigSchema,
  thankYouConfigSchema,
  footerConfigSchema,
} from './types'

// Default block config factory — used when creating a new invitation.
// Order follows Riqqa replica structure.
export const DEFAULT_BLOCKS: Array<{
  blockType: BlockType
  config: Record<string, any>
}> = [
  {
    blockType: 'splash_cover',
    config: splashCoverConfigSchema.parse({}),
  },
  {
    blockType: 'hero',
    config: heroConfigSchema.parse({
      title: 'Hi Ladies/Gentlemen !',
      subtitle: "U're invited to {age}th sweetie pie intimate birthday parties",
    }),
  },
  {
    blockType: 'subject_biodata',
    config: subjectBiodataConfigSchema.parse({
      fullName: '',
      parentsLine: 'Putri dari Bapak ... & Ibu ...',
    }),
  },
  {
    blockType: 'countdown_event',
    config: countdownEventConfigSchema.parse({
      eventDateTime: '2026-07-19T16:00:00+08:00',
      eventTitle: 'Birthday Party',
      eventDateText: 'Sunday,\n19 July 2026',
      eventTime: '16.00 WITA - Selesai',
      venueName: 'Villa Ria',
      address: 'Jl. Stikip Kie Raha, Sasa, Kec. Ternate Sel., Kota Ternate, Maluku Utara, Indonesia',
      mapsUrl: 'https://maps.app.goo.gl/jomf4LSxwA8GJmvt8',
      calendarTitle: 'Birthday Party of Riqqa',
      calendarStartIso: '20260719T080000Z',
      calendarEndIso: '20260719T120000Z',
    }),
  },
  {
    blockType: 'dresscode',
    config: dresscodeConfigSchema.parse({
      text: 'Semi Formal White / Beige',
    }),
  },
  {
    blockType: 'gift',
    config: giftConfigSchema.parse({}),
  },
  {
    blockType: 'rsvp',
    config: rsvpConfigSchema.parse({}),
  },
  {
    blockType: 'guestbook',
    config: guestbookConfigSchema.parse({}),
  },
  {
    blockType: 'thank_you',
    config: thankYouConfigSchema.parse({}),
  },
  {
    blockType: 'footer',
    config: footerConfigSchema.parse({
      makerText: 'MADE BY',
      makerName: 'Salarasa',
      whatsappNumber: '',
      instagramHandle: '',
    }),
  },
]

export function defaultBlocksForNewInvitation() {
  return DEFAULT_BLOCKS.map((b, idx) => ({
    blockType: b.blockType,
    config: b.config,
    orderIndex: idx,
    isActive: true,
  }))
}
