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
      <div class="columns is-multiline is-desktop">
        <div class="column is-12 has-text-centered">
          <h2 class="title is-3 is-uppercase">
            {{ $t('landing.about') }}
          </h2>
        </div>
        <div class="column is-offset-3 is-4 has-text-centered">
          <p>
            {{ $t('landing.about_paragraph') }}
          </p>
        </div>
        <div class="column is-2 has-text-centered">
          <figure>
            <img src="~assets/icra.png" style="height: 10rem">
          </figure>
        </div>
      </div>
    </section>
    <section class="hero section3 is-success">
      <h2 class="title is-3 is-uppercase has-text-centered">
        {{ $t('landing.introduction') }}
      </h2>
      <div class="columns">
        <div class="column">
          <div class="notification is-warning">
            <p class="has-text-centered">
              <b-icon icon="calendar-week" size="is-large" />
            </p>
            <p>
              {{ $t('landing.introduction_organize') }}
            </p>
          </div>
        </div>
        <div class="column">
          <div class="notification is-link">
            <p class="has-text-centered">
              <b-icon icon="account-multiple-plus" size="is-large" />
            </p>
            <p>
              {{ $t('landing.introduction_register') }}
            </p>
          </div>
        </div>
        <div class="column">
          <div class="notification is-primary">
            <p class="has-text-centered">
              <b-icon icon="account-group" size="is-large" />
            </p>
            <p>
              {{ $t('landing.introduction_manage') }}
            </p>
          </div>
        </div>
      </div>
    </section>
    <section class="hero section4 is-info">
      <h2 class="title is-3 is-uppercase has-text-centered has-text-light">
        {{ $t('landing.contact') }}
      </h2>
      <div class="columns is-multiline is-light">
        <div class="column is-8 is-offset-2 is-light">
          <form
            action="https://formspree.io/xrgawpol"
            method="POST"
          >
            <div class="field">
              <label> {{ $t('field.name') }} </label>
              <b-input icon="account" name="name" :placeholder="$t('ph.name')" />
            </div>
            <div class="field">
              <label> {{ $t('field.email') }} </label>
              <b-input
                icon="email"
                type="email"
                :placeholder="$t('ph.email')"
                name="_replyto"
              />
            </div>
            <div class="field">
              <label> {{ $t('field.message') }} </label>
              <b-input
                type="textarea"
                :placeholder="$t('ph.message')"
                name="message"
              />
            </div>
            <b-button type="submit" class="is-block is-fullwidth" outlined>
              {{ $t('button.submit') }}
            </b-button>
          </form>
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
@import "@/styles/variables.sass";
.section1
  background: url('~assets/banner.jpg') center / cover
.section2
  background: $light
  padding: 1rem
+desktop
  .section2
    padding: 5rem
.section3
  padding: 1rem
+desktop
  .section3
    padding: 5rem
.section4
  padding: 1rem
+desktop
  .section4
    padding: 5rem
</style>
