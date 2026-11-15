'use client';

import { useCallback, useState } from 'react';
import type { Todo } from '@/app/types/todo';
import TodoDetailActions from './TodoDetailActions';
import TodoForm from './TodoForm';

interface TodoDetailProps {
    todo: Todo; // 상세 페이지에 표시 중인 할 일
    children: React.ReactNode; // 서버에서 그린 할 일 내용 카드
}

// 상세 페이지 보기·수정 모드 전환
// 내용 카드는 서버 컴포넌트가 그린 것을 children으로 받아 그대로 보여 주고, 전환 상태만 여기서 관리한다.
export default function TodoDetail({ todo, children }: TodoDetailProps) {
    const [isEditing, setIsEditing] = useState(false); // 수정 모드 여부

    // 저장 완료·취소 후 보기 모드로 되돌리기
    // TodoForm의 useEffect 의존성이라 useCallback으로 같은 함수를 유지한다.
    const finishEditing = useCallback(() => setIsEditing(false), []);

    // 수정 모드: 목록과 같은 등록·수정 폼을 재사용한다.
    // 저장하면 saveTodo가 이 상세 페이지 캐시도 비워서 바뀐 내용이 바로 보인다.
    if (isEditing) {
        return <TodoForm editingTodo={todo} onFinish={finishEditing} />;
    }

    return (
        <>
            {children}
            <TodoDetailActions todo={todo} onEdit={() => setIsEditing(true)} />
        </>
    );
}
