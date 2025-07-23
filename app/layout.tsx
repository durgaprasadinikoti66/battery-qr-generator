import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Battery QR Code Viewer',
  description: 'Battery QR Code Viewer',
  generator: 'Battery QR Code Viewer',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
