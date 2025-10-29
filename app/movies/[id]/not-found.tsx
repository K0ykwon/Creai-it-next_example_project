import Link from 'next/link'

export default function NotFound() {
  return (
    <main>
      <div className="header">
        <div className="container">
          <h1>🎬 영화 정보 앱</h1>
        </div>
      </div>

      <div className="container">
        <div className="movie-detail" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '4rem', marginBottom: '20px' }}>404</h1>
          <h2 style={{ marginBottom: '20px' }}>영화를 찾을 수 없습니다</h2>
          <p style={{ marginBottom: '30px', color: '#666' }}>요청하신 영화 정보가 존재하지 않습니다.</p>
          <Link href="/" className="back-link" style={{ fontSize: '1.1rem' }}>← 홈으로 돌아가기</Link>
        </div>
      </div>
    </main>
  )
}
