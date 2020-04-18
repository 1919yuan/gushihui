<template>
  <div class="block">
    <h3> {{ venue.Name }} </h3>
    <div v-if="venue.Type === 'Zoom'">
      <p>Meeting ID: {{ venue.Zoom && venue.Zoom.MeetingId }} </p>
      <p>
        Join Url: <nuxt-link :to="venue.Zoom && venue.Zoom.JoinUrl">
          {{ venue.Zoom && venue.Zoom.JoinUrl }}
        </nuxt-link>
      </p>
      <p>Password: {{ venue.Zoom && venue.Zoom.Password }} </p>
    </div>
    <div v-if="venue.Type === 'Hangout'">
      <p>
        Join Url: <nuxt-link :to="venue.Hangout && venue.Hangout.JoinUrl">
          {{ venue.Hangout && venue.Hangout.JoinUrl }}
        </nuxt-link>
      </p>
    </div>
    <div v-if="venue.Type === 'Skype'">
      <p>
        Join Url: <nuxt-link :to="venue.Skype && venue.Skype.JoinUrl">
          {{ venue.Skype && venue.Skype.JoinUrl }}
        </nuxt-link>
      </p>
    </div>
    <div v-if="venue.Type === 'Youtube'">
      <p>
        Join Url: <nuxt-link :to="venue.Youtube && venue.Youtube.JoinUrl">
          {{ venue.Youtube && venue.Youtube.JoinUrl }}
        </nuxt-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    venue: {
      type: Object,
      required: true
    }
  }
};
</script>
