# cst

> Chinese Storytime Project

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate

# Staging to Firebase Development Site
$ gcloud config set project "${YOUR_DEV_FIREBASE_PROJECT_ID}"
$ yarn gendev
$ yarn fdeploy

# Deploy to Firebase Production Site
$ gcloud config set project "${YOUR_PROD_FIREBASE_PROJECT_ID}"
$ yarn genprod
$ yarn fdeploy
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
