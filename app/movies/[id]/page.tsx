import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getMoviesFromRedis } from '@/lib/redis'

// 동적 경로에서 파라미터를 받는 함수
interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function MovieDetail({ params }: PageProps) {
  const { id } = await params
  const movieId = parseInt(id)
  
  // Redis에서 영화 목록을 불러와 해당 ID 검색
  let movie
  try {
    const movies = await getMoviesFromRedis()
    if (movies && Array.isArray(movies)) {
      movie = movies.find((m: any) => m.id === movieId)
    } else {
      movie = null
    }
  } catch (error) {
    console.error('영화 데이터 가져오기 오류:', error)
    movie = null
  }

  // 영화가 없으면 404 페이지를 보여줍니다
  if (!movie) {
    notFound()
  }

  return (
    <main>
      <div className="header">
        <div className="container">
          <h1>🎬 영화 상세 정보</h1>
        </div>
      </div>

      <div className="container">
        <Link href="/" className="back-link">
          ← 목록으로 돌아가기
        </Link>

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
