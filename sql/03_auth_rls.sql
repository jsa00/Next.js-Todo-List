-- 회원 전용 Todo: 작성자 컬럼 추가 + RLS로 본인 데이터만 접근 (교안 프론트엔드 응용 7장 3강)
-- Supabase 대시보드 > SQL Editor에서 전체 선택 후 실행

-- 인증 전에 테스트로 넣은, 작성자가 없는 할 일 정리
delete from public.todos;

-- 작성자 컬럼. 기본값이 현재 로그인한 사용자라서 등록할 때 따로 넣지 않아도 된다.
alter table public.todos
    add column if not exists user_id uuid not null default auth.uid()
        references auth.users (id) on delete cascade;

-- 2강에서 껐던 RLS 다시 켜기
alter table public.todos enable row level security;

-- 비로그인(anon) 접근 권한 회수. 로그인한 사용자(authenticated)만 남긴다.
revoke all on public.todos from anon;

-- 본인 할 일만 조회
create policy "Users can view their own todos"
on public.todos for select to authenticated
using ((select auth.uid()) = user_id);

-- 본인 UID로만 등록
create policy "Users can create their own todos"
on public.todos for insert to authenticated
with check ((select auth.uid()) = user_id);

-- 본인 할 일만 수정 (작성자를 다른 사람으로 바꾸는 것도 막는다.)
create policy "Users can update their own todos"
on public.todos for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

-- 본인 할 일만 삭제
create policy "Users can delete their own todos"
on public.todos for delete to authenticated
using ((select auth.uid()) = user_id);
