import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Salarasa Digital Invitation',
      },
      {
        name: 'description',
        content: 'Salarasa — Digital invitation platform for birthdays, weddings & special moments. Create and share your beautiful invitation in minutes.',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:site_name',
        content: 'Salarasa',
      },
      {
        property: 'og:title',
        content: 'Salarasa Digital Invitation',
      },
      {
        property: 'og:description',
        content: 'Create and share your beautiful digital invitation in minutes.',
      },
      {
        property: 'og:image',
        content: 'https://www.salarasa.my.id/logo512.png',
      },
      {
        property: 'og:url',
        content: 'https://www.salarasa.my.id',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: 'Salarasa Digital Invitation',
      },
      {
        name: 'twitter:description',
        content: 'Create and share your beautiful digital invitation in minutes.',
      },
      {
        name: 'twitter:image',
        content: 'https://www.salarasa.my.id/logo512.png',
      },
    ],
    links: [
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/favicon.svg',
      },
      {
        rel: 'alternate icon',
        type: 'image/png',
        href: '/logo192.png',
      },
      {
        rel: 'apple-touch-icon',
        href: '/logo192.png',
      },
      {
        rel: 'manifest',
        href: '/manifest.json',
      },
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
