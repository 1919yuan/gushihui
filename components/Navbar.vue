<template>
  <b-navbar
    class="navbar header has-shadow is-primary"
  >
    <template slot="brand">
      <b-navbar-item tag="nuxt-link" to="/">
        <img src="~/assets/buefy.png" alt="Buefy" height="28">
      </b-navbar-item>
    </template>
    <template slot="start">
      <b-navbar-item tag="nuxt-link" to="/">
        {{ $t('nav.home') }}
      </b-navbar-item>
      <b-navbar-item tag="nuxt-link" to="/e?type=storytime">
        {{ $t('nav.liststorytime') }}
      </b-navbar-item>
      <b-navbar-item tag="nuxt-link" to="/group">
        {{ $t('nav.listgroup') }}
      </b-navbar-item>
      <b-navbar-dropdown :label="$t('nav.group')">
        <b-navbar-item tag="nuxt-link" to="/new/group">
          {{ $t('nav.newgroup') }}
        </b-navbar-item>
        <b-navbar-item tag="nuxt-link" to="/new/storytime">
          {{ $t('nav.newstorytime') }}
        </b-navbar-item>
      </b-navbar-dropdown>
      <!-- <b-navbar-dropdown :label="$t('nav.library')"> -->
      <!--   <b-navbar-item tag="nuxt-link" to="/library"> -->
      <!--     {{ $t('nav.listbook') }} -->
      <!--   </b-navbar-item> -->
      <!--   <b-navbar-item tag="nuxt-link" to="/library"> -->
      <!--     {{ $t('nav.addbook') }} -->
      <!--   </b-navbar-item> -->
      <!-- </b-navbar-dropdown> -->
    </template>
    <template slot="end">
      <div class="buttons">
        <LocaleButton />
        <AuthButtons />
      </div>
    </template>
  </b-navbar>
</template>

<script>
import AuthButtons from "~/components/AuthButtons";
import LocaleButton from "~/components/LocaleButton";

export default {
  components: {
    AuthButtons,
    LocaleButton
  }
};
</script>
