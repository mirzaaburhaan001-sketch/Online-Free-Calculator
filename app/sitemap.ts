import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://calculatorflex.com'

  const routes = [
    '',
    '/percentage-calculator',
    '/fraction-calculator',
    '/math-calculator',
    '/graphing-calculator',
    '/finance-calculator',
    '/mortgage-calculator',
    '/age-calculator',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }))
}
