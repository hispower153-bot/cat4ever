'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const links = [
  { href: '/', label: 'HOME' },
  { href: '/saju-tarot', label: 'SajuTaro' },
  { href: '/catstar', label: 'CatStar' },
  { href: '/qna', label: 'Q&A' },
  { href: '/comu', label: 'Comu' },
];

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [ownerName, setOwnerName] = useState<string | null>(null);
  const supabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  useEffect(() => {
    if (!supabaseConfigured) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      const name = data.user?.user_metadata?.full_name || data.user?.email || null;
      setOwnerName(name);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const name = session?.user?.user_metadata?.full_name || session?.user?.email || null;
      setOwnerName(name);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabaseConfigured]);

  const handleLogout = async () => {
    if (!supabaseConfigured) return;
    const supabase = createClient();
    await supabase.auth.signOut();
    setOwnerName(null);
    router.push('/');
    router.refresh();
  };

  return (
    <div className="max-w-site mx-auto px-8">
      <nav className="flex items-center justify-between py-7">
        <Link href="/" className="font-serif font-black text-xl text-forest">
          냥사주
        </Link>
        <ul className="hidden md:flex gap-9 text-sm text-inkDim">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={
                  pathname === l.href
                    ? 'text-forest font-bold'
                    : 'hover:text-forest transition-colors'
                }
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        {ownerName ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 border-[1.5px] border-line text-inkDim rounded-full pl-3 pr-4 py-2 text-[13px] font-bold hover:border-forest hover:text-forest transition-colors"
          >
            <span className="w-6 h-6 rounded-full bg-forest text-cream flex items-center justify-center text-[11px]">
              {ownerName[0]}
            </span>
            {ownerName.split('@')[0]}
          </button>
        ) : (
          <Link
            href="/login"
            className="border-[1.5px] border-forest text-forest rounded-full px-5 py-2.5 text-[13px] font-bold hover:bg-forest hover:text-cream transition-colors"
          >
            Login
          </Link>
        )}
      </nav>
    </div>
  );
}
