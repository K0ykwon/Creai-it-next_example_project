# Next.js 초보자를 위한 영화 정보 앱 🎬

Next.js를 처음 배우는 사람들을 위한 예제 프로젝트입니다.

## 📚 이 프로젝트에서 배울 수 있는 것들

1. **Next.js 기본 구조**: App Router의 기본 구조와 파일 시스템 라우팅
2. **페이지 라우팅**: 정적 페이지와 동적 라우팅
3. **컴포넌트**: React 컴포넌트 작성과 재사용
4. **스타일링**: CSS 모듈과 글로벌 스타일
5. **API 라우트**: Next.js의 API 라우트 기본 사용법
6. **데이터 페칭**: 클라이언트와 서버 컴포넌트 이해
7. **OpenAI API 연동**: 외부 API를 사용한 챗봇 기능 구현
8. **클라이언트 컴포넌트**: 'use client' 디렉티브와 상태 관리

## 🚀 시작하기

### 1단계: 프로젝트 설치

```bash
npm install
```

또는

```bash
yarn install
```

### 2단계: 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 설정을 추가하세요:

#### OpenAI API 키 (채팅 기능 사용 시 필수)
```
OPENAI_API_KEY=your_api_key_here
```
[OpenAI Platform](https://platform.openai.com/api-keys)에서 API 키를 발급받을 수 있습니다.

#### Redis 설정 (선택사항 - 캐싱 및 채팅 기록 저장)

로컬 Redis 사용 시:
```
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=  # 비밀번호가 없는 경우 비워두세요
```

또는 Redis URL 사용:
```
REDIS_URL=redis://localhost:6379
```

**Redis 없이도 실행 가능합니다!**
- Redis가 없어도 앱은 정상 작동합니다
- 다만 채팅 기록 저장과 데이터 캐싱 기능은 사용할 수 없습니다
- 로컬 Redis 설치 방법:
  - **Windows**: [Redis for Windows](https://github.com/microsoftarchive/redis/releases) 또는 Docker 사용
  - **Mac**: `brew install redis` 후 `brew services start redis`
  - **Linux**: `sudo apt-get install redis-server` 후 `sudo systemctl start redis`

**중요:** `.env.local` 파일은 `.gitignore`에 포함되어 있어 Git에 올라가지 않습니다.

### 영화 데이터 초기화 (Redis 사용 시)

Redis를 사용하는 경우, 영화 데이터를 Redis에 저장해야 합니다:

```bash
npm run init-movies
```

이 명령어는:
- 영화 목록을 `movies:list` 키로 Redis에 저장
- 각 영화를 `movie:{id}` 키로 개별 저장
- 챗봇용 프롬프트 텍스트를 `movies:prompt` 키로 저장

**팁**: Redis 서버가 실행 중이어야 합니다!

### 3단계: 개발 서버 실행

```bash
npm run dev
```

또는

```bash
yarn dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📁 프로젝트 구조 설명

```
Creaiit/
├── app/                    # Next.js App Router 메인 폴더
│   ├── layout.tsx         # 전체 레이아웃 (모든 페이지에 적용)
│   ├── page.tsx           # 홈페이지 (/) 
│   ├── globals.css        # 전역 CSS 스타일
│   ├── chat/              # 채팅 페이지
│   │   └── page.tsx       # 영화 챗봇 페이지 (/chat)
│   ├── movies/            # 영화 관련 페이지
│   │   └── [id]/          # 동적 라우팅 ([id]는 변수)
│   │       ├── page.tsx   # 영화 상세 페이지
│   │       └── not-found.tsx  # 404 페이지
│   └── api/               # API 라우트
│       ├── movies/
│       │   └── route.ts   # /api/movies 엔드포인트
│       └── chat/
│           └── route.ts    # /api/chat 엔드포인트 (OpenAI 연동)
├── lib/                    # 유틸리티 함수
│   └── redis.ts            # Redis 클라이언트 및 헬퍼 함수
├── scripts/                # 유틸리티 스크립트
│   └── init-movies.ts      # 영화 데이터 Redis 초기화 스크립트
├── package.json            # 프로젝트 의존성 및 스크립트
├── tsconfig.json           # TypeScript 설정
└── next.config.js          # Next.js 설정
```

## 🎯 주요 개념 설명

### 1. App Router (앱 라우터)
- Next.js 13+ 버전에서 도입된 새로운 라우팅 시스템
- `app` 폴더 안의 파일 구조가 URL 경로가 됩니다
- `page.tsx` 파일이 실제 페이지 컴포넌트입니다

**예시:**
- `app/page.tsx` → `http://localhost:3000/`
- `app/movies/[id]/page.tsx` → `http://localhost:3000/movies/1`

### 2. 레이아웃 (Layout)
- `layout.tsx`는 모든 하위 페이지에 공통으로 적용됩니다
- 헤더, 푸터, 네비게이션 등을 여기에 배치할 수 있습니다

### 3. 동적 라우팅
- `[id]`처럼 폴더명을 대괄호로 감싸면 동적 경로가 됩니다
- `params`를 통해 URL 파라미터에 접근할 수 있습니다

```tsx
// app/movies/[id]/page.tsx
export default function MovieDetail({ params }: { params: { id: string } }) {
  const movieId = params.id // URL의 id 값을 가져옵니다
}
```

### 4. Link 컴포넌트
- Next.js의 `Link` 컴포넌트는 클라이언트 사이드 네비게이션을 제공합니다
- 페이지 전체를 새로고침하지 않고 페이지 전환이 일어납니다

```tsx
import Link from 'next/link'

<Link href="/movies/1">영화 상세보기</Link>
```

### 5. API 라우트
- `app/api` 폴더 안의 파일들이 API 엔드포인트가 됩니다
- 서버 사이드에서 실행되며 데이터베이스 연동이나 외부 API 호출에 사용됩니다

### 6. 클라이언트 컴포넌트 ('use client')
- 기본적으로 모든 컴포넌트는 서버 컴포넌트입니다
- 상태 관리나 브라우저 API를 사용하려면 `'use client'`를 파일 상단에 추가해야 합니다
- 채팅 페이지처럼 실시간 상호작용이 필요한 경우에 사용합니다

### 7. 환경 변수 (.env.local)
- 서버에서만 접근 가능한 환경 변수를 설정하는 파일입니다
- API 키 같은 민감한 정보를 안전하게 저장할 수 있습니다

### 8. Redis 캐싱 및 저장소
- **영화 데이터 저장**: `npm run init-movies`로 영화 데이터를 Redis에 저장
- **데이터 조회**: API와 챗봇이 Redis에서 영화 데이터를 가져와 사용
- Redis가 없어도 앱은 정상 작동하지만, 위 기능들은 사용할 수 없습니다

## 🔧 다음 단계에서 시도해볼 것들

1. ✅ **Redis 캐싱**: 이미 구현됨! 영화 데이터 캐싱
2. **데이터베이스 연동**: 영화 정보를 데이터베이스에 저장
3. **검색 기능**: 영화 제목이나 감독으로 검색하기
4. **필터링**: 출시년도나 장르로 필터링하기
5. **추가/수정/삭제**: 영화 정보 관리 기능
6. **인증**: 로그인/회원가입 기능 추가
7. **이미지 업로드**: 영화 포스터 이미지 추가
8. **실시간 채팅**: WebSocket을 사용한 실시간 채팅 기능

## 📝 주요 명령어

- `npm run dev` - 개발 서버 시작
- `npm run build` - 프로덕션 빌드
- `npm run start` - 프로덕션 서버 시작
- `npm run lint` - 코드 린팅 (코드 검사)
- `npm run init-movies` - Redis에 영화 데이터 초기화 (Redis 사용 시 필수)

## 🎓 학습 팁

1. **하나씩 이해하기**: 각 파일의 역할을 하나씩 파악해보세요
2. **코드 수정해보기**: 색상, 텍스트, 레이아웃을 바꿔보며 시도해보세요
3. **에러 확인하기**: 에러 메시지를 읽고 이해하는 연습을 하세요
4. **문서 참고하기**: Next.js 공식 문서 (https://nextjs.org/docs)를 함께 보세요

## ❓ 자주 묻는 질문

**Q: 왜 React를 배워야 하나요?**
A: Next.js는 React를 기반으로 만들어졌습니다. React의 컴포넌트, props, state 등의 개념을 이해하면 Next.js를 더 쉽게 배울 수 있습니다.

**Q: TypeScript를 꼭 써야 하나요?**
A: 아니요. JavaScript로도 작성할 수 있지만, TypeScript는 타입 안정성을 제공하여 실수를 줄이는 데 도움이 됩니다.

**Q: 페이지를 추가하고 싶어요**
A: `app` 폴더 안에 새 폴더를 만들고 `page.tsx`를 추가하면 됩니다. 예: `app/about/page.tsx` → `/about` 경로 생성

## 🤝 도움이 필요하신가요?

- Next.js 공식 문서: https://nextjs.org/docs
- React 공식 문서: https://react.dev
- Next.js 학습 강좌: https://nextjs.org/learn

---

**Happy Coding! 🚀**
