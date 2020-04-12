export const actions = {
  async onAuthStateChanged ({ commit }, { authUser }) {
    if (!authUser) {
      commit("RESET_STORE");
      return;
    }
    let obj = {
      Id: "",
      Uid: authUser.email,
      Provider: authUser.providerId,
      Username: ""
    };
    if (this.$fireStore) {
      try {
        const results = await this.$fireStore.collection("User").where(
          "Uid", "==", authUser.email).get();
        if (results.docs.length > 0) {
          obj = results.docs[0].data();
          obj.Id = results.docs[0].id;
        }
      } catch {}
    }
    commit("SET_AUTH_USER", { authUser: obj });
  }
};

const initialState = () => ({
  authUser: {
    Id: "",
    Provider: "",
    Uid: "",
    Username: ""
  }
});

export const state = initialState;

export const mutations = {
  RESET_STORE: (state) => {
    Object.assign(state, initialState());
  },
  SET_AUTH_USER: (state, { authUser }) => {
    state.authUser = authUser;
  },
  SET_SESSION_COOKIE (ctx, idToken) {
    let expires = 0;
    if (idToken) { expires = 3600; }
    this.$cookies.set("__session", idToken, {
      maxAge: expires,
      secure: true
    });
  }
};

export const getters = {
  isLoggedIn: (state) => {
    try {
      return state.authUser.Id !== "";
    } catch {
      return false;
    }
  }
};
