import Redis from 'ioredis'

// 영화 데이터
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
  // 환경 변수에서 Redis 설정 가져오기
  const redisUrl = process.env.REDIS_URL

  let redis: Redis

  try {
    redis = new Redis(redisUrl!, {
      retryStrategy: (times: number) => {
        if (times > 3) {
          return null
        }
        return Math.min(times * 200, 2000)
      },
    })

    console.log('🔄 Redis 연결 시도 중...')

    // 연결 대기
    await new Promise<void>((resolve, reject) => {
      redis.on('connect', () => {
        console.log('✅ Redis 연결 성공!')
        resolve()
      })

      redis.on('error', (err) => {
        console.error('❌ Redis 연결 실패:', err.message)
        reject(err)
      })

      // 이미 연결되어 있는 경우
      if (redis.status === 'ready') {
        resolve()
      }
    })

    // 영화 목록을 Redis에 저장
    const moviesListKey = 'movies:list'
    await redis.set(moviesListKey, JSON.stringify(moviesData))
    console.log(`✅ 영화 목록 저장 완료 (${moviesData.length}개 영화)`)

    // (주의) 영화 목록만 저장합니다. 개별 영화/프롬프트 키는 사용하지 않습니다.

    console.log('\n🎉 영화 데이터 초기화 완료!')
    
    await redis.quit()
  } catch (error: any) {
    console.error('❌ 오류 발생:', error.message)
    console.error('\n💡 Redis가 실행 중인지 확인해주세요.')
    console.error('   로컬 Redis: redis-server 명령어로 실행')
    process.exit(1)
  }
}

// 스크립트 실행
initMovies()
