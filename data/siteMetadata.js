/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: 'Hey, Zhiwei',
  author: 'Wang Zhiwei',
  headerTitle: 'Hey, Zhiwei',
  description: 'My chatter about life and the tech realm',
  language: 'en-us',
  theme: 'system', // system, dark or light
  siteUrl: 'https://zhiweio.vercel.app',
  siteRepo: 'https://github.com/zhiweio/myblog',
  siteLogo: `${process.env.BASE_PATH || ''}/static/images/logo.png`,
  socialBanner: `${process.env.BASE_PATH || ''}/static/images/twitter-card.png`,
  email: 'noparking188@gmail.com',
  github: 'https://github.com/zhiweio',
  // x: 'https://twitter.com/x',
  // facebook: 'https://facebook.com',
  // youtube: 'https://youtube.com',
  linkedin: 'https://linkedin.com/in/zhiweio',
  // instagram: 'https://www.instagram.com',
  // medium: 'https://medium.com',
  locale: 'en-US',
  // set to true if you want a navbar fixed to the top
  stickyNav: true,
  analytics: {},
  newsletter: {},
  comments: {},
  search: {
    provider: 'kbar', // kbar or algolia
    kbarConfig: {
      searchDocumentsPath: `${process.env.BASE_PATH || ''}/search.json`, // path to load documents to search
    },
    // provider: 'algolia',
    // algoliaConfig: {
    //   // The application ID provided by Algolia
    //   appId: 'R2IYF7ETH7',
    //   // Public API key: it is safe to commit it
    //   apiKey: '599cec31baffa4868cae4e79f180729b',
    //   indexName: 'docsearch',
    // },
  },
}

module.exports = siteMetadata
