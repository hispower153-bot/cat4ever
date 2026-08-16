-- CatStar 사진 업로드용 Storage 버킷 설정
-- Supabase 대시보드의 SQL Editor에 붙여넣고 실행하세요. (schema.sql 실행 후에 실행)

-- 1. 공개 버킷 생성 (이미 있으면 무시)
insert into storage.buckets (id, name, public)
values ('catstar-photos', 'catstar-photos', true)
on conflict (id) do nothing;

-- 2. 열람은 누구나 가능 (공개 버킷)
create policy "catstar photos are publicly viewable"
on storage.objects for select
using (bucket_id = 'catstar-photos');

-- 3. 업로드는 로그인한 사용자만, 본인 uid 폴더 아래에만 올릴 수 있음
--    (경로 규칙: {user_id}/{파일명})
create policy "users can upload their own catstar photos"
on storage.objects for insert
with check (
  bucket_id = 'catstar-photos'
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- 4. 삭제는 본인 파일만
create policy "users can delete their own catstar photos"
on storage.objects for delete
using (
  bucket_id = 'catstar-photos'
  and auth.uid()::text = (storage.foldername(name))[1]
);
