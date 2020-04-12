export const actions = {
  nuxtServerInit: (process.server && !process.static)
    ? async function ({ commit, dispatch }, { req }) {
      if (!req.headers.cookie) { return; }

      const cookie = await import("cookie");
      const parsedCookies = cookie.parse(req.headers.cookie);
      if (!parsedCookies) { return; }
      const idToken = parsedCookies.__session;

      const JWTDecode = (await import("jwt-decode")).default;
      let decodedAuthUserClaims = null;
      try {
        decodedAuthUserClaims = JWTDecode(idToken);
      } catch { }

      if (decodedAuthUserClaims == null) { return; }

      const admin = require("firebase-admin");
      try {
        const decodedToken = await admin.auth().verifyIdToken(idToken, true);
        const uid = decodedToken.uid;
        if (uid) {
          const user = {
            photoUrl: decodedAuthUserClaims.picture,
            displayName: decodedAuthUserClaims.name,
            email: decodedAuthUserClaims.email,
            uid: decodedAuthUserClaims.user_id
          };
          await dispatch("account/onAuthStateChanged", { authUser: user });
        }
      } catch {
      }
      dispatch("locale/initializeLocale");
    } : ({ dispatch }) => { dispatch("locale/initializeLocale"); }
};

export const state = () => ({});
