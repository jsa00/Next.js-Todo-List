import type { Metadata } from 'next';
import { Suspense } from 'react';
import AuthForm from '@/app/components/AuthForm';

export const metadata: Metadata = { title: '로그인 | TODO 리스트' };

// 로그인 페이지
// 폼이 주소의 redirectUrl을 읽기 때문에 Suspense로 감싸고, 나머지 화면은 미리 렌더링한다.
export default function LoginPage() {
    return (
        <>
            <h1 className="mb-4 bg-orange-400 px-4 py-2 text-center text-xl text-white">
                로그인
            </h1>
            <Suspense>
                <AuthForm mode="login" />
            </Suspense>
        </>
    );
}
