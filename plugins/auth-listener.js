const BuildProfile = (user, claims) => {
  return {
    email: user.email,
    displayName: user.displayName,
    uid: user.uid,
    photoUrl: user.photoURL,
    claims
  };
};

export default async function ({ app, store }) {
  const isServerAuthenticated = store.getters["account/isLoggedIn"];

  if (!isServerAuthenticated) {
    try {
      await app.$fireAuth.signOut();
    } catch {}
  }
  app.$fireAuth.onIdTokenChanged(async function (authUser) {
    if (authUser) {
      try {
        await _handleAuthSuccess(authUser);
      } catch (e) {
        await _handleAuthError(e);
      }
    } else {
      await _handleSignOut();
    }
  });

  async function _handleAuthSuccess (authUser) {
    const { claims, token } = await authUser.getIdTokenResult();
    const user = BuildProfile(authUser, claims);

    await store.commit("account/SET_SESSION_COOKIE", token);
    await store.dispatch("account/onAuthStateChanged", { authUser: user });
  }

  async function _handleSignOut () {
    await store.dispatch("account/onAuthStateChanged", { authUser: null });
    await store.commit("account/SET_SESSION_COOKIE", null);
  }

  async function _handleAuthError (error) {
    const onErrorMutation = null;
    const onErrorAction = null;
    if (onErrorMutation) {
      store.commit(onErrorMutation, error);
    }
    if (onErrorAction) {
      await store.dispatch(onErrorAction, error);
    }
  }
}
