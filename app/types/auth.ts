// 로그인·회원가입 입력 항목 이름
export type AuthField = 'email' | 'password' | 'passwordConfirm';

// 로그인·회원가입 Server Action 결과
export interface AuthActionState {
    success: boolean; // 요청 성공 여부
    message?: string; // 폼 위에 보여 줄 안내 문구
    errors?: Partial<Record<AuthField, string>>; // 입력칸별 오류 문구
    email?: string; // 실패 후 다시 채워 줄 이메일
}
