export const actions = {
  initializeLocale ({ commit }) {
    if (this.$cookies.get("__session")) {
      const session = JSON.parse(this.$cookies.get("__session")) || {};
      const defaultLocale = session.lang || "en";
      commit("SET_LOCALE", defaultLocale);
    } else {
      commit("SET_LOCALE", "en");
    }
  }
};

export const state = () => ({
  locales: ["en", "zh_cn"],
  locale: "en"
});

export const mutations = {
  SET_LOCALE (state, locale) {
    if (state.locales.includes(locale)) {
      state.locale = locale;
    }
  }
};
