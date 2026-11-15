'use client';

import { useActionState, useEffect, useRef } from 'react';
import { saveTodo } from '@/app/actions';
import type { Todo, TodoActionState } from '@/app/types/todo';

interface TodoFormProps {
    editingTodo: Todo | null; // 수정 중인 할 일 (null이면 등록 모드)
    onFinish: () => void; // 저장 완료·취소 후 등록 모드로 되돌리는 함수
}

// Server Action 실행 전 초기 상태
const INITIAL_STATE: TodoActionState = { success: false, message: '' };

// 할 일 등록·수정 공용 폼
export default function TodoForm({ editingTodo, onFinish }: TodoFormProps) {
    const [state, formAction, isPending] = useActionState(
        saveTodo,
        INITIAL_STATE,
    );
    const formRef = useRef<HTMLFormElement>(null);
    const titleRef = useRef<HTMLInputElement>(null);
    const isEditing = editingTodo !== null; // 수정 모드 여부

    // 입력칸 기본값: 실패 후 다시 보여 줄 값 → 수정 중인 할 일 → 빈 값
    const defaults = state.values ?? editingTodo;

    // 저장 결과 처리. 실패는 알림창으로 안내하고, 성공하면 등록 모드로 돌아간다.
    useEffect(() => {
        if (!state.message) return;

        if (!state.success) {
            alert(state.message);
            return;
        }

        onFinish();
        titleRef.current?.focus();
    }, [state, onFinish]);

    // 수정 모드가 되면 목록이 길어도 폼이 보이도록 위로 이동한다.
    useEffect(() => {
        if (!isEditing) return;

        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        titleRef.current?.focus({ preventScroll: true });
    }, [isEditing]);

    return (
        <form ref={formRef} action={formAction} className="px-4">
            {/* 수정할 할 일 번호 (등록 모드에서는 빈 값) */}
            <input type="hidden" name="id" value={editingTodo?.id ?? ''} />

            <dl className="mb-1 flex">
                <dt className="mr-1 basis-[150px] bg-amber-400 p-1 text-center text-white">
                    날짜
                </dt>
                <dd className="grow">
                    <input
                        type="date"
                        name="date"
                        defaultValue={defaults?.date ?? ''}
                        className="h-10 w-full rounded-sm border px-4"
                    />
                </dd>
            </dl>
            <dl className="mb-1 flex">
                <dt className="mr-1 basis-[150px] bg-amber-400 p-1 text-center text-white">
                    제목
                </dt>
                <dd className="grow">
                    <input
                        ref={titleRef}
                        type="text"
                        name="title"
                        placeholder="제목을 입력하세요"
                        defaultValue={defaults?.title ?? ''}
                        className="h-10 w-full rounded-sm border px-4"
                    />
                </dd>
            </dl>
            <dl className="mb-4 flex">
                <dt className="mr-1 basis-[150px] bg-amber-400 p-1 text-center text-white">
                    내용
                </dt>
                <dd className="grow">
                    <textarea
                        name="content"
                        placeholder="내용을 입력하세요"
                        defaultValue={defaults?.content ?? ''}
                        className="h-25 w-full rounded-sm border p-4"
                    />
                </dd>
            </dl>

            <button
                type="submit"
                disabled={isPending}
                className="mx-auto block w-1/2 max-w-xs cursor-pointer rounded-sm bg-lime-500 px-5 py-2 text-lg text-white hover:bg-lime-700 disabled:cursor-wait disabled:opacity-60"
            >
                {isPending ? '저장 중...' : isEditing ? '수정하기' : '등록하기'}
            </button>

            {/* 취소 버튼은 수정 모드에서만 보인다. */}
            {isEditing && (
                <button
                    type="button"
                    onClick={onFinish}
                    className="mx-auto mt-2 block w-1/2 max-w-xs cursor-pointer rounded-sm bg-gray-400 px-5 py-2 text-lg text-white hover:bg-gray-700"
                >
                    취소
                </button>
            )}
        </form>
    );
}
