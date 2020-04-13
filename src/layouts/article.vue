<template>
  <div>
    <Navbar />
    <section class="main-content columns">
      <div class="container column is-12 centered">
        <section class="section">
          <nuxt />
        </section>
      </div>
    </section>
    <Footer />
  </div>
</template>

<script>
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";
export default {
  components: {
    Navbar,
    Footer
  }
};
</script>
