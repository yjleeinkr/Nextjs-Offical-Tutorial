'use server';
// use server: 파일 내 모든 export 하는 함수들은 Server Actions라고 여김
// 또는 서버 컴포넌트 내에서 바로 Server Actions를 작성해도됨
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import postgres from 'postgres';
import { redirect } from 'next/navigation';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

/**
 * safeParse(폼데이터객체).error.flatten().fieldErrors가 아래와 같이 나오기 때문에
 * State.errors 타입을 이렇게 잡음
 * {
  	customerId: [ 'Please select a customer' ],
  	amount: [ 'Please enter an amount greater than $0' ],
  	status: [ 'Please select an invoice status' ]
	}
 * */
export type State = {
	errors?: {
		customerId?: string[];
		amount?: string[];
		status?: string[];
	};
	message?: string | null;
};

const FormSchema = z.object({
	id: z.string(),
	customerId: z.string({
		invalid_type_error: 'Please select a customer',
	}),
	amount: z.coerce
		.number()
		.gt(0, { message: 'Please enter an amount greater than $0' }),
	status: z.enum(['pending', 'paid'], {
		invalid_type_error: 'Please select an invoice status',
	}),
	date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(prevState: State, formData: FormData) {
	/** parse -> safeParse()
	 * - success | error를 포함한 객체를 리턴해준다.
	 * - 유효성 검증을 도와준다.
	 * */
	const validatedFields = CreateInvoice.safeParse({
		customerId: formData.get('customerId'),
		amount: formData.get('amount'),
		status: formData.get('status'),
		// 폼데이터 내 속성이 많다면, Object.fromEntries(formData) 사용
	});

	// DB 삽입 전 유효성 검사
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Missing Fields. Failed to Create Invoice',
		};
	}

	// 유효성 검사를 거친 데이터
	const { customerId, amount, status } = validatedFields.data;
	const amountInCents = amount * 100; // 자바스크립트 부동소수점 오류 제거를 위해 cents 단위로 전환
	const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 형식으로

	try {
		await sql`
		INSERT INTO invoices (customer_id, amount, status, date)
		VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
	`;
	} catch (err) {
		// 데이터베이스 에러 발생 시
		console.error(err);
		return {
			message: 'Database Error: Failed to Create Invoice.',
		};
	}

	// DB 업데이트 후 /dashboard/invoices는 재검증되었고, 새로운 데이터가 페칭된다.
	revalidatePath('/dashboard/invoices');
	redirect('/dashboard/invoices');
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(
	id: string,
	prevState: State,
	formData: FormData,
) {
	const validatedFields = UpdateInvoice.safeParse({
		customerId: formData.get('customerId'),
		amount: formData.get('amount'),
		status: formData.get('status'),
	});

	// DB 삽입 전 유효성 검사
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Missing Fields. Failed to Update Invoice',
		};
	}

	// 유효성 검사를 거친 데이터
	const { customerId, amount, status } = validatedFields.data;
	const amountInCents = amount * 100;
	try {
		await sql`
		UPDATE invoices
		SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
		WHERE id = ${id}
	`;
	} catch (err) {
		console.error(err);
		return { message: 'Database Error: Failed to Update Invoice.' };
	}

	revalidatePath('/dashboard/invoices');
	redirect('/dashboard/invoices');
	/** redirect
	 * redirect는 내부적으로 에러를 던지는 방식으로 동작한다.
	 * 그래서 try/catch 블록 안에서 redirect를 호출하면, catch에서 그 에러를 잡아버린다.
	 * 그러면 의도대로 리다이렉트되지 않고, 예외 처리 로직이 실행될 수 있다.
	 * 따라서, redirect는 try/catch 블록 밖에서 호출한다.
	 */
}

export async function deleteInvoice(id: string) {
	await sql`
		DELETE FROM invoices WHERE id = ${id}
	`;
	revalidatePath('/dashboard/invoices');
}
