import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { getMoviesFromRedis } from '@/lib/redis'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  const { messages } = await request.json()
  const movies = await getMoviesFromRedis()

  const moviesData = movies.map((m: any, i: number) => 
    `\n${i + 1}. ${m.title} (${m.year})\n   - 감독: ${m.director}\n   - 줄거리: ${m.description}${m.rating ? `\n   - 평점: ${m.rating}/10` : ''}`
  ).join('\n')

  const systemPrompt = `당신은 영화 정보 전문 챗봇입니다. 다음 영화 정보를 바탕으로 사용자의 질문에 친절하고 정확하게 답변해주세요.

${moviesData}

중요한 규칙:
- 위에 나열된 영화 정보만 사용하여 답변하세요.
- 영화 추천, 줄거리 설명, 감독 정보 등을 제공할 수 있습니다.
- 정보가 없는 영화에 대해서는 솔직하게 모른다고 답변하세요.
- 친근하고 자연스러운 한국어로 대화하세요.`

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.map((msg: { role: string; content: string }) => ({ role: msg.role, content: msg.content })),
    ],
    temperature: 0.7,
    max_tokens: 500,
  })

  const message = completion.choices[0]?.message?.content || ''
  return NextResponse.json({ message })
}
