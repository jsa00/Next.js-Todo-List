import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTodoById, parseTodoId } from '@/app/queries/todos';
import TodoDetail from '@/app/components/TodoDetail';

interface TodoDetailPageProps {
    params: Promise<{ id: string }>; // 주소의 [id] 값 (/todos/3 → '3')
}

// 등록 일시 표시 형식 (서버 시간대와 상관없이 한국 시간으로 표시)
const createdAtFormat = new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Seoul',
});

// 브라우저 탭 제목을 할 일 제목으로 설정
export async function generateMetadata({
    params,
}: TodoDetailPageProps): Promise<Metadata> {
    const id = parseTodoId((await params).id);
    const todo = id ? await getTodoById(id) : null;

    return { title: `${todo?.title ?? '할 일 상세'} | TODO 리스트` };
}

// 할 일 상세 페이지 (서버 컴포넌트)
// 조회 중에는 같은 폴더의 loading.tsx, 오류는 error.tsx, 없는 할 일은 not-found.tsx가 대신 보인다.
export default async function TodoDetailPage({ params }: TodoDetailPageProps) {
    const { id: rawId } = await params;
    const id = parseTodoId(rawId);

    // 숫자가 아닌 id(/todos/abc)는 조회하지 않고 바로 404
    if (!id) notFound();

    // 다른 회원의 할 일은 RLS가 걸러서 null이 되므로 똑같이 404
    const todo = await getTodoById(id);
    if (!todo) notFound();

    return (
        <main className="mx-auto max-w-xl px-4">
            <h1 className="mb-4 bg-orange-400 px-4 py-2 text-center text-xl text-white">
                할 일 상세
            </h1>

            {/* 보기·수정 전환은 클라이언트 컴포넌트가 맡고, 내용 카드는 서버에서 그려 children으로 넘긴다. */}
            <TodoDetail todo={todo}>
                <article
                    className={`todo-item rounded-sm border border-gray-400 p-6 ${
                        todo.is_completed ? 'is-done' : ''
                    }`}
                >
                    <p className="mb-2 flex items-center justify-between text-sm text-gray-500">
                        <span>{todo.date}</span>
                        <span
                            className={`rounded-full px-3 py-0.5 text-white ${
                                todo.is_completed
                                    ? 'bg-gray-400'
                                    : 'bg-orange-400'
                            }`}
                        >
                            {todo.is_completed ? '완료' : '진행 중'}
                        </span>
                    </p>
                    <h2
                        className={`mb-3 text-2xl ${
                            todo.is_completed
                                ? 'text-gray-400 line-through'
                                : ''
                        }`}
                    >
                        {todo.title}
                    </h2>
                    <p className="todo-content mb-4 min-h-24 border-t border-dashed border-gray-300 pt-3">
                        {todo.content}
                    </p>
                    <p className="text-right text-sm text-gray-400">
                        등록 {createdAtFormat.format(new Date(todo.created_at))}
                    </p>
                </article>
            </TodoDetail>

            <Link
                href="/"
                className="mx-auto mt-6 block w-fit text-orange-500 underline underline-offset-4 hover:text-orange-700"
            >
                ← 목록으로
            </Link>
        </main>
    );
}
