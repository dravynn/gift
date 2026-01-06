import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Valentine Gift Store - Find the Perfect Gift',
  description: 'Discover personalized Valentine\'s Day gifts based on your friend\'s preferences',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen">{children}</body>
    </html>
  )
}

