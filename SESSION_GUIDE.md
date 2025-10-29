# Next.js 1시간 세션 가이드 📚

이 문서는 Next.js를 처음 접하는 분들을 위한 1시간 분량의 실습 가이드입니다.

## 🎯 세션 목표

- Next.js의 기본 개념 이해
- 파일 기반 라우팅 시스템 학습
- 간단한 웹 애플리케이션 만들기

## ⏱️ 시간 배분 (총 60분)

- **설정 및 소개 (10분)**
- **기본 페이지 만들기 (15분)**
- **동적 라우팅 이해하기 (20분)**
- **스타일링 및 마무리 (15분)**

---

## 1단계: 프로젝트 설정 및 소개 (10분)

### 1.1 Next.js란?

**Next.js**는 React 기반의 프레임워크로, 다음과 같은 기능을 제공합니다:
- **서버 사이드 렌더링 (SSR)**: 페이지를 서버에서 미리 렌더링
- **파일 기반 라우팅**: 폴더 구조가 자동으로 URL 경로가 됨
- **자동 코드 분할**: 필요한 코드만 로드하여 빠른 성능
- **API 라우트**: 백엔드 API를 쉽게 만들 수 있음

### 1.2 프로젝트 설치

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:3000`을 열어 확인하세요!

### 1.3 프로젝트 구조 이해

```
app/
├── layout.tsx    # 모든 페이지의 공통 레이아웃
├── page.tsx      # 홈페이지 (/)
└── globals.css   # 전역 스타일
```

**핵심 개념:**
- `app` 폴더 = Next.js의 App Router
- `page.tsx` = 실제 페이지 컴포넌트
- 폴더 이름 = URL 경로

---

## 2단계: 기본 페이지 만들기 (15분)

### 2.1 홈페이지 살펴보기 (`app/page.tsx`)

현재 홈페이지에는 영화 목록이 표시됩니다.

**학습 포인트:**
1. **React 컴포넌트**: 함수가 UI를 반환
2. **JSX**: HTML처럼 보이지만 JavaScript
3. **map() 함수**: 배열을 반복하여 요소 생성

### 2.2 직접 수정해보기

**실습 1: 영화 제목 바꾸기**
```tsx
// app/page.tsx에서 영화 제목을 찾아서 수정해보세요
title: '인셉션' → '내가 좋아하는 영화'
```

**실습 2: 영화 추가하기**
```tsx
// movies 배열에 새로운 영화 객체를 추가해보세요
{
  id: 6,
  title: '새 영화',
  year: 2024,
  description: '설명',
  director: '감독'
}
```

### 2.3 Link 컴포넌트 이해하기

```tsx
import Link from 'next/link'

<Link href="/movies/1">
  영화 보기
</Link>
```

**왜 Link를 사용하나요?**
- `<a>` 태그는 전체 페이지를 새로고침 (느림)
- `Link`는 필요한 부분만 업데이트 (빠름)

---

## 3단계: 동적 라우팅 이해하기 (20분)

### 3.1 동적 라우팅이란?

URL에 따라 다른 내용을 보여주는 기능입니다.

**예시:**
- `/movies/1` → 첫 번째 영화
- `/movies/2` → 두 번째 영화
- `/movies/3` → 세 번째 영화

### 3.2 동적 라우팅 만들기 (`app/movies/[id]/page.tsx`)

폴더 이름을 `[id]`로 만들면 동적 경로가 됩니다!

```tsx
// [id]는 변수입니다
// /movies/1 → params.id = "1"
// /movies/2 → params.id = "2"
```

### 3.3 params 사용하기

```tsx
export default async function MovieDetail({ params }: PageProps) {
  // URL에서 id 값을 가져옵니다
  const { id } = await params
  const movieId = parseInt(id)  // 문자열을 숫자로 변환
  
  // 해당 id의 영화를 찾습니다
  const movie = movies[movieId]
}
```

**실습: 다른 정보 보여주기**
- 영화 평점 추가
- 감독 이름 강조
- 개봉일 추가

### 3.4 404 페이지 (not-found.tsx)

존재하지 않는 영화를 요청하면 404 페이지가 보입니다.

```
/movies/999 → 영화가 없으면 not-found.tsx가 표시됨
```

---

## 4단계: 스타일링 및 마무리 (15분)

### 4.1 CSS 파일 이해하기 (`app/globals.css`)

전역 CSS 파일에 모든 스타일이 있습니다.

**주요 클래스:**
- `.container`: 전체 콘텐츠를 중앙 정렬
- `.movie-card`: 영화 카드 스타일
- `.movie-grid`: 그리드 레이아웃

### 4.2 스타일 수정해보기

**실습 1: 색상 바꾸기**
```css
/* globals.css에서 */
.header {
  background-color: #2c3e50; /* 여기를 원하는 색으로 변경 */
}
```

**실습 2: 카드 크기 조절**
```css
.movie-grid {
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  /* 250px을 300px로 바꾸면 카드가 커집니다 */
}
```

### 4.3 API 라우트 살펴보기 (`app/api/movies/route.ts`)

Next.js에서는 `app/api` 폴더에 파일을 만들면 자동으로 API 엔드포인트가 됩니다!

```tsx
// GET 요청 처리
export async function GET() {
  return NextResponse.json({ movies })
}
```

**확인 방법:**
1. 개발 서버 실행 중
2. 브라우저에서 `http://localhost:3000/api/movies` 접속
3. JSON 데이터가 보입니다!

---

## 🎓 추가 학습 과제

세션이 끝난 후 시도해볼 수 있는 것들:

### 초급
1. 영화 카드에 이미지 추가하기
2. 영화 검색 기능 만들기
3. 영화별 평점 표시하기

### 중급
4. 영화 정보를 데이터베이스에 저장하기
5. 영화 추가/수정/삭제 기능 만들기
6. 사용자 인증 기능 추가하기

### 고급
7. 외부 영화 API 연동하기 (TMDB API 등)
8. 페이지네이션 구현하기
9. SSR과 클라이언트 렌더링 비교하기

---

## 📖 핵심 개념 정리

### 1. 파일 시스템 라우팅
- `app/page.tsx` → `/`
- `app/about/page.tsx` → `/about`
- `app/movies/[id]/page.tsx` → `/movies/1`, `/movies/2`, ...

### 2. 컴포넌트
```tsx
export default function MyComponent() {
  return <div>안녕하세요</div>
}
```

### 3. Props (속성)
```tsx
function Greeting({ name }: { name: string }) {
  return <h1>안녕하세요, {name}님!</h1>
}
```

### 4. 데이터 바인딩
```tsx
const title = "인셉션"
<h1>{title}</h1> // JSX에서 변수 사용
```

### 5. 리스트 렌더링
```tsx
{movies.map(movie => (
  <div key={movie.id}>{movie.title}</div>
))}
```

---

## ❓ 자주 묻는 질문

**Q: 왜 React를 배워야 하나요?**
A: Next.js는 React를 기반으로 만들어졌습니다. React의 컴포넌트 개념을 이해하면 Next.js를 더 쉽게 사용할 수 있습니다.

**Q: TypeScript가 필수인가요?**
A: 아니요. JavaScript로도 작성할 수 있지만, TypeScript는 오류를 미리 잡아줘서 더 안전합니다.

**Q: CSS를 다른 방법으로 사용할 수 있나요?**
A: 네! Tailwind CSS, styled-components, CSS Modules 등 다양한 방법을 사용할 수 있습니다.

**Q: 실제 프로젝트에서는 데이터를 어디서 가져오나요?**
A: 데이터베이스(MySQL, PostgreSQL, MongoDB 등), 외부 API, 또는 파일에서 가져올 수 있습니다.

---

## 🚀 다음 세션 예고

다음 세션에서는:
- 데이터베이스 연동 (Supabase 또는 Firebase)
- 사용자 인증 (로그인/회원가입)
- 실제 영화 API 사용하기
- 배포하기 (Vercel)

---

**수고하셨습니다! 🎉**

이제 Next.js의 기본을 이해하셨습니다. 계속 연습하고 프로젝트를 만들어보세요!
