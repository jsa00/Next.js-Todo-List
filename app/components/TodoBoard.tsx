'use client';

import { useCallback, useState } from 'react';
import type { Todo, TodoFilter } from '@/app/types/todo';
import { TODO_FILTERS, TODO_FILTER_NAMES } from '@/app/utils/todoFilters';
import TodoForm from './TodoForm';
import TodoFilters from './TodoFilters';
import TodoItem from './TodoItem';

interface TodoBoardProps {
    todos: Todo[]; // 서버에서 조회한 전체 할 일
}

// 할 일 화면 상태 관리 (선택한 필터, 수정 중인 할 일)
export default function TodoBoard({ todos }: TodoBoardProps) {
    const [filter, setFilter] = useState<TodoFilter>('all'); // 현재 조회 필터
    const [editingTodo, setEditingTodo] = useState<Todo | null>(null); // 수정 중인 할 일 (null이면 등록 모드)

    // 필터별 할 일 개수 ({ all: 3, active: 2, done: 1 })
    const counts = Object.fromEntries(
        TODO_FILTER_NAMES.map((name) => [
            name,
            todos.filter(TODO_FILTERS[name].match).length,
        ]),
    ) as Record<TodoFilter, number>;

    const { match, empty } = TODO_FILTERS[filter];
    const visibleTodos = todos.filter(match); // 현재 필터 조건에 맞는 할 일

    // 등록 모드로 되돌리기
    // TodoForm의 useEffect 의존성이라 useCallback으로 같은 함수를 유지한다.
    const resetEditing = useCallback(() => setEditingTodo(null), []);

    // 수정 중이던 할 일을 삭제하면 등록 모드로 되돌린다.
    const handleDeleted = (id: number) => {
        if (editingTodo?.id === id) resetEditing();
    };

    return (
        <>
            {/* 할 일이 바뀌면 key가 달라져 폼이 새 값으로 다시 만들어진다. */}
            <TodoForm
                key={editingTodo?.id ?? 'new'}
                editingTodo={editingTodo}
                onFinish={resetEditing}
            />

            <TodoFilters filter={filter} counts={counts} onChange={setFilter} />

            <ul className="todo-items m-4 grid gap-4 p-4 md:grid-cols-2">
                {visibleTodos.length > 0 ? (
                    // 성공 상태
                    visibleTodos.map((todo) => (
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            isEditing={editingTodo?.id === todo.id}
                            onEdit={setEditingTodo}
                            onDeleted={handleDeleted}
                        />
                    ))
                ) : (
                    // 빈 데이터 상태 (필터마다 다른 안내 문구)
                    <li className="todo-empty">{empty}</li>
                )}
            </ul>
        </>
    );
}
