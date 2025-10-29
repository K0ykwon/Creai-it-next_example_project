import { NextResponse } from 'next/server'
import { getMoviesFromRedis } from '@/lib/redis'

export async function GET() {
  try {
    const movies = await getMoviesFromRedis()
    
    if (movies?.length) {
      return NextResponse.json({ movies, source: 'redis' })
    }
    
    return NextResponse.json(
      { error: '영화 데이터를 찾을 수 없습니다.', message: 'npm run init-movies를 실행하여 데이터를 초기화하세요.' },
      { status: 404 }
    )
  } catch (error: any) {
    console.error('Redis에서 영화 데이터 가져오기 오류:', error)
    return NextResponse.json(
      { error: 'Redis 연결 오류', message: 'Redis가 실행 중인지 확인하고, npm run init-movies를 실행하세요.' },
      { status: 500 }
    )
  }
}
