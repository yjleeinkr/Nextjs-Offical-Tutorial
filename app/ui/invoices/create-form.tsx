'use client';

import { CustomerField } from '@/app/lib/definitions';
import Link from 'next/link';
import {
	CheckIcon,
	ClockIcon,
	CurrencyDollarIcon,
	UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createInvoice, State } from '@/app/lib/actions';
import { useActionState } from 'react';

/** form action 속성
 * - 기존 HTML에선 form의 action속성에 해당 폼 데이터를 보낼 주소 URL(POST API 엔드포인트)를 입력했다. 즉, 사용자가 form을 제출하면 그 URL로 데이터가 전송됐다.
 * - 하지만 리액트에선 action 속성을 URL이 아닌 특수한 props로 취급한다. 즉, React가 action 속성을 확장해서 Server Action을 직접 호출할 수 있게 해준다.
 * - 내부적으로 리액트가 서버 액션을 사용하면 자동으로 POST API 엔드포인트를 만들어준다.
 *   즉, 따로 API 라우트를 직접 작성하지 않아도 form의 action에 server action을 연결하면 바로 서버에 요청을 보낼 수 있다.
 */
export default function Form({ customers }: { customers: CustomerField[] }) {
	const initialState: State = { message: null, errors: {} };
	/** useActionState(form action 속성에 붙인 서버 액션, 초기 상태)
	 * 폼 상태와 폼 제출 시 호출되는 함수를 제공
	 * - useActionState 첫번째 인자로 들어가는 폼 액션 함수의 인자
	 * 	1. previousState: 기존 상태
	 * 	2. formData: 폼 데이터
	 * - useActionState 두번째 인자: 초기 상태값
	 * - 배열 리턴
	 * 1. state: 최신 폼 state
	 * 2. formAction: 폼에서 사용할 새로운 액션함수
	 * 3. isPending: 액션 대기 중 여부
	 */
	const [state, formAction] = useActionState(createInvoice, initialState);

	/** 접근성을 위해 form 내부 요소들에 추가한 속성
	 * 1. aria-describedby="customer-error"
	 * - select 요소와 aria-describedby에 매겨진 customer-error를 id로 가진 요소 사이에 관계를 설정해준다.
	 * - id="customer-error"인 요소가 select를 설명하는 요소라고 명시하는 것이다.
	 * - 사용자가 select 태그에 접근 시 스크린 리더가 id="customer-error"인 요소 안의 메시지를 함께 읽어준다.
	 * 2. aria-live="polite"
	 * - aria-describedby에 연결된 요소의 내용이 바뀌면 사용자에게 어떤 모드로 알려줄지에 대한 속성이다.
	 * - 내용이 바뀌면 스크린 리더가 자동으로 사용자에게 알려주는데, polite 모드는 사용자가 입력 중인 상황을 방해하지 않고 여유 있을 때 읽어준다.
	 * - 반면 assertive를 쓰면 즉시 중단하고 곧바로 읽어주는데, 보통 오류 안내는 polite 모드를 쓰는게 적절하다고 한다.
	 * 3. aria-atomic="true"
	 * - 스크린 리더가 aria-live 영역 안의 컨텐츠 변경 시 어떤 부분을 읽어줄 지에 대한 속성이다.
	 * - true일 경우, 전체 영역을 통째로 읽도록 강제한다. (맥락 놓칠 수 있을때 사용)
	 * - false일 경우, 변경된 부분만 읽는다. (업데이트가 잦고, 전체를 매번 읽는다고 쳤을때 불필요하게 장황해지는 경우 사용)
	 */
	return (
		<form action={formAction}>
			<div className="rounded-md bg-gray-50 p-4 md:p-6">
				{/* Customer Name */}
				<div className="mb-4">
					<label htmlFor="customer" className="mb-2 block text-sm font-medium">
						Choose customer
					</label>
					<div className="relative">
						<select
							id="customer"
							name="customerId"
							className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
							defaultValue=""
							aria-describedby="customer-error"
						>
							<option value="" disabled>
								Select a customer
							</option>
							{customers.map((customer) => (
								<option key={customer.id} value={customer.id}>
									{customer.name}
								</option>
							))}
						</select>
						<UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
					</div>
					<div id="customer-error" aria-live="polite" aria-atomic="true">
						{state.errors?.customerId &&
							state.errors.customerId.map((error) => (
								<p className="mt-2 text-sm text-red-500" key={error}>
									{error}
								</p>
							))}
					</div>
				</div>

				{/* Invoice Amount */}
				<div className="mb-4">
					<label htmlFor="amount" className="mb-2 block text-sm font-medium">
						Choose an amount
					</label>
					<div className="relative mt-2 rounded-md">
						<div className="relative">
							<input
								id="amount"
								name="amount"
								type="number"
								step="0.01"
								placeholder="Enter USD amount"
								className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
								aria-describedby="amount-error"
							/>
							<CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
						</div>
					</div>
					<div id="amount-error" aria-live="polite" aria-atomic="true">
						{state.errors?.amount &&
							state.errors.amount.map((error) => (
								<p className="mt-2 text-sm text-red-500" key={error}>
									{error}
								</p>
							))}
					</div>
				</div>

				{/* Invoice Status */}
				<fieldset>
					<legend className="mb-2 block text-sm font-medium">
						Set the invoice status
					</legend>
					<div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
						<div className="flex gap-4">
							<div className="flex items-center">
								<input
									id="pending"
									name="status"
									type="radio"
									value="pending"
									className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
								/>
								<label
									htmlFor="pending"
									className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
								>
									Pending <ClockIcon className="h-4 w-4" />
								</label>
							</div>
							<div className="flex items-center">
								<input
									id="paid"
									name="status"
									type="radio"
									value="paid"
									className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
								/>
								<label
									htmlFor="paid"
									className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
								>
									Paid <CheckIcon className="h-4 w-4" />
								</label>
							</div>
						</div>
					</div>
					<div id="status-error" aria-live="polite" aria-atomic="true">
						{state.errors?.status &&
							state.errors.status.map((error) => (
								<p className="mt-2 text-sm text-red-500" key={error}>
									{error}
								</p>
							))}
					</div>
				</fieldset>
				<div aria-live="polite" aria-atomic="true">
					{state.message ? (
						<p className="mt-2 text-sm text-red-500">{state.message}</p>
					) : null}
				</div>
			</div>
			<div className="mt-6 flex justify-end gap-4">
				<Link
					href="/dashboard/invoices"
					className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
				>
					Cancel
				</Link>
				<Button type="submit">Create Invoice</Button>
			</div>
		</form>
	);
}
