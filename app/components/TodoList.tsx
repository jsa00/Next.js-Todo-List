import { getTodos } from '@/app/queries/todos';
import type { Todo } from '@/app/types/todo';
import TodoBoard from './TodoBoard';

// 할 일 목록 조회 (서버 컴포넌트)
// DB 조회는 서버에서 끝내고, 필터·수정 모드 같은 화면 상태는 클라이언트 컴포넌트(TodoBoard)에 넘긴다.
export default async function TodoList() {
    let todos: Todo[];

    try {
        todos = await getTodos();
    } catch (error) {
        // 오류 상태
        return (
            <p className="m-4 py-8 text-center text-red-500">
                할 일을 불러오지 못했습니다: {(error as Error).message}
            </p>
        );
    }

    return <TodoBoard todos={todos} />;
}
