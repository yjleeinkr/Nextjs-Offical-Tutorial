import { CheckIcon, ClockIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
/** clsx를 사용해서 여러 개의 클래스를 조건에 따라 동적으로 결합하게 도와주는 라이브러리
 * 가끔 클래스 네임 상에 조건 걸었을 때 들어가는 불필요한 빈 문자열이나 null, undefined 같은 값을 자동으로 걸러준다
 */

export default function InvoiceStatus({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2 py-1 text-xs",
        {
          "bg-gray-100 text-gray-500": status === "pending",
          "bg-green-500 text-white": status === "paid",
        }
      )}
    >
      {status === "pending" ? (
        <>
          Pending
          <ClockIcon className="ml-1 w-4 text-gray-500" />
        </>
      ) : null}
      {status === "paid" ? (
        <>
          Paid
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
    </span>
  );
}
