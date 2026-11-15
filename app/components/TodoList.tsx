import { createClient } from '@/utils/supabase/server';
import type { Todo } from '@/app/types/todo';
import TodoBoard from './TodoBoard';

// 할 일 목록 조회 (서버 컴포넌트)
// DB 조회는 서버에서 끝내고, 필터·수정 모드 같은 화면 상태는 클라이언트 컴포넌트(TodoBoard)에 넘긴다.
export default async function TodoList() {
    const supabase = await createClient();

    // 날짜 최신순, 같은 날짜면 나중에 등록한 순
    const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

    // 오류 상태
    if (error) {
        return (
            <p className="m-4 py-8 text-center text-red-500">
                할 일을 불러오지 못했습니다: {error.message}
            </p>
        );
    }

    return <TodoBoard todos={(data ?? []) as Todo[]} />;
}
