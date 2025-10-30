import Link from 'next/link'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function MovieDetail({ params }: PageProps) {
  const { id } = await params
  
  const hdrs = headers()
  const host = hdrs.get('host')
  const protocol = hdrs.get('x-forwarded-proto') ?? (process.env.NODE_ENV === 'production' ? 'https' : 'http')
  const baseUrl = `${protocol}://${host}`

  const res = await fetch(`${baseUrl}/api/movies?id=${id}`, {
    cache: 'no-store'
  })
  
  if (!res.ok) notFound()
  
  const { movie } = await res.json()

  if (!movie) notFound()

  return (
    <main>
      <div className="header">
        <div className="container">
          <h1>🎬 영화 상세 정보</h1>
        </div>
      </div>

      <div className="container">
        <Link href="/" className="back-link">← 목록으로 돌아가기</Link>

        <div className="movie-detail">
          <h1>{movie.title}</h1>
          <div className="meta">
            <p><strong>출시년도:</strong> {movie.year}</p>
            <p><strong>감독:</strong> {movie.director}</p>
            <p><strong>평점:</strong> ⭐ {movie.rating}/10</p>
          </div>
          <div className="description">
            <h2 style={{ marginBottom: '10px', fontSize: '1.3rem' }}>줄거리</h2>
            <p>{movie.description}</p>
          </div>
        </div>
      </div>
    </main>
  )
}
