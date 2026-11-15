'use client';

import { useTransition } from 'react';
import { deleteTodo, toggleTodo } from '@/app/actions';
import type { Todo } from '@/app/types/todo';

interface TodoItemProps {
    todo: Todo; // 화면에 표시할 할 일 한 건
    isEditing: boolean; // 수정 중인 할 일인지 여부 (강조 테두리 표시)
    onEdit: (todo: Todo) => void; // 수정 모드 시작 함수
    onDeleted: (id: number) => void; // 삭제 후 처리 함수
}

// 할 일 카드 한 장 (완료 체크박스, 삭제·수정 버튼)
export default function TodoItem({
    todo,
    isEditing,
    onEdit,
    onDeleted,
}: TodoItemProps) {
    // Server Action이 끝날 때까지 버튼을 잠그기 위한 진행 상태
    const [isPending, startTransition] = useTransition();
    const doneClass = todo.is_completed ? 'line-through text-gray-400' : ''; // 완료한 할 일의 취소선

    const handleToggle = () => {
        startTransition(() => toggleTodo(todo.id, todo.is_completed));
    };

    const handleDelete = () => {
        if (!confirm('정말 삭제하겠습니까?')) return;

        startTransition(async () => {
            await deleteTodo(todo.id);
            onDeleted(todo.id);
        });
    };

    return (
        <li
            className={`todo-item group rounded-sm border border-gray-400 p-4 ${
                todo.is_completed ? 'is-done' : ''
            } ${isEditing ? 'ring-2 ring-indigo-500' : ''} ${
                isPending ? 'opacity-60' : ''
            }`}
        >
            <label className="mb-1 flex w-fit cursor-pointer items-center gap-2">
                <input
                    type="checkbox"
                    checked={todo.is_completed}
                    onChange={handleToggle}
                    disabled={isPending}
                    className="h-4 w-4 cursor-pointer"
                />
                <span className="text-sm text-gray-500">완료</span>
            </label>
            <div className={`group-hover:shadow-md ${doneClass}`}>
                [{todo.date}]{todo.title}
            </div>
            <div className={`todo-content ${doneClass}`}>{todo.content}</div>
            <div className="flex justify-between gap-1">
                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isPending}
                    className="grow cursor-pointer bg-red-400 py-2 text-white hover:bg-red-700"
                >
                    삭제
                </button>
                <button
                    type="button"
                    onClick={() => onEdit(todo)}
                    disabled={isPending}
                    className="grow cursor-pointer bg-cyan-500 py-2 text-white hover:bg-cyan-700"
                >
                    수정
                </button>
            </div>
        </li>
    );
}
