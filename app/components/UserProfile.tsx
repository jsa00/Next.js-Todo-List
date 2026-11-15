import { logout } from '@/app/(auth)/actions';
import { createClient } from '@/utils/supabase/server';

// 접속 계정 표시와 로그아웃 버튼 (서버 컴포넌트)
export default async function UserProfile() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // proxy가 비로그인 사용자를 /login으로 보내므로 보통은 여기까지 오지 않는다.
    if (!user) return null;

    return (
        <div className="mx-4 mb-4 flex items-center justify-end gap-3 text-gray-500">
            <span>{user.email}</span>
            <form action={logout}>
                <button
                    type="submit"
                    className="cursor-pointer rounded-sm bg-gray-400 px-3 py-1 text-white hover:bg-gray-700"
                >
                    로그아웃
                </button>
            </form>
        </div>
    );
}
