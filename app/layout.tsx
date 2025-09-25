/** global.css
 * - 모든 경로에 적용시킬 CSS 파일 (css reset해주거나 사이트 전반적으로 쓰일 요소에 대한 스타일링)
 * - top-level 컴포넌트에 global.css를 import 해주는 게 가장 좋다.
 */
import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';

/** layout 내 메타데이터 추가 시 해당 레이아웃을 가지는 모든 페이지에 메타데이터가 공유됨
 * - RootLayout에 추가했으므로 전역에 아래 메타데이터가 공유됨
 */
export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard', // %s 부분이 특정 page title로 대체된다.
    default: 'Acme Dashboard', // page 내 title이 정해진 게 없다면 디폴트로 보여줄 타이틀 설정
  },
  description: 'The officail Next.js Course Dashboard, build with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* 앱 전역에 폰트 적용 + antialiased 테일윈드 유틸 클래스 사용 (안티 앨리어싱 효과 > 폰트를 좀 더 부드러워 보이는 효과)*/}
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
