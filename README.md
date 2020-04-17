# cst

> Chinese Storytime Project

## Build Setup

```bash
# install dependencies
# Go to https://nvm.sh to install nvm
$ nvm install 10
$ nvm use 10
$ yarn global add nuxt @nuxtjs/eslint-module firebase-tools eslint

# Prepare dev build
$ yarn preparedev

# Prepare prod build
$ yarn prepareprod

# serve with hot reload at localhost:8080
$ yarn dev

# serve SSR with hot reload at localhost:5000(client) and localhost:5001(server)
$ yarn ssr

# Stage: dev build -> dev instance.
$ yarn stage

# Deploy: prod build -> prod instance.
$ yarn deploy
