import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// 로그인 없이 들어갈 수 있는 경로
const PUBLIC_PATHS = ['/login', '/signup'];

// 요청마다 Supabase 세션 쿠키를 갱신하고, 로그인 여부에 따라 이동시키는 함수
// (교안 7장 3강의 utils/supabase/middleware.ts. Next.js 16에서 middleware가 proxy로 이름이 바뀌었다.)
export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                // 갱신된 세션 쿠키를 요청(이후 서버 컴포넌트용)과 응답(브라우저용) 양쪽에 담는다.
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value),
                    );
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options),
                    );
                },
            },
        },
    );

    // 접속한 사용자 확인 (만료된 토큰은 여기서 새로 발급된다.)
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { pathname, search } = request.nextUrl;
    const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

    // 비로그인 사용자가 보호된 페이지에 접근 → /login?redirectUrl=원래 주소
    if (!user && !isPublicPath) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.search = '';
        url.searchParams.set('redirectUrl', pathname + search);
        return NextResponse.redirect(url);
    }

    // 로그인한 사용자가 로그인·회원가입 페이지에 접근 → 메인으로
    if (user && isPublicPath) {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        url.search = '';
        return NextResponse.redirect(url);
    }

    return supabaseResponse;
}
