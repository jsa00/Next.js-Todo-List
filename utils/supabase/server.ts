// Next.js SSR 전용 Supabase 클라이언트 생성 함수
import { createServerClient } from '@supabase/ssr';
// Next.js 서버 쿠키 관리 함수
import { cookies } from 'next/headers';

// 서버 컴포넌트·Server Actions에서 호출하는 Supabase 클라이언트 생성 함수
export async function createClient() {
    // 현재 요청의 쿠키 저장소
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                // 모든 쿠키 조회
                getAll() {
                    return cookieStore.getAll();
                },
                // 변경된 쿠키 저장
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options),
                        );
                    } catch {
                        // 서버 컴포넌트 렌더링 중에는 쿠키를 쓸 수 없어 무시한다.
                    }
                },
            },
        },
    );
}
