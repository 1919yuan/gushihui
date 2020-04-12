const Api = require("~/api/");

export default ({ app, store }, inject) => {
  const api = new Api(app, store);
  inject("api", api);
};
