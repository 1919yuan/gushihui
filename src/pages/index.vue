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
.section1
  background: url('~assets/banner.jpg') center / cover
</style>
