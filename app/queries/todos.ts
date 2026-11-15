import { createClient } from '@/utils/supabase/server';
import type { Todo } from '@/app/types/todo';

// 할 일 조회 함수 모음 (서버 컴포넌트에서 호출)
// RLS 정책이 로그인한 회원의 할 일만 돌려주므로 user_id 조건을 따로 걸지 않는다.

// 로그인한 회원의 할 일 전체 (날짜 최신순, 같은 날짜면 나중에 등록한 순)
// 조회에 실패하면 오류를 던져 화면에서 오류 상태를 보여 주게 한다.
export async function getTodos(): Promise<Todo[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return (data ?? []) as Todo[];
}

// 할 일 한 건. 없거나 다른 회원의 할 일이면 null
export async function getTodoById(id: number): Promise<Todo | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('id', id)
        .maybeSingle(); // 결과가 0건이어도 오류 대신 null

    if (error) throw new Error(error.message);

    return data as Todo | null;
}

// 주소의 id 문자열을 할 일 번호로 변환. 양의 정수가 아니면 null
export function parseTodoId(value: string): number | null {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
}
