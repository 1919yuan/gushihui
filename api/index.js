"use strict";
const firebase = require("firebase/app");

function Api (app, store) {
  this.$fireStore = app.$fireStore;
  this.$store = store;
}

Api.prototype.constructor = Api;
Api.prototype.now = function () {
  return firebase.firestore.Timestamp.now();
};

require("./user")(Api);
require("./group")(Api);
require("./event")(Api);
require("./record")(Api);
require("./storytime")(Api);
require("./venue")(Api);
module.exports = Api;
