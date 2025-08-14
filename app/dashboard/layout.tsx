import SideNav from '@/app/ui/dashboard/sidenav';
import type { PropsWithChildren } from 'react';

/**
 * 해당 경로 상에서 동적인 부분을 Suspense로 감싸고 있다면, Next가 해당 경로 중 어떤 부분이 정적이고, 동적인지 파악할 수 있다.
 * 정적인 부분은 미리 렌더링해놓고, 사용자가 요청하기 전까지 동적인 부분은 렌더링을 미뤄둘 수 있다.
 */
// export const experimental_ppr = true; // PPR 가능해짐

export default function Layout({ children }: PropsWithChildren) {
	return (
		<div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
			<div className="w-full flex-none md:w-64">
				<SideNav />
			</div>
			<div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
		</div>
	);
}
