import type { Metadata } from 'next';
import { Suspense } from 'react';
import AuthForm from '@/app/components/AuthForm';

export const metadata: Metadata = { title: '회원가입 | TODO 리스트' };

// 회원가입 페이지
export default function SignupPage() {
    return (
        <>
            <h1 className="mb-4 bg-orange-400 px-4 py-2 text-center text-xl text-white">
                회원가입
            </h1>
            <Suspense>
                <AuthForm mode="signup" />
            </Suspense>
        </>
    );
}
