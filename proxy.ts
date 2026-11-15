import type { NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/proxy';

// 모든 페이지 요청 전에 실행되는 라우트 가드 (Next.js 16의 proxy, 이전 이름은 middleware)
export async function proxy(request: NextRequest) {
    return await updateSession(request);
}

export const config = {
    matcher: [
        // 정적 파일과 이미지를 제외한 모든 경로
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
