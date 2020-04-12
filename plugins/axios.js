export default function ({ $axios, app, req }) {
  if (process.env.NODE_ENV !== "production") {
    $axios.defaults.baseURL =
      process.env.baseUrl || process.env.API_URL || "http://localhost:8080";
  }

  const getIdToken = () => {
    if (process.server) {
      if (!req.headers.cookie) { return null; }
      return import("cookie").then((cookie) => {
        const parsedCookies = cookie.parse(req.headers.cookie);
        if (!parsedCookies) { return; }
        return parsedCookies.__session;
      });
    }
    if (process.client) {
      return new Promise((resolve, reject) => {
        const unsubscribe = app.$fireAuth.onAuthStateChanged((user) => {
          unsubscribe();
          if (user) {
            user.getIdToken().then((idToken) => {
              resolve(idToken);
            }, () => {
              resolve(null);
            });
          } else {
            resolve(null);
          }
        });
      });
    }
    return null;
  };

  $axios.onRequest(async (config) => {
    if (process.env.NODE_ENV !== "production") {
      config.withCredentials = true;
    }

    const idToken = await getIdToken();

    if (config.headers != null && config.headers["X-Requested-With"] == null) {
      config.headers = {
        "X-Requested-With": "XMLHttpRequest",
        Authorization: "Bearer " + idToken,
        ...config.headers
      };
    }
    return config;
  });
}
