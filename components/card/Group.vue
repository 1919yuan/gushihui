<template>
  <div class="column">
    <div class="card">
      <header class="card-header">
        <div class="media">
          <div v-if="group.ThumbnailUrl" class="media-left">
            <figure class="image is-48x48">
              <img src="group.ThumbnailUrl">
            </figure>
          </div>
          <div class="media-content">
            <p class="card-header-title">
              {{ group.Title }}
            </p>
          </div>
        </div>
      </header>
      <div class="card-content">
        <p class="content has-text-centered">
          {{ group.Description }}
        </p>
      </div>
      <footer class="card-footer">
        <div class="card-footer-item buttons">
          <b-button type="is-info" @click="viewGroup">
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
    group: {
      type: Object,
      required: true
    }
  },
  methods: {
    viewGroup () {
      this.$router.push({ path: "/g/" + this.group.Id });
    }
  }
};
</script>
