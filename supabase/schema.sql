-- 냥사주 (cat4ever) 초기 스키마
-- Supabase 대시보드의 SQL Editor에 붙여넣고 실행하세요.

-- 1. profiles: auth.users 확장 (주인 정보)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  owner_name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- 2. cats: 등록된 고양이들
create table if not exists cats (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles(id) on delete cascade,
  name text not null,
  birth_date date,
  birth_hour smallint, -- 0-23, null이면 시간 모름
  photo_url text,
  created_at timestamptz default now()
);

-- 3. fortunes: 사주/타로 결과 (사주팔자 해시 + 날짜로 캐싱)
create table if not exists fortunes (
  id uuid primary key default gen_random_uuid(),
  cat_id uuid references cats(id) on delete cascade,
  saju_key text, -- 같은 사주는 같은 날 캐시 재사용
  fortune_date date not null default current_date,
  type text check (type in ('saju', 'tarot')) not null,
  preview_text text,
  full_text text,
  paid boolean default false,
  payment_id text,
  created_at timestamptz default now(),
  unique (saju_key, fortune_date)
);

-- 4. catstar_posts: 인스타형 피드
create table if not exists catstar_posts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles(id) on delete cascade,
  cat_id uuid references cats(id) on delete set null,
  title text not null,
  content text,
  image_url text,
  likes_count int default 0,
  created_at timestamptz default now()
);

-- 5. qna_questions / qna_answers
create table if not exists qna_questions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles(id) on delete cascade,
  title text not null,
  content text,
  created_at timestamptz default now()
);

create table if not exists qna_answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid references qna_questions(id) on delete cascade,
  owner_id uuid references profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

-- 6. comu_posts / comu_comments
create table if not exists comu_posts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles(id) on delete cascade,
  title text not null,
  content text,
  created_at timestamptz default now()
);

create table if not exists comu_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references comu_posts(id) on delete cascade,
  owner_id uuid references profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

-- ── RLS 활성화 ──
alter table profiles enable row level security;
alter table cats enable row level security;
alter table fortunes enable row level security;
alter table catstar_posts enable row level security;
alter table qna_questions enable row level security;
alter table qna_answers enable row level security;
alter table comu_posts enable row level security;
alter table comu_comments enable row level security;

-- profiles: 본인만 쓰기, 조회는 전체 공개(작성자 이름 표시용)
create policy "profiles are viewable by everyone" on profiles for select using (true);
create policy "users can insert own profile" on profiles for insert with check (auth.uid() = id);
create policy "users can update own profile" on profiles for update using (auth.uid() = id);

-- cats: 본인만 쓰기, 조회는 공개
create policy "cats are viewable by everyone" on cats for select using (true);
create policy "users can insert own cats" on cats for insert with check (auth.uid() = owner_id);
create policy "users can update own cats" on cats for update using (auth.uid() = owner_id);
create policy "users can delete own cats" on cats for delete using (auth.uid() = owner_id);

-- fortunes: 조회는 공개(캐시 재사용), 쓰기는 서버(service role)에서만 — 별도 insert 정책 없음

-- catstar_posts: 열람 공개, 작성/수정/삭제는 본인만
create policy "catstar posts are viewable by everyone" on catstar_posts for select using (true);
create policy "users can insert own catstar posts" on catstar_posts for insert with check (auth.uid() = owner_id);
create policy "users can update own catstar posts" on catstar_posts for update using (auth.uid() = owner_id);
create policy "users can delete own catstar posts" on catstar_posts for delete using (auth.uid() = owner_id);

-- qna: 열람 공개, 작성/수정/삭제는 본인만
create policy "qna questions are viewable by everyone" on qna_questions for select using (true);
create policy "users can insert own questions" on qna_questions for insert with check (auth.uid() = owner_id);
create policy "users can update own questions" on qna_questions for update using (auth.uid() = owner_id);
create policy "users can delete own questions" on qna_questions for delete using (auth.uid() = owner_id);

create policy "qna answers are viewable by everyone" on qna_answers for select using (true);
create policy "users can insert own answers" on qna_answers for insert with check (auth.uid() = owner_id);
create policy "users can update own answers" on qna_answers for update using (auth.uid() = owner_id);
create policy "users can delete own answers" on qna_answers for delete using (auth.uid() = owner_id);

-- comu: 열람 공개, 작성/수정/삭제는 본인만
create policy "comu posts are viewable by everyone" on comu_posts for select using (true);
create policy "users can insert own comu posts" on comu_posts for insert with check (auth.uid() = owner_id);
create policy "users can update own comu posts" on comu_posts for update using (auth.uid() = owner_id);
create policy "users can delete own comu posts" on comu_posts for delete using (auth.uid() = owner_id);

create policy "comu comments are viewable by everyone" on comu_comments for select using (true);
create policy "users can insert own comments" on comu_comments for insert with check (auth.uid() = owner_id);
create policy "users can update own comments" on comu_comments for update using (auth.uid() = owner_id);
create policy "users can delete own comments" on comu_comments for delete using (auth.uid() = owner_id);

-- 신규 가입 시 profiles 행 자동 생성 트리거
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, owner_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
