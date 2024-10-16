import { fileURLToPath } from 'url';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  /**
   * Head meta tags for SEO.
   */
  app: {
    head: {
      title: 'Animal Jam Masterpieces Viewer - Discover Amazing Art',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Discover the amazing masterpieces from the Animal Jam community!' },
        { hid: 'keywords', name: 'keywords', content: 'Animal Jam, Masterpieces, Art Viewer, Animal Jam Art, Online Community, Game Art, Creative Works' },
        { hid: 'og:title', name: 'og:title', content: 'Animal Jam Masterpieces Viewer' },
        { hid: 'og:description', name: 'og:description', content: 'Discover the amazing masterpieces from the Animal Jam community!' },
        { hid: 'og:image', name: 'og:image', content: '/images/preview.png' }, // Path to your image
        { hid: 'og:url', name: 'og:url', content: 'https://jam.exposed' },
        { hid: 'og:type', name: 'og:type', content: 'website' },
        { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
        { hid: 'twitter:title', name: 'twitter:title', content: 'Animal Jam Masterpieces Viewer' },
        { hid: 'twitter:description', name: 'twitter:description', content: 'Discover the amazing masterpieces from the Animal Jam community!' },
        { hid: 'twitter:image', name: 'twitter:image', content: '/images/preview.png' }, // Path to your image
        { name: 'robots', content: 'index, follow' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap' }
      ]
    }
  },

  site: {
    url: 'https://jam.exposed',
    title: 'Animal Jam Masterpieces Viewer',
    description: 'Discover the amazing masterpieces from the Animal Jam community!',
  },

  /**
   * Source directory.
   */
  srcDir: 'src',

  /**
   * Compatibility date for the application.
   */
  compatibilityDate: '2024-04-03',

  /**
   * Development tools.
   */
  devtools: { enabled: true },

  /**
   * Disable server-side rendering.
   */
  ssr: false, // Consider enabling SSR for better SEO

  /**
   * Enable components.
   */
  components: true,

  /**
   * Plugins.
   */
  plugins: [
    '~/plugins/fontawesome.ts',
  ],

  /**
   * Nuxt modules.
   */
  modules: ['@vueuse/nuxt', '@nuxtjs/tailwindcss',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap', '@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt'],

  /**
   * CSS.
   */
  css: [
    '~/assets/sass/app.scss',
    '@fortawesome/fontawesome-svg-core/styles.css'
  ],

  /**
   * Root alias.
   */
  alias: {
    assets: fileURLToPath(new URL('./src/assets', import.meta.url)),
  },
});