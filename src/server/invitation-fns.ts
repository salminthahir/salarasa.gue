import { createServerFn } from '@tanstack/react-start'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

import { db } from '#/db'
import {
  invitations,
  invitationBlocks,
  themes,
  greetings,
  rsvpResponses,
} from '#/db/schema'
import { authMiddleware } from '#/server/auth-middleware'
import { defaultBlocksForNewInvitation } from '#/lib/blocks/defaults'
import type { BlockType } from '#/db/schema'

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ----------------------------------------------------------------------------
// List invitations for the authenticated user
// ----------------------------------------------------------------------------

export const listInvitations = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    if (!context.user) throw new Error('Unauthorized')
    const rows = await db
      .select({
        id: invitations.id,
        title: invitations.title,
        slug: invitations.slug,
        status: invitations.status,
        eventType: invitations.eventType,
        eventDate: invitations.eventDate,
        createdAt: invitations.createdAt,
        themeName: themes.name,
      })
      .from(invitations)
      .leftJoin(themes, eq(invitations.themeId, themes.id))
      .where(eq(invitations.userId, context.user.id))
      .orderBy(invitations.createdAt)
    return rows
  })

// ----------------------------------------------------------------------------
// Get a single invitation with its blocks
// ----------------------------------------------------------------------------

export const getInvitation = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ context, data }) => {
    if (!context.user) throw new Error('Unauthorized')
    const inv = await db
      .select()
      .from(invitations)
      .where(
        and(
          eq(invitations.id, data.id),
          eq(invitations.userId, context.user.id),
        ),
      )
      .limit(1)
    if (inv.length === 0) throw new Error('Not found')

    const blocks = await db
      .select()
      .from(invitationBlocks)
      .where(eq(invitationBlocks.invitationId, data.id))
      .orderBy(invitationBlocks.orderIndex)

    return { invitation: inv[0], blocks }
  })

// ----------------------------------------------------------------------------
// Create a new invitation (auto-seeds default Riqqa blocks)
// ----------------------------------------------------------------------------

export const createInvitation = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(
    z.object({
      title: z.string().min(1).max(200),
      slug: z.string().min(1).max(120).optional(),
      themeSlug: z.string().optional(),
    }),
  )
  .handler(async ({ context, data }) => {
    if (!context.user) throw new Error('Unauthorized')

    const theme = await db
      .select()
      .from(themes)
      .where(eq(themes.slug, data.themeSlug ?? 'riqqa-pastel-garden'))
      .limit(1)
    if (theme.length === 0) throw new Error('Theme not found')

    const slug = slugify(data.slug ?? data.title)
    const id = crypto.randomUUID()
    await db.insert(invitations).values({
      id,
      userId: context.user.id,
      title: data.title,
      slug,
      eventType: 'birthday',
      themeId: theme[0].id,
      status: 'draft',
    })

    const blocks = defaultBlocksForNewInvitation()
    for (const b of blocks) {
      await db.insert(invitationBlocks).values({
        invitationId: id,
        blockType: b.blockType,
        config: b.config,
        orderIndex: b.orderIndex,
        isActive: b.isActive,
      })
    }

    return { id, slug }
  })

// ----------------------------------------------------------------------------
// Update invitation meta (title, slug, status, eventDate)
// ----------------------------------------------------------------------------

export const updateInvitationMeta = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(
    z.object({
      id: z.string(),
      title: z.string().min(1).max(200).optional(),
      slug: z.string().min(1).max(120).optional(),
      status: z.enum(['draft', 'published', 'archived']).optional(),
      eventDate: z.string().optional().nullable(),
    }),
  )
  .handler(async ({ context, data }) => {
    if (!context.user) throw new Error('Unauthorized')

    const updates: Record<string, unknown> = { updatedAt: new Date() }
    if (data.title !== undefined) updates.title = data.title
    if (data.slug !== undefined) updates.slug = slugify(data.slug)
    if (data.status !== undefined) updates.status = data.status
    if (data.eventDate !== undefined)
      updates.eventDate = data.eventDate ? new Date(data.eventDate) : null

    const result = await db
      .update(invitations)
      .set(updates)
      .where(
        and(
          eq(invitations.id, data.id),
          eq(invitations.userId, context.user.id),
        ),
      )
      .returning({ id: invitations.id })

    if (result.length === 0) throw new Error('Not found')
    return { ok: true }
  })

// ----------------------------------------------------------------------------
// Update a block's config / order / isActive
// ----------------------------------------------------------------------------

export const updateBlock = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(
    z.object({
      blockId: z.number(),
      invitationId: z.string(),
      config: z.record(z.string(), z.unknown()).optional(),
      orderIndex: z.number().optional(),
      isActive: z.boolean().optional(),
    }),
  )
  .handler(async ({ context, data }) => {
    if (!context.user) throw new Error('Unauthorized')

    // Ownership check
    const inv = await db
      .select({ id: invitations.id })
      .from(invitations)
      .where(
        and(
          eq(invitations.id, data.invitationId),
          eq(invitations.userId, context.user.id),
        ),
      )
      .limit(1)
    if (inv.length === 0) throw new Error('Not found')

    const updates: Record<string, unknown> = { updatedAt: new Date() }
    if (data.config !== undefined) updates.config = data.config
    if (data.orderIndex !== undefined) updates.orderIndex = data.orderIndex
    if (data.isActive !== undefined) updates.isActive = data.isActive

    await db
      .update(invitationBlocks)
      .set(updates)
      .where(eq(invitationBlocks.id, data.blockId))
    return { ok: true }
  })

// ----------------------------------------------------------------------------
// Delete an invitation (cascade deletes blocks, greetings, rsvp)
// ----------------------------------------------------------------------------

export const deleteInvitation = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ context, data }) => {
    if (!context.user) throw new Error('Unauthorized')
    await db
      .delete(invitations)
      .where(
        and(
          eq(invitations.id, data.id),
          eq(invitations.userId, context.user.id),
        ),
      )
    return { ok: true }
  })

// ----------------------------------------------------------------------------
// Public (no auth) — render invitation by slug
// ----------------------------------------------------------------------------

export const getPublicInvitation = createServerFn({ method: 'GET' })
  .validator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    let inv
    try {
      inv = await db
        .select()
        .from(invitations)
        .where(eq(invitations.slug, data.slug))
        .limit(1)
    } catch (e) {
      const any = e as any
      const parts = [any?.name, any?.message, any?.code, any?.detail, any?.cause?.message]
      throw new Error(`DB err: ${JSON.stringify(parts.filter(Boolean))}`)
    }
    if (inv.length === 0 || inv[0].status !== 'published') {
      return null
    }
    const invitation = inv[0]

    const theme = invitation.themeId
      ? (
          await db
            .select()
            .from(themes)
            .where(eq(themes.id, invitation.themeId))
            .limit(1)
        )[0]
      : null

    const blocks = await db
      .select()
      .from(invitationBlocks)
      .where(eq(invitationBlocks.invitationId, invitation.id))
      .orderBy(invitationBlocks.orderIndex)

    return {
      invitation,
      theme: theme ?? null,
      blocks: blocks.filter((b) => b.isActive),
    }
  })

// ----------------------------------------------------------------------------
// Guestbook — submit a greeting (public)
// ----------------------------------------------------------------------------

export const submitGreeting = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      invitationId: z.string(),
      name: z.string().min(1).max(100),
      message: z.string().min(2).max(2000),
      attendance: z.enum(['hadir', 'absen', 'ragu']).optional(),
    }),
  )
  .handler(async ({ data }) => {
    const inserted = await db
      .insert(greetings)
      .values({
        invitationId: data.invitationId,
        name: data.name,
        message: data.message,
        attendance: data.attendance,
        isPublic: true,
      })
      .returning({ id: greetings.id, createdAt: greetings.createdAt })
    return inserted[0]
  })

export const listGreetings = createServerFn({ method: 'GET' })
  .validator(
    z.object({
      invitationId: z.string(),
      page: z.number().min(1).default(1),
      perPage: z.number().min(1).max(100).default(10),
    }),
  )
  .handler(async ({ data }) => {
    const offset = (data.page - 1) * data.perPage
    const rows = await db
      .select({
        id: greetings.id,
        name: greetings.name,
        message: greetings.message,
        attendance: greetings.attendance,
        createdAt: greetings.createdAt,
      })
      .from(greetings)
      .where(eq(greetings.invitationId, data.invitationId))
      .orderBy(greetings.createdAt)
      .limit(data.perPage)
      .offset(offset)

    const totalRow = await db
      .select({ count: greetings.id })
      .from(greetings)
      .where(eq(greetings.invitationId, data.invitationId))

    return { rows, total: totalRow.length }
  })

export const deleteGreeting = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.number(), invitationId: z.string() }))
  .handler(async ({ data, context }) => {
    if (!context.user) throw new Error('Unauthorized')
    
    // Verifikasi kepemilikan undangan
    const inv = await db.query.invitations.findFirst({
      where: and(eq(invitations.id, data.invitationId), eq(invitations.userId, context.user.id)),
    })
    if (!inv) throw new Error('Not found or unauthorized')

    await db.delete(greetings).where(eq(greetings.id, data.id))
    return { success: true }
  })

// ----------------------------------------------------------------------------
// RSVP — submit a response (public) & management
// ----------------------------------------------------------------------------

export const submitRsvp = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      invitationId: z.string(),
      guestName: z.string().min(1).max(100),
      jumlahTamu: z.number().int().min(1).max(10).default(1),
      attendance: z.enum(['hadir', 'absen', 'ragu']).optional(),
    }),
  )
  .handler(async ({ data }) => {
    const inserted = await db
      .insert(rsvpResponses)
      .values({
        invitationId: data.invitationId,
        guestName: data.guestName,
        jumlahTamu: data.jumlahTamu,
        attendance: data.attendance,
      })
      .returning({ id: rsvpResponses.id, createdAt: rsvpResponses.createdAt })
    return inserted[0]
  })

export const listRsvp = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .validator(z.object({ invitationId: z.string() }))
  .handler(async ({ data, context }) => {
    if (!context.user) throw new Error('Unauthorized')
    // Verifikasi kepemilikan undangan
    const inv = await db.query.invitations.findFirst({
      where: and(eq(invitations.id, data.invitationId), eq(invitations.userId, context.user.id)),
    })
    if (!inv) throw new Error('Not found or unauthorized')

    const rows = await db
      .select({
        id: rsvpResponses.id,
        guestName: rsvpResponses.guestName,
        jumlahTamu: rsvpResponses.jumlahTamu,
        attendance: rsvpResponses.attendance,
        createdAt: rsvpResponses.createdAt,
      })
      .from(rsvpResponses)
      .where(eq(rsvpResponses.invitationId, data.invitationId))
      .orderBy(rsvpResponses.createdAt)

    return rows
  })

export const deleteRsvp = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.number(), invitationId: z.string() }))
  .handler(async ({ data, context }) => {
    if (!context.user) throw new Error('Unauthorized')
    // Verifikasi kepemilikan undangan
    const inv = await db.query.invitations.findFirst({
      where: and(eq(invitations.id, data.invitationId), eq(invitations.userId, context.user.id)),
    })
    if (!inv) throw new Error('Not found or unauthorized')

    await db.delete(rsvpResponses).where(eq(rsvpResponses.id, data.id))
    return { success: true }
  })
