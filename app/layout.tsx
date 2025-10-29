import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '영화 정보 앱',
  description: 'Next.js를 배우는 첫 번째 프로젝트',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
