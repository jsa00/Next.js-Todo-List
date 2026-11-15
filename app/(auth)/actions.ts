'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import type { AuthActionState } from '@/app/types/auth';
import {
    getSafeRedirectUrl,
    validateLogin,
    validateSignup,
} from '@/app/utils/authValidation';

// 로그인 Server Action
export async function login(
    _prevState: AuthActionState,
    formData: FormData,
): Promise<AuthActionState> {
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');

    const errors = validateLogin(email, password);
    if (Object.keys(errors).length > 0) {
        return { success: false, errors, email };
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error('로그인 에러:', error.message);
        return {
            success: false,
            message:
                error.code === 'email_not_confirmed'
                    ? '메일 인증을 마친 뒤 로그인해 주세요.'
                    : '이메일 또는 비밀번호가 일치하지 않습니다.',
            email,
        };
    }

    // 로그인 상태가 바뀌었으므로 모든 페이지 캐시를 비운다.
    revalidatePath('/', 'layout');
    // 로그인 전에 들어가려던 페이지로 이동
    redirect(getSafeRedirectUrl(formData.get('redirectUrl')));
}

// 회원가입 Server Action
export async function signup(
    _prevState: AuthActionState,
    formData: FormData,
): Promise<AuthActionState> {
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');
    const passwordConfirm = String(formData.get('passwordConfirm') ?? '');

    const errors = validateSignup(email, password, passwordConfirm);
    if (Object.keys(errors).length > 0) {
        return { success: false, errors, email };
    }

    // 인증 메일의 링크를 누르면 돌아올 주소 (현재 접속한 사이트의 로그인 페이지)
    const origin = (await headers()).get('origin') ?? '';

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${origin}/login` },
    });

    if (error) {
        console.error('회원가입 에러:', error.message);
        return {
            success: false,
            message:
                error.code === 'user_already_exists'
                    ? '이미 가입된 이메일입니다.'
                    : error.code === 'over_email_send_rate_limit'
                      ? '요청이 많습니다. 잠시 후 다시 시도해 주세요.'
                      : '회원가입에 실패했습니다.',
            email,
        };
    }

    // 메일 인증을 켠 프로젝트는 이미 가입된 이메일이어도 오류 없이 identities가 빈 사용자를 돌려준다.
    if (data.user?.identities?.length === 0) {
        return { success: false, message: '이미 가입된 이메일입니다.', email };
    }

    // 메일 인증이 필요하면 세션이 없어서 바로 로그인되지 않는다.
    if (!data.session) {
        return {
            success: true,
            message:
                '가입 확인 메일을 보냈습니다. 메일의 링크를 누른 뒤 로그인해 주세요.',
        };
    }

    revalidatePath('/', 'layout');
    redirect('/');
}

// 로그아웃 Server Action
export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();

    revalidatePath('/', 'layout');
    redirect('/login');
}
