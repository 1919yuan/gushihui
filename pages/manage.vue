<template>
  <p> Under construction. </p>
</template>

<script>
export default {
  middleware: "auth",
  created () {
    this.$router.push({ path: "/u/" });
  }
};
</script>
