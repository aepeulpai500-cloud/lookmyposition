# MEXC Positions

Next.js로 만든 MEXC 포지션 관리 대시보드입니다.

## 로컬 실행

```bash
npm install
npm run dev
```

http://localhost:3000에서 접속하세요.

## 환경 변수

`.env` 파일에 다음 변수들을 설정하세요:

```
MEXC_API_KEY=your_api_key
MEXC_API_SECRET=your_api_secret
```

## Vercel 배포

### 1. GitHub에 푸시

```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

### 2. Vercel에서 배포

1. [vercel.com](https://vercel.com) 접속 후 GitHub 계정으로 로그인
2. "Add New Project" 클릭
3. 리포지토리 선택 후 "Import"
4. "Deploy" 클릭

### 3. 환경 변수 설정

배포 후 Vercel 대시보드에서:
- Settings → Environment Variables
- 다음 변수들 추가:
  - `MEXC_API_KEY`: MEXC API 키
  - `MEXC_API_SECRET`: MEXC API 시크릿
- "Redeploy" 클릭

## 기술 스택

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
