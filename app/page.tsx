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
  let movies: Movie[] = []
  
  try {
    const moviesData = await getMoviesFromRedis()
    if (moviesData && Array.isArray(moviesData) && moviesData.length > 0) {
      movies = moviesData
    }
  } catch (error) {
    console.error('영화 데이터 로딩 오류:', error)
    movies = []
  }
  return (
    <main>
      <div className="header">
        <div className="container">
          <h1>🎬 영화 정보 앱</h1>
        </div>
      </div>
      
      <div className="container">
        <div className="nav-links">
          <Link href="/chat" className="nav-link">
            💬 영화 챗봇과 대화하기
          </Link>
        </div>
        
        <h2 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>
          인기 영화 목록
        </h2>
        
        {movies.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <p style={{ marginBottom: '10px' }}>영화 데이터가 없습니다.</p>
            <p style={{ fontSize: '0.9rem' }}>
              Redis 서버를 실행하고 <code style={{ background: '#f0f0f0', padding: '2px 6px', borderRadius: '3px' }}>npm run init-movies</code>를 실행하세요.
            </p>
          </div>
        ) : (
          <div className="movie-grid">
            {movies.map((movie) => (
            <Link 
              key={movie.id} 
              href={`/movies/${movie.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div className="movie-card">
                <h2>{movie.title}</h2>
                <p className="year">출시년도: {movie.year}</p>
                <p>감독: {movie.director}</p>
                <p>{movie.description}</p>
              </div>
            </Link>
          ))}
          </div>
        )}
      </div>
    </main>
  )
}
