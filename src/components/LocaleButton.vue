<template>
  <b-dropdown
    v-model="lang"
    :placeholder="$t('locale.language')"
  >
    <b-button slot="trigger" icon-left="earth">
      {{ $t('locale.language') }}
    </b-button>
    <b-dropdown-item v-for="(loc, idx) in locales" :key="idx" :value="loc">
      {{ $t('locales.' + loc) }}
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
import { mapState } from "vuex";

export default {
  data () {
    return {
      lang: this.locale
    };
  },
  computed: {
    ...mapState("locale", ["locale", "locales"])
  },
  watch: {
    lang (val) {
      this.$store.commit("locale/SET_LOCALE", val);
      this.$i18n.locale = val;
      if (this.$cookies.get("__session")) {
        const session = JSON.parse(this.$cookies.get("__session"));
        session.lang = val;
        this.$cookies.set("__session", JSON.stringify(session), {
          maxAge: 30 * 24 * 60 * 60
        });
      } else {
        const session = { lang: val };
        this.$cookies.set("__session", JSON.stringify(session), {
          maxAge: 30 * 24 * 60 * 60
        });
      }
    }
  }
};
</script>
