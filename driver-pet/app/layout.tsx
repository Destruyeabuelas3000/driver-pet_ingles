import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Roboto } from 'next/font/google'
import { AppProvider } from '@/lib/store'
import { publicAsset } from '@/lib/utils'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import './globals.css'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
})

export const metadata: Metadata = {
  title: 'Driver Pet | Paseadores de Mascotas',
  description:
    'Encuentra el paseador ideal para tu mascota: perfiles, rutas de paseo, calificaciones de dueños y reportes de cada paseo.',
  generator: 'v0.app',
  icons: {
    icon: publicAsset('/images/logo-icon.png'),
    apple: publicAsset('/images/logo-icon.png'),
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#2f7a4b',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={roboto.variable}>
      <body className="paw-bg min-h-screen antialiased">
        <AppProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </AppProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
