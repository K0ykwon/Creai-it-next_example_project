import { NextResponse } from 'next/server'
import { getMoviesFromRedis } from '@/lib/redis'

export async function GET() {
  const movies = await getMoviesFromRedis()
  return NextResponse.json({ movies: movies || [] })
}
