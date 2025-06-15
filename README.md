# Withwhom?

## 프로젝트 소개
- 누구와, 몇 명이서, 어떤 종류의 플레이스를 방문할지에 따라 핫플레이스, 팝업스토어, 식당을 추천해주는 서비스입니다.
- 사용자는 조건(카테고리, 동행자, 인원수)을 입력하면 지도와 리스트로 추천 장소를 확인할 수 있습니다.
- 운영자는 관리자 페이지에서 장소를 직접 추가/수정/삭제할 수 있습니다.

## 주요 기능
- 장소 카테고리(핫플레이스/팝업스토어/식당) 선택
- 동행자(혼자/연인/친구/가족/동료) 및 인원수 입력
- 조건에 맞는 장소 추천(지도+리스트)
- 관리자 페이지에서 장소 CRUD 및 로그인

## 사용 기술
- Next.js (React 기반, TypeScript)
- MUI (Material UI)
- Leaflet.js (지도)
- MongoDB Atlas (DB)
- Express (API)
- next-auth (인증)

## 개발 및 배포
- 프론트/백엔드: Vercel 배포 추천
- DB: MongoDB Atlas 무료 플랜 사용

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
