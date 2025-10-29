import Redis from 'ioredis'

// Redis 클라이언트 인스턴스 (싱글톤 패턴)
let redis: Redis | null = null

// Redis 연결 함수
export function getRedisClient(): Redis {
  if (redis) {
    return redis
  }

  // 환경 변수에서 Redis 설정 가져오기
  try {
    const redisUrl = process.env.REDIS_URL as string | undefined
    if (!redisUrl) {
      throw new Error('REDIS_URL 환경 변수가 설정되어 있지 않습니다.')
    }
    // Redis URL이 있으면 URL을 사용하여 연결
    redis = new Redis(redisUrl, {
        retryStrategy: (times: number) => {
          if (times > 3) {
            return null // 재시도 중단
          }
          return Math.min(times * 200, 2000)
        },
      })
  } catch (error: any) {
    console.error('Redis 초기화 오류:', error.message)
    // 에러가 발생해도 빈 Redis 객체를 반환 (호출하는 쪽에서 처리)
    throw error
  }

  return redis
}

// Redis 연결 종료 (앱 종료 시 사용)
export async function closeRedisConnection() {
  if (redis) {
    await redis.quit()
    redis = null
  }
}

// Redis에서 영화 목록 가져오기
export async function getMoviesFromRedis() {
  const client = getRedisClient()
  const key = 'movies:list'
  
  try {
    const data = await client.get(key)
    if (data) {
      return JSON.parse(data)
    }
    return null
  } catch (error) {
    console.error('Redis에서 영화 목록 불러오기 오류:', error)
    return null
  }
}
