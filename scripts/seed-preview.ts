import { config } from 'dotenv'
config({ path: ['.env.local', '.env'] })

import { db } from '../src/db/index.ts'
import { invitations, invitationBlocks, themes, user } from '../src/db/schema.ts'
import { defaultBlocksForNewInvitation } from '../src/lib/blocks/defaults.ts'
import type { BlockType } from '../src/db/schema.ts'
import { eq } from 'drizzle-orm'

async function seedPreview() {
  console.log('→ Mencari admin user & theme...')
  const admins = await db.select().from(user).limit(1)
  if (!admins.length) throw new Error('Harap jalankan npx tsx run-seed.ts dulu untuk membuat akun admin')
  const adminId = admins[0].id

  const themeList = await db.select().from(themes).where(eq(themes.slug, 'riqqa-pastel-garden'))
  if (!themeList.length) throw new Error('Tema riqqa belum di seed')
  const themeId = themeList[0].id

  const slug = 'anisa'
  const title = 'Anisa Birthday Party'

  console.log('→ Memeriksa apakah undangan anisa sudah ada...')
  const existing = await db.select().from(invitations).where(eq(invitations.slug, slug))
  
  if (existing.length > 0) {
    console.log('✓ Undangan preview sudah tersedia: http://localhost:3000/' + slug)
    process.exit(0)
  }

  console.log('→ Membuat undangan baru...')
  const id = crypto.randomUUID()
  await db.insert(invitations).values({
    id,
    userId: adminId,
    title,
    slug,
    eventType: 'birthday',
    themeId,
    status: 'published' // Langsung publish agar bisa dilihat publik
  })

  console.log('→ Memasang blok-blok tema Riqqa...')
  const blocks = defaultBlocksForNewInvitation()
  for (const b of blocks) {
    await db.insert(invitationBlocks).values({
      invitationId: id,
      blockType: b.blockType as BlockType,
      config: b.config,
      orderIndex: b.orderIndex,
      isActive: b.isActive,
    })
  }

  console.log('🎉 Undangan preview berhasil dibuat!')
  console.log('----------------------------------------------------')
  console.log('🌐 Buka link ini di browsermu sekarang:')
  console.log(`➡️  http://localhost:3000/${slug}?to=Tamu%20Spesial`)
  console.log('----------------------------------------------------')
  
  process.exit(0)
}

seedPreview().catch((e) => {
  console.error(e)
  process.exit(1)
})