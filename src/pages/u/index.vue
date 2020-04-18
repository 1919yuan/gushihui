<template>
  <p> Redirecting... </p>
</template>

<script>
export default {
  middleware: "auth",
  created () {
    this.$router.push({ path: "/u/" + this.$store.state.account.authUser.Username });
  }
};
</script>
