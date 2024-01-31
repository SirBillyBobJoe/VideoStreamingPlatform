import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from './navBar/navbar'
import Searchbar from './searchBar/searchbar'
import Head from 'next/head'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SBBJ Streams',
  description: 'Watch Videos For Free at SBBJ Streams',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const titleAsString = String(metadata.title ?? 'Default Title');
  return (
    <html lang="en">
      <Head>
        <title>{titleAsString}</title>
        <meta name="description" content={metadata.description ?? ''} />
      </Head>
      <body className={inter.className}>
        <Navbar></Navbar>
        <Searchbar></Searchbar>
        {children}
      </body>
    </html>
  )
}
