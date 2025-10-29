import Redis from 'ioredis'

let redis: Redis | null = null

export function getRedisClient(): Redis {
  if (redis) return redis

  try {
    const redisUrl = process.env.REDIS_URL
    if (!redisUrl) {
      throw new Error('REDIS_URL 환경 변수가 설정되어 있지 않습니다.')
    }
    
    redis = new Redis(redisUrl, {
      retryStrategy: (times: number) => {
        if (times > 3) return null
        return Math.min(times * 200, 2000)
      },
    })
  } catch (error: any) {
    console.error('Redis 초기화 오류:', error.message)
    throw error
  }

  return redis
}

export async function closeRedisConnection() {
  if (redis) {
    await redis.quit()
    redis = null
  }
}

export async function getMoviesFromRedis() {
  try {
    const data = await getRedisClient().get('movies:list')
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Redis에서 영화 목록 불러오기 오류:', error)
    return null
  }
}
