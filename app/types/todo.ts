// todos 테이블 한 행의 타입
export interface Todo {
    id: number; // 할 일 고유 번호
    created_at: string; // 생성 일시
    date: string; // 할 일 날짜 (YYYY-MM-DD)
    title: string; // 할 일 제목
    content: string; // 할 일 내용
    is_completed: boolean; // 완료 여부
}

// 조회 필터 이름 (전체 / 진행 중 / 완료)
export type TodoFilter = 'all' | 'active' | 'done';

// 등록·수정 Server Action 결과
export interface TodoActionState {
    success: boolean; // 저장 성공 여부
    message: string; // 화면에 알릴 문구 (처음에는 빈 문자열)
    values?: Pick<Todo, 'date' | 'title' | 'content'>; // 실패 시 입력값을 다시 채우기 위한 값
}
