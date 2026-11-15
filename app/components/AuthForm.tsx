'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useActionState } from 'react';
import { login, signup } from '@/app/(auth)/actions';
import type { AuthActionState, AuthField } from '@/app/types/auth';

interface AuthFormProps {
    mode: 'login' | 'signup'; // 로그인 폼인지 회원가입 폼인지
}

// Server Action 실행 전 초기 상태
const INITIAL_STATE: AuthActionState = { success: false };

// 모드별 화면 문구와 실행할 Server Action
const FORM_CONFIG = {
    login: {
        action: login,
        submitLabel: '로그인',
        linkText: '아직 회원이 아니신가요?',
        linkLabel: '회원가입',
        linkHref: '/signup',
    },
    signup: {
        action: signup,
        submitLabel: '회원가입',
        linkText: '이미 회원이신가요?',
        linkLabel: '로그인',
        linkHref: '/login',
    },
} as const;

// 로그인·회원가입 공용 폼
export default function AuthForm({ mode }: AuthFormProps) {
    const config = FORM_CONFIG[mode];
    const [state, formAction, isPending] = useActionState(
        config.action,
        INITIAL_STATE,
    );

    // 로그인 전에 들어가려던 주소 (proxy가 ?redirectUrl=로 넘겨준다.)
    const redirectUrl = useSearchParams().get('redirectUrl') ?? '/';

    // 입력칸 한 줄 (JavaScript Todo List의 등록 양식과 같은 모양)
    const renderField = (
        name: AuthField,
        label: string,
        type: 'email' | 'password',
        placeholder: string,
    ) => (
        <dl className="mb-1">
            <div className="flex">
                <dt className="mr-1 basis-[150px] bg-amber-400 p-1 text-center text-white">
                    <label htmlFor={`${mode}-${name}`}>{label}</label>
                </dt>
                <dd className="grow">
                    <input
                        id={`${mode}-${name}`}
                        type={type}
                        name={name}
                        placeholder={placeholder}
                        defaultValue={
                            name === 'email' ? state.email : undefined
                        }
                        autoComplete={
                            name === 'email'
                                ? 'email'
                                : mode === 'login'
                                  ? 'current-password'
                                  : 'new-password'
                        }
                        aria-invalid={Boolean(state.errors?.[name])}
                        className="h-10 w-full rounded-sm border bg-white px-4 aria-invalid:border-red-400"
                    />
                </dd>
            </div>
            {/* 입력칸별 오류 문구 */}
            {state.errors?.[name] && (
                <dd className="mt-1 text-right text-sm text-red-500">
                    {state.errors[name]}
                </dd>
            )}
        </dl>
    );

    return (
        <form action={formAction} noValidate className="px-4">
            {/* 서버 응답 안내 문구 (성공은 초록, 실패는 빨강) */}
            {state.message && (
                <p
                    role={state.success ? 'status' : 'alert'}
                    className={`mb-4 rounded-sm border p-3 text-center ${
                        state.success
                            ? 'border-lime-300 bg-lime-50 text-lime-700'
                            : 'border-red-200 bg-red-50 text-red-600'
                    }`}
                >
                    {state.message}
                </p>
            )}

            <input type="hidden" name="redirectUrl" value={redirectUrl} />

            {renderField('email', '이메일', 'email', '이메일을 입력하세요')}
            {renderField(
                'password',
                '비밀번호',
                'password',
                mode === 'signup'
                    ? '6자 이상 입력하세요'
                    : '비밀번호를 입력하세요',
            )}
            {mode === 'signup' &&
                renderField(
                    'passwordConfirm',
                    '비밀번호 확인',
                    'password',
                    '비밀번호를 한 번 더 입력하세요',
                )}

            <button
                type="submit"
                disabled={isPending}
                className="mx-auto mt-4 block w-1/2 max-w-xs cursor-pointer rounded-sm bg-lime-500 px-5 py-2 text-lg text-white hover:bg-lime-700 disabled:cursor-wait disabled:opacity-60"
            >
                {isPending ? '처리 중...' : config.submitLabel}
            </button>

            <p className="mt-4 text-center text-gray-500">
                {config.linkText}{' '}
                <Link
                    href={config.linkHref}
                    className="text-orange-500 underline underline-offset-4 hover:text-orange-700"
                >
                    {config.linkLabel}
                </Link>
            </p>
        </form>
    );
}
