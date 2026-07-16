import { createMiddleware } from '@tanstack/react-start'

export type AuthUser = {
  id: string
  name: string
  email: string
}
export type AuthSession = {
  id: string
  userId: string
  token: string
  expiresAt: Date
}
export type AuthContext = {
  user: AuthUser | null
  session: AuthSession | null
}

const nullAuth: AuthContext = { user: null, session: null }

/**
 * Reads the request, validates the session cookie via better-auth,
 * and injects { user, session } into the server function context.
 */
export const authMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const { auth } = await import('#/lib/auth')
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session) {
      throw new Error('Unauthorized')
    }
    const ctx: AuthContext = {
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      },
      session: {
        id: session.session.id,
        userId: session.session.userId,
        token: session.session.token,
        expiresAt: session.session.expiresAt,
      },
    }
    return next({ context: ctx })
  }
)
