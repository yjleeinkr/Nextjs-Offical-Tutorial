/**
 * not-found.tsx가 error.tsx보다 우선권을 가진다.
 * 구체적인 에러를 처리하고 싶다면 not-found를 사용
 * - 예상못한 예외 등 일반적인 에러, 예외는 error.tsx로
 * - 404 같은 특정 예외에선 not-found.tsx 사용
 */

import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
	return (
		<main className="flex h-full flex-col items-center justify-center gap-2">
			<FaceFrownIcon className="w-10 text-gray-400" />
			<h2 className="text-xl font-semibold">404 Not Found</h2>
			<p>Could not find the requested invoice.</p>
			<Link
				href="/dashboard/invoices"
				className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
			>
				Go Back
			</Link>
		</main>
	);
}
