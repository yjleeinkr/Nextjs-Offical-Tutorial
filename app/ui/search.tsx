'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	/** debounce 적용 */
	const handleSearch = useDebouncedCallback((term: string) => {
		const params = new URLSearchParams(searchParams);
		if (term) {
			params.set('query', term);
		} else {
			params.delete('query');
		}
		replace(`${pathname}?${params.toString()}`);
	}, 300);

	return (
		<div className="relative flex flex-1 flex-shrink-0">
			<label htmlFor="search" className="sr-only">
				Search
			</label>
			<input
				className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
				placeholder={placeholder}
				onChange={(e) => handleSearch(e.target.value)}
				defaultValue={searchParams.get('query')?.toString()}
			/>
			<MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
		</div>
	);
}
/**
 * defaultValue vs value / Controlled vs Uncontrolled
 * 만약 state로 input의 입력값을 관리한다면 value 라는 속성을 사용해서 Controlled 컴포넌트로 만들어야 하는데 이 경우는 리액트가 input의 입력값을 관리하게 된다.
 * 하지만 위의 케이스처럼 input의 입력값을 상태로 다룰게 아니라면 defaultValue라는 속성을 사용할 수 있다.
 * state에 저장하는 대신 검색 쿼리를 url에 저장하고 있기 때문에 이 경우 브라우저의 기본 input 요소가 입력값의 상태를 스스로 관리하게 된다.
 */
