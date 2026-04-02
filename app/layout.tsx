import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Rayve — AI Marketing OS for Meta Ads',
  description:
    'Rayve creates and launches Meta Ads campaigns tailored to your type of business.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${nunito.variable} font-sans antialiased`}
        style={{ background: '#FFFFFF', color: '#111827' }}
      >
        {children}
      </body>
    </html>
  )
}
