import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rayve — AI Marketing OS for Meta Ads',
  description:
    'Rayve creates and launches Meta Ads campaigns tailored to your type of business.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}
        style={{ background: '#0a0a0a', color: '#f5f5f5' }}
      >
        {children}
      </body>
    </html>
  )
}
