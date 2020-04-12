<template>
  <fragment>
    <b-button v-show="!isLoggedIn" tag="nuxt-link" to="/login">
      {{ $t('account.login') }}
    </b-button>
    <b-button v-show="!isLoggedIn" type="is-primary" tag="nuxt-link" to="/signup">
      {{ $t('account.signup') }}
    </b-button>
    <b-button v-show="isLoggedIn" tag="nuxt-link" to="/manage">
      {{ $t('account.account') }}
    </b-button>
    <b-button v-show="isLoggedIn" type="is-primary" @click="doLogout">
      {{ $t('account.logout') }}
    </b-button>
  </fragment>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters("account", ["isLoggedIn"])
  },
  methods: {
    doLogout () {
      this.$fireAuth.signOut();
    }
  }
};
</script>
