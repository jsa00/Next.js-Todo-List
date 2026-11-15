import Link from 'next/link';

// 없는 할 일·다른 회원의 할 일·잘못된 주소일 때 (page.tsx에서 notFound() 호출)
export default function TodoNotFound() {
    return (
        <main className="mx-auto max-w-xl px-4 py-10 text-center">
            <p className="mb-2 text-4xl">🔍</p>
            <h1 className="mb-2 text-xl">할 일을 찾을 수 없어요.</h1>
            <p className="mb-6 text-gray-500">
                삭제되었거나 다른 회원의 할 일일 수 있어요.
            </p>
            <Link
                href="/"
                className="text-orange-500 underline underline-offset-4 hover:text-orange-700"
            >
                ← 목록으로
            </Link>
        </main>
    );
}
