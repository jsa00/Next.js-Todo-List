'use client';

import type { TodoFilter } from '@/app/types/todo';
import { TODO_FILTERS, TODO_FILTER_NAMES } from '@/app/utils/todoFilters';

interface TodoFiltersProps {
    filter: TodoFilter; // 현재 선택한 필터
    counts: Record<TodoFilter, number>; // 필터별 할 일 개수
    onChange: (filter: TodoFilter) => void; // 필터 변경 함수
}

// 할 일 조회 필터 버튼 (전체 / 진행 중 / 완료)
export default function TodoFilters({
    filter,
    counts,
    onChange,
}: TodoFiltersProps) {
    return (
        <nav
            className="mx-4 mt-6 flex justify-center gap-2"
            aria-label="할 일 필터"
        >
            {TODO_FILTER_NAMES.map((name) => (
                <button
                    key={name}
                    type="button"
                    aria-pressed={filter === name}
                    onClick={() => onChange(name)}
                    className="cursor-pointer rounded-full border border-orange-400 bg-white px-4 py-1 hover:bg-orange-100 aria-pressed:bg-orange-400 aria-pressed:text-white"
                >
                    {TODO_FILTERS[name].label} <span>{counts[name]}</span>
                </button>
            ))}
        </nav>
    );
}
