import { NextResponse } from 'next/server'
import { getMoviesFromRedis } from '@/lib/redis'

// API 라우트 - Redis에서 영화 데이터를 가져옵니다
export async function GET() {
  try {
    // Redis에서 영화 목록 가져오기 시도
    const movies = await getMoviesFromRedis()
    
    if (movies && Array.isArray(movies) && movies.length > 0) {
      return NextResponse.json({ 
        movies,
        source: 'redis'
      })
    }
    
    // Redis에 데이터가 없으면 에러 반환
    return NextResponse.json(
      { 
        error: '영화 데이터를 찾을 수 없습니다.',
        message: 'npm run init-movies를 실행하여 데이터를 초기화하세요.'
      },
      { status: 404 }
    )
  } catch (error: any) {
    // Redis 오류 시 에러 반환
    console.error('Redis에서 영화 데이터 가져오기 오류:', error)
    return NextResponse.json(
      { 
        error: 'Redis 연결 오류',
        message: 'Redis가 실행 중인지 확인하고, npm run init-movies를 실행하세요.'
      },
      { status: 500 }
    )
  }
}
