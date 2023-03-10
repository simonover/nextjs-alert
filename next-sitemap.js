const siteUrl = 'https://alert.rip/'

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    additionalPaths: async (config) => [
      await config.transform(config, '/comments'),
    ],
    additionalSitemap: ['https://alert.rip/serversite.xml'],
  },
}
