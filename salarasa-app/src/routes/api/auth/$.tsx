import { createFileRoute } from '@tanstack/react-router'
import type {} from '@tanstack/react-start'

import { auth } from '../../../lib/auth'

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: ({ createHandlers }) =>
      createHandlers({
        ANY: async ({ request }) => {
          // Rekonstruksi request URL agar host persis dengan env / baseURL
          // (Menghindari "invalid origin" akibat beda localhost vs 127.0.0.1 di Vite internal)
          const url = new URL(request.url)
          
          let host = request.headers.get('x-forwarded-host') || request.headers.get('host')
          let proto = request.headers.get('x-forwarded-proto') || 'http'
          
          // Fallback ke localhost:3000 jika host tidak terbaca
          if (!host) host = 'localhost:3000'
          
          const reconstructedUrl = `${proto}://${host}${url.pathname}${url.search}`

          const proxyRequest = new Request(reconstructedUrl, {
            method: request.method,
            headers: request.headers,
            body: request.body,
            ...({ duplex: 'half' } as any)
          })
          
          return auth.handler(proxyRequest)
        },
      }),
  },
})