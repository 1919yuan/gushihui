import Vue from "vue";
import VueI18n from "vue-i18n";
import VvLocaleEN from "vee-validate/dist/locale/en.json";
import VvLocaleCN from "vee-validate/dist/locale/zh_CN.json";

Vue.use(VueI18n);

function _loadLocaleMessages () {
  const locales = require.context("~/locales", true, /[A-Za-z0-9_-]+\.json$/i);
  const messages = {};
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9_-]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });
  messages.en.validations = VvLocaleEN.messages;
  messages.zh_cn.validations = VvLocaleCN.messages;
  return messages;
}

export const translate = new VueI18n({
  locale: "en",
  fallbackLocale: "en",
  messages: _loadLocaleMessages()
});

export default ({ app, store }) => {
  // Set i18n instance on app
  // This way we can use it in middleware and pages asyncData/fetch
  translate.locale = store.state.locale.locale;
  app.i18n = translate;
};
