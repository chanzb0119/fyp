import MainLayout from '@/components/layout/MainLayout'
import { ReactNode } from 'react'
import './globals.css'
import Script from 'next/script'
import { GOOGLE_MAPS_API_KEY } from '@/libs/google-maps'
import ChatInterface2 from '@/components/chat/ChatInterface2'

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <head>
        
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=Function.prototype`}
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <MainLayout>
          {children}
          <ChatInterface2 />
        </MainLayout>
      </body>
    </html>
  )
}