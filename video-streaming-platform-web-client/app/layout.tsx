import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from './navBar/navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SBBJ Streams',
  description: 'Watch Videos For Free',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar></Navbar>
        {children}
        </body>
    </html>
  )
}