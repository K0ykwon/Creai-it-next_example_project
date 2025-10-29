import Redis from 'ioredis'
import { config } from 'dotenv'
import { resolve } from 'path'

// .env.local 파일 로드
config({ path: resolve(process.cwd(), '.env.local') })


const moviesData = [
  {
    id: 1,
    title: '인셉션',
    year: 2010,
    director: '크리스토퍼 놀란',
    description: '꿈 속으로 들어가 생각을 훔치는 특수요원들의 이야기. 레오나르도 디카프리오가 주연한 미스터리 액션 영화로, 현실과 꿈의 경계를 넘나드는 스토리로 유명합니다.',
    rating: 8.8
  },
  {
    id: 2,
    title: '인터스텔라',
    year: 2014,
    director: '크리스토퍼 놀란',
    description: '인류를 구하기 위한 우주 탐험 이야기. 농작물이 모두 죽어가고 먼지 폭풍이 몰아치는 지구에서 새로운 행성을 찾기 위해 나선 우주선 승무원들의 감동적인 여정을 그립니다.',
    rating: 8.6
  },
  {
    id: 3,
    title: '어벤져스: 엔드게임',
    year: 2019,
    director: '앤서니 루소, 조 루소',
    description: '우주의 절반을 구하기 위한 최후의 전투. 타노스의 스냅 이후 우주에 남은 히어로들이 다시 모여 인피니티 스톤을 되찾기 위한 거대한 모험이 펼쳐집니다.',
    rating: 8.4
  },
  {
    id: 4,
    title: '기생충',
    year: 2019,
    director: '봉준호',
    description: '상류층과 하류층의 충돌을 그린 스릴러. 반지하 아파트에 살던 기택 가족이 부자 박 사장 집에 일자리를 얻으면서 벌어지는 예상치 못한 사건들을 그린 작품입니다.',
    rating: 8.5
  },
  {
    id: 5,
    title: '옥자',
    year: 2017,
    director: '봉준호',
    description: '거대한 반려동물 옥자와의 특별한 우정. 10년 동안 옥자와 함께 살아온 미자의 이야기를 통해 자본주의와 자연 환경에 대한 메시지를 전달합니다.',
    rating: 7.0
  }
]

async function initMovies() {
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'
  
  if (!process.env.REDIS_URL) {
    console.log('ℹ️  REDIS_URL 환경 변수가 없어 기본값(localhost:6379)을 사용합니다.')
  }
  
  console.log(`🔄 Redis 연결 시도 중... (${redisUrl})`)
  
  try {
    const redis = new Redis(redisUrl, {
      connectTimeout: 5000,
      retryStrategy: (times: number) => {
        if (times > 3) return null
        return Math.min(times * 200, 2000)
      },
    })

    await new Promise<void>((resolvePromise, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Redis 연결 타임아웃 (5초)'))
      }, 5000)

      redis.on('connect', () => {
        clearTimeout(timeout)
        console.log('✅ Redis 연결 성공!')
        resolvePromise()
      })

      redis.on('error', (err) => {
        clearTimeout(timeout)
        reject(err)
      })

      if (redis.status === 'ready') {
        clearTimeout(timeout)
        resolvePromise()
      }
    })

    await redis.set('movies:list', JSON.stringify(moviesData))
    console.log(`✅ 영화 목록 저장 완료 (${moviesData.length}개 영화)`)
    console.log('\n🎉 영화 데이터 초기화 완료!')
    
    
    await redis.quit()
  } catch (error: any) {
    console.error('\n❌ Redis 연결 실패')
    process.exit(1)
  }
}

initMovies()
