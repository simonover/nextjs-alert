module.exports = {
  siteUrl: 'https://www.alert.rip',
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ['/serversite.xml'],
  generateRobotsTxt: true,
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    }
  },
  additionalPaths: async (config) => [
    await config.transform(config, '/navigate'),
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    additionalSitemaps: [`https://www.alert.rip/serversite.xml`],
  },
}
