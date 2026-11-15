-- JavaScript Todo List와 같은 입력 항목(날짜·제목·내용)을 쓰도록 컬럼 추가
-- Supabase 대시보드 > SQL Editor에서 실행

alter table public.todos
    add column if not exists date date not null default current_date, -- 할 일 날짜
    add column if not exists content text not null default '';         -- 할 일 내용
