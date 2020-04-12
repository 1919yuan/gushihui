<template>
  <div class="block">
    <h3> {{ venue.Name }} </h3>
    <p class="subtitle">
      {{ venue.Description }}
    </p>
    <iframe
      width="600"
      height="450"
      frameborder="0"
      style="border:0"
      :src="place"
      allowfullscreen
    />
  </div>
</template>

<script>
export default {
  props: {
    venue: {
      type: Object,
      required: true
    }
  },
  computed: {
    place () {
      return "https://www.google.com/maps/embed/v1/place?key=" +
        process.env.FIREBASE_API_KEY +
        "&q=" + this.venue.Address.FormattedAddress;
    }
  }
};
</script>
