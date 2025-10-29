import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { getMoviesFromRedis } from '@/lib/redis'

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    // API 키 확인
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY가 설정되지 않았습니다. .env.local 파일에 API 키를 추가해주세요.' },
        { status: 500 }
      )
    }

    const { messages } = await request.json()

    // Redis에서 영화 목록 가져오기
    const movies = await getMoviesFromRedis()
    if (!movies || !Array.isArray(movies) || movies.length === 0) {
      return NextResponse.json(
        {
          error: '영화 데이터를 찾을 수 없습니다.',
          message: 'Redis 서버 실행 후 npm run init-movies를 실행하세요.'
        },
        { status: 404 }
      )
    }

    // 프롬프트 텍스트를 런타임에서 구성
    const moviesData = movies.map((m: any, idx: number) => `\n${idx + 1}. ${m.title} (${m.year})\n   - 감독: ${m.director}\n   - 줄거리: ${m.description}${m.rating ? `\n   - 평점: ${m.rating}/10` : ''}`).join('\n')

    // 시스템 프롬프트 설정 (영화 정보 포함)
    const systemPrompt = `당신은 영화 정보 전문 챗봇입니다. 다음 영화 정보를 바탕으로 사용자의 질문에 친절하고 정확하게 답변해주세요.

${moviesData}

중요한 규칙:
- 위에 나열된 영화 정보만 사용하여 답변하세요.
- 영화 추천, 줄거리 설명, 감독 정보 등을 제공할 수 있습니다.
- 정보가 없는 영화에 대해서는 솔직하게 모른다고 답변하세요.
- 친근하고 자연스러운 한국어로 대화하세요.`

    // OpenAI API 호출
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((msg: { role: string; content: string }) => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const message = completion.choices[0]?.message?.content || '답변을 생성할 수 없습니다.'

    return NextResponse.json({ message })
  } catch (error: any) {
    console.error('OpenAI API 오류:', error)
    
    return NextResponse.json(
      { 
        error: '챗봇 응답 생성 중 오류가 발생했습니다.',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
