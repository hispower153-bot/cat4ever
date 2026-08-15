'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'HOME' },
  { href: '/saju-tarot', label: 'SajuTaro' },
  { href: '/catstar', label: 'CatStar' },
  { href: '/qna', label: 'Q&A' },
  { href: '/comu', label: 'Comu' },
];

export default function Nav() {
  const pathname = usePathname();

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
        <Link
          href="/login"
          className="border-[1.5px] border-forest text-forest rounded-full px-5 py-2.5 text-[13px] font-bold hover:bg-forest hover:text-cream transition-colors"
        >
          Login
        </Link>
      </nav>
    </div>
  );
}
