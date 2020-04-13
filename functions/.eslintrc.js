module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  globals : {
    "_": false
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended',
    'plugin:json/recommended'
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "space-infix-ops": "off",
    "vue/no-v-html": "off",
    "quotes": ["error", "double"],
    "semi": ["error", "always"]
  }
};
