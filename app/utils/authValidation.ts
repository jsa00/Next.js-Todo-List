import type { AuthActionState } from '@/app/types/auth';

type AuthErrors = NonNullable<AuthActionState['errors']>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 이메일 형식 (아이디@도메인.최상위도메인)
export const PASSWORD_MIN_LENGTH = 6; // Supabase Auth 기본 최소 비밀번호 길이

// 로그인 입력값 검사. 오류가 없으면 빈 객체를 돌려준다.
export function validateLogin(email: string, password: string): AuthErrors {
    const errors: AuthErrors = {};

    if (!email) {
        errors.email = '이메일을 입력하세요.';
    } else if (!EMAIL_REGEX.test(email)) {
        errors.email = '이메일 형식이 올바르지 않습니다.';
    }

    if (!password) {
        errors.password = '비밀번호를 입력하세요.';
    }

    return errors;
}

// 회원가입 입력값 검사. 로그인 검사에 비밀번호 길이·확인 검사를 더한다.
export function validateSignup(
    email: string,
    password: string,
    passwordConfirm: string,
): AuthErrors {
    const errors = validateLogin(email, password);

    if (password && password.length < PASSWORD_MIN_LENGTH) {
        errors.password = `비밀번호는 ${PASSWORD_MIN_LENGTH}자 이상 입력하세요.`;
    }

    if (!passwordConfirm) {
        errors.passwordConfirm = '비밀번호 확인을 입력하세요.';
    } else if (password !== passwordConfirm) {
        errors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    }

    return errors;
}

// 로그인 후 이동할 주소. 다른 사이트로 빠져나가지 않도록 내부 경로만 허용한다.
export function getSafeRedirectUrl(value: FormDataEntryValue | null): string {
    const url = typeof value === 'string' ? value : '';
    return url.startsWith('/') && !url.startsWith('//') ? url : '/';
}
