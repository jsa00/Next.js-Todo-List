import type { Todo, TodoFilter } from '@/app/types/todo';

interface TodoFilterOption {
    label: string; // 필터 버튼 문구
    match: (todo: Todo) => boolean; // filter()에 그대로 넘기는 조건 함수
    empty: string; // 조건에 맞는 할 일이 없을 때 보여 줄 문구
}

// 조회 필터 목록. 필터를 늘리려면 TodoFilter 타입과 여기에 항목만 추가하면 된다.
export const TODO_FILTERS: Record<TodoFilter, TodoFilterOption> = {
    all: {
        label: '전체',
        match: () => true,
        empty: '오늘 해야 할 일은 무엇인가요?',
    },
    active: {
        label: '진행 중',
        match: (todo) => !todo.is_completed,
        empty: '진행 중인 할 일이 없어요.',
    },
    done: {
        label: '완료',
        match: (todo) => todo.is_completed,
        empty: '완료한 할 일이 없어요.',
    },
};

// 필터 이름 배열 (버튼 출력 순서)
export const TODO_FILTER_NAMES = Object.keys(TODO_FILTERS) as TodoFilter[];
