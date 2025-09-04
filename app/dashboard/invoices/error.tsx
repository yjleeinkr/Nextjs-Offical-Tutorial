/** React Error Boundary로서 클라이언트 컴포넌트로만 구현 가능하다
 * 서버 컴포넌트는 에러 경계로 쓸 수 없다.
 */
'use client';

import { useEffect } from 'react';

/** 2개의 props를 받는다.
 * 1. error: 자바스크립트 native Error 객체
 * 2. reset: 에러 바운더리를 리셋하는 함수, 호출 시 현재 route를 리렌더한다.
 */
type Props = {
	error: Error & { digest?: string };
	reset: () => void;
};

export default function Error({ error, reset }: Props) {
	useEffect(() => {
		// 에러 로그를 남기면 좋겠다
		console.error(error);
	}, [error]);

	return (
		<main className="flex h-full flex-col items-center justify-center">
			<h2 className="text-center">Something went wrong!</h2>
			<button
				className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
				onClick={() => reset()}
			>
				Try again
			</button>
		</main>
	);
}
