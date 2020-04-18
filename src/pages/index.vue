<template>
  <div>
    <section class="hero is-fullheight section1">
      <div class="hero-head">
        <Navbar transparent />
        <div class="container has-text-centered" style="top: 65px;">
          <h1 class="title is-2 is-spaced has-text-white">
            {{ $t('landing.title') }}
          </h1>
          <h2 class="subtitle is-4 has-text-light">
            {{ $t('landing.subtitle') }}
          </h2>
        </div>
      </div>
    </section>
    <section class="hero section2">
      <div class="columns is-multiline">
        <div class="column is-12 has-text-centered">
          <h2 class="title is-3">
            {{ $t('landing.about') }}
          </h2>
        </div>
        <div class="column is-6 has-text-right">
          <p>asfasdfasdfasfa</p>
        </div>
        <div class="column is-6 has-text-left">
          <figure><img src="~assets/icra.jpg"></figure>
        </div>
      </div>
    </section>
    <section class="hero section3">
      <div class="container has-text-centered">
        <h2 class="title is-3">
          Contact
        </h2>
      </div>
    </section>
    <Footer />
  </div>
</template>

<script>
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";
export default {
  layout: "landing",
  components: {
    Navbar,
    Footer
  }
};
</script>

<style scoped lang="sass">
@import "~bulma/sass/utilities/_all";
.section1
  backgrounpd: url('~assets/banner.jpg') center / cover
.section2
  background: $light
  padding: 5rem
.section2 .title
  text-transform: uppercase;
.section3
  background: $grey-lighter
  padding: 5rem
</style>
