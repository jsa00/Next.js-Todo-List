'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { deleteTodo, toggleTodo } from '@/app/actions';
import type { Todo } from '@/app/types/todo';

interface TodoDetailActionsProps {
    todo: Todo; // 상세 페이지에 표시 중인 할 일
    onEdit: () => void; // 수정 모드로 전환하는 함수
}

// 상세 페이지 버튼 모음 (완료 토글, 삭제, 수정)
export default function TodoDetailActions({
    todo,
    onEdit,
}: TodoDetailActionsProps) {
    const router = useRouter();
    // Server Action이 끝날 때까지 버튼을 잠그기 위한 진행 상태
    const [isPending, startTransition] = useTransition();

    const handleToggle = () => {
        startTransition(() => toggleTodo(todo.id, todo.is_completed));
    };

    const handleDelete = () => {
        if (!confirm('정말 삭제하겠습니까?')) return;

        startTransition(async () => {
            await deleteTodo(todo.id);
            // 삭제한 상세 페이지로 뒤로 가기가 되지 않도록 방문 기록을 목록으로 바꾼다.
            router.replace('/');
        });
    };

    return (
        <div className="mt-4 flex gap-1">
            <button
                type="button"
                onClick={handleToggle}
                disabled={isPending}
                className="grow cursor-pointer bg-lime-500 py-2 text-white hover:bg-lime-700 disabled:opacity-60"
            >
                {todo.is_completed ? '완료 취소' : '완료'}
            </button>
            <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="grow cursor-pointer bg-red-400 py-2 text-white hover:bg-red-700 disabled:opacity-60"
            >
                삭제
            </button>
            {/* 상세 페이지 안에서 수정 폼으로 전환 */}
            <button
                type="button"
                onClick={onEdit}
                disabled={isPending}
                className="grow cursor-pointer bg-cyan-500 py-2 text-white hover:bg-cyan-700 disabled:opacity-60"
            >
                수정
            </button>
        </div>
    );
}
