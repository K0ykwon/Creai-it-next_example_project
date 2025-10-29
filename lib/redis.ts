import Redis from 'ioredis'

let redis: Redis | null = null

export function getRedisClient(): Redis {
  if (redis) return redis

  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'
  redis = new Redis(redisUrl, {
    retryStrategy: (times: number) => {
      if (times > 3) return null
      return Math.min(times * 200, 2000)
    },
  })

  return redis
}

export async function closeRedisConnection() {
  if (redis) {
    await redis.quit()
    redis = null
  }
}

export async function getMoviesFromRedis() {
  const data = await getRedisClient().get('movies:list')
  return data ? JSON.parse(data) : null
}
