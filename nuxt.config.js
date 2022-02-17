import colors from "vuetify/es5/util/colors";

export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: "%s - NFT ACCCESS",
    title: "NFT ACCCESS",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: "NFT ACCCESS",
      },
      {
        hid: "og:image",
        property: "og:image",
        content:
          "https://www.superdthailand.com/media/wysiwyg/Test-Logo-Circle-black-transparent.png",
      },
      {
        hid: "og:image:width",
        property: "og:image:width",
        content: "1200",
      },
      {
        hid: "og:image:height",
        property: "og:image:height",
        content: "1200",
      },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify",
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)

  modules: ["@nuxtjs/axios"],

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
          bg: "#146388",
        },
      },
    },
  },
  // axios config
  axios: {
    // WARNING: proxy doesn't work with nuxt generate,
    // have to use a prefix and set an API_URL
    proxy: true,
    "/api": {
      target: "http://localhost:8000",
      // target: "http://localhost:3000",
      // target: "https://api.opensea.io/api/v1",
      pathRewrite: {
        "^/api": "https://api.opensea.io/api/v1",
        changeOrigin: true,
      },
    },
  },
  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},
};
