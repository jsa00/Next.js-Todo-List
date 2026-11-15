// Next.js SSR 전용 Supabase 클라이언트 생성 함수
import { createServerClient } from '@supabase/ssr';
// Next.js 서버 쿠키 관리 함수
import { cookies } from 'next/headers';
// 요청 시점까지 렌더링을 미루는 함수
import { connection } from 'next/server';

// 서버 컴포넌트·Server Actions에서 호출하는 Supabase 클라이언트 생성 함수
export async function createClient() {
    // Supabase는 토큰 만료를 확인하려고 Date.now()를 쓰는데, cacheComponents는 미리 렌더링할 때 현재 시각 사용을 막는다.
    // connection()으로 이 클라이언트를 쓰는 부분은 요청이 들어온 뒤에만 렌더링되게 한다.
    await connection();

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
