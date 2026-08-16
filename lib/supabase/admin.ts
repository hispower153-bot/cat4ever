import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * service_role 키를 쓰는 관리자 클라이언트입니다.
 * RLS를 무시하고 쓰기 때문에 절대 클라이언트(브라우저)에서 import하면 안 되고,
 * API route handler 등 서버 코드에서만 사용하세요.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) return null;

  return createSupabaseClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
