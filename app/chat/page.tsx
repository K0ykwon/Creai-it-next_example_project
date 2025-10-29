'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const initialMessage: Message = {
  role: 'assistant',
  content: '안녕하세요! 영화에 대해 물어보세요. 예를 들어 "인셉션 줄거리 알려줘" 또는 "봉준호 감독 영화 추천해줘"라고 물어보실 수 있습니다.'
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([initialMessage])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: input }
    const updatedMessages = [...messages, userMessage]
    
    setMessages(updatedMessages)
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      })

      if (!res.ok) throw new Error('응답 실패')

      const { message } = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: message }])
    } catch (error) {
      console.error(error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.' 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main>
      <div className="header">
        <div className="container">
          <h1>💬 영화 챗봇</h1>
        </div>
      </div>

      <div className="container">
        <Link href="/" className="back-link">← 홈으로 돌아가기</Link>

        <div className="chat-container">
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.role}-message`}>
                <div className="message-content">
                  <strong>{msg.role === 'user' ? '나' : '영화 챗봇'}</strong>
                  <p>{msg.content}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="message assistant-message">
                <div className="message-content">
                  <strong>영화 챗봇</strong>
                  <p>답변을 생각하고 있어요...</p>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="chat-input-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="영화에 대해 물어보세요..."
              className="chat-input"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="chat-button"
            >
              전송
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
