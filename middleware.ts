import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

// 미들웨어 > authConfig로 NextAuth 초기화 및 auth 속성을 export 해야함
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
  runtime: 'nodejs',
};

/** 미들웨어 추가함으로써 미들웨어가 인증을 거치기 전까지 렌더링을 시작하지 않으므로 보안 및 애플리케이션 성능면에서 좋다 */
