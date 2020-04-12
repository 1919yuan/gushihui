export const actions = {
  initializeLocale ({ commit }) {
    const defaultLocale = this.$cookies.get(
      "lang", { parseJSON: false }) || "en";
    commit("SET_LOCALE", defaultLocale);
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
