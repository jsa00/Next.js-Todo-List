// 상세 페이지 로딩 상태 (Next.js가 page.tsx를 Suspense로 감싸 데이터를 받는 동안 보여 준다.)
export default function TodoDetailLoading() {
    return <p className="todo-empty">할 일을 불러오는 중...</p>;
}
