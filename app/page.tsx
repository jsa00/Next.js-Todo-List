import { Suspense } from 'react';
import TodoList from './components/TodoList';
import UserProfile from './components/UserProfile';

// 메인 페이지 (서버 컴포넌트)
// 제목 바는 바로 보여 주고, DB 조회가 필요한 부분만 Suspense로 감싸 스트리밍한다.
export default function HomePage() {
    return (
        <main>
            <h1 className="mb-4 bg-orange-400 px-4 py-2 text-center text-xl text-white">
                오늘 할 일 등록하기
            </h1>

            {/* 접속 계정은 쿠키를 읽어야 해서 따로 스트리밍한다. */}
            <Suspense>
                <UserProfile />
            </Suspense>

            {/* 로딩 상태 */}
            <Suspense
                fallback={
                    <p className="todo-empty py-8">할 일을 불러오는 중...</p>
                }
            >
                <TodoList />
            </Suspense>
        </main>
    );
}
