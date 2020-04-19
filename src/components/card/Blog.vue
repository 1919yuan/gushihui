<template>
  <div class="column is-12">
    <div class="card">
      <header class="card-header">
        <div class="media">
          <div v-if="blog.ThumbnailUrl" class="media-left">
            <figure class="image is-48x48">
              <img src="blog.ThumbnailUrl">
            </figure>
          </div>
          <div class="media-content">
            <p class="card-header-title">
              {{ blog.Title }}
            </p>
          </div>
        </div>
      </header>
      <div class="card-content">
        <p class="content has-text-centered">
          {{ blog.Excerpt }}
        </p>
      </div>
      <footer class="card-footer">
        <div class="card-footer-item buttons">
          <b-button type="is-info" @click="viewBlog">
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
    blog: {
      type: Object,
      required: true
    }
  },
  methods: {
    viewBlog () {
      this.$router.push({ path: "/g/" + this.blog.GroupId + "/blog/" + this.blog.Path });
    }
  }
};
</script>
