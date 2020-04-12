<template>
  <div class="column">
    <div class="card">
      <header class="card-header">
        <div class="media">
          <div v-if="event.ThumbnailUrl" class="media-left">
            <figure class="image is-48x48">
              <img src="event.ThumbnailUrl">
            </figure>
          </div>
          <div class="media-content">
            <p class="card-header-title">
              {{ event.Name }}
            </p>
          </div>
        </div>
      </header>
      <div class="card-content">
        <p class="content has-text-centered">
          {{ startAt }}
        </p>
      </div>
      <footer class="card-footer">
        <div class="card-footer-item buttons">
          <b-button type="is-info" @click="viewEvent">
            {{ $t('button.view') }}
          </b-button>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  computed: {
    startAt () {
      return this.$util.formatLocalTime(this.event.Options.StartAt);
    }
  },
  methods: {
    viewEvent () {
      this.$router.push({ path: "/e/" + this.event.Id });
    }
  }
};
</script>
