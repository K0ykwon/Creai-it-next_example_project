import { NextResponse } from 'next/server'
import { getMoviesFromRedis } from '@/lib/redis'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  const movies = await getMoviesFromRedis()
  
  // ID가 있으면 특정 영화만 반환
  if (id) {
    const movieId = parseInt(id)
    if (isNaN(movieId)) {
      return NextResponse.json({ error: 'Invalid movie ID' }, { status: 400 })
    }
    
    const movie = movies?.find((m: any) => m.id === movieId)
    if (!movie) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 })
    }
    return NextResponse.json({ movie })
  }
  
  // ID가 없으면 전체 목록 반환
  return NextResponse.json({ movies: movies || [] })
}
