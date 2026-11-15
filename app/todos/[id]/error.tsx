'use client';

import Link from 'next/link';

interface TodoErrorProps {
    error: Error & { digest?: string }; // 서버에서 던진 오류
    retry: () => void; // 데이터를 다시 받아 이 구간을 다시 렌더링하는 함수
}

// 상세 페이지 오류 상태 (조회 중 오류가 나면 page.tsx 대신 보인다.)
// 오류 경계는 브라우저에서 동작해야 해서 클라이언트 컴포넌트로 만든다.
export default function TodoError({ retry }: TodoErrorProps) {
    return (
        <main className="mx-auto max-w-xl px-4 py-10 text-center">
            <h1 className="mb-2 text-xl text-red-500">
                할 일을 불러오지 못했어요.
            </h1>
            <p className="mb-6 text-gray-500">잠시 후 다시 시도해 주세요.</p>
            <div className="flex justify-center gap-4">
                <button
                    type="button"
                    onClick={() => retry()}
                    className="cursor-pointer rounded-sm bg-lime-500 px-4 py-1 text-white hover:bg-lime-700"
                >
                    다시 시도
                </button>
                <Link
                    href="/"
                    className="py-1 text-orange-500 underline underline-offset-4 hover:text-orange-700"
                >
                    ← 목록으로
                </Link>
            </div>
        </main>
    );
}
