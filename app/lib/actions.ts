'use server';
// use server: 파일 내 모든 export 하는 함수들은 Server Actions라고 여김
// 또는 서버 컴포넌트 내에서 바로 Server Actions를 작성해도됨
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import postgres from 'postgres';
import { redirect } from 'next/navigation';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
	id: z.string(),
	customerId: z.string(),
	amount: z.coerce.number(),
	status: z.enum(['pending', 'paid']),
	date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
	const { customerId, amount, status } = CreateInvoice.parse({
		customerId: formData.get('customerId'),
		amount: formData.get('amount'),
		status: formData.get('status'),
		// 폼데이터 내 속성이 많다면, Object.fromEntries(formData) 사용
	});

	const amountInCents = amount * 100; // 자바스크립트 부동소수점 오류 제거를 위해 cents 단위로 전환
	const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 형식으로

	try {
		await sql`
		INSERT INTO invoices (customer_id, amount, status, date)
		VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
	`;
	} catch (err) {
		console.error(err);
	}

	// DB 업데이트 후 /dashboard/invoices는 재검증되었고, 새로운 데이터가 페칭된다.
	revalidatePath('/dashboard/invoices');
	redirect('/dashboard/invoices');
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
	const { customerId, amount, status } = UpdateInvoice.parse({
		customerId: formData.get('customerId'),
		amount: formData.get('amount'),
		status: formData.get('status'),
	});

	const amountInCents = amount * 100;
	try {
		await sql`
		UPDATE invoices
		SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
		WHERE id = ${id}
	`;
	} catch (err) {
		console.error(err);
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
