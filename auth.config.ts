import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    // 필수 옵션은 아니지만, NextAuth에서 제공하는 디폴트 페이지가 아닌 내가 만든 로그인 페이지(/login)로 리다이렉트시켜줌
    signIn: '/login',
  },
  callbacks: {
    /** authorized 콜백
     * - 들어온 요청이 페이지에 접근할 권한이 있는지 확인하기 위해 Next Middleware에서 사용된다.
     * - 미들웨어가 실행될때 해당 요청이 인증된 사용자에게서 온 요청인지 판단하는 역할을 하는 함수다. (요청이 완료되기 전에 호출)
     * - auth, request 속성을 기반으로 접근 허용 여부를 판단한다.
     * - auth: 로그인된 사용자 세션 정보 (사용자 아이디, 이메일, 만료시간 등)
     * - request: 들어온 HTTP 요청 (url, 헤더, 쿠키 등)
     */
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        else return false; // 로그인 페이지로 리다이렉트됨
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [], // 다양한 로그인 방식을 나열 (구글, 깃헙, 이메일 등 어떤 로그인 방식을 지원할지)
} satisfies NextAuthConfig;
