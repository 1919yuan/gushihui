import path from "path";
import webpack from "webpack";
import admin from "firebase-admin";

require("dotenv").config({
  path: path.resolve(process.cwd(), ".env")
});
if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}

export default {
  mode: "universal",
  srcDir: "src",
  env: {
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY || ""
  },
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: ["@styles/global.sass"],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "@plugins/api.js",
    "@plugins/i18n.js",
    "@plugins/fragment.js",
    "@plugins/schema.js",
    "@plugins/vee-validate.js",
    "@plugins/util.js",
    "@plugins/axios.js",
    { src: "@plugins/auth-listener.js", mode: "client" },
    { src: "@plugins/editor.js", mode: "client" }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    "@nuxtjs/eslint-module"
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://github.com/microcipcip/cookie-universal/tree/master/packages/cookie-universal-nuxt#readme
    ["cookie-universal-nuxt", { parseJSON: false }],
    // Doc: https://buefy.github.io/#/documentation
    "nuxt-buefy",
    // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/axios",
    // Doc: https://firebase.nuxtjs.org/guide
    "@nuxtjs/firebase"
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Firebase Config
   */
  firebase: {
    config: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID
    },
    services: {
      auth: true,
      // {
      //   // initialize: {
      //   //   onAuthStateChangedAction: "onFireAuthStateChanged"
      //   // },
      //   ssr: true
      // },
      firestore: true
    }
  },
  /*
   ** Build configuration
   */
  // buildDir: "../functions/nuxt",
  build: {
    extractCSS: true,
    transpile: [
      "/^nuxt-fire/",
      "vee-validate/dist/rules"
    ],
    plugins: [
      new webpack.ProvidePlugin({
        _: "lodash"
      })
    ],
    extend (config, ctx) {}
  }
};
