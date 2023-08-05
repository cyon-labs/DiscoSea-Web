import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DiscoSea CORE',
  description: 'A 3D Crypto Wallet',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{backgroundColor:"#000000"}} className={inter.className}>{children}</body>
    </html>
  )
}
