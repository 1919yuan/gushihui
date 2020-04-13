const functions = require("firebase-functions");
const functionConfig = functions.config();
for (const key in functionConfig.envs) {
  process.env[key.toUpperCase()] = functionConfig.envs[key];
}
const admin = require("firebase-admin");
if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}
const express = require("express");
const app = express();

const { Nuxt } = require("nuxt");
const config = {
  dev: false,
  debug: false
};

const nuxt = new Nuxt(config);

let isReady = false;
const readyPromise = nuxt
  .ready()
  .then(() => {
    isReady = true;
  })
  .catch(() => {
    process.exit(1);
  });

async function handleRequest (req, res) {
  if (!isReady) {
    await readyPromise;
  }
  res.set("Cache-Control", "public, max-age=1, s-maxage=1");
  await nuxt.render(req, res);
}

app.get("*", handleRequest);
app.use(handleRequest);
exports.cstapp = functions.https.onRequest(app);
