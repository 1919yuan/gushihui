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
  </div>
</template>

<script>
import Navbar from "~/components/Navbar";
export default {
  components: {
    Navbar
  }
};
</script>
