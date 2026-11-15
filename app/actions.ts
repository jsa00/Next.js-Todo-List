'use server';

// Supabase 서버 클라이언트 생성 함수
import { createClient } from '@/utils/supabase/server';
// 캐시 갱신 함수
import { revalidatePath } from 'next/cache';
import type { TodoActionState } from '@/app/types/todo';

// 필수 입력 항목과 비었을 때 보여 줄 메시지 (JavaScript Todo List와 같은 문구)
const REQUIRED_FIELDS = {
    date: '날짜를 선택하세요.',
    title: '할일 제목을 입력하세요.',
    content: '할일 내용을 입력하세요.',
} as const;

type TodoField = keyof typeof REQUIRED_FIELDS;

// 할 일 등록·수정 공용 Server Action
// 폼에 숨은 id 값이 있으면 수정, 없으면 등록한다.
export async function saveTodo(
    _prevState: TodoActionState,
    formData: FormData,
): Promise<TodoActionState> {
    const fields = Object.keys(REQUIRED_FIELDS) as TodoField[];

    // 세 입력값을 앞뒤 공백 없이 읽는다.
    const values = Object.fromEntries(
        fields.map((key) => [key, String(formData.get(key) ?? '').trim()]),
    ) as Record<TodoField, string>;

    // 비어 있는 첫 번째 항목
    const emptyField = fields.find((key) => !values[key]);
    if (emptyField) {
        return { success: false, message: REQUIRED_FIELDS[emptyField], values };
    }

    const id = Number(formData.get('id')) || null; // 수정할 할 일 번호
    const supabase = await createClient();

    const { error } = id
        ? await supabase.from('todos').update(values).eq('id', id)
        : await supabase.from('todos').insert(values);

    if (error) {
        console.error('할 일 저장 에러:', error.message);
        return {
            success: false,
            message: id
                ? '할 일을 수정하지 못했습니다.'
                : '할 일을 등록하지 못했습니다.',
            values,
        };
    }

    // 메인 페이지 캐시를 비워 최신 목록을 다시 그린다.
    revalidatePath('/');
    return { success: true, message: id ? '수정했습니다.' : '등록했습니다.' };
}

// 할 일 완료 상태 토글 Server Action
export async function toggleTodo(id: number, isCompleted: boolean) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('todos')
        .update({ is_completed: !isCompleted })
        .eq('id', id);

    if (error) {
        console.error('데이터 수정 에러:', error.message);
        return;
    }

    revalidatePath('/');
}

// 할 일 삭제 Server Action
export async function deleteTodo(id: number) {
    const supabase = await createClient();

    const { error } = await supabase.from('todos').delete().eq('id', id);

    if (error) {
        console.error('데이터 삭제 에러:', error.message);
        return;
    }

    revalidatePath('/');
}
