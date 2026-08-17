import type { MetadataRoute } from 'next';

const SITE_URL = 'https://cat4ever.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: '/', priority: 1, changeFrequency: 'daily' as const },
    { path: '/saju-tarot', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/gunghap', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/tti', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/star', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/catstar', priority: 0.6, changeFrequency: 'daily' as const },
    { path: '/qna', priority: 0.5, changeFrequency: 'daily' as const },
    { path: '/comu', priority: 0.5, changeFrequency: 'daily' as const },
    { path: '/login', priority: 0.3, changeFrequency: 'monthly' as const },
  ];

  return routes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
