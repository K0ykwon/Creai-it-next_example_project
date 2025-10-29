import Link from 'next/link'
import { getMoviesFromRedis } from '@/lib/redis'

interface Movie {
  id: number
  title: string
  year: number
  description: string
  director: string
}

export default async function Home() {
  const moviesData = await getMoviesFromRedis()
  const movies: Movie[] = moviesData || []

  return (
    <main>
      <div className="header">
        <div className="container">
          <h1>🎬 영화 정보 앱</h1>
        </div>
      </div>
      
      <div className="container">
        <div className="nav-links">
          <Link href="/chat" className="nav-link">💬 영화 챗봇과 대화하기</Link>
        </div>
        
        <h2 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>인기 영화 목록</h2>
        
        <div className="movie-grid">
          {movies.map((movie) => (
            <Link key={movie.id} href={`/movies/${movie.id}`} style={{ textDecoration: 'none' }}>
              <div className="movie-card">
                <h2>{movie.title}</h2>
                <p className="year">출시년도: {movie.year}</p>
                <p>감독: {movie.director}</p>
                <p>{movie.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
