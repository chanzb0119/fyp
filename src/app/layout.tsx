import MainLayout from '@/components/layout/MainLayout'
import { ReactNode } from 'react'
import './globals.css'
import Script from 'next/script'

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <head>
        
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}&libraries=places&callback=Function.prototype`}
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  )
}